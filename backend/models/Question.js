import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  text: {
    type: String,
    required: true,
  },
  options: [
    {
      key: {
        type: String,
        required: true,
        enum: ['a', 'b', 'c', 'd'],
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model('Question', QuestionSchema);
