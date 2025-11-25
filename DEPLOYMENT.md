# FST Servis - Deployment Guide

## Production Deployment Status: ✅ READY

### Backend API (Replit)
- **Runtime**: Node.js 20
- **Server**: Express.js on port 3000
- **Database**: Neon PostgreSQL
- **Deploy Command**: `node server.js`
- **Environment Variables**: DATABASE_URL

### Frontend Mobile App
- **Platform**: iOS (App Store) & Android (Google Play)
- **Build Tool**: EAS Build
- **Package Name**: me.tehnikamn.fstservis
- **Bundle ID (iOS)**: me.tehnikamn.fstservis
- **Google Play Store ID**: 6269989039294200130

---

## Android Build & Play Store Submission

### Requirements
1. Google Play Console Account with app created
2. Signed keystore for Android releases
3. Credentials in Google Play Console

### Commands
```bash
# Create production Android build
eas build --platform android --auto-submit

# Or manual build
eas build --platform android

# Upload to Google Play
eas submit --platform android --path /path/to/app.aab
```

### Build Config (eas.json)
- Build Type: AAB (Android App Bundle)
- Track: Production
- Package: me.tehnikamn.fstservis

---

## iOS Build & App Store Submission

### Requirements
1. Apple Developer Account
2. Apple Team ID
3. Certificate signing credentials

### Commands
```bash
# Create production iOS build
eas build --platform ios --auto-submit

# Or manual build
eas build --platform ios

# Upload to App Store Connect
eas submit --platform ios
```

### Build Config (eas.json)
- Build Type: Archive
- Auto-signing enabled
- Bundle ID: me.tehnikamn.fstservis

---

## Backend Deployment (Replit)

### Setup
1. Push code to Replit (already configured)
2. Set environment variables:
   ```
   DATABASE_URL=postgresql://...
   NODE_ENV=production
   ```

### Start Backend
```bash
node server.js
```

Server runs on port 3000 by default

### API Endpoints
- `POST /api/auth/login` - User login
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/services` - List services
- `POST /api/services` - Create service
- `GET /health` - Health check

---

## Database

### Neon PostgreSQL
- **Connection**: postgresql://neondb_owner:...@ep-shiny-paper-a61txol3.us-west-2.aws.neon.tech/neondb
- **Tables**: users, customers, devices, services, maintenances
- **Status**: Connected ✅

---

## Deployment Checklist

- [x] Backend API ready
- [x] Frontend app built
- [x] Environment variables set
- [x] NEON database connected
- [x] EAS build configured
- [ ] Apple Developer credentials added
- [ ] Google Play credentials added
- [ ] iOS build submitted
- [ ] Android build submitted

---

## Next Steps for Production

1. Add Apple Developer credentials to EAS
2. Add Google Play credentials to EAS
3. Run EAS build for both platforms
4. Submit builds to app stores
5. Monitor app store submissions

---

## Support

For issues or updates, check:
- replit.md - Project architecture
- app.json - App configuration
- eas.json - Build configuration
- server.js - Backend API
