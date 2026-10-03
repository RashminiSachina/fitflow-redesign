import React, { useCallback, useState } from 'react';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import { config, GOALS } from '../config';
import { useAuth } from '../context/AuthContext';
import { getJson, keys, setJson } from '../services/storage';
import { colors, minTouch, radius, spacing, typography } from '../theme';

const DEFAULT_SETTINGS = {
  shareActivity: false,
  allowAi: true,
};

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const saved = (await getJson(keys.settings)) || DEFAULT_SETTINGS;
        setSettings(saved);
      })();
    }, []),
  );

  async function changeGoal(goal) {
    await updateUser({ goal });
  }

  async function toggle(key) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await setJson(keys.settings, next);
  }

  async function openPrivacy() {
    const supported = await Linking.canOpenURL(config.privacyPolicyUrl);
    if (supported) {
      await Linking.openURL(config.privacyPolicyUrl);
    }
  }

  return (
    <Screen>
      <Text style={typography.title}>Profile</Text>
      <Card style={styles.block}>
        <Text style={typography.heading}>{user?.name || 'FitFlow user'}</Text>
        <Text style={typography.caption}>{user?.email}</Text>
        <Text style={[typography.caption, styles.version]}>App version {config.appVersion}</Text>
      </Card>

      <Text style={typography.heading}>Fitness goal</Text>
      <View style={styles.chips}>
        {GOALS.map((goal) => (
          <Pressable
            key={goal.id}
            onPress={() => changeGoal(goal.id)}
            accessibilityRole="button"
            accessibilityLabel={`Set goal ${goal.label}`}
            style={[styles.chip, user?.goal === goal.id && styles.chipOn]}
          >
            <Text style={[styles.chipText, user?.goal === goal.id && styles.chipTextOn]}>{goal.label}</Text>
          </Pressable>
        ))}
      </View>

      <Card style={styles.block}>
        <ToggleRow
          label="Share activity with circles"
          value={settings.shareActivity}
          onValueChange={() => toggle('shareActivity')}
          accessibilityLabel="Share activity with circles"
        />
        <ToggleRow
          label="Allow AI personalization"
          value={settings.allowAi}
          onValueChange={() => toggle('allowAi')}
          accessibilityLabel="Allow AI personalization"
        />
        <Pressable
          onPress={openPrivacy}
          accessibilityRole="link"
          accessibilityLabel="Open privacy policy"
          style={styles.linkRow}
        >
          <Text style={styles.link}>Privacy Policy</Text>
        </Pressable>
      </Card>

      <Button label="Log out" variant="danger" onPress={logout} accessibilityLabel="Log out" />
    </Screen>
  );
}

function ToggleRow({ label, value, onValueChange, accessibilityLabel }) {
  return (
    <View style={styles.toggle}>
      <Text style={typography.body}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={accessibilityLabel}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginVertical: spacing.md },
  version: { marginTop: spacing.sm },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    minHeight: minTouch,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  chipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { color: colors.text, fontWeight: '600', fontSize: 14 },
  chipTextOn: { color: '#FFFFFF' },
  toggle: {
    minHeight: minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  linkRow: {
    minHeight: minTouch,
    justifyContent: 'center',
  },
  link: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
