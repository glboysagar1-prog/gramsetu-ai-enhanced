# GramSetu AI - Design Guidelines

## Analysis & Approach

**Project Type**: File management and analytics platform with authentication
**Design Approach**: Design System (Material Design) + Dashboard References (Linear, Notion)
**Rationale**: Utility-focused application requiring clarity, efficiency, and data visualization. Users need to quickly upload files, view lists, and understand analytics.

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: 222 15% 8%
- Surface: 222 15% 12%
- Surface Elevated: 222 15% 16%
- Primary Brand: 270 60% 58% (Purple accent for AI brand identity)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%
- Border: 222 15% 20%
- Success: 142 76% 45%
- Error: 0 84% 60%

**Light Mode**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 270 60% 48%
- Text Primary: 222 15% 15%
- Text Secondary: 222 10% 45%

### B. Typography

**Font Families** (Google Fonts CDN):
- Primary: 'Inter' - UI elements, body text
- Monospace: 'JetBrains Mono' - file names, analytics data

**Scale**:
- Headings: text-3xl (dashboard headers), text-2xl (section titles), text-xl (card titles)
- Body: text-base (default), text-sm (metadata, captions)
- Data: text-lg font-mono (file sizes, analytics numbers)

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-6
- Section spacing: gap-6 to gap-8
- Page margins: px-6 lg:px-12
- Container: max-w-7xl mx-auto

**Grid Patterns**:
- File list: Single column on mobile, 2-3 columns on desktop
- Analytics cards: 2x2 grid on desktop, stacked on mobile
- Dashboard layout: Sidebar (280px) + main content area

### D. Component Library

**Navigation**
- Sidebar: Fixed left, collapsible on mobile, icons + labels
- Top bar: User profile, notifications, quick actions

**Authentication**
- Clean centered forms with max-w-md
- Input fields: rounded-lg border focus:ring-2 focus:ring-primary
- CTAs: Full-width primary buttons

**File Management**
- Upload zone: Dashed border, drag-drop area with icon
- File cards: Compact list view with thumbnail placeholder, filename (truncated), size, date
- Actions: Icon buttons (download, delete) revealed on hover

**Analytics Dashboard**
- Stat cards: Large number display with trend indicators (↑↓)
- Chart placeholders: Minimum h-64, rounded borders, labeled axes
- Data tables: Striped rows, sortable headers with icons

**Forms & Inputs**
- Consistent height: h-10 for inputs and buttons
- Validation states: Green border (success), red border + message (error)
- File input styled as button with upload icon

### E. Interactions

**Minimal Animation** (performance-focused):
- Button hover: subtle scale (hover:scale-[1.02])
- Card hover: border color change only
- Page transitions: None (instant navigation)
- Loading states: Simple spinner, no skeleton screens

---

## Key Screens Layout

**1. Login/Signup Page**
- Centered card (max-w-md) on gradient background
- Logo at top
- Form fields with clear labels
- Social proof text: "Trusted by 1000+ users for file management"

**2. Dashboard Home**
- Sidebar: Logo, navigation (Dashboard, Files, Analytics, Settings)
- Main area: Welcome header, 3-4 stat cards (Total Files, Storage Used, Recent Uploads)
- Recent activity list below

**3. Files List Page**
- Upload button (top-right, prominent)
- Search/filter bar
- File grid/list with: filename, type icon, size, upload date, actions
- Pagination at bottom

**4. Analytics Page**
- Page title + date range selector
- 2x2 grid of metric cards (Files Uploaded, Storage Trends, etc.)
- 2-3 chart placeholders (bar, line, pie) with descriptive labels

---

## Technical Specifications

**Icons**: Heroicons (via CDN)
**Responsive Breakpoints**: sm:640px, md:768px, lg:1024px, xl:1280px
**Dark Mode**: Default state, toggle in user menu
**Accessibility**: ARIA labels on icon buttons, focus visible states, color contrast AA compliant

---

## Images

**Hero/Marketing (if needed later)**
- Abstract AI/network visualization as background (subtle opacity)
- File organization concept imagery for landing page

**Dashboard**
- No decorative images (utility-first)
- File type icons from icon library
- User avatar placeholders (initials in colored circles)