/**
 * User shape for the in-memory store.
 * When MongoDB Atlas is added, convert this to a Mongoose schema.
 */

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    goal: user.goal,
    createdAt: user.createdAt,
  };
}

module.exports = { toPublicUser };
