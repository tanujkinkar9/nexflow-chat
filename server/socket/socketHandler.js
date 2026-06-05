const Message = require('../models/Message');

const onlineUsers = {}; // { workspaceId: { userId: username } }

const handleSocket = (io) => {
  io.on('connection', (socket) => {

    // Join workspace (for presence)
    socket.on('join_workspace', ({ workspaceId, userId, username }) => {
      socket.join(`workspace:${workspaceId}`);
      socket.data.workspaceId = workspaceId;
      socket.data.userId = userId;
      socket.data.username = username;

      if (!onlineUsers[workspaceId]) onlineUsers[workspaceId] = {};
      onlineUsers[workspaceId][userId] = username;

      io.to(`workspace:${workspaceId}`).emit('online_users', onlineUsers[workspaceId]);
    });

    // Join channel
    socket.on('join_channel', async ({ channelId, userId, username }) => {
      socket.join(`channel:${channelId}`);
      socket.data.channelId = channelId;

      // Load last 50 messages
      try {
        const history = await Message.find({ channel: channelId })
          .sort({ createdAt: 1 }).limit(50);
        socket.emit('message_history', history);
      } catch (err) {
        console.log('History error:', err);
      }
    });

    // Leave channel
    socket.on('leave_channel', ({ channelId }) => {
      socket.leave(`channel:${channelId}`);
    });

    // Send message
    socket.on('send_message', async ({ channelId, content, senderId, senderName }) => {
      try {
        const msg = await Message.create({
          channel: channelId,
          sender: senderId,
          senderName,
          content
        });
        io.to(`channel:${channelId}`).emit('new_message', msg);
      } catch (err) {
        console.log('Message save error:', err);
      }
    });

    // Typing
    socket.on('typing_start', ({ channelId, username }) => {
      socket.to(`channel:${channelId}`).emit('user_typing', username);
    });
    socket.on('typing_stop', ({ channelId }) => {
      socket.to(`channel:${channelId}`).emit('user_stop_typing');
    });

    // Task updated (broadcast to workspace)
    socket.on('task_updated', ({ workspaceId, task }) => {
      socket.to(`workspace:${workspaceId}`).emit('task_changed', task);
    });

    // Disconnect
    socket.on('disconnect', () => {
      const { workspaceId, userId } = socket.data;
      if (workspaceId && userId && onlineUsers[workspaceId]) {
        delete onlineUsers[workspaceId][userId];
        io.to(`workspace:${workspaceId}`).emit('online_users', onlineUsers[workspaceId]);
      }
    });
  });
};

module.exports = { handleSocket };
