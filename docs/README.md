# COBOL Student Account Management System

This project contains a legacy COBOL-based system for managing student accounts. The system allows users to view account balances, credit accounts, and debit accounts with basic validation.

## COBOL Files Overview

### data.cob
**Purpose:** Handles data persistence for account balances.

**Key Functions:**
- `READ`: Retrieves the current balance from storage
- `WRITE`: Updates the balance in storage

**Business Rules:**
- Maintains a single balance value initialized to $1000.00
- Acts as a simple data layer for balance operations

### main.cob
**Purpose:** Main entry point and user interface for the account management system.

**Key Functions:**
- Displays a menu-driven interface
- Handles user input for account operations
- Calls appropriate operations based on user selection

**Business Rules:**
- Provides options for viewing balance, crediting, debiting, and exiting
- Validates user input (accepts choices 1-4)
- Continues operation until user chooses to exit

### operations.cob
**Purpose:** Implements the core business logic for account operations.

**Key Functions:**
- `TOTAL`: Displays the current account balance
- `CREDIT`: Adds funds to the account
- `DEBIT`: Subtracts funds from the account (with validation)

**Business Rules:**
- **Debit Validation:** Prevents debits that would result in a negative balance
  - Checks if account balance is sufficient before processing debit
  - Displays "Insufficient funds" message if balance < debit amount
- **Credit Operations:** Allows unlimited credits to the account
- **Balance Display:** Shows current balance for all operations
- All operations update the persistent balance through the data layer

## System Architecture

The system follows a modular design:
- `main.cob` handles user interaction
- `operations.cob` contains business logic
- `data.cob` manages data persistence

All programs communicate through COBOL CALL statements and linkage sections.

## Business Rules Summary

1. **Initial Balance:** Accounts start with $1000.00
2. **Credit Operations:** No restrictions on credit amounts
3. **Debit Operations:** Must maintain non-negative balance
4. **Balance Persistence:** All changes are immediately saved

## Sequence Diagram

The following Mermaid sequence diagram illustrates the data flow for a debit operation in the COBOL student account management system:

```mermaid
sequenceDiagram
    participant User
    participant MainProgram
    participant Operations
    participant DataProgram

    User->>MainProgram: Select debit option (choice 3)
    MainProgram->>Operations: CALL 'Operations' USING 'DEBIT '
    Operations->>User: DISPLAY "Enter debit amount: "
    User->>Operations: ACCEPT AMOUNT (user input)
    Operations->>DataProgram: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    DataProgram->>Operations: MOVE STORAGE-BALANCE TO BALANCE (return balance)
    Operations->>Operations: IF FINAL-BALANCE >= AMOUNT
    alt Sufficient funds
        Operations->>Operations: SUBTRACT AMOUNT FROM FINAL-BALANCE
        Operations->>DataProgram: CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
        Operations->>User: DISPLAY "Amount debited. New balance: " FINAL-BALANCE
    else Insufficient funds
        Operations->>User: DISPLAY "Insufficient funds for this debit."
    end
```</content>
<parameter name="filePath">/workspaces/skills-modernize-your-legacy-code-with-github-copilot/docs/README.md