import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../components/Button';
import Card from '../components/Card';
import Screen from '../components/Screen';
import { getJson, keys, setJson } from '../services/storage';
import { colors, spacing, typography } from '../theme';

export default function WorkoutSessionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const workout = route.params?.workout;
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const timer = useRef(null);

  useEffect(() => {
    if (running) {
      timer.current = setInterval(() => setSeconds((value) => value + 1), 1000);
    }
    return () => clearInterval(timer.current);
  }, [running]);

  if (!workout) {
    return (
      <Screen>
        <Text style={typography.heading}>No workout selected</Text>
        <Button label="Back" onPress={() => navigation.goBack()} accessibilityLabel="Go back" />
      </Screen>
    );
  }

  async function finish() {
    setRunning(false);
    const progress = (await getJson(keys.progress)) || { workouts: 0, calories: 0, streak: 0 };
    const next = {
      workouts: progress.workouts + 1,
      calories: progress.calories + Number(workout.calories || 120),
      streak: progress.streak + 1,
    };
    await setJson(keys.progress, next);
    navigation.goBack();
  }

  const clock = formatClock(seconds);

  return (
    <Screen>
      <Text style={typography.title}>{workout.name}</Text>
      <Text style={[typography.caption, styles.lede]}>{workout.intensity} · stay with the timer until you tap Finish.</Text>

      <Card style={styles.timerCard}>
        <Text style={styles.timer} accessibilityLabel={`Elapsed time ${clock}`}>
          {clock}
        </Text>
        <View style={styles.row}>
          <Button
            variant="ghost"
            label={running ? 'Pause' : 'Resume'}
            onPress={() => setRunning((value) => !value)}
            accessibilityLabel={running ? 'Pause timer' : 'Resume timer'}
            style={styles.flex}
          />
          <Button label="Finish" onPress={finish} accessibilityLabel="Finish workout" style={styles.flex} />
        </View>
      </Card>

      {(workout.exercises || []).map((item, index) => (
        <Card key={`${item.name}-${index}`} style={styles.item}>
          <Text style={typography.label}>
            {index + 1}. {item.name}
          </Text>
          <Text style={typography.caption}>
            {item.sets} × {item.reps} {item.unit || 'reps'}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

function formatClock(total) {
  const mins = Math.floor(total / 60)
    .toString()
    .padStart(2, '0');
  const secs = (total % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

const styles = StyleSheet.create({
  lede: { marginBottom: spacing.md },
  timerCard: { marginBottom: spacing.md, alignItems: 'center' },
  timer: { fontSize: 48, fontWeight: '700', color: colors.primary, marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm, width: '100%' },
  flex: { flex: 1 },
  item: { marginBottom: spacing.sm },
});
