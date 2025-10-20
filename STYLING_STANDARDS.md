# Styling Standards

## Global Color System

**IMPORTANT:** All styling changes should be made globally, not inline.

### Category Colors

Category colors are defined centrally in `/src/index.css` and can be changed in ONE location to update across the entire app.

#### How to Update Category Colors

Edit the CSS variables in `/src/index.css`:

```css
:root {
  /* Category Colors - Update these to change colors across the entire app */
  --category-rebuild: 59 130 246;        /* Blue */
  --category-ale: 245 158 11;             /* Amber */
  --category-personal-property: 236 72 153; /* Pink */
  --category-all-coverages: 34 197 94;    /* Emerald/Green */
}
```

**RGB Format:** Values are in RGB format (e.g., `59 130 246` = Blue). Use space-separated values without commas.

#### Using Category Colors in Components

Always use the Tailwind utility classes:

```tsx
// ✅ CORRECT - Uses global category color
<div className="bg-category-rebuild" />

// ❌ WRONG - Hardcoded color
<div className="bg-blue-500" />
```

**Available Classes:**
- `bg-category-rebuild` - Blue (for Rebuild category)
- `bg-category-ale` - Amber/Orange (for Additional Living Expenses)
- `bg-category-personal-property` - Pink (for Personal Property)
- `bg-category-all-coverages` - Green (for All Coverages/default)

**For inline styles (gauges, etc.):**
```tsx
// ✅ CORRECT - Uses CSS variable
background: `conic-gradient(rgb(var(--category-rebuild)) ...)`

// ❌ WRONG - Hardcoded RGB value
background: `conic-gradient(rgb(59 130 246) ...)`
```

### General Styling Rules

1. **Always use global styles** - Never hardcode colors, spacing, or other design tokens inline
2. **Use CSS variables** - Define reusable values in `/src/index.css`
3. **Extend Tailwind config** - Add custom utilities in `/tailwind.config.ts` when needed
4. **Follow the design system** - Reference `PAGE_TEMPLATE.md` for layout patterns
5. **Consistency over customization** - Reuse existing patterns before creating new ones

### Adding New Global Colors

1. Add CSS variable to `/src/index.css`:
   ```css
   --my-custom-color: 255 0 0;  /* Red */
   ```

2. Add to Tailwind config in `/tailwind.config.ts`:
   ```ts
   colors: {
     'my-custom': 'rgb(var(--my-custom-color))',
   }
   ```

3. Use in components:
   ```tsx
   <div className="bg-my-custom" />
   ```

### Why This Matters

- **Maintainability:** Change once, update everywhere
- **Consistency:** Ensures colors match across all features
- **Flexibility:** Easy to rebrand or adjust designs
- **Performance:** Tailwind purges unused classes automatically

## Examples

### ✅ Good Practice
```tsx
// Category cards with centralized colors
<div className="bg-category-rebuild">Rebuild</div>
<div className="bg-category-ale">ALE</div>

// Progress bars
<div className="h-2 bg-category-personal-property rounded-full" />

// Gauges with CSS variables
const bg = {
  background: `conic-gradient(rgb(var(--category-rebuild)) ${angle}deg, ...)`
};
```

### ❌ Bad Practice
```tsx
// Hardcoded colors - DO NOT DO THIS
<div className="bg-blue-500">Rebuild</div>
<div className="bg-amber-500">ALE</div>

// Inline RGB values
const bg = {
  background: `conic-gradient(rgb(59 130 246) ${angle}deg, ...)`
};
```

## Questions?

If you need to add new colors or modify the design system, always:
1. Check if a similar color/pattern already exists
2. Add it to the global system (CSS variables + Tailwind config)
3. Document it in this file
4. Never use hardcoded values

