# Vehicle inquiries

`client.inquiries` submits contact information about a public vehicle listing into Orimetrics ERP.
It does not reserve the vehicle, send a message to the customer, or expose customer/request identities.
The core has no widget renderer, browser storage, cached form configuration, or automatic retries.

## Form configuration

```ts
const form = await client.inquiries.getForm(listingSlug, { signal: controller.signal });

if (form.enabled) {
  // Render the company's privacy notice from form.privacyNotice.url.
  // Configure your Turnstile widget with form.turnstile.siteKey and action.
  // Apply form.limits to the form controls.
} else {
  // Hide or disable submission; the privacy notice is not configured.
}
```

Unavailable listings return an HTTP 404. An eligible listing with no notice returns `{ enabled: false }`.
The SDK validates the documented enabled/disabled branches, so TypeScript narrows configuration fields
when `enabled` is true. Treat listing.interestRequestsEnabled as a display hint; fetch current form
configuration before collecting a submission. Server eligibility may change after either read.

## Submission

```ts
import type { InquirySubmission } from "@orimetrics/sdk";
import { validateInquirySubmission } from "@orimetrics/sdk";

// Create once for this logical inquiry, outside the submit/retry callback.
const idempotencyKey = crypto.randomUUID();

// This example assumes form.enabled and that the visitor explicitly acknowledged the notice.
const submission: InquirySubmission = {
  customer: {
    displayName: "Visitor name",
    contacts: [
      { kind: "phone", value: "099 123 4567", countryCode: "EC" },
      { kind: "email", value: "visitor@example.com" },
    ],
    preferredContactChannel: "whatsapp",
  },
  message: "I would like to arrange a visit.",
  privacyVersion: form.privacyNotice.version,
  privacyAcknowledged: true,
  turnstileToken: tokenFromWidget,
};

validateInquirySubmission(submission, form);
const receipt = await client.inquiries.submit(listingSlug, submission, {
  idempotencyKey,
  timeoutMs: 15_000,
  signal: controller.signal,
});
// receipt is { accepted: true }; show an acknowledgment.
```

`submit(listingSlug, submission, options)` requires an explicit UUID idempotency key. The SDK never
creates one or substitutes consent, a privacy version, or a challenge token. Disable duplicate clicks
in the UI and keep submission state in the application. All requests omit ERP credentials and use the
shared transport's safe error boundary, deadlines and cancellation.

At least one contact is required, with at most one phone and one email. A local phone number needs a
country code; an international number beginning with + can omit it. Preferred channel is optional or
null; `whatsapp` requires a phone and `email` requires an email. Contact labels and phone country codes
are optional/nullable. Message is optional/nullable. Entered values are sent unchanged: normalization,
phone/email validity, customer matching and admission remain server responsibilities.

Submission performs structural checks before I/O. `validateInquirySubmission(submission, form)` adds
checks against current name/message/contact limits, enabled status and privacy version. It performs
no I/O and mutates neither argument. Invoke it explicitly with the current form; `submit` does not
fetch/cache configuration. Validation failures throw TypeError with field names, not entered values.
A malformed form response throws a protocol OrimetricsError. These checks do not guarantee acceptance.

## Failures and retry policy

An accepted response is HTTP 202 with `{ accepted: true }`. The SDK exposes only that acknowledgment,
even if the response includes additional fields. No customer identity or duplicate information is returned.

Network failures, deadlines, cancellation after dispatch and malformed success responses can leave the
outcome uncertain. Retain the same key, listing and business payload for an explicit retry. A fresh
Turnstile token may replace the old token: it is excluded from the server's payload fingerprint.
Completed retries return acknowledgment without another inquiry. Do not automatically generate a new
key after a timeout. A deliberate new inquiry uses a new key.

HTTP failures retain safe `status`, `code`, `requestId` and `retryAfterMs` when supplied:

- 404: refresh listing/form availability.
- 409: inspect the server code; changed business input under the same key conflicts. Refresh the form
  for changed-notice or eligibility conflicts. Changed consent/version is new business input, not an
  identical retry; ask the visitor to review the current notice before starting a new submission.
- 422: correct rejected input or refresh an invalid challenge, according to the server code.
- 429: respect `retryAfterMs` before an explicit retry with the same logical operation key.
- 503: verification or service unavailable; retain the key for a later explicit retry.

Do not log submitted contacts, messages or challenge tokens. The SDK does not retain them or expose
raw backend error details. Browser integrations need API CORS support for the website origin,
Content-Type and Idempotency-Key, with diagnostic response headers exposed as needed.

The core does not load Turnstile scripts or render forms. Those concerns belong to the website or
future optional framework helpers. The API remains authoritative for notice changes, visibility,
rate limits and validation at submission time.
