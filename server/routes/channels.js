const router = require('express').Router();
const Channel = require('../models/Channel');
const Workspace = require('../models/Workspace');
const auth = require('../middleware/auth');

// Create channel in workspace
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, workspaceId, isPrivate } = req.body;
    const channel = await Channel.create({
      name, description, isPrivate,
      workspace: workspaceId,
      members: [req.user.id]
    });
    await Workspace.findByIdAndUpdate(workspaceId, { $push: { channels: channel._id } });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get channels for workspace
router.get('/workspace/:workspaceId', auth, async (req, res) => {
  try {
    const channels = await Channel.find({ workspace: req.params.workspaceId });
    res.json(channels);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
