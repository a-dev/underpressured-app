import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const formValues = new WeakMap<object, Record<string, string>>();
const formValidity = new WeakMap<object, boolean>();

class FormElementAdapter extends EventTarget {
  action = "https://forms.example.test/support";
  reportValidity() {
    return formValidity.get(this) ?? true;
  }

  reset() {
    formValues.set(this, {});
  }
}

class ElementAdapter {
  textContent: string | null = "";
}

class ButtonElementAdapter extends ElementAdapter {
  disabled = false;
}

class FormDataAdapter {
  readonly values: Record<string, string>;

  constructor(form: HTMLFormElement) {
    this.values = { ...formValues.get(form) };
  }
}

let initializeSupportForm: typeof import("./support-form").initializeSupportForm;

beforeAll(async () => {
  vi.stubGlobal("HTMLFormElement", FormElementAdapter);
  vi.stubGlobal("HTMLElement", ElementAdapter);
  vi.stubGlobal("HTMLButtonElement", ButtonElementAdapter);
  vi.stubGlobal("FormData", FormDataAdapter);
  vi.stubGlobal("document", { querySelector: () => null });
  vi.stubGlobal("window", globalThis);

  ({ initializeSupportForm } = await import("./support-form"));
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.useRealTimers();
});

const createFixture = ({ valid = true }: { valid?: boolean } = {}) => {
  const form = new HTMLFormElement();
  const status = new HTMLElement();
  const button = new HTMLButtonElement();
  formValues.set(form, {
    name: "Example Person",
    email: "person@example.test",
    message: "A controlled test message.",
  });
  formValidity.set(form, valid);

  initializeSupportForm({ form, status, button });

  return { form, status, button };
};

const submit = async (form: HTMLFormElement) => {
  form.dispatchEvent(new Event("submit", { cancelable: true }));
  // The submit listener is async. dispatchEvent does not wait for it.
  for (let step = 0; step < 8; step += 1) await Promise.resolve();
};

const successResponse = () => new Response('{"success":true}', { status: 200 });

describe("support form controlled responses", () => {
  it("does not send invalid form values", async () => {
    const fetch = vi.fn<() => Promise<Response>>(async () => successResponse());
    vi.stubGlobal("fetch", fetch);
    const { form, button } = createFixture({ valid: false });

    await submit(form);

    expect(fetch).not.toHaveBeenCalled();
    expect(formValues.get(form)).toEqual({
      name: "Example Person",
      email: "person@example.test",
      message: "A controlled test message.",
    });
    expect(button.disabled).toBe(false);
  });

  it("sends the form fields and resets only after HTTP and body success", async () => {
    let submittedBody: unknown;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
        submittedBody = init?.body;
        return successResponse();
      }),
    );
    const { form, status, button } = createFixture();

    await submit(form);

    expect(submittedBody).toMatchObject({
      values: {
        name: "Example Person",
        email: "person@example.test",
        message: "A controlled test message.",
      },
    });
    expect(status.textContent).toBe("Your message was submitted.");
    expect(formValues.get(form)).toEqual({});
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe("Send message");
  });

  it.each<[string, number, string]>([
    ["body rejection", 200, '{"success":false}'],
    ["HTTP rejection with body success", 503, '{"success":true}'],
    ["missing success field", 200, '{"message":"ok"}'],
    ["non-object body", 200, '"success"'],
    ["string success field", 200, '{"success":"true"}'],
    ["malformed JSON", 200, "not json"],
  ])("keeps entered values for %s", async (_case, httpStatus, body) => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(body, { status: httpStatus })),
    );
    const { form, status, button } = createFixture();

    await submit(form);

    expect(status.textContent).not.toBe("Your message was submitted.");
    expect(formValues.get(form)).toEqual({
      name: "Example Person",
      email: "person@example.test",
      message: "A controlled test message.",
    });
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe("Send message");
  });

  it("preserves values after a network error and releases the form for retry", async () => {
    const fetch = vi
      .fn<(url: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValueOnce(successResponse());
    vi.stubGlobal("fetch", fetch);
    const { form, status, button } = createFixture();

    await submit(form);

    expect(status.textContent).toContain(
      "We do not know whether the form service accepted your message.",
    );
    expect(button.disabled).toBe(false);
    expect(button.textContent).toBe("Send message");

    await submit(form);

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("ignores duplicate submits while a request is pending", async () => {
    let resolveFetch: ((response: Response) => void) | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );
    const { form, button } = createFixture();

    form.dispatchEvent(new Event("submit", { cancelable: true }));
    form.dispatchEvent(new Event("submit", { cancelable: true }));
    await Promise.resolve();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(button.disabled).toBe(true);
    expect(button.textContent).toBe("Sending message");

    resolveFetch?.(successResponse());
    for (let step = 0; step < 8; step += 1) await Promise.resolve();
    expect(button.disabled).toBe(false);
  });

  it("aborts a timed out request, preserves values, and permits retry", async () => {
    const fetch = vi
      .fn<(url: RequestInfo | URL, init?: RequestInit) => Promise<Response>>()
      .mockImplementationOnce(
        (_url: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      )
      .mockResolvedValueOnce(successResponse());
    vi.stubGlobal("fetch", fetch);
    vi.useFakeTimers();
    const { form, status, button } = createFixture();

    form.dispatchEvent(new Event("submit", { cancelable: true }));
    await vi.advanceTimersByTimeAsync(15_000);
    for (let step = 0; step < 8; step += 1) await Promise.resolve();

    expect(status.textContent).toContain(
      "We do not know whether the form service accepted your message.",
    );
    expect(button.disabled).toBe(false);

    await submit(form);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
