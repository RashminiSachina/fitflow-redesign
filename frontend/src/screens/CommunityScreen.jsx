import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import LoadingView from '../components/LoadingView';
import OfflineBanner from '../components/OfflineBanner';
import Screen from '../components/Screen';
import { fetchChallenges, fetchFeed, joinChallenge, leaveChallenge } from '../api/community';
import { getJson, keys, setJson } from '../services/storage';
import { colors, spacing, typography } from '../theme';

const FALLBACK = {
  challenges: [
    {
      id: 'ch-sunrise-5k',
      title: 'Sunrise 5K Club',
      description: 'Run or walk 5 kilometres three times this week.',
      members: 128,
      daysLeft: 5,
      joined: false,
    },
    {
      id: 'ch-core-reset',
      title: 'Core Reset',
      description: 'Finish 4 core sessions before Sunday.',
      members: 86,
      daysLeft: 4,
      joined: false,
    },
  ],
  posts: [
    {
      id: 'post-1',
      author: 'Maya K.',
      circle: 'Campus Runners',
      message: 'Hit a new 5K personal best this morning.',
      likes: 24,
    },
  ],
  leaderboard: [
    { rank: 1, name: 'Maya K.', points: 420 },
    { rank: 2, name: 'Samira L.', points: 390 },
    { rank: 3, name: 'You', points: 310 },
  ],
  privacyNote: 'Circles are private. Activity is shared only if you enable it in Profile.',
};

export default function CommunityScreen() {
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const cached = (await getJson(keys.community)) || FALLBACK;
    setData(cached);
    try {
      const [challenges, feed] = await Promise.all([fetchChallenges(), fetchFeed()]);
      const next = {
        challenges: challenges.challenges,
        posts: feed.posts,
        leaderboard: feed.leaderboard,
        privacyNote: feed.privacyNote || challenges.privacyNote,
      };
      setData(next);
      await setJson(keys.community, next);
      setOffline(false);
    } catch (err) {
      setOffline(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function toggleJoin(challenge) {
    const joined = !challenge.joined;
    const nextChallenges = data.challenges.map((item) =>
      item.id === challenge.id
        ? { ...item, joined, members: item.members + (joined ? 1 : -1) }
        : item,
    );
    const next = { ...data, challenges: nextChallenges };
    setData(next);
    await setJson(keys.community, next);
    try {
      if (joined) {
        await joinChallenge(challenge.id);
      } else {
        await leaveChallenge(challenge.id);
      }
    } catch (_err) {
      setOffline(true);
    }
  }

  return (
    <Screen>
      <Text style={typography.title}>Community</Text>
      <Text style={[typography.caption, styles.note]}>{data.privacyNote}</Text>
      <OfflineBanner visible={offline} />
      <ErrorBanner message={error && !offline ? error : ''} />
      {loading ? <LoadingView label="Loading circles" /> : null}

      <Text style={typography.heading}>Challenges</Text>
      {!loading && (!data.challenges || data.challenges.length === 0) ? (
        <EmptyState title="No challenges" message="Check back later for campus challenges." />
      ) : (
        (data.challenges || []).map((challenge) => (
          <Card key={challenge.id} style={styles.block}>
            <Text style={typography.heading}>{challenge.title}</Text>
            <Text style={typography.caption}>
              {challenge.members} members · {challenge.daysLeft} days left
            </Text>
            <Text style={[typography.body, styles.body]}>{challenge.description}</Text>
            <Button
              label={challenge.joined ? 'Leave challenge' : 'Join challenge'}
              variant={challenge.joined ? 'ghost' : 'primary'}
              onPress={() => toggleJoin(challenge)}
              accessibilityLabel={challenge.joined ? `Leave ${challenge.title}` : `Join ${challenge.title}`}
            />
          </Card>
        ))
      )}

      <Text style={typography.heading}>Leaderboard preview</Text>
      <Card style={styles.block}>
        {(data.leaderboard || []).map((row) => (
          <View key={row.rank} style={styles.leader}>
            <Text style={typography.label}>
              {row.rank}. {row.name}
            </Text>
            <Text style={typography.caption}>{row.points} pts</Text>
          </View>
        ))}
      </Card>

      <Text style={typography.heading}>Circle feed</Text>
      {(data.posts || []).map((post) => (
        <Card key={post.id} style={styles.block}>
          <Text style={typography.label}>{post.author}</Text>
          <Text style={typography.caption}>{post.circle}</Text>
          <Text style={[typography.body, styles.body]}>{post.message}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    marginBottom: spacing.md,
    color: colors.textMuted,
  },
  block: { marginBottom: spacing.md, marginTop: spacing.sm },
  body: { marginVertical: spacing.sm },
  leader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    alignItems: 'center',
  },
});
