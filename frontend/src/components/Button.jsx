import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, minTouch, radius, spacing } from '../theme';

export default function Button({
  label,
  onPress,
  accessibilityLabel,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) {
  const palette = {
    primary: { bg: colors.primary, fg: '#FFFFFF' },
    accent: { bg: colors.accent, fg: '#FFFFFF' },
    ghost: { bg: 'transparent', fg: colors.primary },
    danger: { bg: colors.error, fg: '#FFFFFF' },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: palette.bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === 'ghost' && styles.ghost,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouch,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  ghost: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
