import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

export default function ProgressBar({ value, accessibilityLabel }) {
  const clamped = Math.max(0, Math.min(1, Number(value) || 0));
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel || 'Progress'}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
});
