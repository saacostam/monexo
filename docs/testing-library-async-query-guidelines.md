# Testing Library Async Query Guidelines

## Overview

A common source of slow frontend tests is incorrect usage of Testing Library async utilities.

Most performance issues are caused by:

* nested polling
* timeout-based negative assertions
* unnecessary `waitFor` usage

This document defines the recommended patterns for writing fast, reliable UI tests.

---

# Query Types

Testing Library provides 3 primary query families.

## `getBy*`

Use when the element should already exist synchronously.

```ts id="m7p2rx"
screen.getByText("Submit");
```

Behavior:

* synchronous
* throws immediately if not found

Recommended for:

* immediate assertions after render
* stable UI elements

---

## `findBy*`

Use when the element appears asynchronously.

```ts id="z3k8vq"
await screen.findByText("Loaded");
```

Behavior:

* asynchronous
* internally retries until timeout

Recommended for:

* loading states
* async rendering
* server/query completion

---

## `queryBy*`

Use when asserting absence.

```ts id="u4d9wt"
expect(screen.queryByText("Error")).not.toBeInTheDocument();
```

Behavior:

* synchronous
* returns `null` instead of throwing

Recommended for:

* negative assertions
* checking removed elements

---

# Common Anti-Patterns

## Avoid wrapping `findBy*` inside `waitFor`

Bad:

```ts id="f6v2oe"
await waitFor(async () => {
	const content = await screen.findByTestId("content");
	expect(content).toBeVisible();
});
```

Why:

* `findBy*` already performs polling
* wrapping it in `waitFor` creates nested retries
* increases runtime unnecessarily

Good:

```ts id="t1q7mc"
const content = await screen.findByTestId("content");

expect(content).toBeVisible();
```

---

## Avoid using `findBy*` for negative assertions

Bad:

```ts id="y9k3sn"
await expect(screen.findByText("Error")).rejects.toThrow();
```

Why:

* `findBy*` waits until timeout before failing
* each assertion may cost ~1 second

Good:

```ts id="r5n8ha"
expect(screen.queryByText("Error")).not.toBeInTheDocument();
```

---

# When to Use `waitFor`

Use `waitFor` only when waiting for arbitrary async conditions.

Typical examples:

* mock call assertions
* side-effect completion
* state stabilization

Example:

```ts id="x8c4pb"
await waitFor(() => {
	expect(mockFn).toHaveBeenCalled();
});
```

Avoid using `waitFor` for DOM queries that already have async equivalents.

---

# Recommended Test Structure

Prefer:

1. a single async synchronization point
2. synchronous assertions afterward

Example:

```ts id="d2w6rm"
const content = await driver.findContent();

expect(content).toBeVisible();
expect(driver.querySkeleton()).not.toBeInTheDocument();
expect(driver.queryError()).not.toBeInTheDocument();
```

This minimizes:

* polling
* retries
* timeout stacking

---

# Driver Design Guidelines

Drivers should expose all three query styles.

Example:

```ts id="q7v1zy"
class ExampleDriver {
	findContent() {
		return screen.findByTestId("content");
	}

	getContent() {
		return screen.getByTestId("content");
	}

	queryContent() {
		return screen.queryByTestId("content");
	}
}
```

Benefits:

* explicit test intent
* avoids accidental timeout usage
* improves readability

---

# Performance Notes

Slow UI tests are often caused by:

* repeated async retries
* timeout-based absence assertions
* unnecessary polling layers

Not by:

* number of assertions
* realistic rendering
* dependency injection
* integration-oriented test design

Well-structured integration tests can remain both:

* realistic
* performant

---

# Quick Reference

| Goal                             | Recommended Query |
| -------------------------------- | ----------------- |
| Element exists immediately       | `getBy*`          |
| Element appears later            | `findBy*`         |
| Element should not exist         | `queryBy*`        |
| Wait for side-effects/mock calls | `waitFor`         |

---

# Summary

Preferred patterns:

* `findBy*` for async existence
* `queryBy*` for absence
* `getBy*` for immediate existence
* `waitFor` only for non-query async conditions

Avoid:

* `waitFor(findBy(...))`
* `findBy(...).rejects`
* layered polling mechanisms
