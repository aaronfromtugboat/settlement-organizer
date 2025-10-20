import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DocumentUpload } from '@/components/DocumentUpload'
import { Upload, CreditCard, FileText } from 'lucide-react'

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const percent = (n: number) => `${Math.round(n)}%`;

// Sample data - same as before
const settlementData = {
  policyholder: {
    name: "— Wildfire Total Loss —",
    claimNumber: "Claim ######",
    carrier: "Your Insurance Co.",
  },
  lastUpdated: "2025-05-09",
  categories: [
    { key: "dwelling", label: "Dwelling (Coverage A)", icon: "🏠", limit: 336385.67, paid: 327216.47 },
    { key: "dwelling_debris", label: "Dwelling Debris Removal", icon: "🗑️", limit: 16819.28, paid: 0 },
    { key: "other_structures", label: "Other Structures (Coverage B)", icon: "🏘️", limit: 33638.67, paid: 33638.67 },
    { key: "other_structures_debris", label: "Other Structures Debris Removal", icon: "🗑️", limit: 1681.93, paid: 1681.93 },
    { key: "personal_property", label: "Personal Property (Coverage C)", icon: "🪑", limit: 252289.00, paid: 163987.85 },
    { key: "personal_property_debris", label: "Personal Property Debris Removal", icon: "🗑️", limit: 12614.45, paid: 0 },
    { key: "ale", label: "Additional Living Expense (Coverage D)", icon: "💸", limit: 100915.67, paid: 19004.16 },
    { key: "trees_landscaping", label: "Trees & Landscaping", icon: "🌲", limit: 16819.28, paid: 16819.28 },
    { key: "extended_dwelling", label: "Extended Dwelling Limit", icon: "➕", limit: 168192.83, paid: 0 },
    { key: "extended_dwelling_debris", label: "Extended Dwelling Debris Removal", icon: "➕", limit: 8409.64, paid: 0 },
    { key: "extended_other_structures", label: "Extended Other Structures", icon: "➕", limit: 16819.28, paid: 820.47 },
    { key: "extended_other_structures_debris", label: "Extended Other Structures Debris", icon: "➕", limit: 840.96, paid: 0 },
    { key: "personal_property_options", label: "Personal Property Options", icon: "🛡️", limit: 833.33, paid: 0 },
    { key: "building_code", label: "Building Code / Ordinance & Law", icon: "⚖️", limit: 33638.67, paid: 27412.90 },
  ],
};

// Category definitions
const ALE_KEYS = ['ale'];
const PP_KEYS = ['personal_property', 'personal_property_debris', 'personal_property_options'];
const REBUILD_KEYS = [
  'dwelling', 'dwelling_debris', 'other_structures', 'other_structures_debris',
  'trees_landscaping', 'extended_dwelling', 'extended_dwelling_debris',
  'extended_other_structures', 'extended_other_structures_debris', 'building_code'
];

function computeGroupTotals(keys: string[]) {
  const items = settlementData.categories.filter(c => keys.includes(c.key));
  const limit = items.reduce((s, c) => s + c.limit, 0);
  const paid = items.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const remaining = Math.max(0, limit - paid);
  const utilization = limit ? (paid / limit) * 100 : 0;
  return { limit, paid, remaining, utilization, count: items.length };
}

function computeTotals() {
  const limit = settlementData.categories.reduce((s, c) => s + c.limit, 0);
  const paid = settlementData.categories.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
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
          stroke="rgb(var(--category-all-coverages) / 0.2)"
          strokeWidth="12"
        />
        <circle
          cx="68"
          cy="68"
          r="62"
          fill="none"
          stroke="rgb(var(--category-all-coverages))"
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

function CategoryCard({ 
  title, 
  icon, 
  limit, 
  paid, 
  remaining, 
  utilization,
  count,
  href,
  barColor = 'bg-category-all-coverages'
}: { 
  title: string; 
  icon: string;
  limit: number;
  paid: number;
  remaining: number;
  utilization: number;
  count: number;
  href: string;
  barColor?: string;
}) {
  const isSingleCoverage = count === 1;
  
  return (
    <div 
      className="group rounded-2xl border border-gray-200 p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={() => window.location.href = href}
    >
      {isSingleCoverage && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            View payments
          </span>
        </div>
      )}
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-2xl" aria-hidden>{icon}</div>
          <div className="min-w-0">
            <div className="font-medium truncate">{title}</div>
            <div className="text-xs text-gray-500">{count} coverage {count === 1 ? 'line' : 'lines'} • Limit {currency(limit)}</div>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm text-gray-600">Used</div>
          <div className="font-medium">{currency(paid)}</div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm text-gray-600">Remaining</div>
          <div className="font-medium">{currency(remaining)}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className={`h-2 w-full rounded-full overflow-hidden ${barColor}/20`}>
          <div
            className={`h-2 ${barColor} rounded-full`}
            style={{ width: `${Math.min(100, Math.max(0, utilization))}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">{percent(utilization)} of limit used</div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="h-8 w-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
      <div className="text-emerald-300 text-lg font-bold">TB</div>
    </div>
  );
}

export function Home() {
  const [uploadOpen, setUploadOpen] = useState(false);
  
  const totals = computeTotals();
  const rebuildTotals = computeGroupTotals(REBUILD_KEYS);
  const aleTotals = computeGroupTotals(ALE_KEYS);
  const ppTotals = computeGroupTotals(PP_KEYS);

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {/* Header strip */}
        <div className="w-full bg-slate-900 text-white">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <div className="leading-tight">
                <div className="text-sm opacity-80">Tugboat</div>
                <div className="font-semibold">Settlement Snapshot</div>
              </div>
            </div>
            <div className="text-xs opacity-80">Updated {settlementData.lastUpdated}</div>
          </div>
        </div>

        {/* Main card */}
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            {/* Hero band */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8">
              {/* Mobile/Tablet: Stacked layout */}
              <div className="flex flex-col items-center gap-6 lg:hidden">
                {/* Title section - above circle */}
                <div className="text-center max-w-2xl">
                  <div className="text-emerald-300 text-xs uppercase tracking-widest">Wildfire Total Loss</div>
                  <h1 className="text-2xl sm:text-3xl font-bold mt-1">What's left to rebuild?</h1>
                  <p className="mt-2 text-white/80 text-sm">
                    A simple snapshot of your insurance coverages showing limits, amounts paid, and
                    what remains available for your rebuild.
                  </p>
                </div>
                
                {/* Gauge circle - centered */}
                <div className="py-4">
                  <Gauge value={totals.utilization} />
                </div>
                
                {/* Stats grid - below circle */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-3xl">
                  <Stat label="Total Coverage" value={currency(totals.limit)} />
                  <Stat label="Paid to Date" value={currency(totals.paid)} />
                  <Stat label="Remaining" value={currency(totals.remaining)} />
                  <Stat label="Coverage Categories" value="4" />
                </div>
              </div>
              
              {/* Desktop: Horizontal layout */}
              <div className="hidden lg:flex lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="text-emerald-300 text-xs uppercase tracking-widest">Wildfire Total Loss</div>
                  <h1 className="text-2xl sm:text-3xl font-bold mt-1">What's left to rebuild?</h1>
                  <p className="mt-2 text-white/80 max-w-xl text-sm">
                    A simple snapshot of your insurance coverages showing limits, amounts paid, and
                    what remains available for your rebuild.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <Gauge value={totals.utilization} />
                  <div className="grid grid-cols-2 gap-4">
                    <Stat label="Total Coverage" value={currency(totals.limit)} />
                    <Stat label="Paid to Date" value={currency(totals.paid)} />
                    <Stat label="Remaining" value={currency(totals.remaining)} />
                    <Stat label="Coverage Categories" value="4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Categories */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Coverage Categories</h2>
                <div className="text-xs text-gray-500">Limit • used • remaining</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategoryCard
                  title="Rebuild"
                  icon="🏗️"
                  limit={rebuildTotals.limit}
                  paid={rebuildTotals.paid}
                  remaining={rebuildTotals.remaining}
                  utilization={rebuildTotals.utilization}
                  count={rebuildTotals.count}
                  href="/rebuild"
                  barColor="bg-category-rebuild"
                />
                
                <CategoryCard
                  title="Additional Living Expenses"
                  icon="💸"
                  limit={aleTotals.limit}
                  paid={aleTotals.paid}
                  remaining={aleTotals.remaining}
                  utilization={aleTotals.utilization}
                  count={aleTotals.count}
                  href="/payments/ale"
                  barColor="bg-category-ale"
                />
                
                <CategoryCard
                  title="Personal Property"
                  icon="🪑"
                  limit={ppTotals.limit}
                  paid={ppTotals.paid}
                  remaining={ppTotals.remaining}
                  utilization={ppTotals.utilization}
                  count={ppTotals.count}
                  href="/personal-property"
                  barColor="bg-category-personal-property"
                />
                
                <CategoryCard
                  title="All Coverages"
                  icon="📊"
                  limit={totals.limit}
                  paid={totals.paid}
                  remaining={totals.remaining}
                  utilization={totals.utilization}
                  count={settlementData.categories.length}
                  href="/all-coverages"
                  barColor="bg-category-all-coverages"
                />
              </div>

              {/* CTA band */}
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-emerald-900">Know your rebuild balance.</div>
                  <div className="text-sm text-emerald-900/80">Track and organize payments to unlock what's still available.</div>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-emerald-700"
                >
                  Get help with my claim
                </a>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-gray-100 bg-gray-50 p-4 text-xs text-gray-500">
              Tugboat provides guidance and tools to help you understand and manage your claim. We are not your insurer, contractor, or legal representative. Information shown is based on documents and data you provide and may not reflect final determinations by your insurer. Coverage availability and payments are governed by your policy; amounts are estimates and may change as your claim progresses.
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mx-auto max-w-6xl px-6 pb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            <Upload className="w-5 h-5" />
            Upload Payment Document
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <a href="/payments">
              <CreditCard className="w-5 h-5" />
              View All Payments
            </a>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <a href="/documents">
              <FileText className="w-5 h-5" />
              View Documents
            </a>
          </Button>
        </div>
      </div>

      <DocumentUpload open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}
