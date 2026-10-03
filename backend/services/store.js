/**
 * In-memory data store. Replace this module with MongoDB/Mongoose models later.
 * Seed data is realistic fitness content for the HCI lab demo.
 */

const { randomUUID } = require('crypto');

const users = [];

const workoutsByUser = {};

const mealLogsByUser = {};

const joinedChallengesByUser = {};

const challenges = [
  {
    id: 'ch-sunrise-5k',
    title: 'Sunrise 5K Club',
    description: 'Run or walk 5 kilometres three times this week. Completions are private to your circle.',
    members: 128,
    daysLeft: 5,
    reward: 'Streak badge',
  },
  {
    id: 'ch-core-reset',
    title: 'Core Reset',
    description: 'Finish 4 core sessions before Sunday. Share progress only if you opt in.',
    members: 86,
    daysLeft: 4,
    reward: 'Core champion',
  },
  {
    id: 'ch-hydrate',
    title: 'Hydration Week',
    description: 'Log 2 litres of water on 5 days. Circles stay invite-only.',
    members: 210,
    daysLeft: 6,
    reward: 'Hydration streak',
  },
];

const feed = [
  {
    id: 'post-1',
    author: 'Maya K.',
    circle: 'Campus Runners',
    message: 'Hit a new 5K personal best this morning. Slow and steady still counts.',
    likes: 24,
    createdAt: '2026-10-02T06:15:00.000Z',
  },
  {
    id: 'post-2',
    author: 'Jordan P.',
    circle: 'Library Gym Circle',
    message: 'Core Reset day 2 done. 12 minutes, no equipment.',
    likes: 11,
    createdAt: '2026-10-02T18:40:00.000Z',
  },
  {
    id: 'post-3',
    author: 'FitFlow Coach',
    circle: 'Official',
    message: 'Reminder: circles are private. Activity sharing is off unless you enable it in Profile.',
    likes: 41,
    createdAt: '2026-10-01T09:00:00.000Z',
  },
];

const leaderboard = [
  { rank: 1, name: 'Maya K.', points: 420 },
  { rank: 2, name: 'Samira L.', points: 390 },
  { rank: 3, name: 'You', points: 310 },
  { rank: 4, name: 'Jordan P.', points: 280 },
];

function createId(prefix) {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

module.exports = {
  users,
  workoutsByUser,
  mealLogsByUser,
  joinedChallengesByUser,
  challenges,
  feed,
  leaderboard,
  createId,
};
