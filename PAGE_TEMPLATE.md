# Master Page Template

**ALL PAGES MUST FOLLOW THIS EXACT STRUCTURE**

## Page Structure

```tsx
export function YourPage() {
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
            <h1 className="text-2xl sm:text-3xl font-bold">Page Title</h1>
            <p className="mt-2 text-white/80 text-sm">
              Page description or subtitle
            </p>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-8">
            {/* YOUR CONTENT GOES HERE */}
          </div>
          
        </div>
      </div>
    </div>
  )
}
```

## Card Components Inside Content

### Small Cards (Stats, Info)
```tsx
<div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm">
  {/* Card content */}
</div>
```

### Interactive Cards (Clickable)
```tsx
<div className="rounded-2xl border border-gray-200 p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow">
  {/* Card content */}
</div>
```

### CTA Cards
```tsx
<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <div className="text-sm font-semibold text-emerald-900">Title</div>
      <div className="text-sm text-emerald-900/80">Description</div>
    </div>
    <Button className="bg-emerald-600 hover:bg-emerald-700">
      Action
    </Button>
  </div>
</div>
```

## Typography

### Inside Blue Header
- **Main Title**: `text-2xl sm:text-3xl font-bold` (white by default)
- **Subtitle**: `mt-2 text-white/80 text-sm`

### Inside Content Area
- **Section Title**: `text-lg font-semibold text-gray-900`
- **Labels**: `text-xs uppercase tracking-wide text-gray-500`
- **Values**: `text-lg font-semibold`
- **Descriptions**: `text-sm text-gray-500`

## Key Classes Reference

### Container Structure
- Outer wrapper: `min-h-screen bg-gray-50`
- Content container: `mx-auto max-w-6xl px-6 py-8`
- Main card: `rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden`

### Blue Header
- `bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8`

### Content Padding
- `p-6 sm:p-8`

### Card Styles
- Small cards: `rounded-2xl border border-gray-200 p-4 bg-white shadow-sm`
- Large cards with header: See PaymentsView.tsx for example

## Examples

See these pages for working examples:
- `/src/pages/PaymentsView.tsx` - Master reference
- `/src/components/InsuranceSettlementReport.tsx` - Homepage (original design)

## DO NOT
- ❌ Use shadcn Card components
- ❌ Use design system wrapper components
- ❌ Deviate from this structure
- ❌ Use different border colors (always `border-gray-200`)
- ❌ Use different rounded corners (always `rounded-2xl` or `rounded-3xl`)
- ❌ Skip the blue header on pages
- ❌ Put content outside the main card container

## DO
- ✅ Always wrap page in the master structure
- ✅ Use direct Tailwind classes
- ✅ Use exact class names from this template
- ✅ Keep blue header consistent across all pages
- ✅ Use `p-6 sm:p-8` for main content padding
- ✅ Test against homepage to ensure consistency

