import mongoose from 'mongoose';

const QuizResultSchema = new mongoose.Schema({
  answers: [
    {
      questionNumber: {
        type: Number,
        required: true,
      },
      selectedOptions: [
        {
          key: {
            type: String,
            required: true,
            enum: ['a', 'b', 'c', 'd'],
          },
          points: {
            type: Number,
            required: true,
            enum: [1, 2],
          },
        },
      ],
    },
  ],
  redPoints: {
    type: Number,
    default: 0,
  },
  yellowPoints: {
    type: Number,
    default: 0,
  },
  greenPoints: {
    type: Number,
    default: 0,
  },
  bluePoints: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('QuizResult', QuizResultSchema);
