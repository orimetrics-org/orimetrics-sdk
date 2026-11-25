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
no I/O and mutates neither argument. Invoke it with the current form before a new submission;
recovery of an already attempted operation is a separate path described below. `submit` does not
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

## State transitions and ownership

The inquiry workflow has six independent state dimensions. The SDK deliberately does not combine them
into a mutable session or infer one from another:

- **Form discovery:** the website moves from not loaded to loading, then enabled, disabled, unavailable
  (404), or failed. InquiryForm explicitly represents enabled versus disabled; failures reject the
  promise and are not silently converted into disabled. Each getForm fetches a new snapshot. The
  website should ignore stale responses when the selected listing changes, including stale error and
  loading updates. Enabled configuration and listing.interestRequestsEnabled do not guarantee admission.
- **Draft validity:** editing can alternate between invalid and locally valid. Validation is pure and
  does not modify fields, remember readiness or trigger a later request. Fixing an invalid field requires
  another explicit call. Contact structure and preferred-channel consistency are local checks; the
  server owns normalization and final validity. Keep field errors separate from network/admission errors.
- **Privacy acknowledgment:** unacknowledged → explicitly acknowledged for the notice shown to the
  visitor. A different notice version invalidates readiness for a new submission until the visitor reviews
  and acknowledges it. Never copy a new version into an old draft while silently preserving consent.
  The true literal in InquirySubmission represents the caller's assertion of that action; the SDK cannot
  perform or verify the UI interaction. Validation never supplies consent on the caller's behalf.
- **Challenge readiness:** absent, pending, available, expired or failed belong to the website's
  Turnstile integration. The SDK only checks token structure; a nonempty token is not proof of successful
  verification. Widget callbacks own refresh/expiry. A refreshed token may accompany a retry with the
  original business input and key. Do not retain tokens in logs or persistent state by default.
- **Logical submission:** a prepared operation is identified by client organization, listing, explicit
  idempotency key and business payload. The website owns its draft/pending/accepted/rejected/uncertain
  presentation. Transport owns individual attempt settlement. Local validation failure or a signal
  already aborted before dispatch sends nothing; cancellation after dispatch, timeout, network failure
  or a malformed success response can leave server acceptance unknown. An HTTP error describes that
  attempt; it is not a general proof that an earlier uncertain attempt never committed. Acceptance is
  only the acknowledgment returned by submit, not a reservation, message delivery or private staff status.
- **Recovery and rate limiting:** retry is an explicit new attempt of the same logical operation, not
  a new inquiry. Keep the original listing, key and business payload; only the challenge token may change.
  Respect Retry-After when provided, but expiration of a countdown does not itself authorize acceptance.
  Do not rotate keys in response to errors, deduplicate customers locally or automatically resubmit.
  A deliberate new inquiry gets a new key and current consent. Disable duplicate clicks per form while
  pending; separate forms sharing a client must not share a global pending flag or cancel each other.

### New submission versus recovery

Current-form validation is a readiness check for **new** inquiries. It must not become a mandatory
cached-form gate inside submit. For example, the server may accept an inquiry but the response may be
lost; a later form read can show a new notice or disabled admission. The caller can still explicitly
retry the original operation unchanged (optionally with a refreshed token), allowing the server to
return a previously recorded acknowledgment. The SDK neither promises that a replay will succeed nor
uses an old form to authorize a new inquiry. If no prior acceptance exists, current server admission
rules still apply. Resolve uncertainty before silently replacing the operation with edited input.

Retain a separate snapshot of the attempted business payload and key while the visitor edits another
draft. submit serializes each request independently, but it does not retain a retry snapshot for you.
Do not reconstruct a retry from current form fields. Likewise, a late result from an old listing must
not update the new listing's UI; retain enough per-operation state to explain or recover the old result.
Cancellation does not revoke consent, undo acceptance or clear the operation identity automatically.

These boundaries already hold in the implementation. Adding automatic form refresh, client-side
idempotency state or a combined state-machine dependency would risk blocking valid recovery or creating
duplicate submissions. The public API and runtime remain unchanged. Tests in
`test/inquiries/lifecycle.test.ts` protect recovery after form changes, consent preservation, recovery
from local validation errors, input snapshots and independent concurrent attempts. Server replay behavior
is modeled by mocks in these SDK tests; database idempotency and real admission remain backend concerns.
