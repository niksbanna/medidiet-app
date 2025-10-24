# Build Instructions for MediDiet AI

This guide will help you build the MediDiet AI app for Android and iOS platforms.

## Prerequisites

✅ **Already Completed:**
- EAS CLI is installed globally
- `eas.json` configuration file is created
- `app.json` is updated with build configurations

## Required Before Building

### 1. Create/Login to Expo Account

You need an Expo account to build the app. Choose one option:

**Option A: Create a new account**
```bash
eas register
```

**Option B: Login to existing account**
```bash
eas login
```

### 2. Configure Your Project (First Time Only)

```bash
eas build:configure
```

This will link your project to your Expo account.

---

## Building for Android

### Option 1: Build APK (Recommended for Testing)

The APK can be installed directly on Android devices without going through Google Play Store.

```bash
eas build --platform android --profile production
```

**What happens:**
- Creates a production-ready APK
- Build takes approximately 10-20 minutes
- You'll get a download link when the build completes
- File size: ~50-80 MB

**To install on device:**
1. Download the APK from the provided link
2. Transfer to your Android device
3. Enable "Install from Unknown Sources" in Settings
4. Tap the APK file to install

### Option 2: Build AAB (For Google Play Store)

To publish on Google Play Store, you need an AAB (Android App Bundle):

```bash
eas build --platform android --profile production
```

Then update `eas.json` to use AAB:
```json
"production": {
  "android": {
    "buildType": "app-bundle"
  }
}
```

---

## Building for iOS

### Requirements for iOS Builds

- **Apple Developer Account** ($99/year)
- **Apple Developer Program membership**
- You'll be prompted to provide:
  - Bundle Identifier (already set: `com.medidiet.app`)
  - Apple ID
  - App-specific password

### Build iOS App

```bash
eas build --platform ios --profile production
```

**What happens:**
- EAS handles code signing automatically
- Creates an IPA file
- Build takes approximately 15-25 minutes
- You'll get a download link when complete

**Distribution Options:**

**A. Internal Testing (TestFlight)**
```bash
eas submit --platform ios
```

**B. Direct Installation (Ad-Hoc)**
- Download the IPA file
- Use tools like Xcode or Configurator to install

---

## Build Both Platforms Simultaneously

```bash
eas build --platform all --profile production
```

---

## Build Profiles Explained

The `eas.json` file contains three build profiles:

### 1. **development** (Internal testing with development client)
```bash
eas build --platform android --profile development
eas build --platform ios --profile development
```

### 2. **preview** (Internal testing/preview)
```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```
- Android: Creates APK
- iOS: Creates IPA for internal distribution

### 3. **production** (Production release)
```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```
- Android: Creates APK (or AAB if configured)
- iOS: Creates production IPA

---

## Monitoring Your Builds

### Check Build Status

```bash
eas build:list
```

### View Build Details

```bash
eas build:view [BUILD_ID]
```

### Cancel a Build

```bash
eas build:cancel [BUILD_ID]
```

---

## Local Builds (Alternative)

If you prefer to build locally instead of using EAS cloud:

### Android Local Build
```bash
eas build --platform android --profile production --local
```

**Requirements:**
- Android SDK installed
- Java JDK 17+
- Environment variables configured

### iOS Local Build
```bash
eas build --platform ios --profile production --local
```

**Requirements:**
- macOS only
- Xcode installed
- CocoaPods installed

---

## Troubleshooting

### Build Failed?

1. **Check build logs:**
   ```bash
   eas build:view [BUILD_ID]
   ```

2. **Common issues:**
   - Missing environment variables
   - Incorrect bundle identifier
   - Certificate/provisioning issues (iOS)
   - Asset/image errors

3. **Clear cache and retry:**
   ```bash
   eas build --platform android --profile production --clear-cache
   ```

### Login Issues?

```bash
eas logout
eas login
```

### Certificate Issues (iOS)?

```bash
eas credentials
```

This opens the credentials manager to fix signing issues.

---

## Quick Start Guide

**First Time Setup:**
```bash
# 1. Login to Expo
eas login

# 2. Configure project
eas build:configure

# 3. Build Android APK
eas build --platform android --profile production

# 4. Build iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

---

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Submit to App Stores](https://docs.expo.dev/submit/introduction/)
- [Managing Credentials](https://docs.expo.dev/app-signing/managed-credentials/)
- [Troubleshooting Builds](https://docs.expo.dev/build-reference/troubleshooting/)

---

## Build Output

After successful builds, you'll receive:

**Android (APK):**
- File: `medidiet-app-{version}.apk`
- Size: ~50-80 MB
- Direct download link from EAS

**iOS (IPA):**
- File: `medidiet-app-{version}.ipa`
- Size: ~60-100 MB
- Direct download link from EAS

---

## Next Steps After Building

1. **Test the build** on real devices
2. **Submit to stores:**
   - Google Play Store: `eas submit --platform android`
   - Apple App Store: `eas submit --platform ios`
3. **Monitor crash reports** and user feedback
4. **Plan updates** and new releases

---

## Support

If you encounter any issues:
- Check EAS build logs
- Visit [Expo Forums](https://forums.expo.dev/)
- Check [GitHub Issues](https://github.com/niksbanna/medidiet-app/issues)

---

**Happy Building! 🚀**
