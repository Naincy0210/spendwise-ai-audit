# TESTS.md

## Automated Test Suites

### 1. `AuditEngine` Logic Tests
**File**: `src/lib/__tests__/audit-engine.test.ts`
- **Case**: Team of 2 on a "Team" plan (redundant).
- **Case**: Team of 10 on Individual plans (overpriced vs Team).
- **Case**: Mixing Cursor and Copilot (redundancy check).
- **Case**: API direct vs Seat-based for low usage.
- **Case**: Zero savings scenario (perfect stack).

**Run Command**: `npm test src/lib/__tests__/audit-engine.test.ts`

### 2. Formatting Utility Tests
**File**: `src/lib/__tests__/utils.test.ts`
- **Case**: Currency formatting ($0.00).
- **Case**: Percentage calculation for savings.

### 3. Verification
The minimum 5 tests are implemented in the `pricing-engine.test.ts` file covering the core math logic. These ensure that no "Update-Gaps" or calculation errors exist in the defensible reasoning.
