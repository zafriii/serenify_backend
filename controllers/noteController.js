const Note = require('../models/noteModel');

// Create Note (Only for the logged-in user)
const createNote = async (req, res) => {
  try {
    const { heading, content, name } = req.body;

    const note = new Note({
      heading,
      content,
      name,
      user: req.user._id, // Associate the note with the logged-in user
    });

    await note.save();
    res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get All Notes of Logged-in User
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }); // Fetch notes by the logged-in user
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get a Single Note by ID (Only if it belongs to the logged-in user)
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update Note (Only if it belongs to the logged-in user)
const updateNote = async (req, res) => {
  try {
    const { heading, content, name } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      { heading, content, name }, 
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.status(200).json({ message: 'Note updated successfully', note });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete Note (Only if it belongs to the logged-in user)
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
