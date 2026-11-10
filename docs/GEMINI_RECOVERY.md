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

## Recovery verification

Owner approval was granted for the runtime identity, scoped IAM, Railway secrets
and backend deployment on 2026-11-09 America/Lima. Billing readback confirmed
clippo-462915 -> Nestor Projects; available credits totaled S/276.15 at rollout.
The dedicated runtime principal is
`doryai-runtime@clippo-462915.iam.gserviceaccount.com`, with
`roles/aiplatform.user` on this project. Its one active credential is stored in
Railway environment secrets; diagnostic credentials were removed. No private
key was committed or retained in a release archive.

Initial release ee1ebc3 (Railway 733e6379-04a8-4139-84aa-209e82df0ad5)
restored provider authentication, but the real tool loop revealed discarded
thought signatures. Follow-up 546ef6962c1ba76232fc3944919ed8c92847622e
preserves original model response parts/signatures in both tool loops and
persisted model history. Existing UI-only payload filtering remains intact.
No bypass signature placeholders or authentication relaxations were used.

125 API tests and TypeScript compilation passed. A real signed two-round tool
conversation with the dedicated runtime identity passed. Production deployment
`d7148ef5-006c-44d9-8d82-8f7c8cd26485` is SUCCESS from a clean archive of
546ef69; /health returns ok. In the owner's authenticated Safari session,
a read-only saved-link search for harness engineering returned a grounded
answer and the matching GitHub card. The prior chat error disappeared.
This verifies authenticated chat and saved-link retrieval; it does not establish
fresh Instagram media extraction. The initial probe observed an existing AAC
extraction failure that fell back to standard URL analysis; no fresh-save
verification is claimed.

Web/Convex were not deployed and libraries were not migrated/backfilled. Main
still contains the prior source until the recovery PR is integrated; this was a
manual backend-only release. Incorporate the recovery before a future main-based
backend redeploy. Do not redeploy the old main as a working recovery.
Actual new usage charges and credit application await billing reporting.
