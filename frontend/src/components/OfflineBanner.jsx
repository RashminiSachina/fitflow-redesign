import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function OfflineBanner({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="text" accessibilityLabel="Offline mode">
      <Text style={styles.text}>Offline mode — using saved data on this device.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEF3C7',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  text: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '600',
  },
});
