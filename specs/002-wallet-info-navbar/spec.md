# Feature Specification: Wallet Info Navbar

**Feature Branch**: `002-wallet-info-navbar`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "wallet-info-navbar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Search Dropdown (Priority: P1)

As a user, I want to click on the search bar and see a dropdown with search results, so that I can quickly find startups and tokens.

**Why this priority**: Search is a primary navigation method for discovering content on the platform.

**Independent Test**: Can be tested by clicking on the search bar and verifying the dropdown opens with search results.

**Acceptance Scenarios**:

1. **Given** a user is on the dashboard, **When** they click on the search bar, **Then** a dropdown should appear below the search bar.

2. **Given** the search dropdown is open, **When** they view it, **Then** they should see a list of search results with startup name, ticker, and price.

3. **Given** the search dropdown is open, **When** they click outside of it, **Then** the dropdown should close.

4. **Given** the search dropdown is open, **When** they press Escape, **Then** the dropdown should close.

---

### User Story 2 - View Wallet Info (Priority: P1)

As an authenticated user, I want to see my wallet address and balance in the navbar, so that I can quickly verify my connected wallet.

**Why this priority**: Wallet connection is the primary authentication method for this Web3 platform.

**Independent Test**: Can be tested by logging in and checking the navbar for wallet information display.

**Acceptance Scenarios**:

1. **Given** a user is logged in with a connected wallet, **When** they view the navbar, **Then** they should see their truncated wallet address (e.g., `0x7a2...F8d3`).

2. **Given** a user is logged in with a connected wallet, **When** they view the navbar, **Then** they should see their wallet balance in USD format.

3. **Given** a user is logged in, **When** they view the navbar, **Then** they should NOT see the profile avatar icon.

---

### User Story 3 - Copy Wallet Address (Priority: P2)

As a user, I want to copy my wallet address to the clipboard, so that I can share it or use it in transactions.

**Why this priority**: Copying wallet address is a common action for Web3 users.

**Independent Test**: Can be tested by clicking the copy button and verifying the address is copied.

**Acceptance Scenarios**:

1. **Given** a user is logged in and sees their wallet address, **When** they click the copy button, **Then** the full address should be copied to the clipboard.

2. **Given** a user clicks the copy button, **When** copying succeeds, **Then** a visual confirmation (checkmark) should appear briefly.

---

### User Story 4 - Disconnect Wallet (Priority: P1)

As a user, I want to disconnect my wallet from the platform, so that I can switch wallets or secure my account.

**Why this priority**: Disconnecting is essential for security and wallet management.

**Independent Test**: Can be tested by clicking disconnect and verifying logout.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they click the disconnect button, **Then** they should be logged out and redirected to the landing page.

2. **Given** a user disconnects their wallet, **When** disconnection completes, **Then** the navbar should show Sign In/Sign Up buttons.

---

### Edge Cases

- What happens when the user doesn't have a wallet address in their session?
- What happens when the clipboard API is not available (HTTP context)?
- What happens when the search dropdown goes off-screen on mobile devices?
- How does the system handle very long wallet addresses?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The search bar MUST open a dropdown below it when clicked.

- **FR-002**: The search dropdown MUST display search results with startup name, ticker tag, price, and price change.

- **FR-003**: The search dropdown MUST close when clicking outside or pressing Escape.

- **FR-004**: When a user is authenticated, the navbar MUST display their truncated wallet address.

- **FR-005**: When a user is authenticated, the navbar MUST display their wallet balance in USD format.

- **FR-006**: The navbar MUST NOT display the profile avatar when wallet info is shown.

- **FR-007**: The copy button MUST copy the full wallet address to clipboard.

- **FR-008**: The copy button MUST show visual confirmation after successful copy.

- **FR-009**: The disconnect button MUST sign out the user and redirect to the landing page.

### Key Entities

- **WalletInfo**: Contains wallet address (truncated and full) and balance in USD. Derived from session data.

- **SearchResult**: Contains startup name, ticker tag, price, and price change percentage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users can open search dropdown by clicking the search bar.

- **SC-002**: Search dropdown closes on outside click or Escape key press.

- **SC-003**: 100% of authenticated users see wallet info in navbar (no profile avatar).

- **SC-004**: Copy button successfully copies address to clipboard on click.

- **SC-005**: Disconnect button successfully logs out user and redirects.

## Assumptions

- Wallet address is available in the user session from the authentication provider.

- Wallet balance is mocked as "$12,450.00" for initial implementation (API integration is out of scope).

- Search results data is mocked for the dropdown.

## Dependencies

- Existing NextAuth session management.

- Existing search bar component (SearchBar.tsx).

- Existing useSession hook for accessing user data.

- Existing signOut function from next-auth.
