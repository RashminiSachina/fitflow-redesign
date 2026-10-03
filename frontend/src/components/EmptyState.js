import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';
import Button from './Button';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <View style={styles.wrap} accessibilityRole="text" accessibilityLabel={title}>
      <Text style={typography.heading}>{title}</Text>
      <Text style={[typography.caption, styles.message]}>{message}</Text>
      {actionLabel ? <Button label={actionLabel} onPress={onAction} accessibilityLabel={actionLabel} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  message: {
    color: colors.textMuted,
  },
});
