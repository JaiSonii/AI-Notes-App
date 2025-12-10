// @ts-ignore
import { PrismaClient, Note } from '@prisma/client'; 
import { AIService } from './AIService';

export class NoteService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createNote(userId: string, title: string, content: string): Promise<Note> {
    const aiService = await AIService.getInstance();
    const embedding = await aiService.generateEmbedding(`${title}: ${content}`);
    
    const noteId = crypto.randomUUID();
    const vectorString = `[${embedding.join(',')}]`;
    
    await this.prisma.$executeRaw`
      INSERT INTO "Note" ("id", "title", "content", "userId", "embedding", "updatedAt")
      VALUES (${noteId}, ${title}, ${content}, ${userId}, ${vectorString}::vector, NOW())
    `;

    return (await this.prisma.note.findUnique({ where: { id: noteId } })) as Note;
  }

  public async getNotes(userId: string): Promise<Note[]> {
    return this.prisma.note.findMany({ 
      where: { userId }, 
      orderBy: { updatedAt: 'desc' } 
    });
  }

  public async searchNotes(userId: string, query: string): Promise<Note[]> {
    const aiService = await AIService.getInstance();
    const embedding = await aiService.generateEmbedding(query);
    const vectorString = `[${embedding.join(',')}]`;

    const results = await this.prisma.$queryRaw`
      SELECT id, title, content, "userId", "createdAt", "updatedAt"
      FROM "Note"
      WHERE "userId" = ${userId}
      ORDER BY embedding <=> ${vectorString}::vector
      LIMIT 5
    `;
    
    return results as Note[];
  }

  public async updateNote(id: string, userId: string, title: string, content: string) {
    const aiService = await AIService.getInstance();
    const embedding = await aiService.generateEmbedding(`${title}: ${content}`);
    const vectorString = `[${embedding.join(',')}]`;

    await this.prisma.$executeRaw`
      UPDATE "Note"
      SET title=${title}, content=${content}, embedding=${vectorString}::vector, "updatedAt"=NOW()
      WHERE id=${id} AND "userId"=${userId}
    `;
  }

  public async deleteNote(id: string, userId: string) {
    return this.prisma.note.deleteMany({ where: { id, userId } });
  }
}