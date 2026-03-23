const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    symptoms: {
        type: String
    },
    answers: {
        type: Array
    },
    totalScore: {
        type: Number
    },
    maxScore: {
        type: Number
    },
    risklevel: {
        type: String
    }, percentage: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

module.exports = mongoose.model('QuizResult', quizSchema);