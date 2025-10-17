import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getCoverageLabel(coverageType: string): string {
  const labels: Record<string, string> = {
    dwelling: 'Dwelling',
    dwelling_debris: 'Dwelling - Debris Removal',
    other_structures: 'Other Structures',
    other_structures_debris: 'Other Structures - Debris Removal',
    personal_property: 'Personal Property',
    personal_property_debris: 'Personal Property - Debris Removal',
    ale: 'ALE (Additional Living Expenses)',
    trees_shrubs_landscaping: 'Trees, Shrubs, and Landscaping',
    extended_dwelling: 'Extended Limits - Dwelling',
    extended_dwelling_debris: 'Extended Limits - Dwelling Debris Removal',
    extended_other_structures: 'Extended Limits - Other Structures',
    extended_other_structures_debris: 'Extended Limits - Other Structures Debris',
    personal_property_options: 'Personal Property Options',
    building_code: 'Building Code',
  }
  return labels[coverageType] || coverageType
}

