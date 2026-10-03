import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import ErrorBanner from '../components/ErrorBanner';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { colors, minTouch, radius, spacing, typography } from '../theme';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name || email.split('@')[0], 'stay_active');
      }
    } catch (err) {
      setError(err.message || 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={typography.title}>FitFlow</Text>
      <Text style={[typography.caption, styles.subtitle]}>
        Daily workouts, nutrition logging, and private campus circles.
      </Text>
      <ErrorBanner message={error} />

      {mode === 'register' ? (
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          accessibilityLabel="Name"
        />
      ) : null}

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Campus email"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        accessibilityLabel="Email"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password (6+ characters)"
        placeholderTextColor={colors.textMuted}
        secureTextEntry
        style={styles.input}
        accessibilityLabel="Password"
      />

      <Button
        label={mode === 'login' ? 'Log in' : 'Create account'}
        onPress={submit}
        loading={loading}
        accessibilityLabel={mode === 'login' ? 'Log in' : 'Create account'}
      />
      <View style={styles.switchRow}>
        <Button
          variant="ghost"
          label={mode === 'login' ? 'Need an account? Register' : 'Have an account? Log in'}
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          accessibilityLabel={mode === 'login' ? 'Switch to register' : 'Switch to login'}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  input: {
    minHeight: minTouch,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  switchRow: {
    marginTop: spacing.md,
  },
});
