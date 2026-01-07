import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true }
});

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: {
        type: String,
        enum: ['short-answer', 'multiple-choice'],
        required: true
    },
    options: [OptionSchema] // Only for multiple-choice
});

const SurveySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    questions: [QuestionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Survey', SurveySchema);
