const uncertainMessage =
  "We do not know whether the form service accepted your message. Please try again or email support@underpressured.app.";
const rejectedMessage =
  "The form service could not accept your message. Please try again or email support@underpressured.app.";

export function initializeSupportForm({
  form,
  status,
  button,
}: {
  form: HTMLFormElement;
  status: HTMLElement;
  button: HTMLButtonElement;
}) {
  let pending = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;

    const body = new FormData(form);
    pending = true;
    button.disabled = true;
    button.textContent = "Sending message";
    status.textContent = "Sending your message.";

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
        signal: controller.signal,
      });
      const data: unknown = await response.json();
      if (
        typeof data !== "object" ||
        data === null ||
        !("success" in data) ||
        typeof data.success !== "boolean"
      ) {
        status.textContent = uncertainMessage;
      } else if (response.ok && data.success) {
        status.textContent = "Your message was submitted.";
        form.reset();
      } else {
        status.textContent = rejectedMessage;
      }
    } catch {
      status.textContent = uncertainMessage;
    } finally {
      window.clearTimeout(timeout);
      pending = false;
      button.disabled = false;
      button.textContent = "Send message";
    }
  });
}

const form = document.querySelector("[data-support-form]");
const status = document.querySelector("[data-support-status]");
const button = document.querySelector("[data-support-submit]");
if (
  form instanceof HTMLFormElement &&
  status instanceof HTMLElement &&
  button instanceof HTMLButtonElement
) {
  initializeSupportForm({ form, status, button });
}
