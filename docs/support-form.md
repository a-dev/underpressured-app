# Support form

The `/support` form posts to Web3Forms at `https://api.web3forms.com/submit`.

- Access key: `src/shared/config/support.ts`.
- Script: `src/scripts/support-form.ts` sends the form without a page reload.
- Without JavaScript, the native form `POST` still works.

A success message means Web3Forms accepted the request. It does not mean the email arrived. The page always shows a direct email address.

Web3Forms checks spam on its server. Its honeypot field is deprecated. hCaptcha needs setup in the Web3Forms dashboard, so do not add it in code first. See the [Web3Forms docs](https://docs.web3forms.com/getting-started/).
