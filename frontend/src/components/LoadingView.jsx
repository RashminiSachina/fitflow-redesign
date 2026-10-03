import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function LoadingView({ label = 'Loading' }) {
  return (
    <View style={styles.wrap} accessibilityLabel={label} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[typography.caption, styles.label]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
  },
});
