import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import LoadingView from '../components/LoadingView';
import OfflineBanner from '../components/OfflineBanner';
import Screen from '../components/Screen';
import { fetchWorkouts, saveWorkoutRemote } from '../api/workouts';
import { getJson, keys, setJson } from '../services/storage';
import { LIBRARY_EXERCISES } from '../services/workoutEngine';
import { colors, minTouch, radius, spacing, typography } from '../theme';

function newId() {
  return `ex-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default function WorkoutsScreen() {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState([]);
  const [draftName, setDraftName] = useState('Campus strength');
  const [draft, setDraft] = useState(
    LIBRARY_EXERCISES.slice(0, 3).map((item) => ({ ...item, id: newId() })),
  );
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');

  const persist = useCallback(async (next) => {
    setWorkouts(next);
    await setJson(keys.workouts, next);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const local = (await getJson(keys.workouts)) || [];
    setWorkouts(local);
    try {
      const data = await fetchWorkouts();
      const merged = mergeWorkouts(local, data.workouts || []);
      await persist(merged);
      setOffline(false);
    } catch (err) {
      setOffline(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  function addExercise(item) {
    setDraft((current) => [...current, { ...item, id: newId() }]);
  }

  function removeExercise(id) {
    setDraft((current) => current.filter((item) => item.id !== id));
  }

  function move(id, dir) {
    setDraft((current) => {
      const index = current.findIndex((item) => item.id === id);
      const next = [...current];
      const swap = index + dir;
      if (swap < 0 || swap >= next.length) {
        return current;
      }
      [next[index], next[swap]] = [next[swap], next[index]];
      return next;
    });
  }

  function updateField(id, field, value) {
    setDraft((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  async function saveDraft() {
    if (!draftName.trim() || draft.length === 0) {
      setError('Add a name and at least one exercise.');
      return;
    }

    const workout = {
      id: `local-${Date.now()}`,
      name: draftName.trim(),
      intensity: 'Moderate',
      durationMinutes: Math.max(10, draft.length * 5),
      exercises: draft,
      createdAt: new Date().toISOString(),
    };

    const next = [workout, ...workouts];
    await persist(next);
    try {
      await saveWorkoutRemote(workout);
      setOffline(false);
    } catch (_err) {
      setOffline(true);
    }
  }

  return (
    <Screen>
      <Text style={typography.title}>Workouts</Text>
      <Text style={[typography.caption, styles.lede]}>Build a session and save it on this device.</Text>
      <OfflineBanner visible={offline} />
      <ErrorBanner message={error} />
      {loading ? <LoadingView label="Loading workouts" /> : null}

      <Card style={styles.block}>
        <Text style={typography.heading}>Workout builder</Text>
        <TextInput
          value={draftName}
          onChangeText={setDraftName}
          style={styles.input}
          accessibilityLabel="Workout name"
          placeholder="Workout name"
          placeholderTextColor={colors.textMuted}
        />
        {draft.map((item, index) => (
          <View key={item.id} style={styles.exercise}>
            <Text style={typography.label}>
              {index + 1}. {item.name}
            </Text>
            <View style={styles.row}>
              <NumberField
                label="Sets"
                value={String(item.sets)}
                onChange={(value) => updateField(item.id, 'sets', Number(value) || 1)}
              />
              <NumberField
                label={item.unit === 'seconds' ? 'Seconds' : 'Reps'}
                value={String(item.reps)}
                onChange={(value) => updateField(item.id, 'reps', Number(value) || 1)}
              />
            </View>
            <View style={styles.row}>
              <Button variant="ghost" label="Up" onPress={() => move(item.id, -1)} accessibilityLabel={`Move ${item.name} up`} style={styles.flex} />
              <Button variant="ghost" label="Down" onPress={() => move(item.id, 1)} accessibilityLabel={`Move ${item.name} down`} style={styles.flex} />
              <Button variant="danger" label="Remove" onPress={() => removeExercise(item.id)} accessibilityLabel={`Remove ${item.name}`} style={styles.flex} />
            </View>
          </View>
        ))}
        <Text style={[typography.label, styles.gap]}>Add exercise</Text>
        <View style={styles.chips}>
          {LIBRARY_EXERCISES.map((item) => (
            <Pressable
              key={item.name}
              onPress={() => addExercise(item)}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name}`}
              style={styles.chip}
            >
              <Text style={styles.chipText}>+ {item.name}</Text>
            </Pressable>
          ))}
        </View>
        <Button label="Save workout" onPress={saveDraft} accessibilityLabel="Save workout" />
      </Card>

      <Text style={[typography.heading, styles.gap]}>Saved workouts</Text>
      {!loading && workouts.length === 0 ? (
        <EmptyState title="No workouts yet" message="Save a builder session or start the Daily Flow from Home." />
      ) : (
        workouts.map((workout) => (
          <Card key={workout.id} style={styles.block}>
            <Text style={typography.heading}>{workout.name}</Text>
            <Text style={typography.caption}>
              {workout.exercises?.length || 0} exercises · {workout.durationMinutes} min
            </Text>
            <Button
              label="Start workout"
              onPress={() => navigation.navigate('WorkoutSession', { workout })}
              accessibilityLabel={`Start ${workout.name}`}
              style={styles.gap}
            />
          </Card>
        ))
      )}
    </Screen>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <View style={styles.flex}>
      <Text style={typography.caption}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        style={styles.input}
        accessibilityLabel={label}
      />
    </View>
  );
}

function mergeWorkouts(local, remote) {
  const map = new Map();
  [...remote, ...local].forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

const styles = StyleSheet.create({
  lede: { marginBottom: spacing.md },
  block: { marginBottom: spacing.md },
  input: {
    minHeight: minTouch,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.text,
  },
  exercise: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: { flex: 1 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    minHeight: minTouch,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  chipText: { fontSize: 14, color: colors.text, fontWeight: '600' },
  gap: { marginTop: spacing.md },
});
