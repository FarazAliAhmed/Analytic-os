# Feature Specification: Withdrawal Form

**Feature Branch**: `011-withdrawal-form`
**Created**: 2026-01-05
**Status**: Draft
**Input**: User description: "add withdrawal form with account number and account name fields for bank transfer"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter Bank Details for Withdrawal (Priority: P1)

As a user, I want to enter my account number and account name on the withdrawal form so that I can receive funds to my bank account.

**Why this priority**: Without bank details, users cannot withdraw money. This is core wallet functionality.

**Independent Test**: Can be tested by opening withdrawal modal and verifying account number/name fields are present and can be filled.

**Acceptance Scenarios**:

1. **Given** a user has wallet balance, **When** they click "Withdraw", **Then** a form should appear with fields for account number and account name.

2. **Given** a user types their account number, **When** it is 10 digits, **Then** the system should validate the format.

3. **Given** a user types their account name, **When** it is entered, **Then** it should display as they type for verification.

4. **Given** a user enters all required fields, **When** they click submit, **Then** the withdrawal should proceed to confirmation.

---

### User Story 2 - Save Bank Account for Future Withdrawals (Priority: P2)

As a returning user, I want to save my bank account details so that I don't have to re-enter them for future withdrawals.

**Why this priority**: Convenience for users who withdraw regularly. Saves time and reduces errors.

**Independent Test**: Can be tested by entering bank details, completing withdrawal, then starting new withdrawal and verifying saved account appears.

**Acceptance Scenarios**:

1. **Given** a user has completed a withdrawal, **When** they make another withdrawal, **Then** their previously used bank account should be shown as an option.

2. **Given** saved bank accounts exist, **When** user selects one, **Then** account number and name should auto-fill.

3. **Given** user has saved accounts, **When** they want to use a different account, **Then** they can enter new details manually.

---

### User Story 3 - Validate Bank Account Details (Priority: P2)

As a user, I want the system to validate my bank account details before submission so that I don't make mistakes.

**Why this priority**: Prevents failed transfers and ensures money goes to the correct account.

**Independent Test**: Can be tested by entering invalid account numbers and verifying error messages appear.

**Acceptance Scenarios**:

1. **Given** a user enters an account number, **When** it is not 10 digits, **Then** an error message should appear.

2. **Given** a user enters an account name, **When** it is empty or too short, **Then** validation should require minimum length.

3. **Given** all fields are valid, **When** user submits, **Then** the submit button should be enabled.

---

### Edge Cases

- What happens when user enters special characters in account name?
- How does system handle account numbers with spaces or dashes?
- What happens when saved bank account is closed or invalid?
- How does system handle duplicate saved accounts?
- What happens if Monnify API returns account verification failure?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display an input field for account number (10 digits) on the withdrawal form.

- **FR-002**: System MUST display an input field for account name on the withdrawal form.

- **FR-003**: System MUST validate account number format (10 numeric digits for Nigerian accounts).

- **FR-004**: System MUST validate account name is not empty and has minimum 3 characters.

- **FR-005**: System SHOULD verify account details via bank API before withdrawal.

- **FR-006**: System MUST save bank account details for authenticated users for future use.

- **FR-007**: System MUST display saved bank accounts as selectable options.

- **FR-008**: System MUST allow users to add multiple bank accounts.

- **FR-009**: System MUST allow users to delete saved bank accounts.

- **FR-010**: System MUST show validation errors inline when fields are invalid.

### Key Entities

- **BankAccount**: Account number, account name, bank name, bank code, isDefault flag, user association

- **WithdrawalRequest**: Amount, bank account ID, status, created timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of users can successfully enter withdrawal bank details on first attempt.

- **SC-002**: Users see validation errors within 1 second of entering invalid data.

- **SC-003**: 90% of users complete withdrawal after entering bank details.

- **SC-004**: Bank account verification succeeds for 95% of valid accounts.

- **SC-005**: Saved bank accounts appear immediately on subsequent withdrawals.

## Assumptions

- Using Nigerian bank account format (10 digits for account numbers).

- Bank account verification via Monnify API is available.

- Users can have multiple saved bank accounts.

- Default bank account is used if multiple exist.

- Account name is retrieved via bank account name lookup API.

## Dependencies

- Existing WithdrawModal component.

- Monnify account verification API.

- Existing BankAccount model in database.

- Existing wallet balance functionality.

---

*To proceed to planning, run `/sp.plan`*
