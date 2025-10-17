import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CoverageSummary } from '@/types/schema'
import { formatCurrency } from '@/lib/utils'

interface CoverageTableProps {
  summaries: CoverageSummary[]
}

export function CoverageTable({ summaries }: CoverageTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coverage Details</CardTitle>
        <CardDescription>Breakdown of all coverage types and their utilization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-sm text-muted-foreground">
                <th className="text-left py-3 px-4 font-medium">Coverage Type</th>
                <th className="text-right py-3 px-4 font-medium">Limit</th>
                <th className="text-right py-3 px-4 font-medium">Total Paid</th>
                <th className="text-right py-3 px-4 font-medium">Remaining</th>
                <th className="text-center py-3 px-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) => (
                <tr key={summary.coverage_type} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium">{summary.label}</td>
                  <td className="py-3 px-4 text-sm text-right font-mono-financial">
                    {formatCurrency(summary.limit)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-mono-financial">
                    {formatCurrency(summary.total_paid)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-mono-financial font-semibold">
                    {formatCurrency(summary.remaining)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge utilization={summary.utilization_percent} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ utilization }: { utilization: number }) {
  if (utilization === 0) {
    return <Badge variant="secondary">Untapped</Badge>
  } else if (utilization < 50) {
    return <Badge variant="success">Available</Badge>
  } else if (utilization < 100) {
    return <Badge variant="warning">Partial</Badge>
  } else {
    return <Badge variant="destructive">Exhausted</Badge>
  }
}

