import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
