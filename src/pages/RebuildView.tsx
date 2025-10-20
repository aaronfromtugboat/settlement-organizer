import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronDown } from 'lucide-react'

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const percent = (n: number) => `${Math.round(n)}%`;

// Grouped rebuild data
const rebuildGroups = [
  {
    id: 'dwelling',
    label: 'Dwelling (Coverage A)',
    icon: '🏠',
    color: 'dwelling',
    items: [
      { key: "dwelling", label: "Primary Dwelling", limit: 1009157.00, paid: 981649.41 },
      { key: "dwelling_debris", label: "Debris Removal", limit: 50457.85, paid: 0 },
      { key: "extended_dwelling", label: "Extended Limit", limit: 504578.50, paid: 0 },
      { key: "extended_dwelling_debris", label: "Extended Debris Removal", limit: 25228.93, paid: 0 },
    ]
  },
  {
    id: 'other_structures',
    label: 'Other Structures (Coverage B)',
    icon: '🏘️',
    color: 'other-structures',
    items: [
      { key: "other_structures", label: "Primary Structures", limit: 100916.00, paid: 100916.00 },
      { key: "other_structures_debris", label: "Debris Removal", limit: 5045.80, paid: 5045.80 },
      { key: "extended_other_structures", label: "Extended Limit", limit: 50457.85, paid: 2461.41 },
      { key: "extended_other_structures_debris", label: "Extended Debris Removal", limit: 2522.89, paid: 0 },
    ]
  },
  {
    id: 'trees',
    label: 'Trees & Landscaping',
    icon: '🌲',
    color: 'trees',
    items: [
      { key: "trees_landscaping", label: "Trees & Landscaping", limit: 50457.85, paid: 50457.85 },
    ]
  },
  {
    id: 'building_code',
    label: 'Building Code / Ordinance & Law',
    icon: '⚖️',
    color: 'building-code',
    items: [
      { key: "building_code", label: "Building Code Upgrades", limit: 100916.00, paid: 82238.71 },
    ]
  },
];

function computeTotals() {
  let totalLimit = 0;
  let totalPaid = 0;
  
  rebuildGroups.forEach(group => {
    group.items.forEach(item => {
      totalLimit += item.limit;
      totalPaid += Math.min(item.paid, item.limit);
    });
  });
  
  const remaining = Math.max(0, totalLimit - totalPaid);
  const utilization = totalLimit ? (totalPaid / totalLimit) * 100 : 0;
  return { limit: totalLimit, paid: totalPaid, remaining, utilization };
}

function computeGroupTotals(items: typeof rebuildGroups[0]['items']) {
  const limit = items.reduce((s, c) => s + c.limit, 0);
  const paid = items.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const remaining = Math.max(0, limit - paid);
  const utilization = limit ? (paid / limit) * 100 : 0;
  return { limit, paid, remaining, utilization };
}

function Gauge({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 62;
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

function SubItem({ item, color }: { item: typeof rebuildGroups[0]['items'][0]; color: string }) {
  const remaining = Math.max(0, item.limit - item.paid);
  const util = item.limit ? (item.paid / item.limit) * 100 : 0;
  
  const handleClick = () => {
    window.location.href = `/payments/${item.key}`;
  };
  
  return (
    <div 
      className="rounded-xl border border-gray-200 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{item.label}</div>
          <div className="text-xs text-gray-500">Limit {currency(item.limit)}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">{currency(item.paid)}</div>
          <div className="text-xs text-gray-500">paid</div>
        </div>
      </div>
      
      <div className="mt-2">
        <div className={`h-1.5 w-full rounded-full overflow-hidden ${
          color === 'dwelling' ? 'bg-category-dwelling/20' :
          color === 'other-structures' ? 'bg-category-other-structures/20' :
          color === 'trees' ? 'bg-category-trees/20' :
          'bg-category-building-code/20'
        }`}>
          <div
            className={`h-1.5 rounded-full ${
              color === 'dwelling' ? 'bg-category-dwelling' :
              color === 'other-structures' ? 'bg-category-other-structures' :
              color === 'trees' ? 'bg-category-trees' :
              'bg-category-building-code'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, util))}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">{percent(util)} of limit used</div>
      </div>
    </div>
  );
}

function GroupCard({ group }: { group: typeof rebuildGroups[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totals = computeGroupTotals(group.items);
  const hasSubItems = group.items.length > 1;
  
  const handleMainClick = () => {
    if (!hasSubItems) {
      window.location.href = `/payments/${group.items[0].key}`;
    }
  };
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div 
        className={`p-4 ${hasSubItems ? '' : 'cursor-pointer hover:bg-gray-50'} transition-colors`}
        onClick={handleMainClick}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="text-2xl" aria-hidden>{group.icon}</div>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{group.label}</div>
              <div className="text-xs text-gray-500 min-h-[2.5rem] line-clamp-2">
                {hasSubItems ? `${group.items.length} sub-coverages • ` : ''}
                Total limit {currency(totals.limit)}
              </div>
            </div>
          </div>
          
          <div className="hidden sm:block text-right">
            <div className="text-sm text-gray-600">Used</div>
            <div className="font-medium">{currency(totals.paid)}</div>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-sm text-gray-600">Remaining</div>
            <div className="font-medium">{currency(totals.remaining)}</div>
          </div>
          
          {hasSubItems && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronDown 
                className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>

        <div className="mt-3">
          <div className={`h-2 w-full rounded-full overflow-hidden ${
            group.color === 'dwelling' ? 'bg-category-dwelling/20' :
            group.color === 'other-structures' ? 'bg-category-other-structures/20' :
            group.color === 'trees' ? 'bg-category-trees/20' :
            'bg-category-building-code/20'
          }`}>
            <div
              className={`h-2 rounded-full ${
                group.color === 'dwelling' ? 'bg-category-dwelling' :
                group.color === 'other-structures' ? 'bg-category-other-structures' :
                group.color === 'trees' ? 'bg-category-trees' :
                'bg-category-building-code'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, totals.utilization))}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">{percent(totals.utilization)} of limit used</div>
        </div>
      </div>
      
      {hasSubItems && isExpanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
          {group.items.map((item) => (
            <SubItem key={item.key} item={item} color={group.color} />
          ))}
        </div>
      )}
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
                <Stat label="Coverage Groups" value={rebuildGroups.length.toString()} />
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
                  <Stat label="Coverage Groups" value={rebuildGroups.length.toString()} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Coverage Groups</h2>
              <div className="text-xs text-gray-500">Click to expand subcoverages</div>
            </div>

            <div className="columns-1 md:columns-2 gap-4 space-y-4">
              {rebuildGroups.map((group) => (
                <div key={group.id} className="break-inside-avoid">
                  <GroupCard group={group} />
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
