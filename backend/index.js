import express from 'express';
import connectDB from './connect.js';
import User from './model/user.js';
import Question from './model/question.js';
import Reply from './model/reply.js';
import Message from './model/message.js'; // Assuming you have a Message model
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Create Express app
const app = express();

// Create HTTP server
const server = createServer(app);

// Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://popcore6436-dtlxf24ze-xin-yis-projects-c76ad3e1.vercel.app'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Express
const corsOptions = {
  origin: 'https://popcore6436.vercel.app', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Allow credentials
};
app.use(cors(corsOptions));

// Database connection
connectDB();

// Routes
app.get('/', (req, res) => res.send('Hello World'));

// Signup route
app.post('/signup', async (req, res) => {
  const { name, password, email, profileImage } = req.body;
  try {
    const findUser = await User.findOne({ name });
    if (findUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = await User.create({ name, password, email, profileImage });
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    if (findUser.password === password) {
      return res.status(200).json(findUser);
    }
    return res.status(400).json({ message: 'Incorrect password' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Add question route
app.post('/ask-question', async (req, res) => {
  const { question, description, userId, tags } = req.body;
  try {
    const newQuestion = await Question.create({ question, description, author: userId, tags });
    return res.status(201).json(newQuestion);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Answer question route
app.post('/answer/:id', async (req, res) => {
  const { answer, userId } = req.body;
  const { id: questionId } = req.params;
  try {
    const reply = await Reply.create({ reply: answer, author: userId });
    const findQuestion = await Question.findById(questionId);
    await findQuestion.updateOne({ $push: { replies: reply._id } });
    return res.status(201).json(reply);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Upvote question route
app.post('/upvote/:id', async (req, res) => {
  const { id: questionId } = req.params;
  const { userId } = req.body;
  try {
    const findQuestion = await Question.findById(questionId);
    if (findQuestion.upvote.includes(userId)) {
      return res.status(400).json({ message: 'You have already upvoted' });
    }
    if (findQuestion.downvote.includes(userId)) {
      await findQuestion.updateOne({ $pull: { downvote: userId } });
      return res.status(200).json({ message: 'Response updated successfully' });
    }
    await findQuestion.updateOne({ $push: { upvote: userId } });
    return res.status(200).json({ message: 'Upvoted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Downvote question route
app.post('/downvote/:id', async (req, res) => {
  const { id: questionId } = req.params;
  const { userId } = req.body;
  try {
    const findQuestion = await Question.findById(questionId);
    if (findQuestion.downvote.includes(userId)) {
      return res.status(400).json({ message: 'You have already downvoted' });
    }
    if (findQuestion.upvote.includes(userId)) {
      await findQuestion.updateOne({ $pull: { upvote: userId } });
      return res.status(200).json({ message: 'Response updated successfully' });
    }
    await findQuestion.updateOne({ $push: { downvote: userId } });
    return res.status(200).json({ message: 'Downvoted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Get all questions route
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find({})
      .populate('replies')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          model: 'User' // Adjust model name as per your schema
        }
      })
      .populate('author')
      .sort({ createdAt: -1 });
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Get all users route
app.get('/allusers', async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Get questions by user ID route
app.get('/my-questions/:id', async (req, res) => {
  const { id: userId } = req.params;
  try {
    const replies = await Question.find({ author: userId })
      .populate('replies')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          model: 'User' // Adjust model name as per your schema
        }
      })
      .populate('author')
      .sort({ createdAt: -1 });
    return res.status(200).json(replies);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Get questions by topic route
app.get('/find/:topic', async (req, res) => {
  const { topic } = req.params;
  try {
    const questions = await Question.find({ tags: { $in: [topic] } })
      .populate('replies')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          model: 'User' // Adjust model name as per your schema
        }
      })
      .populate('author')
      .sort({ createdAt: -1 });
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// POST a new trivia question
app.post('/triviaquestions', async (req, res) => {
  const { question, answers, correctAnswer, topic } = req.body;
  try {
    const newQuestion = new TriviaQuestion({
      question,
      answers,
      correctAnswer,
      topic
    });
    const savedQuestion = await newQuestion.save();
    return res.status(201).json(savedQuestion);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// GET trivia questions
app.get('/triviaquestions', async (req, res) => {
  const { topic } = req.query;
  try {
    const questions = await TriviaQuestion.find({ topic });
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Search route
app.get('/search', async (req, res) => {
  const { query } = req.query;
  try {
    const questions = await Question.find({
      $or: [
        { question: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('replies')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate('author')
      .sort({ createdAt: -1 });
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', async ({ room, user }) => {
    try {
      const messages = await Message.find({ room }).populate('user', 'name _id profileImage');
      socket.join(room); // Join the room
      socket.emit('receive-messages', messages); // Send existing messages to client
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  });

  socket.on('send-message', async ({ message, room, user }) => {
    try {
      const newMessage = new Message({ message, room, user });
      await newMessage.save();

      // Broadcast the message to all clients in the room
      const populatedMessage = await newMessage.populate('user', 'name _id profileImage').execPopulate();
      io.to(room).emit('receive-message', { message: populatedMessage.message, room: populatedMessage.room, user: populatedMessage.user });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



