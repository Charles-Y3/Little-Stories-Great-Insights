# Little Stories Great Insights

## Content review gate

Before starting other work in this repo, compare the story list in
`src/data/stories/index.js` against the ledger in `docs/CONTENT_REVIEW.md`.
If any story is missing a ledger row, it's new/unreviewed content — tell
the user immediately and offer to run the fidelity check (procedure is in
`docs/CONTENT_REVIEW.md`) before doing anything else. Do not re-check a
story that already has a ledger row unless its `.js` file or the matching
source docx (`docs/stories1.docx` / `docs/stories2.docx`) has changed since
the recorded check date.

See `docs/AUTHORING.md` for the authoring rules (line budget, no-scroll
rule, English-as-adaptation).
