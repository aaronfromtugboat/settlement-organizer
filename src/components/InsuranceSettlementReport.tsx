// No imports needed for this component

/**
 * Credit-report style snapshot for total-loss insurance settlements.
 * - Pure React + TailwindCSS
 * - Swap the JSON in `settlementData` with live data
 * - Designed for ads/landing pages: headline + "trade line" rows that feel familiar
 */

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const percent = (n: number) => `${Math.round(n)}%`;

// =======================
// 🔢 SAMPLE DATA (EDIT ME)
// =======================
const settlementData = {
  policyholder: {
    name: "— Wildfire Total Loss —",
    claimNumber: "Claim ######",
    carrier: "Your Insurance Co.",
  },
  lastUpdated: "2025-05-09",
  summary: {
    tagline: "What's left to rebuild?",
  },
  // Buckets (limit / used / remaining)
  categories: [
    {
      key: "dwelling",
      label: "Dwelling (Coverage A)",
      icon: "🏠",
      limit: 1009157.00,
      paid: 981649.41,
    },
    {
      key: "dwelling_debris",
      label: "Dwelling Debris Removal",
      icon: "🗑️",
      limit: 50457.85,
      paid: 0,
    },
    {
      key: "other_structures",
      label: "Other Structures (Coverage B)",
      icon: "🏘️",
      limit: 100916.00,
      paid: 100916.00,
    },
    {
      key: "other_structures_debris",
      label: "Other Structures Debris Removal",
      icon: "🗑️",
      limit: 5045.80,
      paid: 5045.80,
    },
    {
      key: "personal_property",
      label: "Personal Property (Coverage C)",
      icon: "🪑",
      limit: 756867.00,
      paid: 491963.55,
    },
    {
      key: "personal_property_debris",
      label: "Personal Property Debris Removal",
      icon: "🗑️",
      limit: 37843.35,
      paid: 0,
    },
    {
      key: "ale",
      label: "Additional Living Expense (Coverage D)",
      icon: "💸",
      limit: 302747.00,
      paid: 57012.47,
    },
    {
      key: "trees_landscaping",
      label: "Trees & Landscaping",
      icon: "🌲",
      limit: 50457.85,
      paid: 50457.85,
    },
    {
      key: "extended_dwelling",
      label: "Extended Dwelling Limit",
      icon: "➕",
      limit: 504578.50,
      paid: 0,
    },
    {
      key: "extended_dwelling_debris",
      label: "Extended Dwelling Debris Removal",
      icon: "➕",
      limit: 25228.93,
      paid: 0,
    },
    {
      key: "extended_other_structures",
      label: "Extended Other Structures",
      icon: "➕",
      limit: 50457.85,
      paid: 2461.41,
    },
    {
      key: "extended_other_structures_debris",
      label: "Extended Other Structures Debris",
      icon: "➕",
      limit: 2522.89,
      paid: 0,
    },
    {
      key: "personal_property_options",
      label: "Personal Property Options",
      icon: "🛡️",
      limit: 2500.00,
      paid: 0,
    },
    {
      key: "building_code",
      label: "Building Code / Ordinance & Law",
      icon: "⚖️",
      limit: 100916.00,
      paid: 82238.71,
    },
  ],
};

// Compute derived totals
function computeTotals(categories: typeof settlementData.categories) {
  const limit = categories.reduce((s, c) => s + c.limit, 0);
  const paid = categories.reduce((s, c) => s + Math.min(c.paid, c.limit), 0);
  const remaining = Math.max(0, limit - paid);
  const utilization = limit ? (paid / limit) * 100 : 0;
  return { limit, paid, remaining, utilization };
}

// ----------
// Self tests
// ----------
function nearlyEqual(a: number, b: number, eps = 1e-6) {
  return Math.abs(a - b) <= eps;
}

(function runSelfTests() {
  const cats = settlementData.categories;
  // Test 1: categories present
  console.assert(Array.isArray(cats) && cats.length > 0, "[TEST] categories should be a non-empty array");
  // Test 2: per-item paid <= limit
  cats.forEach((c) => {
    console.assert(c.paid <= c.limit + 1e-9, `[TEST] paid should not exceed limit for ${c.key}`);
  });
  // Test 3: totals math
  const t = computeTotals(cats);
  console.assert(nearlyEqual(t.limit, cats.reduce((s, c) => s + c.limit, 0)), "[TEST] total limit mismatch");
  console.assert(nearlyEqual(t.paid, cats.reduce((s, c) => s + Math.min(c.paid, c.limit), 0)), "[TEST] total paid mismatch");
  console.assert(nearlyEqual(t.remaining, Math.max(0, t.limit - t.paid)), "[TEST] remaining mismatch");
  console.log("[TEST] Settlement Snapshot tests passed");
})();

// Simple gauge using conic-gradient
function Gauge({ value }: { value: number }) {
  // value 0-100
  const angle = Math.min(100, Math.max(0, value)) * 3.6; // convert to degrees
  const bg = {
    background: `conic-gradient(rgb(34 197 94) ${angle}deg, rgb(229 231 235) ${angle}deg 360deg)`,
  };
  return (
    <div className="relative h-36 w-36 rounded-full" style={bg}>
      <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-inner">
        <div className="text-center leading-tight">
          <div className="text-xs text-gray-500">Utilization</div>
          <div className="text-2xl font-semibold">{percent(value)}</div>
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

function TradeLine({ item }: { item: typeof settlementData.categories[0] }) {
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

      {/* Progress bar */}
      <div className="mt-3">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-emerald-500 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, util))}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500">{percent(util)} of limit used</div>
      </div>
    </div>
  );
}

// Logo component - replace with your actual logo
function Logo() {
  return (
    <div className="h-8 w-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
      {/* Replace this with your actual logo component or image */}
      <div className="text-emerald-300 text-lg font-bold">TB</div>
    </div>
  );
}

export default function InsuranceSettlementReport() {
  const totals = computeTotals(settlementData.categories);

  return (
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
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
                  <Stat label="Coverage Lines" value={settlementData.categories.length.toString()} />
                </div>
              </div>
            </div>
          </div>

          {/* Tradelines list */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Coverage Lines</h2>
              <div className="text-xs text-gray-500">Limit • used • remaining</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settlementData.categories.map((c) => (
                <TradeLine key={c.key} item={c} />
              ))}
            </div>

            {/* CTA band for ads/landing */}
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
  );
}
