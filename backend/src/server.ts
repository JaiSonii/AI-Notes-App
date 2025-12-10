import express from 'express';
import cors from 'cors';
import { AuthController } from './controllers/AuthController';
import { NoteController } from './controllers/NoteController';
import { authenticate } from './middlewares/authMiddleware';

const app = express();
app.use(cors());
app.use(express.json());

const authController = new AuthController();
const noteController = new NoteController();

// Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

app.get('/api/notes', authenticate, noteController.getAll);
app.post('/api/notes', authenticate, noteController.create);
app.get('/api/notes/search', authenticate, noteController.search);
app.put('/api/notes/:id', authenticate, noteController.update);
app.delete('/api/notes/:id', authenticate, noteController.delete);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});