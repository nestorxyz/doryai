# Gemini chat incident — 2026-11-09 America/Lima

Production deployment b440fe95-b81b-46c4-8ff5-04e2b4f74971 serves commit
54f503ca772610ba849f2a1b328e0f5128587c3e. Backend /health returns ok.
Railway production chat logs and an isolated inference request both show HTTP
400 API_KEY_INVALID from generativelanguage.googleapis.com. No user library
content was used in diagnostic inference requests.

A different locally available current key returns HTTP 402 prepayment depleted,
so replacing the old key with that key would not restore chat. No keys were
written to logs or source. A Vertex request in clippo-462915 returned 404 for
gemini-2.5-flash but HTTP 200 for gemini-3.8-flash.

## Prepared local change

Shared server-only Gemini client configuration supports an explicit Vertex
route using project-scoped service-account credentials. Chat and social-video
processing use the same factory. Existing Developer API defaults are preserved
until Vertex is explicitly selected. No fallback sends requests through a
second billing route. GEMINI_MODEL permits the tested Vertex Flash selection.
Malformed credentials fail with a generic error that does not echo secret JSON.

124 API tests pass; API TypeScript build passes. Tests cover existing key
behavior, credential/project mismatch, malformed-secret redaction and model
selection. This does not establish production acceptance.

## Approved rollout

The owner approved the following production rollout in this chat on 2026-11-09.

Create a dedicated DoryAI runtime service account in clippo-462915 with
roles/aiplatform.user on that project, provision one server credential into
Railway secret environment storage, set GOOGLE_GENAI_USE_VERTEXAI=true,
GOOGLE_CLOUD_PROJECT=clippo-462915, GOOGLE_CLOUD_LOCATION=global,
GEMINI_MODEL=gemini-3.8-flash and GOOGLE_SERVICE_ACCOUNT_JSON. Deploy the
reviewed backend, verify health and an authenticated chat action. Keep web,
Convex, libraries and billing plans unchanged. Credential must never enter Git
or chat. Runtime identity creation and scoped IAM binding have begun; deployment and
authenticated verification are still pending.

Rollback: restore the prior backend deployment and prior runtime variables;
this restores the prior configuration but its invalid key still needs repair.
Avoid presenting rollback as a working AI service. Actual Cloud-credit
application and charges require billing readback.
