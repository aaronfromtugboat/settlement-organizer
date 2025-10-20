import { usePayments } from '@/hooks/usePayments'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react'
import { formatCurrency, formatDate, getCoverageLabel } from '@/lib/utils'
import { groupPaymentsByCheckpoint } from '@/lib/calculations'
import type { CoverageType } from '@/types/schema'

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

export function PaymentsView() {
  const { data: payments = [], isLoading } = usePayments('sample-policy-001')
  
  const handleCoverageChange = (coverage: string) => {
    window.location.href = `/payments/${coverage}`
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

  const checkpoints = groupPaymentsByCheckpoint(payments)
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {/* Blue Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" className="border-white/20 bg-white/10 hover:bg-white/20 text-white" asChild>
                <a href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Overview
                </a>
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Payment History</h1>
                <p className="mt-2 text-white/80 text-sm">
                  All payment checkpoints organized by date
                </p>
              </div>
              
              <Select onValueChange={handleCoverageChange}>
                <SelectTrigger className="w-full sm:w-64 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <SelectValue placeholder="Jump to coverage..." />
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

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Total Payments</span>
              <span className="text-lg font-semibold mt-2">{formatCurrency(totalPaid)}</span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Payment Checkpoints</span>
              <span className="text-lg font-semibold mt-2">{checkpoints.length}</span>
            </div>
          </div>
          
          <div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">Individual Payments</span>
              <span className="text-lg font-semibold mt-2">{payments.length}</span>
            </div>
          </div>
        </div>

        {checkpoints.length === 0 ? (
          <div className="bg-white p-12" style={{ borderRadius: '1rem', border: '1px solid rgb(229, 231, 235)', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
            <div className="flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments recorded</h3>
              <p className="text-gray-500 text-center mb-6">
                Payments will appear here once documents are processed
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white overflow-hidden" style={{ borderRadius: '1.5rem', border: '1px solid rgb(229, 231, 235)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
            <div className="text-white p-6 sm:p-8" style={{ background: 'linear-gradient(to right, rgb(15 23 42), rgb(30 41 59))' }}>
              <h2 className="text-2xl font-bold">Payment Timeline</h2>
              <p className="mt-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Payments organized by checkpoint date with coverage breakdown
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-8">
              {checkpoints.map((checkpoint, index) => (
                <div key={checkpoint.date} className="relative">
                  {index !== checkpoints.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formatDate(checkpoint.date)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {checkpoint.payments.length} payment{checkpoint.payments.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-emerald-600">
                            {formatCurrency(checkpoint.total)}
                          </div>
                          <p className="text-xs text-gray-500">Total received</p>
                        </div>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Coverage Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Document</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {checkpoint.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getCoverageLabel(payment.coverage_type)}
                                  {payment.amount < 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      Adjustment
                                    </Badge>
                                  )}
                                </div>
                                {payment.notes && (
                                  <p className="text-xs text-gray-500 mt-1">{payment.notes}</p>
                                )}
                              </TableCell>
                              <TableCell>
                                <span className={`font-medium ${
                                  payment.amount < 0 ? 'text-red-600' : 'text-gray-900'
                                }`}>
                                  {formatCurrency(payment.amount)}
                                </span>
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
                </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-emerald-50 p-5" style={{ borderRadius: '1rem', border: '1px solid rgb(167, 243, 208)' }}>
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
      </div>
    </div>
  )
}
