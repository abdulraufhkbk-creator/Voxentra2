import { GoogleGenAI } from '@google/genai';
import { AIAnalysisRequest, AIServiceProvider, FullAnalysisAIOutput } from './types';
import { DeterministicProvider } from './deterministicProvider';

function extractJson(text: string): any {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export class GeminiProvider implements AIServiceProvider {
  name = 'Gemini 3.8 Flash (Server-Side Multi-Modal)';
  private aiClient: GoogleGenAI | null = null;
  private fallbackProvider = new DeterministicProvider();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5) {
      try {
        this.aiClient = new GoogleGenAI({
          apiKey: apiKey.trim(),
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } catch (err) {
        console.warn('Failed to initialize GoogleGenAI client, falling back to deterministic engine:', err);
        this.aiClient = null;
      }
    }
  }

  isAvailable(): boolean {
    return this.aiClient !== null;
  }

  async analyzeFullContent(req: AIAnalysisRequest): Promise<FullAnalysisAIOutput> {
    const fallback = await this.fallbackProvider.analyzeFullContent(req);

    if (!this.aiClient) {
      return fallback;
    }

    try {
      const prompt = `You are the core intelligence engine of VOXENTRA, a privacy-first AI-powered social intelligence analyzer.
Analyze the following REAL content retrieved from ${req.content.platform.toUpperCase()}:
Author / Channel: ${req.content.author_pseudonym}
Content Text: "${req.content.text}"
Observed Engagement: Views=${req.content.engagement?.views || 0}, Likes=${req.content.engagement?.likes || 0}, Comments=${req.content.engagement?.comments || 0}
Source Reference: ${req.content.source_reference}

Respond in strictly valid JSON format matching this schema:
{
  "answers": {
    "what_is_happening": "1-2 sentence factual explanation of this specific content item",
    "who_is_driving_it": "Communities, creators, or audiences driving engagement",
    "how_is_it_spreading": "Observed propagation patterns and algorithmic distribution",
    "what_are_people_feeling": "Emotional tone and audience reaction",
    "what_are_the_main_narratives": "Primary themes and talking points in the content"
  },
  "risk_assessment": {
    "level": "LOW" | "CAUTION" | "HIGH",
    "confidence": "Low" | "Moderate" | "High",
    "overall_summary": "Reasoning for the risk level based strictly on evidence",
    "key_signals": [
      {
        "title": "Signal Title",
        "category": "synthetic_media" | "provenance" | "context" | "propagation",
        "severity": "low" | "caution" | "high",
        "description": "Short explanation",
        "evidence": ["bullet 1", "bullet 2"]
      }
    ]
  },
  "sentiment_summary": {
    "positive_pct": number,
    "neutral_pct": number,
    "negative_pct": number,
    "dominant_emotion": "anger" | "anxiety" | "fear" | "excitement" | "joy" | "surprise"
  }
}
Remember: Never output fake truth percentages. Ground your reasoning strictly in the provided content text and metrics.`;

      const response = await this.aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = extractJson(response.text || '');
      if (!parsed) {
        return fallback;
      }

      const riskLevel = parsed.risk_assessment?.level || fallback.risk.risk_level;
      const confidence = parsed.risk_assessment?.confidence || fallback.risk.confidence;

      return {
        ai_engine: `${this.name} (Live Multi-Modal AI)`,
        risk: {
          ...fallback.risk,
          risk_level: riskLevel,
          confidence: confidence,
          overall_assessment: parsed.risk_assessment?.overall_summary || fallback.risk.overall_assessment,
          signals: parsed.risk_assessment?.key_signals && parsed.risk_assessment.key_signals.length > 0
            ? parsed.risk_assessment.key_signals.map((sig: any, idx: number) => ({
                id: `gemini-sig-${idx}`,
                category: sig.category || 'provenance',
                title: sig.title || 'Observed Signal',
                severity: sig.severity || 'caution',
                description: sig.description || '',
                evidence: sig.evidence || ['AI Multi-Modal Signal Extraction'],
                technical_details: 'Extracted via Gemini 3.8 Flash structured semantic cross-referencing.',
              }))
            : fallback.risk.signals,
        },
        sentiment: {
          ...fallback.sentiment,
          overall: {
            positive: parsed.sentiment_summary?.positive_pct ?? fallback.sentiment.overall.positive,
            neutral: parsed.sentiment_summary?.neutral_pct ?? fallback.sentiment.overall.neutral,
            negative: parsed.sentiment_summary?.negative_pct ?? fallback.sentiment.overall.negative,
          },
        },
        audience: fallback.audience,
        trends: fallback.trends,
        network: fallback.network,
        timeline: fallback.timeline,
        cross_platform: fallback.cross_platform,
        answers: {
          what_is_happening: parsed.answers?.what_is_happening || fallback.answers.what_is_happening,
          who_is_driving_it: parsed.answers?.who_is_driving_it || fallback.answers.who_is_driving_it,
          how_is_it_spreading: parsed.answers?.how_is_it_spreading || fallback.answers.how_is_it_spreading,
          what_are_people_feeling: parsed.answers?.what_are_people_feeling || fallback.answers.what_are_people_feeling,
          what_are_the_main_narratives: parsed.answers?.what_are_the_main_narratives || fallback.answers.what_are_the_main_narratives,
        },
      };
    } catch (error) {
      console.warn('Gemini generateContent call encountered an issue, defaulting to deterministic fallback:', error);
      return fallback;
    }
  }

  async analyzeTopic(topicQuery: string): Promise<FullAnalysisAIOutput> {
    const fallback = await this.fallbackProvider.analyzeTopic(topicQuery);
    if (!this.aiClient) return fallback;

    try {
      const prompt = `You are VOXENTRA's topical intelligence analyzer. Analyze the following topic or hashtag across public social platforms:
Topic: "${topicQuery}"

Respond in strictly valid JSON format matching this schema:
{
  "answers": {
    "what_is_happening": "1-2 sentence overview of the topic discussion",
    "who_is_driving_it": "Communities and groups driving momentum",
    "how_is_it_spreading": "Cross-platform propagation pathways",
    "what_are_people_feeling": "General sentiment and emotional tone",
    "what_are_the_main_narratives": "Dominant narratives and perspectives"
  },
  "risk_assessment": {
    "level": "LOW" | "CAUTION" | "HIGH",
    "confidence": "Low" | "Moderate" | "High",
    "overall_summary": "Topical risk summary"
  },
  "dominant_sentiment": {
    "positive_pct": number,
    "neutral_pct": number,
    "negative_pct": number
  }
}`;

      const response = await this.aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = extractJson(response.text || '');
      if (!parsed) return fallback;

      return {
        ...fallback,
        ai_engine: `${this.name} (Live Topic Synthesis)`,
        risk: {
          ...fallback.risk,
          risk_level: parsed.risk_assessment?.level || fallback.risk.risk_level,
          confidence: parsed.risk_assessment?.confidence || fallback.risk.confidence,
          overall_assessment: parsed.risk_assessment?.overall_summary || fallback.risk.overall_assessment,
        },
        sentiment: {
          ...fallback.sentiment,
          overall: {
            positive: parsed.dominant_sentiment?.positive_pct ?? fallback.sentiment.overall.positive,
            neutral: parsed.dominant_sentiment?.neutral_pct ?? fallback.sentiment.overall.neutral,
            negative: parsed.dominant_sentiment?.negative_pct ?? fallback.sentiment.overall.negative,
          },
        },
        answers: {
          what_is_happening: parsed.answers?.what_is_happening || fallback.answers.what_is_happening,
          who_is_driving_it: parsed.answers?.who_is_driving_it || fallback.answers.who_is_driving_it,
          how_is_it_spreading: parsed.answers?.how_is_it_spreading || fallback.answers.how_is_it_spreading,
          what_are_people_feeling: parsed.answers?.what_are_people_feeling || fallback.answers.what_are_people_feeling,
          what_are_the_main_narratives: parsed.answers?.what_are_the_main_narratives || fallback.answers.what_are_the_main_narratives,
        },
      };
    } catch (error) {
      console.warn('Gemini topic analysis encountered an issue, defaulting to fallback:', error);
      return fallback;
    }
  }

  async analyzeAccount(accountQuery: string): Promise<FullAnalysisAIOutput> {
    const fallback = await this.fallbackProvider.analyzeAccount(accountQuery);
    if (!this.aiClient) return fallback;

    try {
      const prompt = `You are VOXENTRA's pseudonymous account diffusion auditor.
Audit the public behavioral diffusion patterns for public account: "${accountQuery}"

Respond in strictly valid JSON format matching this schema:
{
  "answers": {
    "what_is_happening": "1-2 sentence summary of account diffusion profile",
    "who_is_driving_it": "Communities amplifying or interacting with this account",
    "how_is_it_spreading": "Cross-platform forwarding and repost patterns",
    "what_are_people_feeling": "Public reaction to content from this account",
    "what_are_the_main_narratives": "Key themes associated with this handle"
  },
  "risk_assessment": {
    "level": "LOW" | "CAUTION" | "HIGH",
    "confidence": "Low" | "Moderate" | "High",
    "overall_summary": "Account risk and amplification profile"
  }
}`;

      const response = await this.aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const parsed = extractJson(response.text || '');
      if (!parsed) return fallback;

      return {
        ...fallback,
        ai_engine: `${this.name} (Live Account Topology)`,
        risk: {
          ...fallback.risk,
          risk_level: parsed.risk_assessment?.level || fallback.risk.risk_level,
          confidence: parsed.risk_assessment?.confidence || fallback.risk.confidence,
          overall_assessment: parsed.risk_assessment?.overall_summary || fallback.risk.overall_assessment,
        },
        answers: {
          what_is_happening: parsed.answers?.what_is_happening || fallback.answers.what_is_happening,
          who_is_driving_it: parsed.answers?.who_is_driving_it || fallback.answers.who_is_driving_it,
          how_is_it_spreading: parsed.answers?.how_is_it_spreading || fallback.answers.how_is_it_spreading,
          what_are_people_feeling: parsed.answers?.what_are_people_feeling || fallback.answers.what_are_people_feeling,
          what_are_the_main_narratives: parsed.answers?.what_are_the_main_narratives || fallback.answers.what_are_the_main_narratives,
        },
      };
    } catch (error) {
      console.warn('Gemini account analysis encountered an issue, defaulting to fallback:', error);
      return fallback;
    }
  }
}
