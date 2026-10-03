# FitFlow keystore management

This file describes how the Android upload key should be stored for the IT3060 lab and any later Play Console upload. It does not contain passwords.

## What the keystore is for

`fitflow-release.jks` (or `.keystore`) is the **upload key**. Gradle uses it to sign the AAB/APK you upload. Google Play App Signing then re-signs the artifact that users download with Google’s **app signing key**.

If you only distribute an APK for campus internal testing (no Play Console), this same file is the signing key testers install. Losing it means you cannot ship an update that Android will treat as the same app unless you also control Play App Signing.

## Never commit these files

Keep all of the following out of Git (already listed in `.gitignore`):

- `*.jks`, `*.keystore` (except the public RN `debug.keystore`)
- `frontend/android/keystore.properties`
- Any password list, screenshot of passwords, or chat paste of the keystore

Commit only `frontend/android/keystore.properties.example`.

## Who holds it (lab recommendation)

- **Primary holder:** the student submitting the lab (you).
- **Backup holder:** one teammate or the module supervisor, on a separate encrypted copy.
- Do not email the keystore and passwords in the same message.

## Secure storage

1. Generate the keystore on your machine (see `build-notes.md`).
2. Copy `fitflow-release.jks` to an encrypted USB drive or a password manager file vault.
3. Store `storePassword`, `keyAlias`, and `keyPassword` in a password manager, not in the same folder as a plaintext `.txt`.
4. Keep a printed recovery sheet in a locked place if the lab requires a supervisor backup.

## Play App Signing

When you create the Play Console app:

1. Upload a signed AAB (`bundleRelease`).
2. Let Google manage the app signing key (default).
3. Keep your upload key safe. If the upload key is lost, Play Console can reset it because Google holds the app signing key.
4. If you never enrolled in Play App Signing and you lose the keystore, you cannot update that package name. You would need a new `applicationId`.

## If the keystore is lost

| Situation | What to do |
| --- | --- |
| Play App Signing is on | Request an upload-key reset in Play Console. |
| Sideload / lab APK only | Generate a new keystore. Testers must uninstall the old app first; signatures will not match. |
| File exists, password forgotten | There is no recovery. Generate a new keystore and treat it as a new signing identity. |

## Rotation

Do not rotate the upload key unless Play Console walks you through it. Changing `keyAlias` or generating a new JKS without a Play reset will fail updates.
