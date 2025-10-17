# Settlement Organizer - Usage Guide

## Overview

The Settlement Organizer helps policyholders track insurance settlement coverage for total loss claims. It replaces complex spreadsheets with an intuitive interface that calculates remaining coverage, tracks payments, and manages documentation.

## Key Concepts

### Coverage Types

The app tracks 14 different coverage types:

1. **Dwelling** - Main structure coverage
2. **Dwelling Debris Removal** - Cleanup costs for main structure
3. **Other Structures** - Detached structures (garages, sheds, etc.)
4. **Other Structures Debris Removal** - Cleanup costs for detached structures
5. **Personal Property** - Contents and belongings
6. **Personal Property Debris Removal** - Cleanup costs for contents
7. **ALE (Additional Living Expenses)** - Temporary housing costs
8. **Trees, Shrubs, and Landscaping** - Outdoor property coverage
9. **Extended Limits - Dwelling** - Additional dwelling coverage
10. **Extended Limits - Dwelling Debris** - Additional debris removal for dwelling
11. **Extended Limits - Other Structures** - Additional coverage for detached structures
12. **Extended Limits - Other Structures Debris** - Additional debris removal for detached structures
13. **Personal Property Options** - Enhanced personal property coverage
14. **Building Code** - Upgrades required by current building codes

### Aggregated Coverage Categories

The app automatically calculates five key categories:

- **Debris Removal Total** - All debris removal limits combined
- **Rebuild of Dwelling** - Dwelling + Building Code + Extended Dwelling
- **Rebuild of Other Structures** - Other Structures + Extended Other Structures
- **Trees, Shrubs, and Landscaping** - Direct coverage for landscaping
- **Personal Property Replacement** - Personal Property + Personal Property Options
- **Total Available** - Sum of all remaining coverage if fully exhausted

## Features

### 1. Policy Overview Dashboard

**What it shows:**
- Policy number and policyholder name
- Total coverage across all limits
- Total paid to date
- Remaining available coverage
- Deductible amount

**How to use:**
- View at-a-glance financial summary
- Monitor overall progress of settlement
- Quick reference for key policy details

### 2. Coverage Details Table

**What it shows:**
- Each coverage type with its limit
- Amount paid to date for each coverage
- Remaining balance for each coverage
- Status badges (Untapped, Available, Partial, Exhausted)

**Status Indicators:**
- 🔵 **Untapped** (0% used) - No payments applied yet
- 🟢 **Available** (<50% used) - Significant coverage remaining
- 🟡 **Partial** (50-99% used) - Some coverage remaining
- 🔴 **Exhausted** (100% used) - Coverage fully utilized

**How to use:**
- Identify which coverages still have available funds
- Track utilization of each coverage type
- Plan future payments based on remaining balances

### 3. Payment Timeline

**What it shows:**
- Chronological list of payment checkpoints
- Each checkpoint displays date and total amount
- Individual payments within each checkpoint
- Coverage type and amount for each payment
- Notes and adjustments (negative values for reconciliations)
- Linked documentation badges

**How to use:**
- Add new payment checkpoints with specific dates
- Record multiple payments for a single date
- Track payment history over time
- View which documents are associated with payments
- Add notes for adjustments or reconciliations

**Example:**
```
Checkpoint: March 10, 2025 - $1,554,935.23
├─ Dwelling: $944,513.72
├─ Other Structures: $100,916.00
├─ Personal Property: $378,433.50
└─ Building Code: $79,734.83
```

### 4. Summary Panel

**What it shows:**
- Calculated totals for aggregated coverage categories
- Total available across all coverages
- Real-time calculations as payments are added

**How to use:**
- Understand total funds available for rebuild
- See breakdown by major category (debris removal, dwelling rebuild, etc.)
- Reference the "Grand Total Available" for complete financial picture

**Key Metric:**
The **Total Available** figure shows the maximum coverage available if all limits are fully exhausted - this is the most important number for understanding total claim capacity.

### 5. Document Management

**What it shows:**
- Uploaded payment documentation
- File names and types
- Association with specific payments

**How to use:**
- Upload EOBs (Explanation of Benefits)
- Store check images
- Attach disbursement letters
- Link documents to specific payment checkpoints
- Download documents for review or sharing

## Common Workflows

### Adding a New Policy

1. Navigate to the policy creation form
2. Enter policy number and policyholder name
3. Input deductible amount
4. Fill in all coverage limits (from dec page/policy documents)
5. Save the policy

### Recording a Payment Checkpoint

1. Click "Add Payment Checkpoint"
2. Select the checkpoint date (date payment was received)
3. Add individual payments:
   - Select coverage type
   - Enter amount
   - Add optional notes (e.g., "Initial payment", "Reconciliation")
4. Upload supporting documentation (optional)
5. Save the checkpoint

### Handling Adjustments

If a payment needs to be adjusted or reconciled:

1. Add a new payment entry on the adjustment date
2. Enter a **negative amount** for the adjustment
3. Add a note explaining the adjustment (e.g., "Reconciliation", "Overpayment correction")
4. The app will automatically recalculate remaining balances

**Example:**
```
Original payment: $6,252.73 (March 10)
Adjustment: -$1,206.93 (May 9, note: "Reconciliation")
Net paid: $5,045.80
```

### Uploading Documentation

1. Navigate to the payment checkpoint or coverage area
2. Click "Upload Document"
3. Select file (PDF, image, etc.)
4. Optionally link to a specific payment
5. File is stored securely in cloud storage

### Understanding Remaining Coverage

**Scenario:** You need to know how much is available for the dwelling rebuild.

**Steps:**
1. Look at the **Summary Panel**
2. Find "Rebuild of Dwelling (including building codes)"
3. This number includes:
   - Remaining Dwelling coverage
   - Remaining Building Code coverage
   - Remaining Extended Dwelling coverage

**Example:**
```
Dwelling remaining: $27,507.59
Building Code remaining: $18,677.29
Extended Dwelling remaining: $504,578.50
---
Total for Dwelling Rebuild: $550,763.38
```

## Tips and Best Practices

### 1. Date Your Payments Accurately
Use the actual date the payment was received, not when you're entering it into the system.

### 2. Add Notes for Clarity
Include notes on adjustments, reconciliations, or unusual payments to maintain a clear audit trail.

### 3. Link Documentation
Always upload and link EOBs or payment evidence to the corresponding checkpoint for easy reference.

### 4. Review Regularly
Check the Coverage Details Table and Summary Panel regularly to understand your remaining coverage.

### 5. Track Debris Removal Separately
Debris removal limits are separate from rebuild limits - the app automatically combines them in the summary.

### 6. Understand Extended Limits
Extended limits are additional coverages that expand your total available funds beyond base policy limits.

### 7. Monitor ALE Separately
Additional Living Expenses (ALE) are typically tracked independently as they're for temporary housing, not rebuild.

## Calculations Explained

### Total Available Coverage

The "Total Available" figure represents **the maximum amount available** if all coverages are fully utilized:

```
Total Available = 
  All Debris Removal (Dwelling + Other Structures + Personal Property)
  + Rebuild Dwelling (Dwelling + Building Code + Extended Dwelling)
  + Rebuild Other Structures (Other Structures + Extended Other Structures)
  + Trees, Shrubs, Landscaping
  + Personal Property (Personal Property + Personal Property Options)
  + ALE
```

This differs from "Total Coverage" which is simply the sum of all policy limits, regardless of how they can be applied.

### Utilization Percentage

```
Utilization % = (Total Paid / Coverage Limit) × 100
```

This shows how much of each coverage type has been used.

### Remaining Balance

```
Remaining = Coverage Limit - Total Paid
```

Remaining balance shows what's still available for each coverage type.

## Understanding Your Policy

### Base Coverage vs. Extended Limits

- **Base Coverage**: The primary policy limits (Dwelling, Other Structures, Personal Property, etc.)
- **Extended Limits**: Additional coverage beyond base limits, providing extra capacity

### Debris Removal

Debris removal is typically a percentage of the main coverage (e.g., 10% of Dwelling). The app tracks it separately to show exactly how much is available for cleanup vs. rebuild.

### Building Code Coverage

When rebuilding, you may need to upgrade to meet current building codes. This coverage pays for those required upgrades.

## Support and Questions

For questions about:
- **Coverage amounts**: Refer to your policy dec page or contact your insurance adjuster
- **Payment timing**: Contact your insurance company
- **App functionality**: See README.md or open a GitHub issue

## Quick Reference

| Question | Where to Look |
|----------|---------------|
| How much have I been paid total? | Policy Overview → Total Paid |
| How much do I have left? | Policy Overview → Remaining Available |
| What's available for rebuild? | Summary Panel → Rebuild of Dwelling |
| Which coverages are untapped? | Coverage Details → Status column |
| When was a payment received? | Payment Timeline → Checkpoint dates |
| What documentation do I have? | Payment Timeline → Document badges |
| How much can I access in total? | Summary Panel → Total Available |

---

**Pro Tip:** The Summary Panel's "Total Available" is your most important number - it shows the maximum coverage available across your entire policy if fully utilized.

