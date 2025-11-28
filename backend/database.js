const db = {
  users: [
    { userId: 1, email: 'admin@example.com', password: 'admin', telegramId: null, telegramUsername: null, subscription: 'free', tonBalance: 0, unlocked: [], bans: false, lastLogin: Date.now(), admin: true }
  ],
  levels: {},
  tonPool: 0,
  scores: [],
  achievements: {}
};
export default db;
