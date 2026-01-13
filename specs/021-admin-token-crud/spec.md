# Feature Specification: Admin Token Management CRUD

**Feature Branch**: `021-admin-token-crud`
**Created**: 2026-01-11
**Status**: Draft
**Input**: User description: "Implement full CRUD for admin token management page with working actions (add, edit, toggle, delete), real API integration, and proper modals for create/edit forms. Stats should fetch from API. Tokens should be visible to other users through the public tokens API."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Manage Tokens (Priority: P1)

As an admin, I want to view all tokens in a table with their details (name, symbol, price, supply, status) so that I can monitor the tokens on the platform.

**Why this priority**: This is the core functionality - without viewing tokens, no other admin actions can be performed.

**Independent Test**: Can be tested by loading the tokens page and verifying all tokens from the database are displayed with correct data.

**Acceptance Scenarios**:

1. **Given** admin navigates to token management page, **When** page loads, **Then** display stats cards (Total Tokens, Active Tokens, Total Volume) and token table with all tokens from database.
2. **Given** tokens exist in database, **When** table renders, **Then** show columns: Token Name, Symbol, Price, Total Supply, Status, Actions with correct data.
3. **Given** admin enters search term, **When** typing in search box, **Then** filter tokens by name or symbol in real-time.
4. **Given** no tokens exist, **When** page loads, **Then** show empty state message.

---

### User Story 2 - Add New Token (Priority: P1)

As an admin, I want to create new tokens with full details so that they become available for users to invest in.

**Why this priority**: New tokens need to be created for the platform to offer investment options to users.

**Independent Test**: Can be tested by clicking "Add New Token", filling form, submitting, and verifying token appears in table and is visible to public users.

**Acceptance Scenarios**:

1. **Given** admin is on token page, **When** clicks "Add New Token" button, **Then** open modal with token creation form.
2. **Given** admin fills token form, **When** submits with valid data, **Then** create token via API, close modal, refresh table, show success notification.
3. **Given** admin submits form with missing required fields, **When** validation fails, **Then** show inline error messages for each invalid field.
4. **Given** admin submits form with duplicate symbol, **When** API rejects, **Then** show error that symbol already exists.
5. **Given** new token created, **When** public users browse tokens, **Then** newly created token is visible.

---

### User Story 3 - Edit Existing Token (Priority: P1)

As an admin, I want to modify token details so that I can update prices, yields, or other information as needed.

**Why this priority**: Token parameters may need adjustment after creation (price changes, yield updates).

**Independent Test**: Can be tested by clicking edit icon on a token, modifying values, saving, and verifying changes persist.

**Acceptance Scenarios**:

1. **Given** admin views token table, **When** clicks edit icon on a token row, **Then** open modal pre-filled with current token data.
2. **Given** admin modifies token data, **When** submits changes, **Then** update token via API, close modal, refresh table, show success notification.
3. **Given** admin attempts to submit invalid data, **When** validation fails, **Then** show inline error messages.

---

### User Story 4 - Toggle Token Status (Priority: P2)

As an admin, I want to activate or deactivate tokens so that I can control which tokens are available for trading.

**Why this priority**: Allows temporary suspension of tokens without deletion, important for maintenance or compliance.

**Independent Test**: Can be tested by clicking toggle button and verifying token status changes and public visibility updates accordingly.

**Acceptance Scenarios**:

1. **Given** admin views token table, **When** clicks toggle icon on active token, **Then** token status changes to inactive, API updates, table refreshes.
2. **Given** admin views token table, **When** clicks toggle icon on inactive token, **Then** token status changes to active, API updates, table refreshes.
3. **Given** token is deactivated, **When** public users browse tokens, **Then** token is hidden or marked as unavailable.

---

### User Story 5 - Delete Token (Priority: P2)

As an admin, I want to remove tokens from the system so that deprecated or incorrect tokens are no longer visible.

**Why this priority**: Cleanup of obsolete tokens that should no longer exist in the system.

**Independent Test**: Can be tested by clicking delete icon, confirming deletion, and verifying token is removed from table.

**Acceptance Scenarios**:

1. **Given** admin views token table, **When** clicks delete icon, **Then** show confirmation dialog.
2. **Given** admin confirms deletion, **When** deletion succeeds, **Then** remove token from table, show success notification.
3. **Given** admin cancels deletion, **When** dialog closed, **Then** token remains unchanged.

---

### Edge Cases

- What happens when API is unavailable during token operations?
- How does system handle concurrent edits to the same token by multiple admins?
- What happens when trying to delete a token with existing investments?
- How does system handle very long token names or descriptions in the table?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display token management page with stats cards and data table.
- **FR-002**: System MUST fetch token data from `/api/admin/tokens` endpoint.
- **FR-003**: System MUST calculate stats (total tokens, active tokens, total volume) from fetched data.
- **FR-004**: System MUST filter tokens by name or symbol based on search input.
- **FR-005**: System MUST provide "Add New Token" button that opens creation modal.
- **FR-006**: System MUST validate token creation form fields: name, symbol (2-10 chars), price (positive), annual yield (0-100%), industry, payout frequency, investment type, risk level, listing date, minimum investment, employee count.
- **FR-007**: System MUST submit new token to `/api/admin/tokens` (POST) and handle duplicate symbol errors.
- **FR-008**: System MUST provide edit action that opens modal with pre-filled token data.
- **FR-009**: System MUST update token via `/api/admin/tokens/[id]` (PUT).
- **FR-010**: System MUST toggle token active status via `/api/admin/tokens/[id]` (PUT with isActive field).
- **FR-011**: System MUST delete/deactivate token via `/api/admin/tokens/[id]` (DELETE) with confirmation.
- **FR-012**: System MUST show success/error notifications after each operation.
- **FR-013**: System MUST sync created tokens to public view for regular users.

### Key Entities

- **Token**: Represents a tradable token on the platform with properties: id, tokenId, name, symbol, price, annualYield, industry, payoutFrequency, investmentType, riskLevel, listingDate, closeDate, logoUrl, minimumInvestment, employeeCount, description, volume, transactionCount, isActive, createdAt.
- **TokenStats**: Derived data for dashboard showing total count, active count, total volume.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can view token list within 2 seconds of page load.
- **SC-002**: Admin can create a new token and see it appear in the table within 3 seconds of submission.
- **SC-003**: Admin can edit token details and see changes reflected within 2 seconds of submission.
- **SC-004**: 100% of token operations (create, edit, toggle, delete) succeed when API is available.
- **SC-005**: New tokens are immediately visible to public users after creation.
- **SC-006**: All form validations prevent invalid submissions with clear error messages.
