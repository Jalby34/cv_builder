import { CVData, AISuggestion, QuestionResponse } from '../types/cv';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class AIService {
  private async makeRequest(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async generateQuickBuildQuestions(targetRole?: string): Promise<string[]> {
    return this.makeRequest('/api/ai/quick-questions', { targetRole });
  }

  async generateFollowUpQuestion(
    question: string,
    answer: string,
    context: QuestionResponse[]
  ): Promise<string | null> {
    return this.makeRequest('/api/ai/follow-up', {
      question,
      answer,
      context,
    });
  }

  async generateCVFromAnswers(
    responses: QuestionResponse[],
    targetRole?: string
  ): Promise<CVData> {
    return this.makeRequest('/api/ai/generate-cv', {
      responses,
      targetRole,
    });
  }

  async suggestAchievements(
    experienceDescription: string,
    role: string,
    company: string
  ): Promise<string[]> {
    return this.makeRequest('/api/ai/suggest-achievements', {
      experienceDescription,
      role,
      company,
    });
  }

  async suggestSkills(
    currentSkills: string[],
    targetRole: string,
    experiences: any[]
  ): Promise<AISuggestion[]> {
    return this.makeRequest('/api/ai/suggest-skills', {
      currentSkills,
      targetRole,
      experiences,
    });
  }

  async improveSection(
    sectionType: string,
    content: string,
    context: any
  ): Promise<AISuggestion[]> {
    return this.makeRequest('/api/ai/improve-section', {
      sectionType,
      content,
      context,
    });
  }

  async analyzeATSCompatibility(cv: CVData): Promise<any> {
    return this.makeRequest('/api/ai/analyze-ats', { cv });
  }

  async extractLinkedInData(profileData: any): Promise<Partial<CVData>> {
    return this.makeRequest('/api/ai/extract-linkedin', { profileData });
  }

  async matchJobs(cv: CVData, jobDescriptions: any[]): Promise<any[]> {
    return this.makeRequest('/api/ai/match-jobs', {
      cv,
      jobDescriptions,
    });
  }

  async suggestPortfolioItems(experiences: any[], projects: any[]): Promise<string[]> {
    return this.makeRequest('/api/ai/suggest-portfolio', {
      experiences,
      projects,
    });
  }
}

export const aiService = new AIService();
