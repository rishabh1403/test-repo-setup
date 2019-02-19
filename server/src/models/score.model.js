import { Schema, model } from 'mongoose';

const scoreSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  value: {
    type: Number,
    min: 0,
    required: true,
  },
});

export default model('Score', scoreSchema);
