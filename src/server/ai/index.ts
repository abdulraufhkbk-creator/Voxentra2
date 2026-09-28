import { AIServiceProvider } from './types';
import { GeminiProvider } from './geminiProvider';
import { DeterministicProvider } from './deterministicProvider';

class AIServiceManager {
  private primaryProvider: AIServiceProvider;
  private fallbackProvider: AIServiceProvider;

  constructor() {
    this.primaryProvider = new GeminiProvider();
    this.fallbackProvider = new DeterministicProvider();
  }

  getActiveProvider(): AIServiceProvider {
    if (this.primaryProvider.isAvailable()) {
      return this.primaryProvider;
    }
    return this.fallbackProvider;
  }

  getEngineName(): string {
    return this.getActiveProvider().name;
  }
}

export const aiManager = new AIServiceManager();
export const aiService = aiManager.getActiveProvider();
export * from './types';
