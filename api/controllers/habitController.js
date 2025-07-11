const Habit = require("../models/Habit");

// Create habit
exports.createHabit = async (req, res) => {
  try {
    const { title, description, frequency } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const habit = new Habit({
      user: req.user._id,
      title,
      description,
      frequency,
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all habits for user
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get single habit by id
exports.getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update habit
exports.updateHabit = async (req, res) => {
  try {
    const { title, description, frequency, completedDates } = req.body;
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    if (title !== undefined) habit.title = title;
    if (description !== undefined) habit.description = description;
    if (frequency !== undefined) habit.frequency = frequency;
    if (completedDates !== undefined) habit.completedDates = completedDates;

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete habit
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!habit) return res.status(404).json({ error: "Habit not found" });
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
