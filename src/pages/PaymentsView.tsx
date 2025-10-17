import { usePayments } from '@/hooks/usePayments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react'
import { formatCurrency, formatDate, getCoverageLabel } from '@/lib/utils'
import { groupPaymentsByCheckpoint } from '@/lib/calculations'

export function PaymentsView() {
  const { data: payments = [], isLoading } = usePayments('sample-policy-001')

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
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <a href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Overview
            </a>
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">
          All payment checkpoints organized by date
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalPaid)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Payment Checkpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {checkpoints.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">Individual Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {payments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {checkpoints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments recorded</h3>
            <p className="text-gray-500 text-center mb-6">
              Payments will appear here once documents are processed
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment Timeline</CardTitle>
            <CardDescription>
              Payments organized by checkpoint date with coverage breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                          <div className="text-lg font-semibold font-mono-financial text-emerald-600">
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
                                <span className={`font-mono-financial font-semibold ${
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
