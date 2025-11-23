# ALGFCS — Automated Local Government Fee Collection System

Version: v1.2 (Final for Engineering Handover)

Prepared by: ISCE Digital Concept Ltd

Date: October 11, 2025

Status: Approved for Development

Distribution: Engineering • Product • Operations • Compliance • Executive

---

## Table of Contents

- [0. Document Control](#0-document-control)
- [1. Overview](#1-overview)
- [2. Objectives](#2-objectives)
- [3. Scope](#3-scope)
- [4. Stakeholders and Roles](#4-stakeholders-and-roles)
- [5. Personas & User Stories](#5-personas--user-stories)
- [6. Payment & Bill Logic](#6-payment--bill-logic)
- [7. Fee Catalogue Examples](#7-fee-catalogue-examples)
- [8. Wallet & Ledger](#8-wallet--ledger)
- [9. Bill Lifecycle State Machine](#9-bill-lifecycle-state-machine)
- [10. Reconciliation](#10-reconciliation)
- [11. PSSP Integration (Interswitch)](#11-pssp-integration-interswitch)
- [12. Security & Compliance](#12-security--compliance)
- [13. Data Model Overview](#13-data-model-overview)
- [14. API Surface and Contracts](#14-api-surface-and-contracts)
- [15. Webhooks & Idempotency](#15-webhooks--idempotency)
- [16. Reporting](#16-reporting)
- [17. Audit & Governance](#17-audit--governance)
- [18. Non-Functional Requirements](#18-non-functional-requirements)
- [19. Deployment Architecture (Multi-Instance, Non-Multi-Tenant)](#19-deployment-architecture-multi-instance-non-multi-tenant)
- [20. Configuration & Feature Flags](#20-configuration--feature-flags)
- [21. CI/CD + Deployment Appendix](#21-cicd--deployment-appendix)
- [22. Testing & UAT](#22-testing--uat)
- [23. Cutover & Rollback](#23-cutover--rollback)
- [24. Risks & Mitigations](#24-risks--mitigations)
- [25. Success Metrics & KPIs](#25-success-metrics--kpis)
- [26. Glossary](#26-glossary)
- [27. Appendices](#27-appendices)
  - [27.1 Data Dictionary (Expanded)](#271-data-dictionary-expanded)
  - [27.2 API Versioning](#272-api-versioning)
  - [27.3 Audit Details](#273-audit-details)
  - [27.4 Non-Multi-Tenant Clarification](#274-non-multi-tenant-clarification)
  - [27.5 Story Mapping Seeds (for backlog)](#275-story-mapping-seeds-for-backlog)
  - [27.6 Acceptance Criteria Template](#276-acceptance-criteria-template)

---

## 0. Document Control

- Document Type: Product Requirements Document (PRD)
- Product Name: ALGFCS — Automated Local Government Fee Collection System
- Version: v1.2 (Final for Engineering Handover)
- Prepared By: ISCE Digital Concept Ltd
- Status: Approved for Development
- Distribution: Engineering • Product • Operations • Compliance • Executive

### Revision History

| Version | Date       | Author | Change Summary                                                                   |
| ------: | ---------- | ------ | -------------------------------------------------------------------------------- |
|    v1.0 | 2025-10-11 | ISCE   | Initial PRD with wallet model and fines                                          |
|    v1.1 | 2025-10-11 | ISCE   | Added multi-instance (non-multi-tenant) architecture clarification               |
|    v1.2 | 2025-10-11 | ISCE   | Added CI/CD + Deployment Appendix; expanded data dictionary & API; audit details |

---

## 1. Overview

The Automated Local Government Fee Collection System (ALGFCS) is a standalone platform for end-to-end fee lifecycle management—from fee catalog and bill generation to wallet-based settlement, optional direct bill payments via Bill ID, fines/penalties, reconciliation, receipts/certificates, and complete auditability. Payments are processed by the PSSP (Interswitch), while ALGFCS serves as the source of truth for bills, wallet credits/debits, compliance status, and audit logs.

Key principles:

- Wallet-first model: Payers top up wallets via Static Virtual Account (VA) or Static Payment Reference; no withdrawals allowed.
- Every bill has a unique Bill ID (human-readable with check-digit); can be paid directly via PSSP if wallet balance is insufficient.
- Fine rules are configurable per fee type; defaults are OFF until enabled by LGA HQ.
- Full audit readiness: immutable logs for every system/admin action and payment event.
- Non-multi-tenant: single codebase, multi-instance deployments per LGA with isolated databases and environments.

## 2. Objectives

| Goal                         | Description                                                  | Metric                                |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| Digitize revenue processes   | Automate recurring and ad-hoc bills; eliminate cash handling | ≥95% digital payments                 |
| Enable frictionless payments | Wallet top-ups + Bill ID fallback                            | ≤5% unpaid after due dates            |
| Automate compliance          | Grace periods, fines, certificates                           | ≥30% reduction in chronic delinquents |
| Ensure auditability          | Immutable audit logs & exports                               | 100% traceable transactions           |
| Modular deployment           | Same codebase, per-LGA envs, feature toggles                 | One-click deploy per LGA              |

---

## 3. Scope

In Scope:

- Fee catalog and bill generation (scheduled and manual)
- Wallet-based payments (top-up only; no withdrawals)
- Direct Bill ID payments via PSSP
- Fine rules per fee type (fixed/percentage; recurring; cap)
- Receipts and annual/period certificates
- Reconciliation with PSSP; settlement reporting
- Admin, Payer, and Enforcement portals
- Immutable audit logs and export

Out of Scope:

- Wallet withdrawals or transfers
- Card payments (phase-2 option)
- Multi-tenant data model (system is multi-instance instead)

---

## 4. Stakeholders and Roles

| Role               | Responsibilities                                        | Critical Permissions (Examples)                         |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------- |
| LGA HQ Admin       | Owns system configuration, fee/fine policies, approvals | Manage fee types, fine rules, waivers; export audits    |
| Finance Admin      | Monitors revenue; approves waivers; reconciliation      | Approve waivers; settlement reports; manual adjustments |
| Compliance Officer | Field verification, notices, enforcement actions        | View payer status; issue notices; limited updates       |
| Payer              | Views bills, tops up wallet, pays bills                 | View/receipt download; cannot alter fees                |
| Auditor            | Reviews immutable logs and exports                      | Read-only access to Audit/Reports                       |

RACI Matrix (Abbreviated):

| Activity            | LGA HQ Admin | Finance Admin | Compliance Officer | Engineering |
| ------------------- | ------------ | ------------- | ------------------ | ----------- |
| Fee policy setup    | R            | C             | I                  | A           |
| Fine rule changes   | A            | C             | I                  | I           |
| Waiver approval     | C            | A             | I                  | I           |
| Reconciliation      | I            | A             | I                  | C           |
| Audit export        | A            | C             | I                  | I           |
| Deploy new instance | I            | I             | I                  | A           |

---

## 5. Personas & User Stories

Personas:

- Payer (Citizen/Business Owner): Wants to pay quickly without friction; prefers wallet top-ups and receipts on mobile.
- Finance Admin: Needs clear visibility into collections, waivers, and reconciliation discrepancies.
- Compliance Officer: Needs a fast way to verify on the field with clear Paid/Pending/Overdue status.
- Auditor: Needs immutable logs and exports with non-repudiation.

Sample User Stories:

- As a payer, I want to top up my wallet via bank transfer so that my upcoming bills get paid automatically.
- As a payer, I want to pay a specific bill via Bill ID if my wallet is short, so I don’t miss deadlines.
- As a Finance Admin, I want to set fines per fee type with grace periods so that compliance improves.
- As an Auditor, I want exportable, immutable logs for any period so that I can complete an external audit.

---

## 6. Payment & Bill Logic

Bill Generation & Settlement:

- Every bill has a unique Bill ID (human-readable, with check-digit).
- On bill creation, system checks wallet balance: if sufficient → auto-debit; else bill remains Pending.
- Payers can pay directly using Bill ID through PSSP channels; webhooks mark the bill as Paid.
- Wallet top-ups (VA/Static Payment Reference) credit wallet; system auto-settles oldest pending bills (FIFO).

Fine Rules (Per Fee Type):

| Parameter  | Type     | Description                               | Example      |
| ---------- | -------- | ----------------------------------------- | ------------ |
| enabled    | boolean  | Toggle to activate/deactivate fines       | true         |
| grace_days | integer  | Days after due date before a fine applies | 5            |
| fine_type  | enum     | fixed \| percentage                       | percentage   |
| fine_value | decimal  | Amount or percent value                   | 2 (means 2%) |
| repeat     | enum     | once \| daily \| weekly                   | weekly       |
| cap_amount | decimal? | Maximum total fines for a bill            | 50000.00     |

Fine Calculation Pseudocode:

```text
On schedule (daily cron):
  for each bill where status in (PENDING, OVERDUE):
    if FineRule.enabled and (today > bill.due_date + grace_days):
      if not exceeded cap:
        compute fine_amount:
          if fine_type == 'fixed': amount = fine_value
          if fine_type == 'percentage': amount = bill.base_amount * (fine_value/100)
        if repeat == 'once' and already_applied: skip
        else if repeat in ('daily','weekly') and interval not reached: skip
        apply fine:
          bill.total_due += amount
          create FineLog(bill_id, amount, applied_at=now)
          append to AuditLog(action='fine_applied', before/after snapshots)
        set bill.status = 'OVERDUE'
```

---

## 7. Fee Catalogue Examples

| Family      | Sub-Type            | Size/Band          | Billing        | Price (Example)            |
| ----------- | ------------------- | ------------------ | -------------- | -------------------------- |
| Waste       | Residential         | Small/Medium/Large | Monthly/Annual | ₦2,000 / ₦4,000 / ₦7,500   |
| Waste       | Commercial          | Small/Medium/Large | Monthly/Annual | ₦5,000 / ₦10,000 / ₦20,000 |
| Operational | Hotel/Liquor/Bakery | Small/Medium/Large | Annual         | ₦50k / ₦100k / ₦200k       |
| Park & Pay  | Individual/Fleet    | N/A                | Daily/Monthly  | ₦300/day • ₦12k/month      |

---

## 8. Wallet & Ledger

- One wallet per payer; balance cannot be negative; no withdrawals.
- Ledger entries created for every credit (top-up) and debit (bill payment).
- Top-up sources: Static VA (permanent) and Customer Reference (7-day expiry).
- Idempotency: top-ups are matched by PSSP transaction ID + our reference; duplicates are ignored.

Auto-Debit Policy:

- Pay oldest pending bills first (FIFO).
- If partial balance remains, system pays partially only if allowed by fee type; otherwise leaves bill pending.
- Generate receipt per Paid bill immediately; email/SMS optional.

---

## 9. Bill Lifecycle State Machine

```text
DRAFT → ACTIVE → (PENDING | PAID)
If overdue: PENDING → OVERDUE → (FINE_APPLIED repeat) → PAID
Manual cancellation allowed only by Finance Admin; requires reason; logged in AuditLog.
Re-open paid bill is prohibited; adjustments are handled with credit/debit notes + AuditLog.
```

---

## 10. Reconciliation

- Primary stream: PSSP webhooks for top-ups and Bill ID payments (near-real-time).
- Secondary stream: nightly transaction pulls to verify and backfill any missed webhooks.
- Unmatched VA credits go into an Exception Queue for manual resolution.
- Settlement report generated daily by PSSP channel, fee family, and date.

---

## 11. PSSP Integration (Interswitch)

- Static Virtual Account (VA): permanent account per payer for wallet top-ups; assigned once and reusable.
- Static Payment Reference: permanent payment reference per payer for wallet top-ups; assigned once and reusable for all top-up transactions.
- Bill ID payments: direct bill settlement on PSSP channels; webhook marks bill as Paid.
- Webhook security: HMAC signatures; clock-skew allowance; retries with exponential backoff; idempotency keys.

---

## 12. Security & Compliance

- Transport security: HTTPS (TLS 1.2+) only; HSTS enabled.
- Secrets: environment variables; never stored in source control; rotate quarterly or on incident.
- RBAC: least-privilege roles; dual-control for waivers above threshold.
- PII minimization: store only required fields; encrypt sensitive-at-rest (AES-256).
- Audit integrity: immutable logs; append-only model; signed snapshots optional for cold storage.
- Backups: daily DB snapshots; retention 35 days minimum; encrypted at-rest.

---

## 13. Data Model Overview

Entities:

- Payer (id, type[PERSON|BUSINESS], name, contact, wallet_id) — Owns assets and receives bills
- Wallet (id, user_id, balance, va_account, status) — Top-up only; no withdrawals
- TopUp (id, wallet_id, ref, channel[VA|REF], amount, PSSP_txn_id, status, confirmed_at) — Credits wallet on confirmation
- FeeType (id, family, sub_type, size, price, schedule) — Defines pricing & schedule
- Bill (id, bill_id, fee_type_id, user_id, amount, due_date, total_due, status) — Unique bill identifier
- FineRule (id, fee_type_id, enabled, grace_days, fine_type, fine_value, repeat, cap_amount) — Per fee-type configuration
- FineLog (id, bill_id, fine_rule_id, amount, applied_at) — History of applied fines
- Waiver (id, bill_id, amount_waived, approved_by, reason, approved_at) — Admin relief on amounts
- Payment (id, bill_id, wallet_id, source[wallet|pssp], amount, paid_at) — Bill settlement events
- AuditLog (id, actor, entity, action, before, after, timestamp, ip) — Immutable history

Selected Field Types (Examples):

- id: UUID (Primary Key)
- amount/price: DECIMAL(14,2) (Non-negative)
- due_date/paid_at: TIMESTAMP WITH TIME ZONE (UTC stored)
- status: ENUM (DRAFT|ACTIVE|PENDING|PAID|OVERDUE|CANCELLED)
- ref/bill_id: VARCHAR(32) (Unique, with check digit for bill_id)
- fine_value: DECIMAL(8,4) (Percent or fixed amount)

---

## 14. API Surface and Contracts

Public (PSSP-Facing):

- POST /pssp/webhooks — Receives payment notifications for wallet top-ups and bill payments (Bill ID).
- GET /pssp/health — Liveness/readiness for PSSP integration checks.

Admin:

- POST /admin/fees/types — Create/Update fee types and prices
- POST /admin/fines/rules — Create/Update fine rules per fee type
- POST /admin/bills/run — Trigger scheduled bill generation
- POST /admin/waivers — Approve waiver against bill
- GET /admin/reports/settlement — Settlement summary (CSV/JSON)
- GET /admin/audit/export — Audit export for date-range

Payer:

- GET /payer/wallet — Get wallet balance & top-up options (includes VA and payment reference if assigned)
- POST /payer/wallet/va — Request static virtual account generation (if not already assigned)
- POST /payer/wallet/payment-reference — Request static payment reference generation (if not already assigned)
- GET /payer/bills — List bills with statuses
- GET /payer/bills/{bill_id} — View single bill & instructions
- POST /payer/bills/{bill_id}/pay_intent — Get PSSP deep-link or instructions

Sample Payloads:

Webhook (Wallet Top-up):

```json
{
  "pssp": "interswitch",
  "event": "wallet_topup_confirmed",
  "txn_id": "PSSP123456789",
  "wallet_ref": "WALLET-OG-0001",
  "channel": "VA",
  "amount": 50000.0,
  "currency": "NGN",
  "paid_at": "2025-10-11T09:45:21Z",
  "signature": "hmac-sha256:..."
}
```

Webhook (Bill Paid via Bill ID):

```json
{
  "pssp": "interswitch",
  "event": "bill_paid",
  "txn_id": "PSSP987654321",
  "bill_id": "BILL-2025-000034",
  "amount": 51000.0,
  "currency": "NGN",
  "paid_at": "2025-10-12T10:12:00Z",
  "signature": "hmac-sha256:..."
}
```

Selected Error Codes:

| Code                  | HTTP | Meaning                             | Client Action                     |
| --------------------- | ---- | ----------------------------------- | --------------------------------- |
| WALLET-INSUFFICIENT   | 409  | Wallet balance is below bill amount | Top-up wallet or pay via Bill ID  |
| BILL-NOT-FOUND        | 404  | Bill ID not recognized              | Verify Bill ID                    |
| WEBHOOK-BAD-SIGNATURE | 401  | Signature invalid                   | Do not retry; investigate secrets |
| ALREADY-PROCESSED     | 200  | Idempotent duplicate                | No action needed                  |

---

## 15. Webhooks & Idempotency

- All inbound webhooks validated via HMAC signature and timestamp window (±5 minutes).
- Idempotent handling by (pssp, txn_id) unique key stored in WebhookLog.
- Failed processing routed to a dead-letter queue; retried with exponential backoff (max N attempts).
- Nightly reconciliation compares PSSP transactions with internal ledgers and fixes any drifts.

---

## 16. Reporting

---

## 16a. Certificate Issuance & Verification Subsystem (CIVS)

### Overview

The Certificate Issuance and Verification Subsystem (CIVS) automates the end-to-end process of generating, approving, issuing, and verifying all official certificates managed by Local Governments and State Ministries. It eliminates manual paperwork by providing a digital-first issuance workflow, while maintaining an option for authenticated physical (hardcopy) pickup or delivery for citizens who require it.

### Core Objectives

- Streamline issuance of government certificates and approvals across all sectors (identity, business, land, health, education, etc.).
- Enforce document verification, background checks, and fee payment before certificate generation.
- Enable digital storage, instant verification, and tamper-proof authentication via QR codes and digital signatures.
- Integrate with ALGFCS revenue modules to ensure that all certificate-related fees are automatically captured and remitted.

### Functional Scope

| Function                         | Description                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Digital Application Portal       | Citizens or businesses apply online by selecting certificate type, uploading documents, and paying fees via ALGFCS. |
| Automated Requirement Validation | System cross-checks uploaded documents, verifies identity (NIN/BVN), and validates payment compliance.              |
| Workflow Automation              | Each certificate type has predefined approval steps—document verification, background check, officer sign-off.      |
| Digital Certificate Generation   | Approved applications result in a digitally signed certificate (PDF with QR Code) stored in applicant’s profile.    |
| Hardcopy Request Management      | Applicants may request a printed version for pickup or delivery to verified addresses.                              |
| Real-Time Verification API       | Public/institutional verifiers can confirm authenticity by scanning QR code or querying endpoint.                   |
| Audit and Compliance             | All actions logged with timestamps, officer IDs, and verification results for transparency.                         |

### Integration Points with ALGFCS

| Integration Area     | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| Payment Engine       | All certificate fees processed through ALGFCS’s revenue collection APIs.  |
| Identity & Records   | Prefills applications and ensures accurate identity validation.           |
| Notification Service | Sends SMS/email updates at each workflow stage.                           |
| Analytics Dashboard  | Aggregates issuance, revenue, and verification statistics.                |
| Security Layer       | Uses unified authentication, encryption, and digital signature framework. |

### Key Certificate Categories Supported

- State of Origin / Indigene Certificates
- Business Premises Certificates
- Land and Property Certificates (e.g., C of O, Building Approval)
- Trade and Transport Licenses
- Educational and Training Certificates
- Health, Food Handling, and Medical Fitness Certificates
- Tax and Revenue Compliance Certificates

### Technical Features

- Digital certificate generation with embedded QR code verification URL
- Role-based access control for approval and issuance
- Blockchain-ready/hash-anchored verification ledger for tamper-proof records
- Centralized document store for attachments and issued certificates
- API endpoints for third-party or inter-ministry verification integrations

### Impact

This subsystem ensures that all certificate-related payments are properly captured as internal revenue, while improving public service delivery and reducing fraud. It provides a standardized digital framework for all Local Governments and Ministries to manage and verify certificates seamlessly within ALGFCS.

---

## 17. Audit & Governance

- Immutable AuditLog table with before/after snapshots on sensitive entities.
- Read-only Auditor role to view/export audit records without PII overexposure.
- Weekly audit digest email (optional) for high-risk actions (e.g., waivers over threshold).

---

## 18. Non-Functional Requirements

| Area          | Target/Practice                                                |
| ------------- | -------------------------------------------------------------- |
| Availability  | ≥ 99.5% MVP, target 99.9% post-MVP                             |
| Latency       | p95 < 400ms for API; background tasks decoupled                |
| Scalability   | 1M+ bills per instance; sharded job queues if needed           |
| Security      | TLS 1.2+; HSTS; secrets via env; RBAC; IP allow-list for admin |
| Observability | Tracing, structured logs, metrics; per-instance dashboards     |
| Backups       | Daily snapshots; restore tested quarterly                      |

---

## 19. Deployment Architecture (Multi-Instance, Non-Multi-Tenant)

- One shared repository; separate environments per LGA.
- Each instance has its own database, domain, PSSP credentials, and branding.
- Feature toggles enable/disable modules per LGA.

Example Instances:

| LGA  | Domain          | DB Name      | Feature Flags (Examples)   |
| ---- | --------------- | ------------ | -------------------------- |
| Ogun | ogunfees.gov.ng | ogun_fees_db | WASTE=ON; OPS=ON; PARK=OFF |
| Edo  | edofees.gov.ng  | edo_fees_db  | WASTE=ON; OPS=OFF; PARK=ON |

---

## 20. Configuration & Feature Flags

Environment Variables (Examples):

| Key                     | Example        | Description                  |
| ----------------------- | -------------- | ---------------------------- |
| APP_NAME                | Edo Fee System | Branding per LGA             |
| LGA_CODE                | EDO001         | Unique code per LGA instance |
| DATABASE_URL            | postgres://... | Dedicated DB per instance    |
| INTERSWITCH_CLIENT_ID   | edo_xxx        | PSSP credentials             |
| INTERSWITCH_SECRET_KEY  | edo_xxx        | PSSP credentials             |
| ENABLE_WASTE_FEES       | true           | Feature toggle               |
| ENABLE_OPERATIONAL_FEES | false          | Feature toggle               |
| ENABLE_PARK_FEES        | true           | Feature toggle               |
| AUDIT_MODE              | STRICT         | Logging intensity            |

---

## 21. CI/CD + Deployment Appendix

Pipeline Stages:

1. Build: Lint, test, and compile; create Docker image tagged with commit SHA.
2. Staging Deploy: Auto-deploy to shared staging for QA/UAT.
3. Production Deploy (Per LGA): Manual approval; applies the right .env and DB migrations.
4. Post-Deploy Checks: Healthcheck, DB migration verification, smoke tests.

GitHub Actions Sketch:

```yaml
name: Deploy LGA Instance
on:
  workflow_dispatch:
    inputs:
      lga:
        description: 'Target LGA'
        required: true
        default: 'ogun'

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Image
        run: docker build -t algfcs:${{ github.sha }} .
      - name: Push Image
        run: docker push registry.digitalocean.com/isce/algfcs:${{ github.sha }}
      - name: Deploy to DO
        run: doctl apps update ${{ secrets.DO_APP_ID_${{ inputs.lga | upper }} }} --spec .do/app.yaml
```

Monitoring & SLOs:

- Health endpoint per instance: /health (liveness & readiness).
- Dashboards: CPU, memory, p95 latency, webhook errors, reconciliation lag.
- Alerts: Webhook failure rate > 1%, reconciliation lag > 30 min, DB connection saturation > 80%.

Backups & DR:

- Daily DB snapshots; retain 35 days; verified restore process (quarterly test).
- Emergency rollback: redeploy previous image; revert DB via point-in-time restore if needed.
- Runbook: Incident severity levels, on-call rotation, escalation contacts.

---

## 22. Testing & UAT

- Unit tests: billing, fines, wallet debits, idempotent webhook handling.
- Integration tests: PSSP webhook signature + reconciliation sanity.
- UAT scripts: end-to-end bill run → wallet top-up → auto-debit → receipt → audit export.
- Performance tests: load of 1M bills, webhook burst handling, reconciliation window.

---

## 23. Cutover & Rollback

- Cutover checklist: DNS, SSL cert, PSSP webhooks, env vars, DB migrations, seed fee catalog.
- Rollback: Repoint to prior image; roll back migrations with backups; notify stakeholders.

---

## 24. Risks & Mitigations

| Risk                  | Impact                  | Mitigation                                              |
| --------------------- | ----------------------- | ------------------------------------------------------- |
| Ambiguous VA credit   | Unmatched funds         | Narration rules + exception queue + operator assignment |
| Over-aggressive fines | User dissatisfaction    | Caps + clear policy + waiver workflow                   |
| PSSP latency/outage   | Delayed confirmations   | Retries + nightly reconciliation pulls                  |
| Admin misuse          | Fraud/compliance issues | RBAC + dual-control + immutable audit                   |

---

## 25. Success Metrics & KPIs

- ≥ 95% digital payment rate; 0% cash collections
- < 1% reconciliation variance
- 100% of bills auditable with end-to-end trace
- ≥ 30% increase in verified collections in 6 months
- ≥ 99.5% availability (MVP), track toward 99.9%

---

## 26. Glossary

- Bill ID: Unique identifier for each bill (human-readable + check digit)
- Wallet: Prepaid balance store; top-up only; auto-debit on bill creation
- Fine Rule: Policy to apply penalties post-grace period, fixed or percentage
- PSSP: Payment Service Provider (Interswitch) handling top-ups and direct bill pays
- Reconciliation: Process to match PSSP transactions with internal ledgers
- Audit Log: Immutable record of all actions and changes
- Multi-Instance: One codebase, separate deployments per LGA; not multi-tenant

---

## 27. Appendices

### 27.1 Data Dictionary (Expanded)

This appendix will evolve into API/DB contracts for engineering:

- Monetary fields use DECIMAL(14,2) unless otherwise specified.
- Percentages use DECIMAL(8,4) for precision.
- All timestamps are stored in UTC, with timezone-aware types.
- All IDs are UUID v4 unless originating from external PSSP.

### 27.2 API Versioning

- Base path /api/v1 for app-facing endpoints; PSSP webhooks may be at root or dedicated sub-path.
- Backward-compatible changes allowed within v1; breaking changes require v2.

### 27.3 Audit Details

- Audit entries include actor (user/service), entity, action, before/after JSON snapshots, timestamp, IP.
- Audit storage is append-only; mutations are prohibited; archival snapshots can be signed.

### 27.4 Non-Multi-Tenant Clarification

- One repository, N deployments (one per LGA), each with isolated DB, secrets, and feature flags. No shared data plane.

### 27.5 Story Mapping Seeds (for backlog)

Epics and example story seeds to accelerate backlog creation:

#### Epic 1 — Fee Catalogue & Scheduling

- As an LGA HQ Admin, I want to define fee families, sub-types, and price bands so that bills can be generated consistently.
- As an LGA HQ Admin, I want to configure billing schedules (monthly/annual) so that recurring bills are created automatically.

#### Epic 2 — Billing & Bill IDs

- As the system, I want to generate a unique, human-readable Bill ID with a check digit so that payers can pay via PSSP channels.
- As a Payer, I want to view my active and pending bills so that I can plan payments.

#### Epic 3 — Wallet & Top-ups (VA/Customer Reference)

- As a Payer, I want a static virtual account so that I can top up my wallet via bank transfers anytime.
- As a Payer, I want to create a one-time Customer Reference that expires in 7 days so that I can top up for a specific need.

#### Epic 4 — Auto-Debit & Receipts

- As the system, I want to auto-debit the wallet FIFO on bill creation so that the oldest pending bills are settled first.
- As a Payer, I want an instant receipt after payment so that I have proof of settlement.

#### Epic 5 — Fines & Grace Rules

- As an LGA HQ Admin, I want to enable fines with grace days and caps per fee type so that compliance improves without being punitive.
- As the system, I want to apply fines on a schedule (once/daily/weekly) so that overdue bills accrue as configured.

#### Epic 6 — PSSP Integration & Webhooks

- As the system, I want to validate PSSP webhooks via HMAC and time window so that only legitimate events are processed.
- As the system, I want idempotent processing of (pssp, txn_id) so that duplicates do not affect balances.

#### Epic 7 — Reconciliation & Settlement

- As a Finance Admin, I want nightly reconciliation pulls so that missed webhooks are backfilled.
- As a Finance Admin, I want settlement summaries by channel and date so that finance reporting is accurate.

#### Epic 8 — Admin & RBAC

- As a Finance Admin, I want dual-control for large waivers so that fraud risk is reduced.
- As an Admin, I want IP allow-listing for admin portal so that access is restricted.

#### Epic 9 — Audit & Governance

- As an Auditor, I want immutable logs with before/after snapshots so that I can prove non-repudiation.
- As an Auditor, I want exportable audit trails for a date range so that I can complete external audits.

#### Epic 10 — Reporting & Exports

- As a Finance Admin, I want CSV/JSON exports for collections and fines so that I can analyze in BI tools.
- As a Finance Admin, I want a wallet ledger report (opening/credits/debits/closing) per payer so that I can reconcile balances.

#### Epic 11 — Feature Flags & LGA Instances

- As Engineering, I want per-LGA feature toggles so that modules can be tailored per deployment.
- As Engineering, I want isolated databases per LGA so that data is not commingled.

#### Epic 12 — DevOps & CI/CD

- As Engineering, I want a per-LGA deployment pipeline with manual approvals so that releases are controlled.
- As Engineering, I want post-deploy health checks and smoke tests so that issues are caught early.

### 27.6 Acceptance Criteria Template

Use this template when converting story seeds into issues:

Given [precondition]
When [action]
Then [expected outcome]
And [additional checks]

Non-functional checks (if applicable):

- p95 latency: < 400ms
- Security: HMAC validation passing; RBAC enforced
- Audit: before/after snapshots recorded
- Observability: structured logs with correlation IDs
