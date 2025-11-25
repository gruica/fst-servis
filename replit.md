# FST Servis - White Appliance Service Management App

## Overview

FST Servis is a professional mobile application built with React Native and Expo for managing white appliance service operations. The app enables service technicians and administrators to manage customers, track service requests, maintain device records, schedule maintenance, and generate reports while working in the field. It features a modern, tab-based interface with authentication, real-time data management, and integrated notification and email capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation v7 with bottom tab navigation and stack navigators
- **State Management**: React Context API for authentication (AuthContext) and data management (DataContext)
- **UI Components**: Custom themed components built on React Native primitives
- **Animations**: Reanimated 4 for smooth, performant animations
- **Gesture Handling**: React Native Gesture Handler for interactive UI elements
- **Keyboard Management**: React Native Keyboard Controller for improved form handling

**Design System**:
- Theme system supporting light/dark modes with automatic system preference detection
- Consistent spacing, typography, and color tokens defined in `constants/theme.ts`
- Custom components (Button, Card, ThemedText, ThemedView) that automatically adapt to theme
- Status badges and priority indicators with semantic colors

**Screen Structure**:
- 4 main tabs: Services (home), Customers, Schedule, Reports
- Stack navigation within each tab for detail screens
- Modal presentation for create/edit forms
- Floating Action Button for quick service creation

### Authentication & Authorization

**Approach**: Mock authentication with local storage persistence
- Email/password authentication flow
- Two demo users: admin and technician roles
- Session persistence using AsyncStorage
- Role-based UI adjustments (admin vs technician)
- Future-ready for backend integration

**Current Implementation**:
- Demo credentials stored in AuthContext
- Protected routes via conditional rendering based on `isAuthenticated` state
- Logout functionality with confirmation dialog

### Data Management

**Strategy**: Local-first with AsyncStorage persistence
- All CRUD operations managed through DataContext
- Sample data pre-populated for demonstration
- Optimistic UI updates with async persistence
- Data relationships maintained through IDs (customer -> devices -> services)

**Data Models**:
- **Customer**: Contact information, address, notes
- **Device**: Type, brand, model, serial number, linked to customer
- **Service**: Status, priority, description, diagnosis, solution, photos, linked to customer and device
- **Maintenance**: Scheduled maintenance records (type defined, implementation pending)
- **User**: Authentication and profile information

**Future Database Migration**:
- Architecture designed for easy migration to backend API
- All data operations abstracted through context providers
- ID generation using utility functions ready for UUID replacement

### Device Capabilities

**Camera & Image Management**:
- QR code scanning for device serial numbers (native only)
- Photo capture and gallery selection via expo-image-picker
- Multiple photo attachments per service record
- Fallback UI for web platform (QR scanning unavailable message)

**Push Notifications**:
- Expo Notifications configured for service status updates
- Permission handling for iOS and Android
- Custom notification channels on Android
- Service status change notifications
- New service assignment notifications

**Email Integration**:
- Expo Mail Composer for sending service status updates to customers
- Email availability detection (platform-specific)
- Formatted service reports with all details
- HTML-free plain text for universal compatibility

**Biometric Authentication** (Planned):
- Face ID/Touch ID support mentioned in design guidelines
- Not yet implemented in current codebase

### Platform-Specific Implementations

**Multi-Platform Support**:
- iOS: Transparent headers with blur effects, biometric auth ready
- Android: Edge-to-edge layout, material design adaptations
- Web: Fallback components for native-only features (camera, keyboard controller)

**Code Splitting**:
- Platform-specific files (`.native.tsx` for CameraScanner)
- Conditional rendering based on Platform.OS
- Web-specific useColorScheme hook for SSR compatibility

### Build & Deployment

**Development**:
- Replit-optimized dev server with proxy configuration
- Expo Go for mobile testing
- Web development server for browser testing

**Build System**:
- Custom build script (`scripts/build.js`) for static hosting
- QR code generation for Expo Go access
- Landing page template for web deployment
- Metro bundler integration

## External Dependencies

### Core Framework
- **Expo SDK 54**: Cross-platform app framework with managed workflow
- **React 19.1**: UI library with experimental React Compiler enabled
- **React Native 0.81.5**: Mobile app framework

### Navigation & Layout
- **React Navigation**: Bottom tabs and native stack navigators
- **React Native Safe Area Context**: Proper inset handling for modern devices
- **Expo Blur**: iOS blur effects for navigation bars

### UI & Interactions
- **React Native Reanimated**: High-performance animations
- **React Native Gesture Handler**: Advanced gesture recognition
- **React Native Keyboard Controller**: Enhanced keyboard management
- **Expo Vector Icons** (@expo/vector-icons): Feather icon set

### Device Features
- **Expo Camera**: Camera access and QR scanning
- **Expo Barcode Scanner**: QR code detection
- **Expo Image Picker**: Photo gallery and camera access
- **Expo Notifications**: Push notifications
- **Expo Mail Composer**: Email composition
- **Expo Haptics**: Tactile feedback

### Storage & Data
- **AsyncStorage**: Local key-value storage for data persistence
- **Expo File System**: File management for photo storage

### Development Tools
- **TypeScript**: Type safety and developer experience
- **ESLint**: Code quality and formatting
- **Prettier**: Code formatting
- **Babel Module Resolver**: Path aliasing (`@/` imports)

### Future Integrations
- Backend API (architecture ready for REST/GraphQL integration)
- Real-time database (current local storage easily replaceable)
- Cloud storage for photos (currently local file system)
- Analytics service (mentioned in notification utilities)