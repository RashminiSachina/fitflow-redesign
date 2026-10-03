# FitFlow Android release build notes

App: **FitFlow**  
`applicationId`: `com.fitflow.redesign`  
Version lives at the top of `frontend/android/app/build.gradle`:

```
def appVersionCode = 1
def appVersionName = "1.0.0"
```

Bump **both** before every store or lab upload. `versionCode` must increase. `versionName` is the human-readable label.

Hermes is enabled (`frontend/android/gradle.properties` → `hermesEnabled=true`). Release builds use R8 minify + resource shrinking.

## 0. One-time machine setup

You need:

- JDK 17 (Android Studio’s JBR is fine)
- Android SDK + platform tools
- An emulator **or** a USB-debuggable device
- Node 22+ for Metro / `npm`

On Windows, run Gradle from `frontend\android` in PowerShell.

## 1. Generate a release keystore (placeholders only)

From `frontend/android` (create the file **next to** `keystore.properties`, not inside `app/` unless you change `storeFile`):

```bat
keytool -genkeypair -v -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 ^
  -keystore fitflow-release.jks ^
  -alias fitflow ^
  -storepass YOUR_STORE_PASSWORD ^
  -keypass YOUR_KEY_PASSWORD ^
  -dname "CN=FitFlow Lab, OU=IT3060, O=Campus, L=City, ST=State, C=LK"
```

Copy the example properties file and fill in real values locally:

```bat
copy keystore.properties.example keystore.properties
```

`keystore.properties` must contain:

```
storeFile=fitflow-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=fitflow
keyPassword=YOUR_KEY_PASSWORD
```

`storeFile` is resolved from `frontend/android/` (`rootProject.file(...)`).

If `keystore.properties` is missing, **debug still builds**. Release falls back to the debug keystore and Gradle prints a warning. Do not upload a debug-signed artifact to Play.

## 2. Backend for a live demo (optional)

Release APKs on a **physical phone** cannot use `http://10.0.2.2:5000` (that host is the emulator’s loopback to your PC). Change `frontend/src/config.js` → `apiBaseUrl` to your machine’s LAN IP (for example `http://192.168.1.20:5000`) and keep the phone on the same Wi-Fi. The app still works offline without the API.

```bat
cd backend
copy .env.example .env
npm install
npm start
```

Health check: `http://localhost:5000/api/health`

## 3. Install JS deps and start Metro (debug)

```bat
cd frontend
npm install
npm start
```

In a second terminal:

```bat
cd frontend
npm run android
```

You should see the FitFlow login screen. Register or log in with any campus-style email and a password of 6+ characters.

## 4. Release AAB (Play Console / internal testing)

```bat
cd frontend\android
gradlew.bat bundleRelease
```

Output:

`frontend\android\app\build\outputs\bundle\release\app-release.aab`

## 5. Release APK (sideload / lab device)

```bat
cd frontend\android
gradlew.bat assembleRelease
```

Output:

`frontend\android\app\build\outputs\apk\release\app-release.apk`

## 6. Verify signing

Replace paths if your SDK location differs.

```bat
jarsigner -verify -verbose -certs frontend\android\app\build\outputs\apk\release\app-release.apk
```

```bat
"%ANDROID_HOME%\build-tools\35.0.0\apksigner" verify --print-certs frontend\android\app\build\outputs\apk\release\app-release.apk
```

If `ANDROID_HOME` is unset, use Android Studio’s SDK path, typically:

`%LOCALAPPDATA%\Android\Sdk\build-tools\<version>\apksigner.bat`

For AAB size / device APKs, install [bundletool](https://developer.android.com/tools/bundletool) and run:

```bat
java -jar bundletool.jar build-apks --bundle=frontend\android\app\build\outputs\bundle\release\app-release.aab --output=fitflow.apks --mode=universal
```

Inspect the generated `.apks` (zip) size before upload.

## 7. Install on emulator or device

Emulator (debug is easier):

```bat
cd frontend
npm run android
```

Release APK on a device with USB debugging:

```bat
adb install -r frontend\android\app\build\outputs\apk\release\app-release.apk
```

Uninstall first if the existing install was signed with a different key:

```bat
adb uninstall com.fitflow.redesign
```

## 8. Store listing assets

Drop lab screenshots and the feature graphic into:

- `release/store-assets/screenshots/phone`
- `release/store-assets/screenshots/tablet`
- `release/store-assets/feature-graphic`
- `release/store-assets/icons`
- `release/store-assets/promo`

Internal test notes can go in `testing/`.
