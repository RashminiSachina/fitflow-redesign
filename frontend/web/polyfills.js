// Polyfills for React Native modules on web
import { Text, View, ScrollView, StyleSheet, Platform } from 'react-native';
import React from 'react';

// Polyfill for react-native-safe-area-context
export const SafeAreaProvider = ({ children }) => <>{children}</>;
export const SafeAreaView = View;
export const useSafeAreaInsets = () => ({ top: 0, right: 0, bottom: 0, left: 0 });
export const SafeAreaInsetsContext = React.createContext({ top: 0, right: 0, bottom: 0, left: 0 });
export const initialWindowMetrics = { frame: { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }, insets: { top: 0, right: 0, bottom: 0, left: 0 } };

// Polyfill for react-native-screens
export const Screen = View;
export const ScreenContainer = View;
export const useScreens = () => {};

// Polyfill for react-native-gesture-handler
export const GestureHandlerRootView = View;
export const GestureDetector = View;
export const Gesture = {
  Tap: () => ({}),
  Pan: () => ({}),
  Pinch: () => ({}),
  Rotation: () => ({}),
};

// Polyfill for react-native-reanimated
export const Animated = {
  View,
  Text,
  ScrollView,
  Image: 'img',
  createAnimatedComponent: (Component) => Component,
  timing: (value, config) => ({ start: () => {} }),
  spring: (value, config) => ({ start: () => {} }),
  decay: (value, config) => ({ start: () => {} }),
  sequence: (animations) => ({ start: () => {} }),
  parallel: (animations) => ({ start: () => {} }),
  delay: (time) => ({ start: () => {} }),
  event: (handlerName, config) => ({}),
  Value: class {
    constructor(value) { this._value = value; }
    setValue(value) { this._value = value; }
    getValue() { return this._value; }
  },
};

export const useAnimatedStyle = (style) => style;
export const useSharedValue = (value) => ({ value, getValue: () => value });
export const withTiming = (value, config) => value;
export const withSpring = (value, config) => value;
export const withDecay = (velocity, config) => velocity;
export const useDerivedValue = (callback, deps) => ({ getValue: () => callback() });
export const useAnimatedScrollHandler = (handler) => handler;

// Polyfill for react-native-image-picker
export const launchCamera = () => Promise.reject(new Error('Camera not available on web'));
export const launchImageLibrary = () => Promise.reject(new Error('Image picker not available on web'));
export default {
  launchCamera,
  launchImageLibrary,
};

console.log('React Native Web polyfills loaded');
