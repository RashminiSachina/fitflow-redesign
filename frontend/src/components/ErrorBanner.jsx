import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function ErrorBanner({ message }) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLabel={message}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEE2E2',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  text: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
  },
});
