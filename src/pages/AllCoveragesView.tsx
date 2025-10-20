import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const percent = (n: number) => `${Math.round(n)}%`;

// Sample data - same as Home
const settlementData = {
  lastUpdated: "2025-05-09",
  categories: [
    { key: "dwelling", label: "Dwelling (Coverage A)", icon: "🏠", limit: 1009157.00, paid: 981649.41, group: "rebuild" },
    { key: "dwelling_debris", label: "Dwelling Debris Removal", icon: "🗑️", limit: 50457.85, paid: 0, group: "rebuild" },
    { key: "other_structures", label: "Other Structures (Coverage B)", icon: "🏘️", limit: 100916.00, paid: 100916.00, group: "rebuild" },
    { key: "other_structures_debris", label: "Other Structures Debris Removal", icon: "🗑️", limit: 5045.80, paid: 5045.80, group: "rebuild" },
    { key: "personal_property", label: "Personal Property (Coverage C)", icon: "🪑", limit: 756867.00, paid: 491963.55, group: "pp" },
    { key: "personal_property_debris", label: "Personal Property Debris Removal", icon: "🗑️", limit: 37843.35, paid: 0, group: "pp" },
    { key: "ale", label: "Additional Living Expense (Coverage D)", icon: "💸", limit: 302747.00, paid: 57012.47, group: "ale" },
    { key: "trees_landscaping", label: "Trees & Landscaping", icon: "🌲", limit: 50457.85, paid: 50457.85, group: "rebuild" },
    { key: "extended_dwelling", label: "Extended Dwelling Limit", icon: "➕", limit: 504578.50, paid: 0, group: "rebuild" },
    { key: "extended_dwelling_debris", label: "Extended Dwelling Debris Removal", icon: "➕", limit: 25228.93, paid: 0, group: "rebuild" },
    { key: "extended_other_structures", label: "Extended Other Structures", icon: "➕", limit: 50457.85, paid: 2461.41, group: "rebuild" },
    { key: "extended_other_structures_debris", label: "Extended Other Structures Debris", icon: "➕", limit: 2522.89, paid: 0, group: "rebuild" },
    { key: "personal_property_options", label: "Personal Property Options", icon: "🛡️", limit: 2500.00, paid: 0, group: "pp" },
    { key: "building_code", label: "Building Code / Ordinance & Law", icon: "⚖️", limit: 100916.00, paid: 82238.71, group: "rebuild" },
  ],
};

function TradeLine({ item, barColor = 'bg-category-all-coverages' }: { item: typeof settlementData.categories[0]; barColor?: string }) {
  const remaining = Math.max(0, item.limit - item.paid);
  const util = item.limit ? (item.paid / item.limit) * 100 : 0;
  
  const handleClick = () => {
    window.location.href = `/payments/${item.key}`;
  };
  
  return (
    <div 
      className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-2xl" aria-hidden>{item.icon}</div>
          <div className="min-w-0">
            <div className="font-medium truncate">{item.label}</div>
            <div className="text-xs text-gray-500">Coverage limit {currency(item.limit)}</div>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm text-gray-600">Used</div>
          <div className="font-medium">{currency(item.paid)}</div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm text-gray-600">Remaining</div>
          <div className="font-medium">{currency(remaining)}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-2 ${barColor} rounded-full`}
            style={{ width: `${Math.min(100, Math.max(0, util))}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">{percent(util)} of limit used</div>
      </div>
    </div>
  );
}

function NestedGauge({ 
  allCoverages, 
  rebuild, 
  personalProperty, 
  ale 
}: { 
  allCoverages: number;
  rebuild: number;
  personalProperty: number;
  ale: number;
}) {
  // Convert percentages to degrees
  const allAngle = Math.min(100, Math.max(0, allCoverages)) * 3.6;
  const rebuildAngle = Math.min(100, Math.max(0, rebuild)) * 3.6;
  const ppAngle = Math.min(100, Math.max(0, personalProperty)) * 3.6;
  const aleAngle = Math.min(100, Math.max(0, ale)) * 3.6;
  
  return (
    <div className="relative h-36 w-36 rounded-full flex-shrink-0 mx-auto">
      {/* Background circle for all rings */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-900 to-slate-800" />
      
      {/* Outermost Ring - All Coverages (Green) - 12px thick */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 136 136">
        <circle
          cx="68"
          cy="68"
          r="62"
          fill="none"
          stroke={`rgb(var(--category-all-coverages) / 0.2)`}
          strokeWidth="12"
        />
        <circle
          cx="68"
          cy="68"
          r="62"
          fill="none"
          stroke={`rgb(var(--category-all-coverages))`}
          strokeWidth="12"
          strokeDasharray={`${(allAngle / 360) * 389.56} 389.56`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Second Ring - Rebuild (Blue) - 12px thick */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 136 136">
        <circle
          cx="68"
          cy="68"
          r="50"
          fill="none"
          stroke={`rgb(var(--category-rebuild) / 0.2)`}
          strokeWidth="12"
        />
        <circle
          cx="68"
          cy="68"
          r="50"
          fill="none"
          stroke={`rgb(var(--category-rebuild))`}
          strokeWidth="12"
          strokeDasharray={`${(rebuildAngle / 360) * 314.16} 314.16`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Third Ring - Personal Property (Pink) - 12px thick */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 136 136">
        <circle
          cx="68"
          cy="68"
          r="38"
          fill="none"
          stroke={`rgb(var(--category-personal-property) / 0.2)`}
          strokeWidth="12"
        />
        <circle
          cx="68"
          cy="68"
          r="38"
          fill="none"
          stroke={`rgb(var(--category-personal-property))`}
          strokeWidth="12"
          strokeDasharray={`${(ppAngle / 360) * 238.76} 238.76`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Innermost Ring - ALE (Amber) - 12px thick */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 136 136">
        <circle
          cx="68"
          cy="68"
          r="26"
          fill="none"
          stroke={`rgb(var(--category-ale) / 0.2)`}
          strokeWidth="12"
        />
        <circle
          cx="68"
          cy="68"
          r="26"
          fill="none"
          stroke={`rgb(var(--category-ale))`}
          strokeWidth="12"
          strokeDasharray={`${(aleAngle / 360) * 163.36} 163.36`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center Donut Hole - Dark Blue Background */}
      <div 
        className="absolute rounded-full bg-gradient-to-r from-slate-900 to-slate-800"
        style={{
          top: '54px',
          left: '54px',
          right: '54px',
          bottom: '54px'
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

function CategorySection({ title, items, barColor = 'bg-category-all-coverages' }: { title: string; items: typeof settlementData.categories; barColor?: string }) {
  const totalLimit = items.reduce((s, c) => s + c.limit, 0);
  const totalPaid = items.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const totalRemaining = Math.max(0, totalLimit - totalPaid);
  
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex gap-6 mt-2 text-sm">
          <div>
            <span className="text-gray-500">Total Limit: </span>
            <span className="font-semibold">{currency(totalLimit)}</span>
          </div>
          <div>
            <span className="text-gray-500">Used: </span>
            <span className="font-semibold">{currency(totalPaid)}</span>
          </div>
          <div>
            <span className="text-gray-500">Remaining: </span>
            <span className="font-semibold">{currency(totalRemaining)}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((c) => (
          <TradeLine key={c.key} item={c} barColor={barColor} />
        ))}
      </div>
    </div>
  );
}

export function AllCoveragesView() {
  const rebuildItems = settlementData.categories.filter(c => c.group === 'rebuild');
  const aleItems = settlementData.categories.filter(c => c.group === 'ale');
  const ppItems = settlementData.categories.filter(c => c.group === 'pp');
  
  const totalLimit = settlementData.categories.reduce((s, c) => s + c.limit, 0);
  const totalPaid = settlementData.categories.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const totalRemaining = Math.max(0, totalLimit - totalPaid);
  
  // Calculate utilization for each category
  const allUtilization = totalLimit ? (totalPaid / totalLimit) * 100 : 0;
  
  const rebuildLimit = rebuildItems.reduce((s, c) => s + c.limit, 0);
  const rebuildPaid = rebuildItems.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const rebuildUtilization = rebuildLimit ? (rebuildPaid / rebuildLimit) * 100 : 0;
  
  const ppLimit = ppItems.reduce((s, c) => s + c.limit, 0);
  const ppPaid = ppItems.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const ppUtilization = ppLimit ? (ppPaid / ppLimit) * 100 : 0;
  
  const aleLimit = aleItems.reduce((s, c) => s + c.limit, 0);
  const alePaid = aleItems.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const aleUtilization = aleLimit ? (alePaid / aleLimit) * 100 : 0;

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
            
            {/* Mobile/Tablet: Stacked layout */}
            <div className="flex flex-col items-center gap-6 lg:hidden">
              <div className="text-center max-w-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold">All Coverage Lines</h1>
                <p className="mt-2 text-white/80 text-sm">
                  Detailed view of all {settlementData.categories.length} coverage lines grouped by category
                </p>
              </div>
              
              <div className="py-4">
                <NestedGauge 
                  allCoverages={allUtilization}
                  rebuild={rebuildUtilization}
                  personalProperty={ppUtilization}
                  ale={aleUtilization}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-3xl">
                <Stat label={`Rebuild: ${percent(rebuildUtilization)}`} value={currency(rebuildPaid)} />
                <Stat label={`Personal Property: ${percent(ppUtilization)}`} value={currency(ppPaid)} />
                <Stat label={`ALE: ${percent(aleUtilization)}`} value={currency(alePaid)} />
                <Stat label={`All Coverages: ${percent(allUtilization)}`} value={currency(totalPaid)} />
              </div>
            </div>
            
            {/* Desktop: Horizontal layout */}
            <div className="hidden lg:flex lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">All Coverage Lines</h1>
                <p className="mt-2 text-white/80 max-w-xl text-sm">
                  Detailed view of all {settlementData.categories.length} coverage lines grouped by category
                </p>
              </div>
              <div className="flex items-center gap-6">
                <NestedGauge 
                  allCoverages={allUtilization}
                  rebuild={rebuildUtilization}
                  personalProperty={ppUtilization}
                  ale={aleUtilization}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Stat label={`Rebuild: ${percent(rebuildUtilization)}`} value={currency(rebuildPaid)} />
                  <Stat label={`Personal Property: ${percent(ppUtilization)}`} value={currency(ppPaid)} />
                  <Stat label={`ALE: ${percent(aleUtilization)}`} value={currency(alePaid)} />
                  <Stat label={`All Coverages: ${percent(allUtilization)}`} value={currency(totalPaid)} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            <CategorySection title="🏗️ Rebuild" items={rebuildItems} barColor="bg-category-rebuild" />
            <CategorySection title="💸 Additional Living Expenses" items={aleItems} barColor="bg-category-ale" />
            <CategorySection title="🪑 Personal Property" items={ppItems} barColor="bg-category-personal-property" />
          </div>
          
        </div>
      </div>
    </div>
  );
}

