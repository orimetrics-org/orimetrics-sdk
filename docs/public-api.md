# Public API conventions for implementation

The core SDK comes first. After the first implementation steps, add a minimalist demo website that
can become a skeleton for client websites. React helpers are deferred until the core is complete.

Client creation and `organization.getProfile()` are implemented; see [transport.md](transport.md).
The remaining feature names below are the intended interface for upcoming milestones.
Consumer examples should validate this interface before a stable release.

## Client and ownership

Expose `createOrimetricsClient(options)` with one organization per instance. Keep `baseUrl`,
`organizationSlug`, and optional injected `fetch` from `OrimetricsOptions`; add configurable deadlines
with the transport implementation. Call options carry an optional `AbortSignal`.
Do not derive tenant identity from globals, website hostnames or ERP sessions. Do not perform network
requests during client construction or module import.

Use cohesive feature APIs:

- `client.organization.getProfile()` and `client.organization.logoUrl()`.
- `client.dealerships.getProfile(dealershipSlug)` and `client.dealerships.logoUrl(dealershipSlug)`.
- `client.vehicles.list(filters)`, `client.vehicles.get(listingSlug)`, and `client.vehicles.photoUrl(...)`.
- `client.inquiries.getForm(listingSlug)` and `client.inquiries.submit(...)`.
- `client.appraisals.getForm(dealershipSlug)`, `client.appraisals.submit(...)`, and explicit photo
  upload/completion helpers implemented with the appraisal milestone.

Keep website routing and UI state out of these functions. Pure filter serialization helpers may be
shared; filtering itself stays on the server. Use feature subpath exports when implementations exist,
and measure tree shaking rather than assuming an aggregate client removes unused features.
Do not expose generic arbitrary-route execution as the supported Orimetrics consumer interface.

## Return values and errors

Operations return promises of typed domain results. Preserve server collection metadata and receipt
semantics instead of flattening them away. Optional/nullable fields retain their transport meanings.
Do not expose openapi-fetch's response wrapper or generic `paths` type as our stable public interface.

Use a single documented error boundary in the transport milestone:

- HTTP failures carry kind `http`, status, safe message, and server code/request ID when present.
- Network, deadline and malformed-response failures have distinct `network`, `timeout`, and `protocol`
  kinds. Do not fabricate HTTP statuses or backend codes for them.
- Caller cancellation preserves standard `AbortError` semantics and is not retried.
- Never expose raw backend details as a default user-facing message. Preserve diagnostic request IDs.

Default to no automatic retries initially. An opt-in read retry policy may be added with bounded
attempts, cancellation and `Retry-After` support. Submissions always retain an explicit operation key;
recovery must not silently generate a new key. Accept fresh challenge tokens for the same submission
where the backend permits them. A timeout does not establish that a write failed.

Only the scoped photo completion operation sends its completion authorization token. Other public
operations omit ERP cookies and credentials. Core code has no persistent cache or browser storage.

## Next milestone

Implement vehicle browsing and the remaining public profile/branding operations against this transport.
Then create the minimalist demo website using the packed SDK. Inquiry/appraisal workflows and optional
React helpers remain later milestones.
