import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const percent = (n: number) => `${Math.round(n)}%`;

// Personal Property coverage lines only
const ppData = {
  lastUpdated: "2025-05-09",
  categories: [
    { key: "personal_property", label: "Personal Property (Coverage C)", icon: "🪑", limit: 756867.00, paid: 491963.55 },
    { key: "personal_property_debris", label: "Personal Property Debris Removal", icon: "🗑️", limit: 37843.35, paid: 0 },
    { key: "personal_property_options", label: "Personal Property Options", icon: "🛡️", limit: 2500.00, paid: 0 },
  ],
};

function computeTotals() {
  const limit = ppData.categories.reduce((s, c) => s + c.limit, 0);
  const paid = ppData.categories.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const remaining = Math.max(0, limit - paid);
  const utilization = limit ? (paid / limit) * 100 : 0;
  return { limit, paid, remaining, utilization };
}

function Gauge({ value }: { value: number }) {
  const angle = Math.min(100, Math.max(0, value)) * 3.6;
  const bg = {
    background: `conic-gradient(rgb(var(--category-personal-property)) ${angle}deg, rgb(229 231 235) ${angle}deg 360deg)`,
  };
  return (
    <div className="relative h-36 w-36 rounded-full flex-shrink-0 mx-auto" style={bg}>
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

function TradeLine({ item }: { item: typeof ppData.categories[0] }) {
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
        <div className="h-2 w-full bg-category-personal-property/20 rounded-full overflow-hidden">
          <div
            className="h-2 bg-category-personal-property rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, util))}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">{percent(util)} of limit used</div>
      </div>
    </div>
  );
}

export function PersonalPropertyView() {
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
                <h1 className="text-2xl sm:text-3xl font-bold">🪑 Personal Property</h1>
                <p className="mt-2 text-white/80 text-sm">
                  Coverage for personal belongings, debris removal, and additional options
                </p>
              </div>
              
              <div className="py-4">
                <Gauge value={totals.utilization} />
              </div>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-3xl">
                <Stat label="Total Coverage" value={currency(totals.limit)} />
                <Stat label="Paid to Date" value={currency(totals.paid)} />
                <Stat label="Remaining" value={currency(totals.remaining)} />
                <Stat label="Coverage Lines" value={ppData.categories.length.toString()} />
              </div>
            </div>
            
            {/* Desktop: Horizontal layout */}
            <div className="hidden lg:flex lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">🪑 Personal Property</h1>
                <p className="mt-2 text-white/80 max-w-xl text-sm">
                  Coverage for personal belongings, debris removal, and additional options
                </p>
              </div>
              <div className="flex items-center gap-6">
                <Gauge value={totals.utilization} />
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Total Coverage" value={currency(totals.limit)} />
                  <Stat label="Paid to Date" value={currency(totals.paid)} />
                  <Stat label="Remaining" value={currency(totals.remaining)} />
                  <Stat label="Coverage Lines" value={ppData.categories.length.toString()} />
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
              {ppData.categories.map((c) => (
                <TradeLine key={c.key} item={c} />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

