# Feature Specification: Token Creation (Backend)

**Feature Branch**: `014-token-creation`
**Created**: 2026-01-07
**Status**: Draft
**Input**: User description: "On the admin account I would be creating the tokens. Form where I can set price, ticker symbol, annual yield, select industry, payout frequency, investment type, risk level, date of listing, close date, upload token logo. Backend only for now."

## User Scenarios & Testing

### User Story 1 - Admin Creates Token (Priority: P1)

As an admin, I want to create new tokens with all details so that users can invest in them.

**Independent Test**: Can be tested via API with admin credentials.

**Acceptance Scenarios**:

1. **Given** an admin is authenticated, **When** they create a token with all required fields, **Then** the token is saved to the database.

2. **Given** a token is created, **When** other users view the token, **Then** they can see the token details (price, yield, industry, etc.).

3. **Given** duplicate ticker symbol, **When** admin tries to create token, **Then** error "Token symbol already exists" is returned.

---

### User Story 2 - Admin Updates Token (Priority: P2)

As an admin, I want to update token details so that I can correct or modify existing tokens.

**Independent Test**: Can be tested via API with admin credentials.

**Acceptance Scenarios**:

1. **Given** a token exists, **When** admin updates any field, **Then** the changes are saved.

---

### User Story 3 - Admin Deletes Token (Priority: P3)

As an admin, I want to delete tokens so that I can remove invalid or obsolete tokens.

**Independent Test**: Can be tested via API with admin credentials.

**Acceptance Scenarios**:

1. **Given** a token exists, **When** admin deletes it, **Then** the token is removed from database.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide API endpoint to create tokens.

- **FR-002**: System MUST require admin authentication for token management.

- **FR-003**: System MUST accept the following fields:
  - Token name
  - Ticker symbol (unique)
  - Price (NGN)
  - Annual yield (percentage)
  - Industry (selection)
  - Payout frequency
  - Investment type
  - Risk level
  - Date of listing
  - Close date
  - Token logo (URL)
  - Minimum investment
  - Employee count
  - Description

- **FR-004**: System MUST validate required fields.

- **FR-005**: System MUST return validation errors for missing/invalid fields.

- **FR-006**: System MUST provide endpoints for update and delete.

- **FR-007**: System MUST list all tokens (for admin and public).

### Key Entities

- **Token**: All token metadata

### Dependencies

- Existing authentication system (for admin check).

- Image upload capability (or URL input).

---

*To proceed to planning, run `/sp.plan`*
