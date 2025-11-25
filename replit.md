# FST Servis - White Appliance Service Management App

## Overview

FST Servis je profesionalna mobilna aplikacija sagrađena sa React Native i Expo SDK 54 za upravljanje servisnim operacijama bele tehnike. Aplikacija omogućava servisnim tehnicijarima i administratorima da upravljaju kupcima, prate zahtjeve za servis, održavaju evidenciju uređaja, planiraju održavanje i generišu izvještaje tokom rada u terenu. Aplikacija ima modernu karticu sa tab navigacijom, autentifikacijom, menadžmentom podataka u realnom vremenu, integrisanom push notifikacijom, email mogućnostima, i multi-role sistemom sa OAuth social login integracijom za sve društvene mreže.

## User Preferences

Preferred communication style: Jednostavnim, svakodnevnim jezikom.

## System Architecture

### Frontend Architecture

**Framework**: React Native sa Expo SDK 54
- **Navigation**: React Navigation v7 sa tab navigacijom na dnu i stack navigatorima
- **State Management**: React Context API za autentifikaciju (AuthContext) i upravljanje podacima (DataContext)
- **UI Components**: Prilagođene komponente gradirane na React Native primitivama
- **Animations**: Reanimated 4 za glatke, performantne animacije
- **Gesture Handling**: React Native Gesture Handler za interaktivne UI elemente
- **Keyboard Management**: React Native Keyboard Controller za poboljšano rukovanje formama
- **Social Authentication**: expo-auth-session za OAuth integraciju

**Design System**:
- Sistem tema sa podrškom za light/dark mode sa automatskom detekcijom sistemske postavke
- Dosledan spacing, tipografija i color tokens definisani u `constants/theme.ts`
- Prilagođene komponente (Button, Card, ThemedText, ThemedView) koje se automatski prilagođavaju temi
- Status bedževi i prioritetni indikatori sa semantičkim bojama

**Screen Structure**:
- 4 glavne kartice: Servisi (početna), Klijenti, Raspored, Izvještaji
- Stack navigacija unutar svake kartice za detalje
- Modalni prikaz za kreiraj/uredi forme
- Plutajuća akciona dugme za brzo kreiranje servisa

### Authentication & Authorization

**Pristup**: Kombinovana autentifikacija
- Email/lozinka autentifikacija sa 6 demo naloga
- **Social Login**: Google, Facebook, GitHub, X (Twitter), Instagram preko `expo-auth-session`
- Dva administratorska naloga: admin i tehnički menadžer
- Dva korisnika: obični tehnicijar i rezervni dijelovi dobavljač
- Dva poslovnih partnera sa custom kredencijalima za ElektroShop i DelParts
- Persistencija sesije korištenjem AsyncStorage
- Role-based UI prilagođavanja (admin vs tehnicijar vs partner vs dobavljač)
- Sigurna prijava via OAuth

**Demo Nalozi**:
1. admin@fst.me / admin123 (Administrator)
2. serviser@fst.me / serviser123 (Tehnician)
3. partner@fst.me / partner123 (Business Partner - ElektroShop D.O.O)
4. supplier@fst.me / supplier123 (Dobavljač - DelParts)

### Backend Architecture (PRODUCTION)

**Framework**: Node.js sa Express
- **Database**: Neon PostgreSQL (`postgresql://neondb_owner:...@ep-shiny-paper-a61txol3.us-west-2.aws.neon.tech/neondb`)
- **API**: REST API sa CORS podrške
- **Port**: 3000 (production) ili dynamics kroz Replit

**API Endpoints**:
- `POST /api/auth/login` - Prijava
- `POST /api/auth/register` - Registracija
- `GET /api/customers` - Lista klijenata
- `POST /api/customers` - Kreiranje klijenta
- `GET /api/customers/:id` - Detalji klijenta
- `PUT /api/customers/:id` - Ažuriranje klijenta
- `GET /api/services` - Lista servisa
- `POST /api/services` - Kreiranje servisa
- `PUT /api/services/:id` - Ažuriranje servisa
- `GET /health` - Health check

### Data Management

**Strategija**: Lokalni-prvo sa AsyncStorage persistencijom (frontend) -> Backend API (production)
- Svi CRUD operacije menadžovani kroz DataContext
- Uzorak podataka za demonstraciju
- Optimistički UI updates sa async persistencijom
- Veze podataka održavane kroz ID-jeve (kupicc -> uređaji -> servisi)

**Modeli podataka**:
- **Kupicc**: Kontakt informacije, adresa, beleške, `createdByUserId`
- **Uređaj**: Tip, marka, model, serijski broj, povezan sa kupcem
- **Servis**: Status, prioritet, opis, dijagnoza, rešenje, fotografije, `createdByUserId`
- **Održavanje**: Evidencije planiranog održavanja
- **Korisnik**: Autentifikacija, profil, uloga

**Role-Based Access**:
- **Business Partners** vide samo svoje klijente i servise koje su kreirali
- Filtrirani prikazi na `ServicesScreen` i `CustomersScreen`
- `createdByUserId` praćenje za sve entitete

### Device Capabilities

**Kamera & Upravljanje Fotografijama**:
- QR kod skeniranje za serijske brojeve uređaja (samo native)
- Hvatanje fotografija i odabir iz galerije preko expo-image-picker
- Više fotografija po zapisu o servisu
- Fallback UI za web platformu

**Push Notifikacije**:
- Expo Notifications konfiguriran za ažuriranja statusa servisa
- Rukovanje dozvolama za iOS i Android
- Prilagođeni kanali notifikacija na Android-u
- Obavještenja promjene statusa servisa

**Email Integracija**:
- Expo Mail Composer za slanje ažuriranja statusa
- Detekcija dostupnosti emaila
- Oblikovani izvještaji o servisu

### OAuth Social Login

**Dostupni Provajderi**:
- ✅ Google
- ✅ Facebook
- ✅ GitHub
- ✅ X (Twitter)
- ✅ Instagram

**Implementacija**:
- `utils/oauth.ts` sa svim OAuth logikom
- Automatska korisnička kreira iz social profila
- Sigurni tokeni rukovanja kroz Replit environment vars
- Smooth fallback na demo naloge ako OAuth nije konfiguriran

**Environment Variables** (za production setup):
- EXPO_PUBLIC_GOOGLE_CLIENT_ID
- EXPO_PUBLIC_FACEBOOK_APP_ID
- EXPO_PUBLIC_GITHUB_CLIENT_ID
- EXPO_PUBLIC_X_CLIENT_ID
- EXPO_PUBLIC_INSTAGRAM_APP_ID
- EXPO_PUBLIC_REDIRECT_URL
- DATABASE_URL (za backend API)

### Multi-Platform Support

**Podrška za sve platforme**:
- iOS: Transparentni zaglavlje sa blur efektima
- Android: Edge-to-edge raspored, adaptacije material dizajna
- Web: Fallback komponente za native-only funkcije

**Kod razdvajanja**:
- Platform-specific fajlovi (`.native.tsx` za CameraScanner)
- Uslovna renderiranja bazirana na Platform.OS
- Web-specific prilagođavanja

### Build & Deployment

**Razvoj**:
- Replit-optimizovani dev server sa proxy konfiguracijom
- Expo Go za mobilno testiranje
- Web dev server za browser testiranje

**Build Sistem**:
- Custom build skript (`scripts/build.js`) za static hosting
- QR kod generisanje za Expo Go pristup
- Landing page template za web deployment

**Production Deployment**:
- App Store: Trebam Apple Developer credentials
- Google Play Store: Trebam Google Play Console credentials
- Backend API: Pokreće se na Replit-u na portu 3000
- Database: Neon PostgreSQL sa CONNECTION_URL

## External Dependencies

### Core Framework
- **Expo SDK 54**: Cross-platform app framework
- **React 19.1**: UI library
- **React Native 0.81.5**: Mobile app framework

### Navigation & Layout
- **React Navigation v7**: Tab i stack navigatori
- **React Native Safe Area Context**: Inset rukovanje
- **Expo Blur**: iOS blur efekti

### Authentication & Social Login
- **expo-auth-session**: OAuth2 implementacija
- **expo-web-browser**: Web browser integracija za OAuth flow

### UI & Interactions
- **React Native Reanimated**: Animacije
- **React Native Gesture Handler**: Gesture recognition
- **React Native Keyboard Controller**: Keyboard rukovanje
- **Expo Vector Icons**: Feather icon set

### Device Features
- **Expo Camera**: Camera pristup i QR scanning
- **Expo Barcode Scanner**: QR kod detekcija
- **Expo Image Picker**: Photo gallery i camera pristup
- **Expo Notifications**: Push notifikacije
- **Expo Mail Composer**: Email kompoter
- **Expo Haptics**: Taktilna povratna informacija

### Storage & Data
- **AsyncStorage**: Lokalno key-value skladištenje (frontend)
- **Expo File System**: File menadžment
- **PostgreSQL (Neon)**: Cloud database

### Backend Dependencies
- **Express**: Web framework
- **pg**: PostgreSQL driver
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Development Tools
- **TypeScript**: Type sigurnost
- **ESLint**: Code quality
- **Prettier**: Code formatiranje
- **Babel Module Resolver**: Path aliasing

## Recent Changes (November 25, 2025)

### Backend API Setup
- Kreiram Node.js Express backend sa pg (PostgreSQL driver)
- Konfigurisan DATABASE_URL environment varijabla za Neon DB
- REST API endpoints za authentication i CRUD operacije
- Server.js file sa svim potrebnim endpointima

### Role-Based Access Control
- Implementirani 4 uloge: admin, technician, business_partner, supplier
- Business partneri vide samo svoje klijente i servise
- Role-based filtering u ServicesScreen i CustomersScreen
- CreatedByUserId praćenje

### Social Login Integration
- Dodana integracijska za Google, Facebook, GitHub, X, Instagram
- OAuth utility sa svim logikom
- LoginScreen sa vizuelnim dugmičima za social prijave
- AuthContext proširenja sa loginWithOAuth metodom
- Environment variables za OAuth kredencijale

## Future Integrations

- Mobile app API integration sa backend-om
- Real-time baza podataka za live updates
- Cloud storage za fotografije
- Analytics servis

## Deployment

### Production Steps
1. **Apple App Store**: Trebam Apple Developer naloga + podaci
2. **Google Play Store**: Trebam Google Play Console naloga
3. **Backend**: Express API pokrenut na Replit-u
4. **Database**: Neon PostgreSQL konekcija aktivna
