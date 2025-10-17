import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { AggregatedCoverage } from '@/types/schema'
import { formatCurrency } from '@/lib/utils'

interface SummaryPanelProps {
  aggregated: AggregatedCoverage
}

export function SummaryPanel({ aggregated }: SummaryPanelProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="text-2xl">Coverage Summary</CardTitle>
        <CardDescription>Total remaining coverage across all categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <SummaryRow
            label="Debris Removal"
            amount={aggregated.debris_removal_total}
            description="Dwelling, other structures, and personal property"
          />
          <SummaryRow
            label="Rebuild of Dwelling"
            amount={aggregated.rebuild_dwelling_total}
            description="Including building codes"
          />
          <SummaryRow
            label="Rebuild of Other Structures"
            amount={aggregated.rebuild_other_structures_total}
          />
          <SummaryRow
            label="Trees, Shrubs, and Landscaping"
            amount={aggregated.trees_shrubs_landscaping_total}
          />
          <SummaryRow
            label="Personal Property Replacement"
            amount={aggregated.personal_property_total}
          />
        </div>

        <Separator className="my-4" />

        <div className="rounded-lg bg-primary/10 p-4 border-2 border-primary/20">
          <div className="flex justify-between items-baseline">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Available</div>
              <div className="text-xs text-muted-foreground mt-1">
                If all coverages fully exhausted
              </div>
            </div>
            <div className="text-3xl font-bold font-mono-financial text-primary">
              {formatCurrency(aggregated.total_available)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryRow({
  label,
  amount,
  description,
}: {
  label: string
  amount: number
  description?: string
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      <div className="text-lg font-semibold font-mono-financial">
        {formatCurrency(amount)}
      </div>
    </div>
  )
}

