# FST Service Management Mobile App - Design Guidelines

## Application Overview
A professional mobile application for FST white appliance service technicians to manage customers, track service requests, assign jobs, and plan maintenance while working in the field. The app must prioritize speed, efficiency, and offline capability for technicians on-site.

## Architecture Decisions

### Authentication
**Auth Required** - Business application with multiple users (admin, service technicians, clients)

**Implementation:**
- Use email/password authentication (industry standard for business apps)
- Include "Remember Me" option for faster login on trusted devices
- Add biometric authentication option (Face ID/Touch ID) after initial login
- Mock authentication flow in prototype using local state
- Account screen features:
  - Profile with technician photo and contact info
  - Specialties/certifications display
  - Work statistics (services completed, ratings)
  - Log out with confirmation
  - Settings for notifications and app preferences

### Navigation Architecture
**Tab Navigation (4 tabs + Floating Action Button)**

**Tab Structure:**
1. **Services** (Home) - List of all service requests with filters
2. **Customers** - Customer and device management
3. **Schedule** - Calendar view of upcoming maintenance
4. **Reports** - Statistics and service reports

**Floating Action Button:**
- Core action: "New Service Request"
- Positioned bottom-right for thumb accessibility
- Icon: Plus (+) symbol from Feather icons
- Opens modal form for quick service creation

**Additional Navigation:**
- Service details use stack navigation (push/pop)
- Settings accessible from profile tab header
- Search functionality in Services and Customers tabs

## Screen Specifications

### 1. Services Screen (Home Tab)
**Purpose:** View and manage all service requests with filtering

**Layout:**
- **Header:** Transparent with search bar
  - Left: FST logo/app name
  - Right: Filter button
  - Search bar integrated below header
- **Main Content:** FlatList with pull-to-refresh
  - Service cards showing: customer name, device type, status badge, assigned technician, date
  - Status color coding (pending: yellow, in-progress: blue, completed: green, cancelled: red)
  - Swipe actions: Mark complete (left), View details (tap)
- **Safe Area:** 
  - Top: headerHeight + Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl + fabHeight

### 2. Service Detail Screen (Stack Modal)
**Purpose:** View complete service information and update status

**Layout:**
- **Header:** Standard navigation header (non-transparent)
  - Left: Back button
  - Right: Edit button
  - Title: Service #[ID]
- **Main Content:** ScrollView with sections
  - Customer information card
  - Device details card
  - Service history timeline
  - Photo attachments (grid layout)
  - Notes and technician comments
  - Status update buttons at bottom
- **Safe Area:**
  - Top: Spacing.xl
  - Bottom: insets.bottom + Spacing.xl

### 3. New Service Request Screen (Modal)
**Purpose:** Quickly create new service request from the field

**Layout:**
- **Header:** Modal header (non-transparent)
  - Left: Cancel button
  - Right: Save button
  - Title: "New Service"
- **Main Content:** Scrollable form with sections
  - Customer selection (searchable dropdown)
  - Device selection (from customer's devices or add new)
  - Issue description (multiline text input)
  - Priority selector (chips: Low, Medium, High, Urgent)
  - Photo upload (camera button for on-site photos)
  - Assign technician (optional)
- Submit button: In header (right side)
- **Safe Area:**
  - Top: Spacing.xl
  - Bottom: insets.bottom + Spacing.xl

### 4. Customers Screen (Tab)
**Purpose:** Manage customer database and their devices

**Layout:**
- **Header:** Transparent with search bar
  - Left: "Customers" title
  - Right: Add customer button (+)
  - Search bar below
- **Main Content:** FlatList with alphabetical sections
  - Customer cards with avatar, name, phone, device count
  - Tap to view customer details
- **Safe Area:**
  - Top: headerHeight + Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl

### 5. Customer Detail Screen (Stack)
**Purpose:** View customer information and manage their devices

**Layout:**
- **Header:** Standard navigation (non-transparent)
  - Left: Back button
  - Right: Edit button
  - Title: Customer name
- **Main Content:** ScrollView
  - Contact information section
  - Registered devices list
  - Service history for this customer
  - Add device button at bottom
- **Safe Area:**
  - Top: Spacing.xl
  - Bottom: insets.bottom + Spacing.xl

### 6. Schedule Screen (Tab)
**Purpose:** View upcoming maintenance appointments and service schedule

**Layout:**
- **Header:** Default navigation (non-transparent)
  - Title: "Schedule"
  - Right: Calendar view toggle (list/calendar)
- **Main Content:** Calendar or list view
  - Calendar mode: Month view with colored dots for scheduled days
  - List mode: Grouped by date showing all scheduled services
  - Tap to view service details
- **Safe Area:**
  - Top: Spacing.xl (with header)
  - Bottom: tabBarHeight + Spacing.xl

### 7. Reports Screen (Tab)
**Purpose:** View statistics and generate service reports

**Layout:**
- **Header:** Default navigation (non-transparent)
  - Title: "Reports"
  - Right: Date range filter
- **Main Content:** ScrollView with cards
  - Summary statistics (total services, completed, pending)
  - Charts: Services by status, by device type, by technician
  - Export button for detailed reports
- **Safe Area:**
  - Top: Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl

## Design System

### Color Palette
**Professional Service Industry Theme:**
- **Primary:** #2563EB (Blue 600) - Trust, professionalism
- **Primary Light:** #3B82F6 (Blue 500)
- **Primary Dark:** #1D4ED8 (Blue 700)
- **Secondary:** #64748B (Slate 500) - Neutral, industrial
- **Background:** #F8FAFC (Slate 50)
- **Surface:** #FFFFFF (White)
- **Error:** #DC2626 (Red 600)
- **Warning:** #F59E0B (Amber 500)
- **Success:** #10B981 (Green 500)
- **Text Primary:** #0F172A (Slate 900)
- **Text Secondary:** #64748B (Slate 500)
- **Border:** #E2E8F0 (Slate 200)

**Status Colors:**
- Pending: #F59E0B (Amber 500)
- In Progress: #3B82F6 (Blue 500)
- Completed: #10B981 (Green 500)
- Cancelled: #DC2626 (Red 600)

### Typography
- **Heading Large:** 28px, Bold, Slate 900
- **Heading Medium:** 20px, Semibold, Slate 900
- **Heading Small:** 16px, Semibold, Slate 900
- **Body Regular:** 14px, Regular, Slate 700
- **Body Small:** 12px, Regular, Slate 600
- **Label:** 12px, Medium, Slate 600 (uppercase)
- **Button:** 14px, Semibold

### Components

**Service Card:**
- White background with subtle border
- 16px padding
- 12px border radius
- Status badge top-right (8px radius, colored background)
- Customer name (Heading Small)
- Device info and date (Body Small, Secondary)
- Assigned technician avatar bottom-left

**Customer Card:**
- White background, subtle shadow
- Avatar (48px circular) left-aligned
- Name and phone stacked
- Device count badge
- Tap target: full card

**Floating Action Button:**
- 56x56px circular button
- Primary color background
- White plus icon (24px)
- Positioned 16px from bottom-right
- Drop shadow: offset (0, 2), opacity 0.10, radius 2

**Status Badge:**
- Pill shape (full border radius)
- 6px vertical padding, 12px horizontal
- Status color at 15% opacity background
- Status color text (Body Small, Semibold)

**Form Inputs:**
- 48px height for touch targets
- 12px border radius
- Slate 200 border, Slate 900 text
- 16px horizontal padding
- Focus state: Primary color border, subtle blue background

**Photo Upload Button:**
- Dashed border (Slate 300)
- Camera icon centered (Feather icons)
- "Add Photo" text below icon
- Minimum 120x120px

### Interaction Design

**Touch Feedback:**
- All buttons: 90% opacity on press
- Cards: Slight scale down (0.98) + subtle shadow increase
- Tab bar: Active tab has Primary color, inactive Slate 400

**Gestures:**
- Pull-to-refresh on all lists
- Swipe-to-complete on service cards (left swipe shows green complete button)
- Long-press on service card for quick actions menu

**Loading States:**
- Skeleton screens for list loading (animated pulse)
- Spinner for form submissions
- Optimistic updates where possible (update UI immediately, sync in background)

**Offline Indicator:**
- Persistent banner at top when offline (amber background, "Working Offline" text)
- Local data badge on cards modified offline
- Sync icon in header when pending sync

### Visual Assets

**Required Custom Assets:**
1. **FST Logo** - Professional service company logo for splash screen and header
2. **Empty States:**
   - No services illustration (wrench and checklist)
   - No customers illustration (person with magnifying glass)
   - No scheduled maintenance (calendar with clock)
3. **Onboarding Illustrations** (3 screens):
   - Screen 1: Mobile technician with tools
   - Screen 2: Service tracking workflow
   - Screen 3: Customer satisfaction

**System Icons (Feather):**
- Tool, Wrench, Settings for service types
- User, Users for customers
- Calendar, Clock for scheduling
- FileText, BarChart for reports
- Camera, Image for photos
- CheckCircle, XCircle for status

### Accessibility
- Minimum touch targets: 44x44 points
- Text contrast ratio: 4.5:1 minimum
- Status communicated via color + icon + text
- Form labels always visible
- Error messages clear and actionable
- Support for system text size adjustments
- VoiceOver/TalkBack labels on all interactive elements