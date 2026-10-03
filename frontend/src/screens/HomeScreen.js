import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Card from '../components/Card';
import ErrorBanner from '../components/ErrorBanner';
import LoadingView from '../components/LoadingView';
import OfflineBanner from '../components/OfflineBanner';
import ProgressBar from '../components/ProgressBar';
import Screen from '../components/Screen';
import { fetchRecommendation } from '../api/workouts';
import { useAuth } from '../context/AuthContext';
import { getJson, keys, setJson } from '../services/storage';
import { recommendLocal } from '../services/workoutEngine';
import { colors, minTouch, radius, spacing, typography } from '../theme';

const WEEKLY_GOAL = 3;
const MINUTES_OPTIONS = [15, 20, 25, 30, 40];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, setOffline } = useAuth();
  const [plan, setPlan] = useState(null);
  const [progress, setProgress] = useState({ workouts: 0, calories: 0, streak: 0 });
  const [minutes, setMinutes] = useState(25);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offline, setLocalOffline] = useState(false);
  const [adjusting, setAdjusting] = useState(false);

  const goal = user?.goal || 'stay_active';
  const greeting = greetingForNow(user?.name || 'there');
  const goalHit = progress.workouts >= WEEKLY_GOAL;

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const savedProgress = (await getJson(keys.progress)) || { workouts: 0, calories: 0, streak: 0 };
    setProgress(savedProgress);

    try {
      const data = await fetchRecommendation(goal, minutes);
      setPlan(data);
      await setJson(keys.recommendation, data);
      setLocalOffline(false);
      setOffline(false);
    } catch (err) {
      const cached = (await getJson(keys.recommendation)) || recommendLocal({ goal, minutes });
      setPlan(cached);
      setLocalOffline(true);
      setOffline(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [goal, minutes, setOffline]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <Screen>
      <Text style={typography.title}>{greeting}</Text>
      <Text style={[typography.caption, styles.lede]}>Your Daily Flow is ready when you are.</Text>
      <OfflineBanner visible={offline} />
      <ErrorBanner message={error && !offline ? error : ''} />

      {loading ? <LoadingView label="Building today's plan" /> : null}

      {plan && !loading ? (
        <Card style={styles.hero}>
          <Text style={styles.kicker}>AI Daily Flow</Text>
          <Text style={typography.heading}>{plan.name}</Text>
          <Text style={typography.caption}>
            {plan.durationMinutes} min · {plan.intensity} · ~{plan.calories} kcal
          </Text>
          <Text style={[typography.body, styles.why]}>Why this plan? {plan.explanation}</Text>
          <View style={styles.row}>
            <Button
              label="Start"
              onPress={() => navigation.navigate('Workouts', { screen: 'WorkoutSession', params: { workout: plan } })}
              accessibilityLabel="Start daily flow workout"
              style={styles.flex}
            />
            <Button
              variant="ghost"
              label="Adjust"
              onPress={() => setAdjusting((value) => !value)}
              accessibilityLabel="Adjust daily flow suggestion"
              style={styles.flex}
            />
          </View>
          {adjusting ? (
            <View style={styles.adjust}>
              <Text style={typography.label}>Available minutes</Text>
              <View style={styles.chips}>
                {MINUTES_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setMinutes(option)}
                    accessibilityRole="button"
                    accessibilityLabel={`${option} minutes`}
                    style={[styles.chip, minutes === option && styles.chipOn]}
                  >
                    <Text style={[styles.chipText, minutes === option && styles.chipTextOn]}>{option} min</Text>
                  </Pressable>
                ))}
              </View>
              <Button label="Update plan" onPress={load} accessibilityLabel="Update recommended plan" />
            </View>
          ) : null}
        </Card>
      ) : null}

      <Card>
        <Text style={typography.heading}>This week</Text>
        <Text style={typography.caption}>
          {progress.workouts} of {WEEKLY_GOAL} workouts · {progress.calories} kcal · {progress.streak}-day streak
        </Text>
        <View style={styles.barWrap}>
          <ProgressBar
            value={progress.workouts / WEEKLY_GOAL}
            accessibilityLabel="Weekly workout goal progress"
          />
        </View>
        {goalHit ? (
          <View style={styles.celebrate} accessibilityLabel="Weekly goal reached">
            <Text style={styles.celebrateText}>You hit this week's workout goal. Keep the streak going.</Text>
          </View>
        ) : null}
      </Card>
    </Screen>
  );
}

function greetingForNow(name) {
  const hour = new Date().getHours();
  if (hour < 12) {
    return `Good morning, ${name}`;
  }
  if (hour < 17) {
    return `Good afternoon, ${name}`;
  }
  return `Good evening, ${name}`;
}

const styles = StyleSheet.create({
  lede: {
    marginBottom: spacing.md,
  },
  hero: {
    marginBottom: spacing.md,
    borderColor: colors.primary,
  },
  kicker: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  why: {
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
  adjust: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    minHeight: minTouch,
    minWidth: minTouch,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextOn: {
    color: '#FFFFFF',
  },
  barWrap: {
    marginTop: spacing.md,
  },
  celebrate: {
    marginTop: spacing.md,
    backgroundColor: '#D1FAE5',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  celebrateText: {
    color: colors.accentDark,
    fontSize: 14,
    fontWeight: '700',
  },
});
