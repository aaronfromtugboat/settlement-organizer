# Design System - Consistent Styling Guide

This document outlines the consistent styling patterns used across the application to ensure all pages look cohesive.

## Design System Components

We now use a dedicated design system with components that match the homepage exactly:

### Card Components
```tsx
import { HeroCard, StandardCard, InteractiveCard, StatCard, CTACard, EmptyStateCard } from '@/components/design-system'

// Hero Card - Main content with blue header
<HeroCard>
  <HeroHeader>
    <HeroTitle>Title</HeroTitle>
    <HeroSubtitle>Description</HeroSubtitle>
  </HeroHeader>
  <div className="p-6 sm:p-8">
    {/* Content */}
  </div>
</HeroCard>

// Standard Card - Regular cards
<StandardCard className="p-4">
  {/* Content */}
</StandardCard>

// Interactive Card - Hoverable cards
<InteractiveCard>
  {/* Content */}
</InteractiveCard>

// Stat Card - Small stat cards
<StatCard label="Label" value="$1,234.56" />

// CTA Card - Call to action
<CTACard>
  {/* Content */}
</CTACard>

// Empty State Card - For empty states
<EmptyStateCard>
  {/* Content */}
</EmptyStateCard>
```

### Typography Components
```tsx
import { PageTitle, PageSubtitle, HeroTitle, HeroSubtitle, CardTitle, CardDescription } from '@/components/design-system'

// Page titles
<PageTitle>Page Title</PageTitle>
<PageSubtitle>Page description</PageSubtitle>

// Hero headers (blue background)
<HeroTitle>Hero Title</HeroTitle>
<HeroSubtitle>Hero description</HeroSubtitle>

// Card content
<CardTitle>Card Title</CardTitle>
<CardDescription>Card description</CardDescription>
```

## Key Benefits

✅ **Guaranteed Consistency** - All components use the exact same classes as the homepage
✅ **No CSS Variable Conflicts** - Direct Tailwind classes, no CSS variable overrides
✅ **Easy to Use** - Simple import and use, no complex styling needed
✅ **Maintainable** - All styling centralized in design system components
✅ **Extensible** - Easy to add new components following the same patterns

## Usage Examples

### Complete Page Structure
```tsx
import { 
  HeroCard, 
  StandardCard, 
  StatCard, 
  CTACard, 
  PageTitle, 
  PageSubtitle,
  HeroTitle,
  HeroSubtitle 
} from '@/components/design-system'

export function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <PageTitle>My Page</PageTitle>
        <PageSubtitle>Page description</PageSubtitle>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total" value="$1,234.56" />
          <StatCard label="Count" value="42" />
          <StatCard label="Status" value="Active" />
        </div>
        
        {/* Main content */}
        <HeroCard>
          <HeroHeader>
            <HeroTitle>Main Content</HeroTitle>
            <HeroSubtitle>Content description</HeroSubtitle>
          </HeroHeader>
          <div className="p-6 sm:p-8">
            {/* Your content */}
          </div>
        </HeroCard>
        
        {/* CTA */}
        <CTACard className="mt-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold text-emerald-900">Need help?</div>
              <div className="text-sm text-emerald-900/80">Get support</div>
            </div>
            <Button>Contact Us</Button>
          </div>
        </CTACard>
      </div>
    </div>
  )
}
```

## Colors

### Brand Colors
- Primary Action: `bg-emerald-600 hover:bg-emerald-700`
- Success/Positive: `text-emerald-600`
- Warning/Partial: `text-orange-600`
- Error/Negative: `text-red-600`

### Neutral Colors
- Background: `bg-gray-50`
- Card Background: `bg-white`
- Border: `border-gray-200`
- Text Primary: `text-gray-900`
- Text Secondary: `text-gray-600`
- Text Tertiary: `text-gray-500`

### CTA Colors
- Background: `bg-emerald-50`
- Border: `border-emerald-200`
- Text: `text-emerald-900`
- Subtext: `text-emerald-900/80`

## Layout

### Page Wrapper
```tsx
<div className="min-h-screen bg-gray-50">
  <div className="mx-auto max-w-6xl px-6 py-8">
    {/* Content */}
  </div>
</div>
```

### Spacing
- Page padding: `px-6 py-8`
- Card padding (small): `p-4`
- Card padding (medium): `p-5`
- Card padding (large): `p-6 sm:p-8`
- Card padding (empty state): `p-12`
- Grid gaps: `gap-4` or `gap-6`
- Section margins: `mb-6` or `mb-8`

## Buttons

### Primary Button
```tsx
<Button className="bg-emerald-600 hover:bg-emerald-700">
  Label
</Button>
```

### Secondary Button
```tsx
<Button variant="outline">
  Label
</Button>
```

### Small Button
```tsx
<Button size="sm" variant="outline" className="h-8 px-3">
  Label
</Button>
```

## Important Rules

1. **Never use CardHeader, CardTitle, CardContent, CardDescription** - Use direct divs with classes instead
2. **Never use monospace fonts for currency** - Always use Inter (text-lg font-semibold)
3. **Always use rounded-2xl for cards** - Except main hero cards which use rounded-3xl
4. **Consistent shadows** - shadow-sm for normal, shadow-xl for hero, hover:shadow-md for interactive
5. **Consistent padding** - p-4 for stats, p-5 for CTAs, p-6/p-8 for content
6. **Use bg-gray-50 for page backgrounds** - Not in App.tsx, but in each page wrapper

## Grid Layouts

### 3 Column (Stats)
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
```

### 4 Column (Stats)
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
```

### Document Cards
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

