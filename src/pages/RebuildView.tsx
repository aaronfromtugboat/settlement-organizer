import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const percent = (n: number) => `${Math.round(n)}%`;

// Rebuild coverage lines only (everything except ALE and Personal Property)
const rebuildData = {
  lastUpdated: "2025-05-09",
  categories: [
    { key: "dwelling", label: "Dwelling (Coverage A)", icon: "🏠", limit: 1009157.00, paid: 981649.41 },
    { key: "dwelling_debris", label: "Dwelling Debris Removal", icon: "🗑️", limit: 50457.85, paid: 0 },
    { key: "other_structures", label: "Other Structures (Coverage B)", icon: "🏘️", limit: 100916.00, paid: 100916.00 },
    { key: "other_structures_debris", label: "Other Structures Debris Removal", icon: "🗑️", limit: 5045.80, paid: 5045.80 },
    { key: "trees_landscaping", label: "Trees & Landscaping", icon: "🌲", limit: 50457.85, paid: 50457.85 },
    { key: "extended_dwelling", label: "Extended Dwelling Limit", icon: "➕", limit: 504578.50, paid: 0 },
    { key: "extended_dwelling_debris", label: "Extended Dwelling Debris Removal", icon: "➕", limit: 25228.93, paid: 0 },
    { key: "extended_other_structures", label: "Extended Other Structures", icon: "➕", limit: 50457.85, paid: 2461.41 },
    { key: "extended_other_structures_debris", label: "Extended Other Structures Debris", icon: "➕", limit: 2522.89, paid: 0 },
    { key: "building_code", label: "Building Code / Ordinance & Law", icon: "⚖️", limit: 100916.00, paid: 82238.71 },
  ],
};

function computeTotals() {
  const limit = rebuildData.categories.reduce((s, c) => s + c.limit, 0);
  const paid = rebuildData.categories.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const remaining = Math.max(0, limit - paid);
  const utilization = limit ? (paid / limit) * 100 : 0;
  return { limit, paid, remaining, utilization };
}

function Gauge({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 62; // radius is 62 (68 - 6 for stroke width)
  const dashArray = `${(value / 100) * circumference} ${circumference}`;
  
  return (
    <div className="relative h-36 w-36 rounded-full flex-shrink-0 mx-auto">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 136 136">
        <circle
          cx="68"
          cy="68"
          r="62"
          fill="none"
          stroke="rgb(var(--category-rebuild) / 0.2)"
          strokeWidth="12"
        />
        <circle
          cx="68"
          cy="68"
          r="62"
          fill="none"
          stroke="rgb(var(--category-rebuild))"
          strokeWidth="12"
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
        <div className="text-center leading-tight">
          <div className="text-xs text-gray-700 font-medium">Utilization</div>
          <div className="text-2xl font-semibold text-gray-900">{percent(value)}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

function TradeLine({ item }: { item: typeof rebuildData.categories[0] }) {
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
        <div className="h-2 w-full bg-category-rebuild/20 rounded-full overflow-hidden">
          <div
            className="h-2 bg-category-rebuild rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, util))}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">{percent(util)} of limit used</div>
      </div>
    </div>
  );
}

export function RebuildView() {
  const totals = computeTotals();

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
                <h1 className="text-2xl sm:text-3xl font-bold">🏗️ Rebuild</h1>
                <p className="mt-2 text-white/80 text-sm">
                  Coverage for dwelling, structures, debris removal, landscaping, and building code upgrades
                </p>
              </div>
              
              <div className="py-4">
                <Gauge value={totals.utilization} />
              </div>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-3xl">
                <Stat label="Total Coverage" value={currency(totals.limit)} />
                <Stat label="Paid to Date" value={currency(totals.paid)} />
                <Stat label="Remaining" value={currency(totals.remaining)} />
                <Stat label="Coverage Lines" value={rebuildData.categories.length.toString()} />
              </div>
            </div>
            
            {/* Desktop: Horizontal layout */}
            <div className="hidden lg:flex lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">🏗️ Rebuild</h1>
                <p className="mt-2 text-white/80 max-w-xl text-sm">
                  Coverage for dwelling, structures, debris removal, landscaping, and building code upgrades
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Gauge value={totals.utilization} />
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Total Coverage" value={currency(totals.limit)} />
                  <Stat label="Paid to Date" value={currency(totals.paid)} />
                  <Stat label="Remaining" value={currency(totals.remaining)} />
                  <Stat label="Coverage Lines" value={rebuildData.categories.length.toString()} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Coverage Lines</h2>
              <div className="text-xs text-gray-500">Limit • used • remaining</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rebuildData.categories.map((c) => (
                <TradeLine key={c.key} item={c} />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

