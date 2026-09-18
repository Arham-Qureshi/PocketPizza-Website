# POKKET_PIZZA_DESIGN_SPEC.md
**Complete Design System Reference — extracted directly from `Untitled.fig` binary node tree (4,301 nodes decoded)**

---

## 1. Brand Identity
- **Wordmark:** "POKKET PIZZA" — appears in `logo-group` frames across Home/nav/footer, paired with a `logo-icon` mark
- **Primary brand color:** `#D62828` (signature red — used for CTAs, prices, active states)
- **Brand personality:** warm, handmade, appetite-forward — reinforced via cream backgrounds + charcoal dark sections for storytelling (About page "Our Sourdough, Our Craft")
- **USP embedded in brand visuals:** copy such as *"We slow-proof our signature sourdough bases for 48 hours..."* appears directly in design content (About page), confirming handmade-base story is a core visual/content pillar, not just a tagline

---

## 2. Full Color System

### 2.1 Primary / Brand
| Token | Hex | Usage |
|---|---|---|
| `--color-brand-red` | `#D62828` | Primary buttons, prices, active nav, brand accents |

### 2.2 Neutral / Text
| Token | Hex | Usage |
|---|---|---|
| `--color-charcoal` | `#2B2B2B` | Primary text on light, dark section backgrounds |
| `--color-charcoal-alt` | `#3B3B3B` | Secondary dark surface |
| `--color-black` | `#000000` | Pure black accents |
| `--color-body-secondary` | `#615E5A` | Secondary/body text on light backgrounds |
| `--color-muted-warm-gray` | `#969089` | Tertiary text, disabled states, borders |
| `--color-white` | `#FFFFFF` | Cards, text on dark |

### 2.3 Background
| Token | Hex | Usage |
|---|---|---|
| `--color-cream-bg` | `#FFF8F0` | Primary light-theme page background |
| `--color-off-white-alt` | `#FFFDF9` | Secondary light background |
| `--color-cream-alt` | `#FFF5E6` | Section background variant |
| `--color-blush-tint` | `#FDF0EE` | Light accent background (badges/highlights) |
| `--color-neutral-tint` | `#F5F3EE` | Neutral card background |

### 2.4 Semantic / Status Colors
| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#E8FDF0` / `#E8F9EE` | Success state backgrounds (order confirmed) |
| `--color-error-tint` | `#FFF0EE` | Error/validation state background |
| `--color-warning` | `#FF9500` | Warning badges/status |
| `--color-star-rating` | `#FFC107` | Review stars, rating highlights |
| `--color-whatsapp` | `#25D366` | WhatsApp CTA button |
| `--color-info` | `#007AFF` | Info/link elements (admin) |

### 2.5 Stroke / Border Colors
| Hex | Frequency | Usage |
|---|---|---|
| `#EADCC9` | 327× (most common) | Default card/input border |
| `#D62828` | 155× | Active/focus border, brand outline |
| `#FFFFFF` | 147× | Border on dark surfaces |
| `#2B2B2B` | 67× | Dark outline |
| `#FFC107` | 27× | Rating/highlight border |
| `#25D366` | 9× | WhatsApp button border |

---

## 3. Typography

**Font families:** `Outfit` (1,046 uses — headings/UI/buttons) + `Inter` (383 uses — body copy)

### 3.1 Type Scale (20+ confirmed styles)
| Style Name (suggested) | Family | Weight | Size | Typical Use |
|---|---|---|---|---|
| Display XL | Outfit | ExtraBold | 56px | Largest hero headline |
| Display L | Outfit | ExtraBold | 48px | Hero headline alt |
| H1 | Outfit | ExtraBold | 40px | Page hero (mobile) / H2 desktop |
| H1 Alt | Outfit | ExtraBold | 36px, 32px | Section headline |
| H2 | Outfit | ExtraBold | 28px | Section headline (mobile) |
| H3 | Outfit | ExtraBold | 24px, 22px, 20px | Sub-section headline |
| H4 | Outfit | Bold / ExtraBold | 18px | Card titles, large buttons |
| H4 Alt | Outfit | ExtraBold | 16px | Emphasis headline |
| Button/Nav | Outfit | Bold | 16px | Buttons, nav links |
| Subheading | Outfit | Medium | 16px | Section subheads |
| Card Title | Outfit | Bold | 15px | Product/order card titles |
| Label Bold | Outfit | Bold / SemiBold | 14px | Buttons, form labels (most common bold pairing) |
| Body Small (UI) | Outfit | Regular | 14px, 13px | Small UI text |
| Tag/Meta | Outfit | Bold | 13px, 12px, 11px | Tags, badges, meta labels |
| Body Default | Inter | Regular | 14px | Primary body copy (most common body style) |
| Body Variant | Inter | Regular | 15px, 13px, 12px, 11px | Captions, helper text, form hints |

**Line height:** 100% (tight) on the majority of UI text nodes — use as default; increase for long-form paragraph copy (About page story blocks) per design review.

### 3.2 Weight/Color Pairing Conventions
- Headlines: Outfit ExtraBold/Bold + `#2B2B2B` (light bg) or `#FFFFFF` (dark bg)
- Prices/CTAs: Outfit Bold + `#D62828`
- Body copy: Inter Regular + `#615E5A`
- Meta/tags: Outfit Bold (small size) + `#969089` or status color

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (gap/stackSpacing — exact values in use)
```
2px · 4px · 6px · 8px · 10px · 12px · 14px · 16px · 18px · 20px · 24px · 28px · 32px · 40px · 48px · 60px · 64px · 85px
```
**Core scale to standardize on:** `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64` (an 8px-rooted scale — matches 1,012+ instances at 12px and 934+ at 16px, the two most-used values)

### 4.2 Padding Scale (container padding — exact values in use)
```
2px · 4px · 6px · 8px · 10px · 12px · 14px · 16px · 18px · 20px · 24px · 28px · 32px · 40px · 48px · 64px · 80px · 88px · 100px · 120px
```
Most common: **12px** (1,012×), **16px** (934×), **24px** (510×) — use these three as default card/section/page padding respectively.

### 4.3 Admin Desktop Layout Structure
Based on confirmed component frames (`Admin Top Nav`, `sidebar`, `sidebar-footer`, `panel-header`, `panel-body`, `dashboard-control-panel`):
```
┌─────────────────────────────────────────────┐
│  Admin Top Nav (full width, ~98px height)    │
├───────────┬───────────────────────────────────┤
│           │                                   │
│  Sidebar  │      Main Panel Content            │
│  (nav-    │   (panel-header + panel-body)      │
│  item-*)  │   e.g. Kanban columns, tables,      │
│           │   forms, KOT side panel            │
│  sidebar- │                                   │
│  footer   │                                   │
└───────────┴───────────────────────────────────┘
```
Sidebar nav items confirmed: Home-equivalent Dashboard, Active Orders, New Orders, Preparing, Ready for Handoff, Completed, Cancelled, All Orders, Menu Editor, Kitchen Analytics, Store Settings.

### 4.4 Corner Radius Scale
| Radius | Frequency | Use |
|---|---|---|
| 8px | 151× | Small elements (inputs, badges) |
| 12px | 147× | Standard card/button radius |
| 16px | 98× | Larger cards, product cards |
| 20px | 75× | Section/hero cards |
| 26px | 45× | Pills/large buttons |
| 100px | 35× | Fully rounded (avatars, icon buttons, pills) |
| 18px | 33× | Modals/panels |
| 10px | 30× | Inputs |
| 6px | 26× | Small tags |
| 4px | 20× | Fine details |

**Standardized scale:** `8 / 12 / 16 / 20 / 100(pill)`

---

## 5. Screen Inventory (33 screens, exact node IDs + dimensions)

### Customer — Mobile (375–402px width)
| Screen | Node GUID | Dimensions |
|---|---|---|
| Home | [65, 2] | 402 × 2838 |
| About | [65, 187] | 402 × 1560 |
| Menu | [65, 270] | 402 × 2069 |
| Cart | [65, 390] | 402 × 1254 |
| Checkout | [65, 501] | 402 × 1264 |
| Contact | [65, 596] | 402 × 1473 |
| Product Customization | [85, 9] | 375 × 812 |
| Checkout Order Types | [85, 104] | 375 × 812 |
| Order Confirmation | [85, 162] | 375 × 812 |
| Order Tracking | [85, 203] | 375 × 812 |
| Invoice | [85, 286] | 375 × 812 |
| Supporting States | [85, 350] | 375 × 812 |

### Customer — Desktop (1440px width)
| Screen | Node GUID | Dimensions |
|---|---|---|
| Home | [65, 700] | 1440 × 2889 |
| About | [65, 920] | 1440 × 1921 |
| Menu | [65, 1023] | 1440 × 1501 |
| Cart | [65, 1180] | 1440 × 1066 |
| Checkout | [65, 1308] | 1440 × 1185 |
| Contact | [65, 1423] | 1440 × 1431 |
| Product Customization | [85, 538] | 1440 × 1024 |
| Checkout Order Types | [85, 634] | 1440 × 1304 |
| Order Tracking | [85, 757] | 1440 × 1366 |
| Order Confirmation | [95, 6] | 1440 × 1371 |
| Invoice | [95, 156] | 1440 × 1733 |
| Supporting States | [95, 300] | 1440 × 1396 |

### Admin — Desktop (1446–1448px width)
| Screen | Node GUID | Dimensions |
|---|---|---|
| Login | [95, 425] | 1446 × 1024 |
| Order Detail | [95, 642] | 1447 × 1024 |
| Menu Management | [95, 863] | 1446 × 1024 |
| Add/Edit Product | [95, 1029] | 1448 × 1481 |
| Order History | [95, 1191] | 1447 × 1024 |
| Reports | [95, 1345] | 1446 × 1024 |
| Order Management | [116, 4] | 1446 × 1024 |

### Admin — Mobile (376px width)
| Screen | Node GUID | Dimensions |
|---|---|---|
| Order Management | [95, 1541] | 376 × 812 |
| Order Detail | [95, 1622] | 376 × 812 |

*(Total: 24 Customer + 9 Admin = 33 screens)*

---

## 6. Component Library (confirmed component frames + real sub-component instances)

### Dedicated "Components" page frames (12)
1. **Variant Add-on Selector** — 380×420
2. **Order Type Segmented Control** — 380×266 (`segmented-toggle` instances found in Checkout)
3. **Order Progress Stepper** — 380×398
4. **Feedback State Pattern** — 760×314 (covers empty/error/success states)
5. **Status Badges** — 380×188 (`badge`, `badge-new`, `type-badge`, `status-pill`, `status-tag`)
6. **Active Toggle** — 380×228 (`toggle-status`, `toggle-col`)
7. **Kanban Column** — 420×640 (`status-column`, `empty-column-state`)
8. **Order Card** — 380×168
9. **Data Table Row** — 1100×80 (`table-row`, `table-head`, `history-table`)
10. **Admin Top Nav** — 1440×98 (`nav-group`, `nav-item-*`, `logo-group`, `profile-avatar`)
11. **Stat Card** — 360×135 (`kpi-card`, `chart-card`)
12. **Login Form** — 440×582 (`form-fields`, `form-header`)

### Additional real component instances found across screens (not on Components page but reused)
- **Buttons:** `accept-button`, `selector-buttons`, `btn-order-status` — primary (filled red), secondary (outline), icon buttons (WhatsApp/call)
- **Inputs:** `input-container`, `history-inputs`, `checkout-form` fields — default/focused/error states (`checkout-form-errors`, "Invalid Information" error text confirmed)
- **Cards:** `cat-card`, `customer-card`, `delivery-card`, `dine-in-card`, `dine-in-helper-card`, `empty-cart-card`, `form-card` — many contextual card variants beyond the base Order/Stat cards
- **Panels:** `categories-panel`, `products-panel`, `kot-side-panel`, `live-tracking-panel`, `dashboard-control-panel`
- **Alerts:** `alert-circle`, `alert-octagon`, `alert-triangle`, `cancelled-alert` — icon-based alert system with a dedicated "Order Cancellation Alert" state
- **Sidebar:** `sidebar`, `sidebar-footer`, `order-status-sidebar` (admin nav + order-tracking sidebar variant)
- **Header variants:** `header`, `header-bar`, `header-left/right`, `header-actions`, `column-header`, `detail-header`, `form-header`, `modal-header`, `panel-header`, `section-header`, `product-table-header`
- **Logo:** `logo-group`, `logo-icon` — reused in nav + footer

---

## 7. Effects & Elevation

### Shadows (2 exact tokens found across 89 uses)
```css
/* Shadow A — soft card elevation (most common) */
box-shadow: 0px 6px 16px rgba(71, 60, 53, 0.06);

/* Shadow B — stronger elevation (modals, KOT panel, dropdowns) */
box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.20);
```

### Border/Stroke Styles
| Weight | Frequency | Use |
|---|---|---|
| 1px | 3,878× | Default border (cards, inputs, dividers) |
| 2px | 364× | Emphasis border (active/focus states) |
| 1.5px | 28× | Icon strokes |
| 3px, 2.5px | rare | Special emphasis (isolated cases) |

---

## 8. Iconography & Assets
- **Icon style:** Line-style vector icons (387 VECTOR nodes total) — consistent stroke-based icon set (alert-circle/octagon/triangle, status-icons, rank-icon, clock-empty-icon)
- **Icon strokes:** predominantly 1–1.5px weight, matching the border-weight system above
- **Product images:** used as fills within `cat-card`/product cards — 30+ distinct product photos found in the file's image blob store (see `images/` folder in the .fig package)
- **Avatar spec:** `profile-avatar` — circular (100px radius token), used in Admin Top Nav

---

## 9. Responsive Breakpoints

| Aspect | Mobile | Desktop |
|---|---|---|
| Customer frame width | 375–402px | 1440px |
| Admin frame width | 376px | 1446–1448px |
| Navigation | Hamburger menu | Full horizontal nav (Customer) / persistent sidebar (Admin) |
| Admin layout | Simplified — Order Management + Order Detail only | Full sidebar + panel layout, all 7 screens |
| Cards | Single column stack | Grid (2–4 columns depending on section) |
| Floating actions | WhatsApp + Call pinned bottom-right | Same, smaller relative footprint |

**Note:** Admin was intentionally scoped mobile-only for Order Management + Order Detail (matches earlier design brief: staff need quick status checks on the go; full menu/reports management stays desktop-first).

---

## 10. Accessibility Notes (WCAG 2.1 contrast ratios — calculated from exact hex values)

| Pairing | Ratio | AA Normal Text (4.5:1) | AA Large Text/UI (3:1) |
|---|---|---|---|
| Charcoal `#2B2B2B` on White | 14.16:1 | ✅ PASS | ✅ PASS |
| White on Charcoal `#2B2B2B` | 14.16:1 | ✅ PASS | ✅ PASS |
| Body secondary `#615E5A` on White | 6.45:1 | ✅ PASS | ✅ PASS |
| Body secondary `#615E5A` on Cream `#FFF8F0` | 6.12:1 | ✅ PASS | ✅ PASS |
| Brand Red `#D62828` on White | 5.01:1 | ✅ PASS | ✅ PASS |
| White on Brand Red `#D62828` button | 5.01:1 | ✅ PASS | ✅ PASS |
| Brand Red `#D62828` on Cream `#FFF8F0` | 4.75:1 | ✅ PASS | ✅ PASS |
| Muted gray `#969089` on White | 3.16:1 | ❌ FAIL | ✅ PASS (large/UI only) |
| ⚠️ WhatsApp green `#25D366` on White | 1.98:1 | ❌ FAIL | ❌ FAIL |
| ⚠️ Star yellow `#FFC107` on White | 1.63:1 | ❌ FAIL | ❌ FAIL |

**Flags for remediation:**
- `#969089` (muted gray) should be reserved for large text (18px+) or non-text UI elements only — fails AA for normal body text
- `#25D366` (WhatsApp green) and `#FFC107` (star yellow) fail contrast against white — these are almost certainly used as **icon/fill colors on colored buttons or as background chips with dark text**, not as text color directly on white. Confirm actual usage context per instance; if used as raw text-on-white anywhere, darken or add a background treatment.

---

## 11. Appendix A — Ready-to-Use CSS Custom Properties

```css
:root {
  /* Brand */
  --color-brand-red: #D62828;

  /* Neutral / Text */
  --color-charcoal: #2B2B2B;
  --color-charcoal-alt: #3B3B3B;
  --color-black: #000000;
  --color-body-secondary: #615E5A;
  --color-muted-warm-gray: #969089;
  --color-white: #FFFFFF;

  /* Background */
  --color-cream-bg: #FFF8F0;
  --color-off-white-alt: #FFFDF9;
  --color-cream-alt: #FFF5E6;
  --color-blush-tint: #FDF0EE;
  --color-neutral-tint: #F5F3EE;

  /* Semantic */
  --color-success-bg: #E8FDF0;
  --color-error-bg: #FFF0EE;
  --color-warning: #FF9500;
  --color-star-rating: #FFC107;
  --color-whatsapp: #25D366;
  --color-info: #007AFF;

  /* Border */
  --color-border-default: #EADCC9;
  --color-border-active: #D62828;

  /* Typography */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radius scale */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 100px;

  /* Shadows */
  --shadow-card: 0px 6px 16px rgba(71, 60, 53, 0.06);
  --shadow-elevated: 0px 4px 12px rgba(0, 0, 0, 0.20);

  /* Border weights */
  --border-default: 1px;
  --border-emphasis: 2px;
}
```

---

## 12. Appendix B — Figma File Structure Map

```
Untitled.fig
├── Page: Customer
│   ├── Home (Mobile / Desktop)
│   ├── About (Mobile / Desktop)
│   ├── Menu (Mobile / Desktop)
│   ├── Cart (Mobile / Desktop)
│   ├── Checkout (Mobile / Desktop)
│   ├── Contact (Mobile / Desktop)
│   ├── Product Customization (Mobile / Desktop)
│   ├── Checkout Order Types (Mobile / Desktop)
│   ├── Order Confirmation (Mobile / Desktop)
│   ├── Order Tracking (Mobile / Desktop)
│   ├── Invoice (Mobile / Desktop)
│   └── Supporting States (Mobile / Desktop)
│
├── Page: Admin
│   ├── Login (Desktop)
│   ├── Order Management (Desktop / Mobile)
│   ├── Order Detail (Desktop / Mobile)
│   ├── Menu Management (Desktop)
│   ├── Add/Edit Product (Desktop)
│   ├── Order History (Desktop)
│   └── Reports (Desktop)
│
├── Page: Components
│   ├── Variant Add-on Selector
│   ├── Order Type Segmented Control
│   ├── Order Progress Stepper
│   ├── Feedback State Pattern
│   ├── Status Badges
│   ├── Active Toggle
│   ├── Kanban Column
│   ├── Order Card
│   ├── Data Table Row
│   ├── Admin Top Nav
│   ├── Stat Card
│   └── Login Form
│
└── Page: Internal Only Canvas
    └── (animation keyframe tracks only — not relevant to frontend build)
```

**Total node count:** 4,301 (2,244 frames · 1,429 text layers · 387 vectors · 80 lines · 74 rounded rectangles · 60 ellipses)

---

*Document generated by direct binary extraction from Untitled.fig — all values above are exact, not estimated.*
