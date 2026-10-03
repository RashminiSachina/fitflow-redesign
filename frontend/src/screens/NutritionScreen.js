import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import LoadingView from '../components/LoadingView';
import OfflineBanner from '../components/OfflineBanner';
import Screen from '../components/Screen';
import { fetchMealLogs, recognizeFood, saveMealLog } from '../api/nutrition';
import { getJson, keys, setJson } from '../services/storage';
import { colors, minTouch, radius, spacing, typography } from '../theme';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function NutritionScreen() {
  const [logs, setLogs] = useState([]);
  const [photoUri, setPhotoUri] = useState(null);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(true);
  const [recognizing, setRecognizing] = useState(false);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');

  const todayCalories = useMemo(
    () =>
      logs
        .filter((item) => (item.loggedAt || '').slice(0, 10) === todayKey())
        .reduce((sum, item) => sum + Number(item.calories || 0), 0),
    [logs],
  );

  const persist = useCallback(async (next) => {
    setLogs(next);
    await setJson(keys.meals, next);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const local = (await getJson(keys.meals)) || [];
    setLogs(local);
    try {
      const data = await fetchMealLogs();
      await persist(data.logs || local);
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

  async function openCamera() {
    setError('');
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
      quality: 0.6,
      saveToPhotos: false,
    });

    if (result.didCancel) {
      return;
    }

    if (result.errorCode === 'permission') {
      Alert.alert(
        'Camera permission needed',
        'FitFlow uses the camera only to log meals. You can still add food manually.',
      );
      return;
    }

    if (result.errorCode) {
      setError('The camera could not be opened. Add the meal manually instead.');
      return;
    }

    const uri = result.assets && result.assets[0] && result.assets[0].uri;
    if (!uri) {
      return;
    }

    setPhotoUri(uri);
    setRecognizing(true);
    try {
      const recognized = await recognizeFood({ source: 'camera' });
      setFoodName(recognized.name);
      setCalories(String(recognized.calories));
      setOffline(false);
    } catch (_err) {
      setFoodName('Grilled chicken rice bowl');
      setCalories('520');
      setOffline(true);
    } finally {
      setRecognizing(false);
    }
  }

  async function saveMeal() {
    const kcal = Number(calories);
    if (!foodName.trim() || !Number.isFinite(kcal) || kcal < 0) {
      setError('Enter a food name and calories.');
      return;
    }

    const entry = {
      id: `meal-${Date.now()}`,
      name: foodName.trim(),
      calories: kcal,
      photoUri,
      loggedAt: new Date().toISOString(),
    };

    await persist([entry, ...logs]);
    try {
      await saveMealLog(entry);
      setOffline(false);
    } catch (_err) {
      setOffline(true);
    }
    setFoodName('');
    setCalories('');
    setPhotoUri(null);
  }

  return (
    <Screen>
      <Text style={typography.title}>Nutrition</Text>
      <Text style={typography.caption}>Today: {todayCalories} kcal</Text>
      <OfflineBanner visible={offline} />
      <ErrorBanner message={error} />

      <Card style={styles.block}>
        <Button label="Open camera" onPress={openCamera} accessibilityLabel="Open camera to log food" />
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} accessibilityLabel="Captured meal photo" />
        ) : null}
        {recognizing ? <LoadingView label="Recognizing food" /> : null}
        <TextInput
          value={foodName}
          onChangeText={setFoodName}
          placeholder="Food name"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          accessibilityLabel="Food name"
        />
        <TextInput
          value={calories}
          onChangeText={setCalories}
          placeholder="Calories"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          style={styles.input}
          accessibilityLabel="Calories"
        />
        <Button label="Save meal" onPress={saveMeal} accessibilityLabel="Save meal" variant="accent" />
      </Card>

      <Text style={typography.heading}>Today's log</Text>
      {loading ? <LoadingView label="Loading meals" /> : null}
      {!loading && logs.length === 0 ? (
        <EmptyState title="No meals yet" message="Snap a photo or type a meal to start today's log." />
      ) : (
        logs.map((item) => (
          <Card key={item.id} style={styles.block}>
            <Text style={typography.label}>{item.name}</Text>
            <Text style={typography.caption}>
              {item.calories} kcal · {(item.loggedAt || '').slice(11, 16)}
            </Text>
          </Card>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { marginVertical: spacing.md },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
    marginTop: spacing.md,
    backgroundColor: colors.border,
  },
  input: {
    minHeight: minTouch,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
});
