import { usePayments } from '@/hooks/usePayments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <a href="/payments">
              <ArrowLeft className="w-4 h-4 mr-2" />
              All Payments
            </a>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getCoverageLabel(coverageType)}
            </h1>
            <p className="text-gray-600 mt-2">
              Payment history for this coverage type
            </p>
          </div>
          
          <Select value={coverageType} onValueChange={handleCoverageChange}>
            <SelectTrigger className="w-64">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Coverage Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono-financial text-gray-900">
              {formatCurrency(limit)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono-financial text-orange-600">
              {formatCurrency(totalPaid)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono-financial text-emerald-600">
              {formatCurrency(remaining)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-xl font-bold text-gray-900">
                {Math.round(utilization)}%
              </div>
              <Badge variant={utilization === 0 ? 'secondary' : utilization < 50 ? 'success' : utilization < 100 ? 'warning' : 'destructive'}>
                {utilization === 0 ? 'Untapped' : utilization < 50 ? 'Available' : utilization < 100 ? 'Partial' : 'Exhausted'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Coverage Utilization</span>
              <span className="font-medium">{Math.round(utilization)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, utilization))}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {coveragePayments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments for this coverage</h3>
            <p className="text-gray-500 text-center mb-6">
              Payments for {getCoverageLabel(coverageType)} will appear here once processed
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              {coveragePayments.length} payment{coveragePayments.length !== 1 ? 's' : ''} for {getCoverageLabel(coverageType)}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                          <span className={`font-mono-financial font-semibold ${
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
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Card className="mt-8 bg-emerald-50 border-emerald-200">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between py-6">
          <div>
            <h3 className="font-semibold text-emerald-900">Upload more payment documents</h3>
            <p className="text-sm text-emerald-800">Add EOBs, payment letters, or photos of checks</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 mt-4 sm:mt-0" asChild>
            <a href="/">Upload Documents</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
