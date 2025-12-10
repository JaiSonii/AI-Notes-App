import { Request, Response } from 'express';
import { NoteService } from '../services/NoteService';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export class NoteController {
  private noteService = new NoteService();

  create = async (req: AuthRequest, res: Response) => {
    const { title, content } = req.body;
    const note = await this.noteService.createNote(req.user!.userId, title, content);
    res.json(note);
  };

  getAll = async (req: AuthRequest, res: Response) => {
    const notes = await this.noteService.getNotes(req.user!.userId);
    res.json(notes);
  };

  search = async (req: AuthRequest, res: Response) => {
    const { q } = req.query;
    if (!q) return this.getAll(req, res);
    const notes = await this.noteService.searchNotes(req.user!.userId, String(q));
    res.json(notes);
  };

  update = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;
    await this.noteService.updateNote(id, req.user!.userId, title, content);
    res.json({ success: true });
  }

  delete = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await this.noteService.deleteNote(id, req.user!.userId);
    res.json({ success: true });
  }
}