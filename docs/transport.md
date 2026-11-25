# Client and transport

The package now exports `createOrimetricsClient`, `OrimetricsError`, configuration/request types, and
public domain types. Organization/dealership profiles, vehicle browsing and vehicle inquiries use
the shared internal transport. Appraisal form/submission/completion operations also use it; signed
storage PUTs use a separate upload helper with the same deadlines and credential omission.

```ts
import { createOrimetricsClient, OrimetricsError } from "@orimetrics/sdk";

const client = createOrimetricsClient({
  baseUrl: "https://your-api.example",
  organizationSlug: "your-company",
  timeoutMs: 15_000,
});

const controller = new AbortController();

try {
  const profile = await client.organization.getProfile({
    limit: 25,
    offset: 0,
    signal: controller.signal,
    timeoutMs: 5_000,
  });
  console.log(profile.company.name);
} catch (error) {
  if (error instanceof DOMException && error.name === "AbortError") {
    // The caller cancelled; no error UI is normally needed.
  } else if (error instanceof OrimetricsError) {
    console.error(error.kind, error.status, error.code, error.requestId);
  } else {
    throw error;
  }
}
```

URLs in examples are placeholders. Construction validates configuration but performs no network I/O.
One client is scoped to one organization, and configuration is copied at construction. Instance and
feature APIs are frozen. `baseUrl` accepts HTTP(S), including a deployment path prefix; trailing slashes
are removed. URL credentials, queries and fragments are rejected. The organization slug must be a
nonempty path segment without traversal, delimiters, percent escapes, whitespace or control characters.

## Requests and cancellation

The default deadline is **15,000 ms**. Per-request `timeoutMs` overrides it; both accept integer
milliseconds from 1 through 2,147,483,647. There is no unlimited mode. The deadline covers fetch,
response-body reading and decoding, subject to the JavaScript event loop. It cannot preempt synchronous
CPU work. A caller's already-aborted signal prevents dispatch. Cancellation returns a standard
`AbortError` with a safe message even when the caller supplied a custom abort reason.

Requests settle on deadline/cancellation even if a custom fetch ignores its signal. The internal signal
is aborted, but a non-cooperative custom fetch may continue its own underlying work. Timers and caller
listeners are removed when the SDK request settles. Requests have independent controllers.

All API requests set `credentials: "omit"`, `cache: "no-store"`, and `redirect: "error"`. No session
cookies, global auth configuration, browser storage or automatic retry mechanism is installed. Redirect
failures appear as network failures; browsers do not expose their underlying redirect details. The API
must allow the website origin through CORS and expose diagnostic headers for the SDK to read them.

An optional `fetch(request, init)` adapter can observe or replace the Fetch implementation. It receives
both a Request and explicit RequestInit credential/cache/redirect/signal settings. Forward both to
native fetch. The adapter is trusted application code: the SDK cannot prevent it from ignoring these
settings or sending its own additional requests. Bun 1.4.4's Request credential getter differs from
browser behavior, so tests verify the explicit init as well as a separate native-browser smoke check.

## Errors

`OrimetricsError` has a safe message and `kind`:

- `http`: a non-success HTTP response. `status` comes from the actual response, not its JSON body.
  `code` and `requestId` are retained when present and well-formed. The `X-Request-ID` header takes
  precedence over the Problem Details body. An unreadable/non-JSON error body remains an HTTP error.
- `network`: fetch or response-stream failure. No invented status or backend code is attached.
- `timeout`: the deadline expired. A mutation may already have reached the server; this is not proof
  that it failed. No invented status is attached.
- `protocol`: unexpected content type, invalid JSON, missing expected content, or failed feature decoding.
  A response request ID is retained when available.

`retryAfterMs` converts a valid Retry-After delay or HTTP date to a nonnegative millisecond delay.
It is informational: the SDK does not retry automatically. Raw backend titles/details, fetch error
messages and causes are not attached to SDK errors. Input/configuration mistakes use `TypeError`.

## Internal feature integration

`shared/api/transport.ts` uses the pinned OpenAPI types through openapi-fetch. Features supply a typed
send function and an unknown-to-domain decoder. The transport passes the fixed organization and a
per-request signal, validates organization scope, and enforces request settings at the fetch boundary.
Categorical arrays use repeated query parameters; JSON serialization preserves string money and null.

Only scoped appraisal-photo completion POSTs may send an Authorization header. Public submissions
preserve their caller-supplied idempotency keys; the transport neither generates keys nor retries writes.
Signed storage uploads use the dedicated appraisal upload helper rather than this API-scoped transport.

JSON and binary operations are distinct. Future binary operations select their parser and decoder
explicitly. No-content success can be accepted by an appropriate decoder; the profile decoder correctly
rejects it because that operation promises a profile. Profile decoding validates nested transport shape,
including nullable fields and website variants, while allowing additive fields. It does not sanitize
HTML or validate external links for rendering; website code remains responsible for safe rendering.

Public profile interfaces are checked bidirectionally against the generated contract at compile time.
They keep backend schema names and the full OpenAPI operation map out of public declarations.

## Lifecycle ownership

Client and transport have three lifecycles. Keep their ownership separate when adding features:

- **Construction:** unresolved options → validated, frozen configuration → frozen client, or a thrown
  configuration error. Construction is synchronous and performs no I/O. A client has no connecting,
  authenticated or disposed state; requests are independent and require no client reset.
- **Request supervision:** validate options → reject a pre-aborted call, or start an active operation
  with one timer and one caller-abort listener → settle by success, failure, caller cancellation or
  deadline → remove the timer and listener. Promise settlement owns the terminal outcome; AbortSignal
  owns interruption. The interruption promise is rejected before abort listeners run, preserving safe
  cancellation/timeout errors even when an adapter immediately rejects. Synchronous operation throws
  are adopted as rejections so both sides of the race are observed. A late caller abort cannot change
  an already settled operation. No retry/backoff states exist.
- **Response handling:** sending → reading a received response → decoding its domain value → resolve
  or reject. The internal RequestPhase union carries a Response only after receipt. Scope/header
  rejection happens before fetch; fetch rejection is network failure. Reading includes status/media-type
  checks and body consumption. Non-success responses produce HTTP errors; unavailable problem JSON
  falls back to safe status/header diagnostics. Invalid JSON/media type is a protocol failure, whereas
  an interrupted body stream is a network failure. Domain-decoder failures are protocol failures.
  Existing non-protocol OrimetricsErrors pass through. Request IDs remain available after receipt.

The deadline surrounds the entire response lifecycle, including HTTP problem-body reading. If a body
never finishes, the deadline can win even after headers arrive. Interruption does not undo a write.
An adapter that ignores its signal may still perform underlying work, but late responses are discarded
and their unused bodies cancelled; late body completion cannot enter the feature decoder. Synchronous
JavaScript decoding cannot be preempted by a timer.

JSON versus binary, 204/205 handling, and the completion-token header exception are request policies,
not persistent client states. Response stream consumption and promise settlement remain native Web API
responsibilities. Avoid duplicate settled flags or a state-machine dependency for these mechanisms.

Regression coverage lives in `test/transport/lifecycle.test.ts`, alongside deadline, serialization and
client error-boundary tests. Public methods, error kinds, default deadlines and no-retry behavior remain
unchanged by the explicit phase representation.
