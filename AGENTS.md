<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

## Comments

- Every function definition gets a short one-line purpose comment immediately above it. This includes exported functions, local helpers, nested functions, handlers, and callbacks.

- For an inline anonymous callback, place its one-line comment above the containing operation when inserting it inside the expression would hurt readability.

- For a query, mutation, or action, state who can call it and any notable side effects when those details are not obvious.

- Add a one-line intent comment immediately before every non-obvious domain operation or side-effect block, especially lifecycle transitions, payment changes, audit writes, provider calls, cleanup jobs, and permission-sensitive actions. State the business effect, not the method name.

- Do not leave a newly added multi-line block unexplained just because the containing function already has a purpose comment.

- Use extra inline comments only for non-obvious logical steps or to explain why a critical line exists. Do not narrate simple setters, readable guards, or ordinary assignments.

- Keep comments concise, in sentence case, and without a trailing period. Update them whenever behavior changes.
