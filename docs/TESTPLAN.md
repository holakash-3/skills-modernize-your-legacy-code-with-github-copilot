# COBOL Account Management System - Test Plan

This test plan covers the current business logic implemented in the COBOL student account management system. Use these test cases to validate behavior with business stakeholders.

> **Note:** This plan is intended as a template for stakeholder validation. "Actual Result" and "Status" should be filled in during execution.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|-------------|-----------------------|----------------|------------|-----------------|---------------|--------------------|----------|
| TC-01 | View current balance | Application started; balance stored as $1000.00 | 1. Choose menu option `1` (View Balance). | Displays: `Current balance: 001000.00` (or equivalent formatted value). | | | |
| TC-02 | Credit account increases balance | Application started; balance stored as $1000.00 | 1. Choose menu option `2` (Credit Account). 2. Enter credit amount `250.00`. | Displays confirmation and updated balance: `Current balance: 001250.00` (or equivalent). | | | |
| TC-03 | Debit account decreases balance when funds sufficient | Application started; balance stored as $1000.00 | 1. Choose menu option `3` (Debit Account). 2. Enter debit amount `250.00`. | Displays confirmation and updated balance: `Current balance: 000750.00` (or equivalent). | | | |
| TC-04 | Debit rejected when funds insufficient | Application started; balance stored as $1000.00 | 1. Choose menu option `3` (Debit Account). 2. Enter debit amount `1500.00`. | Displays: `Insufficient funds for this debit.` and balance remains unchanged. | | | |
| TC-05 | Menu input validation - invalid choice | Application started | 1. Enter an invalid menu choice (e.g., `9`, `a`, or blank). | Prompts with menu again or shows validation message; does not crash. | | | |
| TC-06 | Persistence - changes saved between operations | Application started; balance stored as $1000.00 | 1. Credit `200.00`. 2. View balance. | Balance reflects credit (e.g., `001200.00`). | | | |
| TC-07 | Persistence - balance persists across runs | Application started; balance stored as $1000.00 (or last saved) | 1. Credit or debit to change balance. 2. Exit. 3. Restart application. 4. View balance. | Balance reflects last saved value from previous run. | | | |
| TC-08 | Exit application gracefully | Application started | 1. Choose menu option `4` (Exit). | Displays exit message and terminates without error. | | | |
