import { usePayments } from '@/hooks/usePayments'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, FileText, ExternalLink, ChevronDown } from 'lucide-react'
import { formatCurrency, formatDate, getCoverageLabel } from '@/lib/utils'
import type { CoverageType } from '@/types/schema'

interface CoveragePaymentsViewProps {
  coverageType: CoverageType
}

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

// Mock policy data - in real app this would come from API
const mockPolicy = {
  dwelling: 1009157,
  dwelling_debris: 50457.85,
  other_structures: 100916,
  other_structures_debris: 5045.80,
  personal_property: 756867,
  personal_property_debris: 37843.35,
  ale: 302747,
  trees_shrubs_landscaping: 50457.85,
  extended_dwelling: 504578.50,
  extended_dwelling_debris: 25228.93,
  extended_other_structures: 50457.85,
  extended_other_structures_debris: 2522.89,
  personal_property_options: 2500,
  building_code: 100916,
}

export function CoveragePaymentsView({ coverageType }: CoveragePaymentsViewProps) {
  const { data: allPayments = [], isLoading } = usePayments('sample-policy-001')
  
  // Filter payments for this coverage type
  const coveragePayments = allPayments.filter(payment => payment.coverage_type === coverageType)
  const totalPaid = coveragePayments.reduce((sum, payment) => sum + payment.amount, 0)
  const limit = mockPolicy[coverageType] || 0
  const remaining = Math.max(0, limit - totalPaid)
  const utilization = limit ? (totalPaid / limit) * 100 : 0

  const handleCoverageChange = (newCoverage: string) => {
    window.location.href = `/payments/${newCoverage}`
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading payments...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <a href="/payments">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Payments
              </a>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getCoverageLabel(coverageType)}
            </h1>
            <p className="text-gray-600 mt-2">
              Payment history for this coverage type
            </p>
          </div>
            
            <Select value={coverageType} onValueChange={handleCoverageChange}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select coverage" />
                <ChevronDown className="w-4 h-4 ml-2" />
              </SelectTrigger>
              <SelectContent>
                {coverageTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getCoverageLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Coverage Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Coverage Limit</span>
              <span className="text-lg font-semibold mt-2">{formatCurrency(limit)}</span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Total Paid</span>
              <span className="text-lg font-semibold text-orange-600 mt-2">{formatCurrency(totalPaid)}</span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Remaining</span>
              <span className="text-lg font-semibold text-emerald-600 mt-2">{formatCurrency(remaining)}</span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Utilization</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-semibold">{Math.round(utilization)}%</span>
                <Badge variant={utilization === 0 ? 'secondary' : utilization < 50 ? 'success' : utilization < 100 ? 'warning' : 'destructive'}>
                  {utilization === 0 ? 'Untapped' : utilization < 50 ? 'Available' : utilization < 100 ? 'Partial' : 'Exhausted'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm mb-8 p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coverage Utilization</span>
              <span className="font-medium">{Math.round(utilization)}%</span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              coverageType === 'ale' ? 'bg-category-ale/20' :
              coverageType === 'personal_property' || coverageType === 'personal_property_debris' || coverageType === 'personal_property_options' ? 'bg-category-personal-property/20' :
              'bg-category-rebuild/20'
            }`}>
              <div
                className={`h-2 rounded-full transition-all ${
                  coverageType === 'ale' ? 'bg-category-ale' :
                  coverageType === 'personal_property' || coverageType === 'personal_property_debris' || coverageType === 'personal_property_options' ? 'bg-category-personal-property' :
                  'bg-category-rebuild'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, utilization))}%` }}
              />
            </div>
          </div>
        </div>

        {coveragePayments.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12">
            <div className="flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments for this coverage</h3>
              <p className="text-gray-500 text-center mb-6">
                Payments for {getCoverageLabel(coverageType)} will appear here once processed
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8">
              <h2 className="text-2xl font-bold">Payment History</h2>
              <p className="mt-2 text-white/80 text-sm">
                {coveragePayments.length} payment{coveragePayments.length !== 1 ? 's' : ''} for {getCoverageLabel(coverageType)}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Document</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coveragePayments
                  .sort((a, b) => new Date(b.checkpoint_date).getTime() - new Date(a.checkpoint_date).getTime())
                  .map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">
                          {formatDate(payment.checkpoint_date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            payment.amount < 0 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {formatCurrency(payment.amount)}
                          </span>
                          {payment.amount < 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Adjustment
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.notes && (
                          <span className="text-sm text-gray-600">{payment.notes}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          View
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-emerald-900">Upload more payment documents</div>
              <div className="text-sm text-emerald-900/80">Add EOBs, payment letters, or photos of checks</div>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <a href="/">Upload Documents</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
