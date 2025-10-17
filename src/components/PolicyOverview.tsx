import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Policy } from '@/types/schema'
import { formatCurrency } from '@/lib/utils'
import { calculateTotalCoveragesPayable, calculateTotalPaidAll } from '@/lib/calculations'
import type { Payment } from '@/types/schema'

interface PolicyOverviewProps {
  policy: Policy
  payments: Payment[]
}

export function PolicyOverview({ policy, payments }: PolicyOverviewProps) {
  const totalCoverages = calculateTotalCoveragesPayable(policy)
  const totalPaid = calculateTotalPaidAll(payments)
  const totalRemaining = totalCoverages - totalPaid

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Policy Number</CardDescription>
          <CardTitle className="text-2xl">{policy.policy_number}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {policy.policy_holder_name}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Coverage</CardDescription>
          <CardTitle className="text-2xl font-mono-financial">
            {formatCurrency(totalCoverages)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            All policy limits combined
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Paid</CardDescription>
          <CardTitle className="text-2xl font-mono-financial text-orange-600">
            {formatCurrency(totalPaid)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Across all coverages
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Remaining Available</CardDescription>
          <CardTitle className="text-2xl font-mono-financial text-green-600">
            {formatCurrency(totalRemaining)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Deductible: {formatCurrency(policy.deductible)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

