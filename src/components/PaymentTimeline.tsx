import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Payment } from '@/types/schema'
import { formatCurrency, formatDate, getCoverageLabel } from '@/lib/utils'
import { groupPaymentsByCheckpoint } from '@/lib/calculations'
import { FileText } from 'lucide-react'

interface PaymentTimelineProps {
  payments: Payment[]
  documents?: Array<{ id: string; payment_id?: string; file_name: string }>
}

export function PaymentTimeline({ payments, documents = [] }: PaymentTimelineProps) {
  const checkpoints = groupPaymentsByCheckpoint(payments)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Timeline</CardTitle>
        <CardDescription>Chronological view of payment checkpoints</CardDescription>
      </CardHeader>
      <CardContent>
        {checkpoints.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No payments recorded yet</p>
            <p className="text-sm mt-2">Add your first payment checkpoint to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {checkpoints.map((checkpoint, index) => {
              const checkpointDocs = documents.filter((doc) =>
                checkpoint.payments.some((p) => p.id === doc.payment_id)
              )

              return (
                <div key={checkpoint.date} className="relative">
                  {index !== checkpoints.length - 1 && (
                    <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border" />
                  )}
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lg font-semibold">
                          {formatDate(checkpoint.date)}
                        </div>
                        <div className="text-lg font-semibold font-mono-financial">
                          {formatCurrency(checkpoint.total)}
                        </div>
                      </div>

                      <div className="space-y-2 mt-3">
                        {checkpoint.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium">
                                {getCoverageLabel(payment.coverage_type)}
                              </div>
                              {payment.notes && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {payment.notes}
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-semibold font-mono-financial">
                              {formatCurrency(payment.amount)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {checkpointDocs.length > 0 && (
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {checkpointDocs.map((doc) => (
                            <Badge key={doc.id} variant="outline" className="gap-1">
                              <FileText className="w-3 h-3" />
                              {doc.file_name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

