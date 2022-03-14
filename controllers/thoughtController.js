const { User, Thought } = require("../models");

module.exports = {
  // Get every thought
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .populate({ path: "reactions", select: "-__v" })
    .select("-__v")
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: "No thought exists with that ID!" })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => {
        User.findOneAndUpdate({ _id: req.body.userId }, { $addToSet: { thoughts: dbThoughtData._id } }, { new: true })
          .then(dbUserData => 
              !dbUserData
                ? res.status(404).json({ message: "No user found with this id!" })
                : res.json(dbUserData)
          )
          .catch((err) => res.status(500).json(err));
      })
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { new: true })
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json(err)
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json(err)
          : User.findOneAndUpdate({ _id: dbThoughtData.username }, { $pull: { thoughts: req.params.thoughtId } })
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => res.status(500).json(err))
      )
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req, res) {
    
  }
};