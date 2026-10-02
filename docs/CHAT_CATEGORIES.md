# Category creation in chat

Users can explicitly create a category without first saving a link:

- `Crea una categoría Kubo con descripción: mi startup de IA en contabilidad.`
- `Creemos Kubo, es mi startup de IA en contabilidad.`
- `Create a category Research.`

Only an explicit command in the **current user message** exposes the
`create_category` tool. Ordinary saves, searches, quoted source content and
negative requests do not enable it. A message containing a URL keeps the
existing save workflow; creating a category and saving a link in one message
is not supported by this bounded flow. Use two messages instead.

The model extracts a name that must be present in that message plus an optional
description. The API allows one creation attempt per request and confirms the
database result directly, rather than asking the model to invent a success
response. Names are 1–80 characters and descriptions at most 500 characters.
An unclear command should receive a request for an explicit name, not a write.

The Convex mutation checks the configured backend secret, the session owner,
and the user before writing. Category lookup and insertion happen in the same
transaction, scoped by the existing user index. Case, Unicode compatibility,
and whitespace-equivalent names reuse the existing record; existing names and
descriptions are not overwritten. The sidebar's create action shares this
validation and duplicate handling. No schema/index change or backfill is needed.

Creation does not rename/delete categories, move links, or change retrieval.
The reactive sidebar displays the new category with no library-layout change.
Historical automatic category creation during link registration is unchanged.

## Preview acceptance

1. In a signed-in isolated Preview, send the first example and confirm the
   category/description appears in the sidebar.
2. Repeat with a different case/spacing. Confirm no second category appears and
   the original description is preserved.
3. Save a link asking for that existing category and confirm its placement.
4. Check ordinary searches, negative requests and failed writes do not claim
   category creation. Backend tests cover forged sessions/secrets independently.

Local tests/build, provider deployment, and owner acceptance are separate
checks. Do not promote to production without explicit approval.
