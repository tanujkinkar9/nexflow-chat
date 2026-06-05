const router = require('express').Router();
const Workspace = require('../models/Workspace');
const Channel = require('../models/Channel');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Create workspace
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const inviteCode = crypto.randomBytes(6).toString('hex');
    const workspace = await Workspace.create({
      name, description,
      owner: req.user.id,
      members: [req.user.id],
      inviteCode
    });
    // Create a general channel automatically
    const general = await Channel.create({
      name: 'general',
      description: 'General discussion',
      workspace: workspace._id,
      members: [req.user.id]
    });
    workspace.channels.push(general._id);
    await workspace.save();

    await User.findByIdAndUpdate(req.user.id, { $push: { workspaces: workspace._id } });
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user workspaces
router.get('/', auth, async (req, res) => {
  try {
    const workspaces = await Workspace.find({ members: req.user.id })
      .populate('channels').populate('members', 'username email');
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join via invite code
router.post('/join', auth, async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const workspace = await Workspace.findOne({ inviteCode });
    if (!workspace) return res.status(404).json({ message: 'Invalid invite code' });

    if (!workspace.members.includes(req.user.id)) {
      workspace.members.push(req.user.id);
      await workspace.save();
      await User.findByIdAndUpdate(req.user.id, { $push: { workspaces: workspace._id } });
    }
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
