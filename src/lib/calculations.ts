import type { Policy, Payment, CoverageSummary, AggregatedCoverage, CoverageType } from '@/types/schema'
import { getCoverageLabel } from './utils'

/**
 * Calculate total paid for a specific coverage type
 */
export function calculateTotalPaid(payments: Payment[], coverageType: CoverageType): number {
  return payments
    .filter((p) => p.coverage_type === coverageType)
    .reduce((sum, p) => sum + p.amount, 0)
}

/**
 * Calculate remaining coverage for a specific type
 */
export function calculateRemaining(limit: number, totalPaid: number): number {
  return Math.max(0, limit - totalPaid)
}

/**
 * Calculate utilization percentage
 */
export function calculateUtilization(limit: number, totalPaid: number): number {
  if (limit === 0) return 0
  return Math.min(100, (totalPaid / limit) * 100)
}

/**
 * Generate coverage summaries for all coverage types
 */
export function generateCoverageSummaries(policy: Policy, payments: Payment[]): CoverageSummary[] {
  const coverageTypes: CoverageType[] = [
    'dwelling',
    'dwelling_debris',
    'other_structures',
    'other_structures_debris',
    'personal_property',
    'personal_property_debris',
    'ale',
    'trees_shrubs_landscaping',
    'extended_dwelling',
    'extended_dwelling_debris',
    'extended_other_structures',
    'extended_other_structures_debris',
    'personal_property_options',
    'building_code',
  ]

  return coverageTypes.map((type) => {
    const limit = policy[type]
    const totalPaid = calculateTotalPaid(payments, type)
    const remaining = calculateRemaining(limit, totalPaid)
    const utilization = calculateUtilization(limit, totalPaid)

    return {
      coverage_type: type,
      label: getCoverageLabel(type),
      limit,
      total_paid: totalPaid,
      remaining,
      utilization_percent: utilization,
    }
  })
}

/**
 * Calculate aggregated coverage totals (matching columns L-Q in spreadsheet)
 * This replicates the right-side summary calculations
 */
export function calculateAggregatedCoverage(policy: Policy, payments: Payment[]): AggregatedCoverage {
  const summaries = generateCoverageSummaries(policy, payments)
  
  // Get remaining amounts for each coverage type
  const getRemaining = (type: CoverageType) => 
    summaries.find((s) => s.coverage_type === type)?.remaining || 0

  // Column L: Debris Removal of dwelling, other structures, and personal property
  const debris_removal_total = 
    getRemaining('dwelling_debris') +
    getRemaining('other_structures_debris') +
    getRemaining('personal_property_debris') +
    getRemaining('extended_dwelling_debris') +
    getRemaining('extended_other_structures_debris')

  // Column M: Rebuild of Dwelling (including building codes)
  const rebuild_dwelling_total = 
    getRemaining('dwelling') +
    getRemaining('building_code') +
    getRemaining('extended_dwelling')

  // Column N: Rebuild of Other Structures
  const rebuild_other_structures_total = 
    getRemaining('other_structures') +
    getRemaining('extended_other_structures')

  // Column O: Trees, Shrubs, and Landscaping
  const trees_shrubs_landscaping_total = getRemaining('trees_shrubs_landscaping')

  // Column P: Personal Property replacement
  const personal_property_total = 
    getRemaining('personal_property') +
    getRemaining('personal_property_options')

  // Column Q: Total available (sum of all remaining coverages)
  const total_available = 
    debris_removal_total +
    rebuild_dwelling_total +
    rebuild_other_structures_total +
    trees_shrubs_landscaping_total +
    personal_property_total +
    getRemaining('ale')

  return {
    debris_removal_total,
    rebuild_dwelling_total,
    rebuild_other_structures_total,
    trees_shrubs_landscaping_total,
    personal_property_total,
    total_available,
  }
}

/**
 * Calculate total coverages payable (sum of all limits)
 */
export function calculateTotalCoveragesPayable(policy: Policy): number {
  return (
    policy.dwelling +
    policy.dwelling_debris +
    policy.other_structures +
    policy.other_structures_debris +
    policy.personal_property +
    policy.personal_property_debris +
    policy.ale +
    policy.trees_shrubs_landscaping +
    policy.extended_dwelling +
    policy.extended_dwelling_debris +
    policy.extended_other_structures +
    policy.extended_other_structures_debris +
    policy.personal_property_options +
    policy.building_code
  )
}

/**
 * Calculate total paid across all coverages
 */
export function calculateTotalPaidAll(payments: Payment[]): number {
  return payments.reduce((sum, p) => sum + p.amount, 0)
}

/**
 * Group payments by checkpoint date
 */
export function groupPaymentsByCheckpoint(payments: Payment[]) {
  const grouped = new Map<string, Payment[]>()
  
  payments.forEach((payment) => {
    const existing = grouped.get(payment.checkpoint_date) || []
    grouped.set(payment.checkpoint_date, [...existing, payment])
  })

  return Array.from(grouped.entries())
    .map(([date, payments]) => ({
      date,
      payments,
      total: payments.reduce((sum, p) => sum + p.amount, 0),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

