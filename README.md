# Ledger POC – SAP CAP

This project is a proof-of-concept Ledger service built using **SAP CAP (Node.js)**.  
The goal is to simulate balance loading and transaction processing in a clean, model-driven way, without over-engineering things too early.

This repo is mainly for **learning, experimentation, and validation of CAP concepts** like:
- OData V4 actions
- Multipart uploads
- CDS enums
- Service logic in Node.js
- Local testing using SQLite

---

## Problem Statement / Requirements

This project implements a very small-scale banking ledger service.

The system processes daily CSV files provided by a company. These files describe
money transfers between customer accounts that the company operates on behalf
of its customers.

Each account is identified by a 16-digit account number. A core business rule is
that no transfer is allowed if it would result in the source account balance
dropping below zero.

The system is required to:
- load initial account balances for a single company from a CSV file
- accept a day’s transfer file and process each transfer sequentially
- validate sufficient balance before applying a transfer
- record the outcome of each transfer (success or rejection)

An example balance file and an example transfer file are provided as part of the
challenge. The solution intentionally focuses on correctness, clarity, and CAP
best practices rather than building a full banking system.

---

## Sample File / Data
### Balance Load Example
| Starting state of accounts for Account | customers of Alpha Sales: Balance |
|---------------------------------------:|----------------------------------:|
| 1111234522226789                       |                           5000.00 |
| 1111234522221234                       |                          10000.00 |
| 2222123433331212                       |                            550.00 |
| 1212343433335665                       |                           1200.00 |
| 3212343433335755                       |                          50000.00 |

### Single day transactions for company
| From             | To               | Amount  |
|-----------------:|-----------------:|--------:|
| 1111234522226789 | 1212343433335665 |  500.00 |
| 3212343433335755 | 2222123433331212 | 1000.00 |
| 3212343433335755 | 1111234522226789 |  320.50 |
| 1111234522221234 | 1212343433335665 |   25.60 |

Instead of building everything at once, this POC focuses on **correct patterns first**, then performance or HANA-specific optimisations later.

---

## Assumptions

The following assumptions were made to keep the solution focused and aligned
with the PoC:

- The system processes data for a single company at a time.
  Company information is supplied implicitly (e.g. via file name or request
  context) and is not modeled as a separate entity.

- Account numbers are unique per company and are represented as fixed-length
  16-digit strings.

- Account balances are loaded in bulk via a CSV file.
  If an account does not already exist during a balance load, it is created.
  If it already exists, its balance is overwritten (not incremented).

- Transfers are processed sequentially in the order provided in the CSV file.
  No concurrency or parallel processing is assumed.

- A transfer is rejected if the source account does not exist or if executing
  the transfer would result in a negative balance.

- All monetary values are assumed to be valid and expressed in a single currency
  per record. Currency conversion is out of scope.

- CSV files are assumed to be well-formed and reasonably sized.
  Extensive validation and error recovery are intentionally limited.

- Transfers are recorded as a single logical transaction.
  The system does not model separate debit and credit ledger entries.
  This simplification is intentional for the scope of the PoC.
  Modeling a full double-entry ledger (with separate debit and credit
  records) was considered out of scope and would not add value to the
  core requirement being demonstrated.

- No explicit associations are defined between Accounts and Transactions.
  Introducing associations would have added additional complexity around
  key management and persistence without improving the clarity or correctness
  of the solution for this PoC

- Company entity for master data and validation is also considered 
  out of scope for this PoC
- The solution is designed as a proof of concept.
  Non-functional concerns such as performance tuning, audit logging,
  authorization, and reconciliation are out of scope.

---

## Tech Stack

- **SAP CAP (Node.js)**
- **OData V4**
- **SQLite** (for local development)
- **SAP Business Application Studio (BAS)**

> Note: HANA is *not required* for this POC. SQLite is intentionally used to keep things simple and fast for local testing.

---

## Project Structure (high level)
├── app/
│ ├── accounts
│ └── transactions
├── db/
│ └── schema.cds # Data model (entities, enums)
├── srv/
│ ├── ledger-service.cds
│ └── ledger-service.js # Service logic
├── test/
│ └── http/ # HTTP test files (REST Client style)
├── package.json
└── README.md

---

## Service Actions (LedgerService)
LedgerService
│
├─ loadBalances(company, file)
│ ├─ reads CSV balance file
│ ├─ creates or overwrites Accounts
│ ├─ sets lastTransType = BALANCE_LOAD
│
├─ processTransactions(company, file)
  ├─ reads CSV transfer file
  ├─ validates source account balance
  ├─ updates Accounts balances
  ├─ creates Transactions records
  ├─ sets status = SUCCESS or REJECTED

## Testing Solution
Testing is done using the SAP CAP development runtime and the built-in HTTP
client in SAP Business Application Studio.

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Open the provided _*./test/ledger-service.http*_ file in the project.
- Execute the test requests directly from the editor