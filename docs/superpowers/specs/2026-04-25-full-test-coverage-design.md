# Full Test Coverage Design

**Date:** 2026-04-25
**Status:** Approved

## Problem

107 of 152 tracked source files have less than 100% statement coverage. Root causes:

1. **Tests mock themselves** — tests like `cityService.test.js` import only `vitest`, not the real module. Other tests use `vi.mock('../apps/client/src/components/ui/SeekerFilterModal')` to mock the very component they're supposed to test.
2. **No tests at all** — some utils, middlewares, contexts, and small UI components have no test file.
3. **Infrastructure files** — entry points and config files are tracked in coverage but cannot be meaningfully unit-tested.

## Goals

- All business logic files reach meaningful coverage (target: >80% statements, ideally 100%)
- Infrastructure/entry-point files excluded from coverage tracking
- All 4 previously failing tests remain fixed (updateUserService date issue resolved separately)

## Section 1: Coverage Configuration

Update `vitest.config.js` `exclude` array to add infrastructure files:

```
apps/api/app.js
apps/api/index.js
apps/api/config/env.js
apps/api/routes/health.js
apps/api/routes/routes.js
apps/api/utils/cron-jobs.js
apps/api/utils/debug-ai-generation.js
apps/api/utils/showCurrentJobTitles.js
apps/api/utils/check-openai-status.js
apps/client/src/main.jsx
apps/client/src/libs/prisma.ts
```

These are Express/React entry points, environment config, and CLI scripts — unit testing them provides no value and would require running a full server.

## Section 2: Fix Service Tests (0% — test exists but mocks real code)

**Pattern:** Each test file imports only `vitest` and tests mock data structures. Fix: import the real service, mock only external I/O dependencies (prisma, AWS, Clerk, Redis).

**Services to fix** (test file exists, real file at 0%):
| Test file | Real file |
|---|---|
| `tests/cityService.test.js` | `apps/api/services/cityService.js` |
| `tests/getJobById.test.js` | `apps/api/services/getJobById.js` |
| `tests/getJobService.test.js` | `apps/api/services/getJobService.js` |
| `tests/imageModerationService.test.js` | `apps/api/services/imageModerationService.js` |
| `tests/jobBoostService.test.js` | `apps/api/services/jobBoostService.js` |
| `tests/jobCreateService.test.js` | `apps/api/services/jobCreateService.js` |
| `tests/jobDeleteService.test.js` | `apps/api/services/jobDeleteService.js` |
| `tests/jobService.test.js` | `apps/api/services/jobService.js` |
| `tests/premiumEmailService.test.js` | `apps/api/services/premiumEmailService.js` |
| `tests/s3UploadService.test.js` | `apps/api/services/s3UploadService.js` |
| `tests/updateUserService.test.js` | `apps/api/services/updateUserService.js` |

**Approach per service:**
1. Read real service to understand its exported functions and dependencies
2. Add `import realService from '../apps/api/services/...'` at the top
3. Add `vi.mock()` for each external dependency (prisma, AWS SDK, nodemailer, etc.)
4. Replace mock-only assertions with calls to real functions

## Section 3: Fix Component Tests (vi.mock on self)

**Problem:** `seeker-filter-modal.test.jsx` and similar files do:
```js
vi.mock('../apps/client/src/components/ui/SeekerFilterModal', () => ({ default: () => <div/> }))
import SeekerFilterModal from '../apps/client/src/components/ui/SeekerFilterModal';
```
The mock replaces the real component before it's imported — real code never runs.

**Components to fix** (test mocks itself):
- `apps/client/src/components/ui/SeekerFilterModal.jsx`
- `apps/client/src/components/ui/ImageUpload.jsx`

**Approach:** Remove `vi.mock()` on the component itself. Keep mocks only for external dependencies (hooks, API calls, store). Keep existing test assertions — they describe the expected behavior.

## Section 4: New Tests for Uncovered Files

Files with no test at all. Write new test files in `tests/`.

**API middlewares:**
- `apps/api/middlewares/errorHandler.js` → `tests/errorHandler.test.js`
- `apps/api/middlewares/validation.js` → `tests/validation.test.js`

**API utils:**
- `apps/api/utils/badWordsList.js` → `tests/badWordsList.test.js`
- `apps/api/utils/stripe.js` → `tests/stripe.test.js`
- `apps/api/utils/telegram.js` → `tests/telegram.test.js`
- `apps/api/utils/toastUtils.js` → `tests/toastUtils.test.js`
- `apps/api/utils/upload.js` → `tests/upload.test.js`
- `apps/api/utils/mailer.js` → `tests/mailer.test.js`
- `apps/api/utils/s3Upload.js` → `tests/s3Upload.test.js`
- `apps/api/utils/attachJobsToUsers.js` — test exists, partial coverage
- `apps/api/utils/fakeUsers.js` — test exists, partial coverage

**Client contexts:**
- `apps/client/src/contexts/ImageUploadContext.jsx` → `tests/ImageUploadContext.test.jsx`
- `apps/client/src/contexts/LoadingContext.jsx` → `tests/LoadingContext.test.jsx`

**Small UI components** (render + basic assertions):
- `apps/client/src/components/ui/button.jsx` → `tests/button.test.jsx`
- `apps/client/src/components/ui/spinner.jsx` → `tests/spinner.test.jsx`
- `apps/client/src/components/ui/FilterIcon.jsx` → `tests/FilterIcon.test.jsx`
- `apps/client/src/components/ui/ProgressBar.jsx` → `tests/ProgressBar.test.jsx`
- `apps/client/src/components/ui/ImageModal.jsx` → `tests/ImageModal.test.jsx`
- `apps/client/src/components/ui/NewsletterAdmin.jsx` → `tests/NewsletterAdmin.test.jsx`

**Client libs:**
- `apps/client/src/libs/users.js` → `tests/users.test.js`

**Client pages:**
- `apps/client/src/pages/NewsletterSubscription.jsx` — test needed
- `apps/client/src/pages/SeekerDetails.jsx` — test needed

## Execution Order

1. Update `vitest.config.js` excludes (fast, removes noise immediately)
2. Fix service tests (Section 2) — highest coverage ROI
3. Fix component tests with vi.mock-on-self (Section 3)
4. Write new tests for uncovered utils/middlewares (Section 4)
5. Write new tests for uncovered UI components and contexts (Section 4 continued)
6. Run full coverage report and verify targets met

## Success Criteria

- `npx vitest run --coverage` passes with 0 failures
- All files in `apps/api/services/` reach ≥80% statement coverage
- All files in `apps/api/utils/` (not excluded) reach ≥80% statement coverage
- All files in `apps/client/src/` (not excluded) reach ≥80% statement coverage
- Infrastructure files removed from coverage noise
