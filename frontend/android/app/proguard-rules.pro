# Add project specific ProGuard rules here.

# React Native / Hermes
-keep,includedescriptorclasses class com.facebook.react.** { *; }
-keep,includedescriptorclasses class com.facebook.hermes.** { *; }
-keep,includedescriptorclasses class com.facebook.jni.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.runtime.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

# App
-keep class com.fitflow.redesign.** { *; }

# Navigation / screens / gesture handler / image picker / async storage
-keep class com.swmansion.** { *; }
-keep class com.th3rdwave.safeareacontext.** { *; }
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-keep class com.imagepicker.** { *; }
-dontwarn com.swmansion.**
