export type CoverageType =
  | 'dwelling'
  | 'dwelling_debris'
  | 'other_structures'
  | 'other_structures_debris'
  | 'personal_property'
  | 'personal_property_debris'
  | 'ale'
  | 'trees_shrubs_landscaping'
  | 'extended_dwelling'
  | 'extended_dwelling_debris'
  | 'extended_other_structures'
  | 'extended_other_structures_debris'
  | 'personal_property_options'
  | 'building_code';

export interface Policy {
  id: string;
  created_at: string;
  updated_at: string;
  policy_number: string;
  policy_holder_name: string;
  deductible: number;
  
  // Coverage limits
  dwelling: number;
  dwelling_debris: number;
  other_structures: number;
  other_structures_debris: number;
  personal_property: number;
  personal_property_debris: number;
  ale: number;
  trees_shrubs_landscaping: number;
  extended_dwelling: number;
  extended_dwelling_debris: number;
  extended_other_structures: number;
  extended_other_structures_debris: number;
  personal_property_options: number;
  building_code: number;
}

export interface Payment {
  id: string;
  policy_id: string;
  checkpoint_date: string;
  coverage_type: CoverageType;
  amount: number;
  notes?: string;
  created_at: string;
}

export interface PaymentCheckpoint {
  date: string;
  payments: Payment[];
  total: number;
}

export interface Document {
  id: string;
  policy_id: string;
  payment_id?: string;
  file_key: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface CoverageSummary {
  coverage_type: CoverageType;
  label: string;
  limit: number;
  total_paid: number;
  remaining: number;
  utilization_percent: number;
}

export interface AggregatedCoverage {
  debris_removal_total: number;
  rebuild_dwelling_total: number;
  rebuild_other_structures_total: number;
  trees_shrubs_landscaping_total: number;
  personal_property_total: number;
  total_available: number;
}

