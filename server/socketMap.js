const userSocketMap = {};

module.exports = {
  getUserSocketMap: () => userSocketMap,
  setUserSocket: (userId, socketId) => {
    userSocketMap[userId] = socketId;
  },
  removeUserSocket: (socketId) => {
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socketId) {
        delete userSocketMap[userId];
        return userId;
      }
    }
    return null;
  },
};
