const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
    userId: { type: String, required: true },
    createdOn: { type: Date, default: new Date().getTime() }
});

const Note = mongoose.model('Note',NoteSchema);

module.exports = Note;