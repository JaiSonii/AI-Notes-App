import { pipeline } from '@xenova/transformers';

export class AIService {
  private static instance: AIService;
  private extractor: any;

  private constructor() {}

  public static async getInstance(): Promise<AIService> {
    if (!AIService.instance) {
      AIService.instance = new AIService();
      // Initialize the model locally
      AIService.instance.extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return AIService.instance;
  }

  public async generateEmbedding(text: string): Promise<number[]> {
    const output = await this.extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}