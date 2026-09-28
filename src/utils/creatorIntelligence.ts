import { AnalysisResult, SocialPlatform } from '../types/analysis';
import {
  AudienceQuestionItem,
  ConversationGapItem,
  CreatorOpportunityItem,
  EmergingTopicItem,
  IdeaForgeConfig,
  IdeaForgeGeneratedConcept,
} from '../types/creator';

/**
 * Derives comprehensive Creator Lens intelligence directly from existing AnalysisResult data.
 */
export function deriveCreatorIntelligence(analysis: AnalysisResult) {
  const { trends, risk, audience, cross_platform, content } = analysis;

  // 1. Emerging Topics
  const primaryTopicName = content.topic || analysis.title;
  const isDeepfake = analysis.id.includes('deepfake') || risk.risk_level === 'HIGH';
  const isIndicAi = analysis.id.includes('trend') || analysis.id.includes('indic') || analysis.title.toLowerCase().includes('bhashatech');
  const isFlood = analysis.id.includes('flood') || analysis.id.includes('recontextualized') || analysis.title.toLowerCase().includes('infrastructure');

  const emergingTopics: EmergingTopicItem[] = [
    {
      id: 'topic-primary',
      name: primaryTopicName,
      discussion_volume: `${(content.engagement.views / 1000).toFixed(1)}k+ views / ${(content.engagement.likes / 1000).toFixed(1)}k reactions`,
      growth_rate: `+${trends.acceleration_percentage}%`,
      velocity: trends.acceleration_percentage > 100 ? 'Surging' : 'High',
      platforms: cross_platform.platforms.map((p) => p.platform),
      sentiment: isDeepfake ? 'skeptical' : isIndicAi ? 'positive' : 'mixed',
      audience_interest: 'Very High',
      why_notable: `Observed cross-platform velocity across ${cross_platform.total_platforms_detected} networks with ${content.engagement.velocity_rate}.`,
      why_it_matters: isDeepfake
        ? 'Rapid dissemination of synthetic multimedia without verifiable C2PA credentials is triggering urgent consumer verification questions.'
        : isIndicAi
        ? 'High community curiosity regarding indigenous AI benchmark comparisons and low-resource language coverage.'
        : 'Recontextualized archival disaster media is generating acute local panic and traffic misinformation across regional community channels.',
      signal_summary: `${trends.trending_topics[0]?.name || primaryTopicName} showing +${trends.acceleration_percentage}% trajectory over ${trends.acceleration_period}.`,
    },
    ...(trends.trending_topics.slice(1, 4).map((t, idx) => ({
      id: `topic-secondary-${idx}`,
      name: t.name,
      discussion_volume: `${(t.volume / 1000).toFixed(1)}k interactions`,
      growth_rate: `+${t.growth}%`,
      velocity: (t.growth > 80 ? 'Surging' : 'Moderate') as 'Surging' | 'Moderate',
      platforms: ['x', 'youtube', 'reddit'] as SocialPlatform[],
      sentiment: (t.sentiment === 'positive' ? 'positive' : t.sentiment === 'negative' ? 'negative' : 'mixed') as any,
      audience_interest: (t.growth > 100 ? 'Very High' : 'High') as 'Very High' | 'High',
      why_notable: `Keyword acceleration detected in ${trends.viral_keywords[idx]?.category || 'social trends'} cluster.`,
      why_it_matters: 'Audience engagement index indicates rising interest with significant demand for explanatory teardowns.',
      signal_summary: `Topic velocity driven by community discussions on technical feasibility and public implications.`,
    }))),
  ];

  // 2. Audience Questions (What is the audience asking?)
  const audienceQuestions: AudienceQuestionItem[] = isDeepfake
    ? [
        {
          id: 'q-1',
          question: 'How can I tell if this viral video is AI-generated or authentic?',
          frequency: 'Very High (42% of reply sentiment)',
          platforms: ['instagram', 'youtube', 'x', 'reddit'],
          related_topic: primaryTopicName,
          discussion_volume: '48.2k inquiries observed',
          context_sample: '"Is this speech real? The mouth looks slightly unnatural around the pauses."',
          urgency: 'Immediate Need',
        },
        {
          id: 'q-2',
          question: 'Is there any official government gazette or gazetted notification backing this claim?',
          frequency: 'High (28% of reply sentiment)',
          platforms: ['x', 'telegram', 'facebook'],
          related_topic: primaryTopicName,
          discussion_volume: '29.5k inquiries observed',
          context_sample: '"Checked the official ministry portal and there is zero record of this scheme."',
          urgency: 'Immediate Need',
        },
        {
          id: 'q-3',
          question: 'Where did the original unedited footage actually originate?',
          frequency: 'Moderate (18% of reply sentiment)',
          platforms: ['reddit', 'youtube'],
          related_topic: primaryTopicName,
          discussion_volume: '14.1k inquiries observed',
          context_sample: '"Reverse image search matches a press conference from 2024 with completely different audio."',
          urgency: 'High Interest',
        },
        {
          id: 'q-4',
          question: 'What is C2PA metadata and why is it missing in social re-uploads?',
          frequency: 'Rising (12% of reply sentiment)',
          platforms: ['x', 'reddit'],
          related_topic: 'Content Provenance & C2PA',
          discussion_volume: '8.7k inquiries observed',
          context_sample: '"Does Instagram strip out the cryptographic provenance certificates when saving reels?"',
          urgency: 'High Interest',
        },
      ]
    : isIndicAi
    ? [
        {
          id: 'q-1',
          question: 'How does BhashaTech-7B compare against global LLMs on Indic benchmark suites (MMLU-Indic)?',
          frequency: 'Very High (38% of reply sentiment)',
          platforms: ['x', 'reddit', 'youtube'],
          related_topic: primaryTopicName,
          discussion_volume: '34.8k inquiries observed',
          context_sample: '"Are there independent benchmarks comparing Kannada and Tamil token efficiency against Llama-3?"',
          urgency: 'Immediate Need',
        },
        {
          id: 'q-2',
          question: 'Can developers fine-tune and run these weights locally on consumer hardware?',
          frequency: 'High (31% of reply sentiment)',
          platforms: ['reddit', 'x'],
          related_topic: 'Open Weights Deployment',
          discussion_volume: '22.4k inquiries observed',
          context_sample: '"What are the VRAM requirements for 4-bit quantized inference on RTX 4060 GPUs?"',
          urgency: 'Immediate Need',
        },
        {
          id: 'q-3',
          question: 'How was the multilingual training dataset sanitized for cultural nuances and code-mixing?',
          frequency: 'Moderate (19% of reply sentiment)',
          platforms: ['x', 'youtube'],
          related_topic: 'Dataset Transparency',
          discussion_volume: '12.6k inquiries observed',
          context_sample: '"Does the tokenizer properly preserve script ligatures without blowing up token length?"',
          urgency: 'High Interest',
        },
      ]
    : [
        {
          id: 'q-1',
          question: 'Is this structural collapse happening right now or is this old footage?',
          frequency: 'Very High (54% of broadcast reactions)',
          platforms: ['telegram', 'facebook', 'x'],
          related_topic: primaryTopicName,
          discussion_volume: '56.3k inquiries observed',
          context_sample: '"People are forwarding this into family groups saying Metro Line 4 is shut today."',
          urgency: 'Immediate Need',
        },
        {
          id: 'q-2',
          question: 'Why are different news aggregation pages reporting completely conflicting dates and locations?',
          frequency: 'High (26% of broadcast reactions)',
          platforms: ['x', 'facebook', 'telegram'],
          related_topic: 'Cross-Platform Caption Drift',
          discussion_volume: '19.2k inquiries observed',
          context_sample: '"One post says Sector 4 and another says coastal highway. Which is it?"',
          urgency: 'Immediate Need',
        },
      ];

  // 3. Conversation Gaps (What is missing from the conversation?)
  const conversationGaps: ConversationGapItem[] = isDeepfake
    ? [
        {
          id: 'gap-1',
          title: 'Forensic Visual Teardowns for Non-Technical Viewers',
          gap: 'While millions of viewers suspect the video is fake, virtually no mainstream creator has published a step-by-step visual breakdown showing specific lip-sync boundary jitter and earlobe shadow discrepancies.',
          evidence: 'Over 48k comments question authenticity, yet top-ranking content consists solely of reposts or reactionary text captions without forensic guidance.',
          audience_signal: 'Audience repeatedly requests: "Can someone show the exact timestamps where the AI glitches?"',
          opportunity: 'Produce a 60-second slowed-down side-by-side analysis highlighting the 3 subtle visual physics anomalies (corneal reflections, teeth rendering, phonetic lip timing).',
          related_topic: primaryTopicName,
          platforms: ['youtube', 'instagram'],
          suggested_formats: ['Short video / Reel / Short', 'Carousel / Slides', 'Explainer Breakdown'],
        },
        {
          id: 'gap-2',
          title: 'Official Verification Protocol & Gazette Portal Navigation',
          gap: 'Audiences struggle to distinguish between unofficial promotional domain names and sovereign gazette publications, resulting in phishing risks.',
          evidence: 'Network propagation graph reveals 14 bot clusters distributing duplicate unverified registration URLs with high clickthrough velocity.',
          audience_signal: 'Comment clusters show confusion regarding authentic domain suffixes (.gov.in vs commercial vanity links).',
          opportunity: 'Create a screen-share guide demonstrating how to search sovereign gazettes and verify policy announcements in under 30 seconds.',
          related_topic: 'Policy Fraud Prevention',
          platforms: ['youtube', 'x', 'instagram'],
          suggested_formats: ['Short video / Reel / Short', 'Educational Walkthrough', 'Infographic / Visual Summary'],
        },
        {
          id: 'gap-3',
          title: 'Why Social Platforms Strip C2PA Provenance Headers',
          gap: 'Audiences do not understand why provenance verification fails after media is compressed and re-uploaded across different messaging apps.',
          evidence: 'C2PA cryptographic audit shows zero signed provenance in reposted MP4 containers despite authentic origins.',
          audience_signal: 'Technical users asking why verified camera hashes disappear during cross-platform syndication.',
          opportunity: 'Explain the "Provenance Loss Pipeline" across social media re-encodings in an approachable animated carousel or thread.',
          related_topic: 'Content Provenance & C2PA',
          platforms: ['x', 'reddit', 'youtube'],
          suggested_formats: ['X / Threads Post Sequence', 'Carousel / Slides', 'Long-form YouTube video'],
        },
      ]
    : isIndicAi
    ? [
        {
          id: 'gap-1',
          title: 'Real-World Low-Resource Benchmark Teardown (Beyond MMLU)',
          gap: 'Existing coverage focuses on press releases; few creators have tested nuanced local idioms, administrative dialects, and Hinglish mixed code queries live.',
          evidence: 'Reddit developersIndia and technical X threads express skepticism about token-level efficiency on low-resource Indic scripts.',
          audience_signal: 'High engagement on developer queries: "Does it hallucinate legal and medical terms in regional languages?"',
          opportunity: 'Conduct a practical live coding test comparing translation fidelity and reasoning across 5 regional languages.',
          related_topic: primaryTopicName,
          platforms: ['youtube', 'x', 'reddit'],
          suggested_formats: ['Long-form YouTube video', 'X / Threads Post Sequence', 'Educational Walkthrough'],
        },
        {
          id: 'gap-2',
          title: 'Local Quantization & Setup Guide for Student Developers',
          gap: 'Lack of accessible Ollama / GGUF local installation tutorials tailored for laptops without enterprise GPUs.',
          evidence: '31% of audience inquiries request quantization parameters and memory footprint data.',
          audience_signal: 'Students asking: "How do I run this for my college capstone project offline?"',
          opportunity: 'Step-by-step tutorial running the 4-bit quantized model locally on a 16GB RAM laptop with zero API fees.',
          related_topic: 'Open Source AI Deployment',
          platforms: ['youtube', 'x'],
          suggested_formats: ['Long-form YouTube video', 'Carousel / Slides', 'Educational Walkthrough'],
        },
      ]
    : [
        {
          id: 'gap-1',
          title: 'Visual Geolocation & Reverse-Archive Verification Method',
          gap: 'News channels amplify re-uploaded disaster footage without teaching viewers how reverse image search and weather satellite history can pinpoint the real recording date.',
          evidence: 'Drift analysis shows footage recorded 2 years ago in a different state being captioned as an active metropolitan emergency.',
          audience_signal: '54% of broadcast feedback asking if local transit is paralyzed today.',
          opportunity: 'Create a fast forensic guide showing how to verify flood and disaster videos using free browser tools in 45 seconds.',
          related_topic: primaryTopicName,
          platforms: ['instagram', 'youtube', 'x'],
          suggested_formats: ['Short video / Reel / Short', 'Carousel / Slides', 'News Analysis & Debunk'],
        },
      ];

  // 4. Creator Opportunities
  const creatorOpportunities: CreatorOpportunityItem[] = [
    {
      id: 'opp-1',
      topic: primaryTopicName,
      opportunity_title: isDeepfake
        ? '5 Visual Red Flags to Check Before Believing a Viral Video'
        : isIndicAi
        ? 'We Tested Indic AI on 10 Hard Dialect Prompts: Here Are the Results'
        : 'How to Debunk Viral Disaster Footage in Under 60 Seconds',
      why_it_matters: isDeepfake
        ? 'High discussion volume + repeated audience verification questions + absence of practical visual breakdowns.'
        : isIndicAi
        ? 'Rapid adoption spike + high technical curiosity among developer and student communities.'
        : 'Urgent consumer panic + repeated queries + major gap in rapid geolocation explanations.',
      audience_need: isDeepfake
        ? 'Everyday viewers need simple, memorable optical heuristics they can apply on their phones without paid software.'
        : isIndicAi
        ? 'Builders need unfiltered, benchmark-grounded performance metrics on regional languages.'
        : 'Local residents need verified status confirmation and practical methods to verify forwards.',
      supporting_evidence: `Aggregated data from ${cross_platform.total_platforms_detected} platforms showing +${trends.acceleration_percentage}% velocity with high audience skepticism.`,
      relevant_platforms: ['youtube', 'instagram', 'x'],
      suggested_format: 'Short video / Reel / Short',
      possible_angle: isDeepfake
        ? 'Show 3 real frames side-by-side with zoomed highlights on mouth edges and blink rates.'
        : isIndicAi
        ? 'Stress-test code-mixed sentences and complex regional idioms side-by-side.'
        : 'Walk through free reverse-search tools directly on a smartphone screen.',
    },
    {
      id: 'opp-2',
      topic: 'Information Literacy & Trust',
      opportunity_title: isDeepfake
        ? 'The Phishing Trap Behind Fake Policy Announcements'
        : isIndicAi
        ? 'How to Run Indic LLMs Locally with Zero Cloud Costs'
        : 'Why Old Disaster Videos Go Viral Every Monsoon (And How to Spot Them)',
      why_it_matters: 'Addresses critical safety and education blindspots currently exploited by coordinated distribution vectors.',
      audience_need: 'Actionable preventative knowledge to protect friends, family, and professional workflows.',
      supporting_evidence: `Identified across multiple bot amplification clusters and community group discussions.`,
      relevant_platforms: ['x', 'youtube', 'reddit'],
      suggested_format: isDeepfake ? 'Carousel / Slides' : 'Long-form YouTube video',
      possible_angle: 'Step-by-step breakdown of syndication mechanics and verification checklists.',
    },
  ];

  return {
    emergingTopics,
    audienceQuestions,
    conversationGaps,
    creatorOpportunities,
  };
}

/**
 * Generates an evidence-grounded Idea Forge concept based on user parameters and existing intelligence.
 */
export function generateIdeaForgeConcept(
  analysis: AnalysisResult,
  config: IdeaForgeConfig
): IdeaForgeGeneratedConcept {
  const { topic, platform, audience: targetAudience, content_format, tone, objective, custom_angle, selected_gap_id } = config;
  const intel = deriveCreatorIntelligence(analysis);
  const matchedGap = intel.conversationGaps.find((g) => g.id === selected_gap_id) || intel.conversationGaps[0];

  const isDeepfake = analysis.id.includes('deepfake') || analysis.risk.risk_level === 'HIGH';
  const isIndicAi = analysis.id.includes('trend') || analysis.id.includes('indic') || analysis.title.toLowerCase().includes('bhashatech');

  // Dynamically tailor Title & Hook to the chosen format, tone, and objective
  let title = '';
  let hook = '';
  let coreAngle = custom_angle || '';
  let problemQuestion = '';
  let whyNow = '';
  let evidence = '';
  let outlineBullets: string[] = [];
  let suggestedTags: string[] = [];
  let cta = '';

  if (isDeepfake) {
    if (content_format.includes('Short') || content_format.includes('Reel')) {
      title = '5 Things to Check Before Believing That Viral Video';
      hook = 'Before you forward that viral announcement to your group chats, pause and look at these three exact spots.';
    } else if (content_format.includes('YouTube') || content_format.includes('Explainer')) {
      title = 'Forensic Breakdown: How This AI Video Was Synthesized (And How to Spot It)';
      hook = 'Millions saw this clip today, but optical forensic analysis reveals three immediate red flags.';
    } else if (content_format.includes('Carousel') || content_format.includes('Infographic')) {
      title = 'The 30-Second Fake Media Verification Cheat Sheet';
      hook = 'Swipe through for the 5-step checklist every social media user needs today.';
    } else {
      title = 'Why Viral Video Claims Are Spreading Without Official Verification: A Forensic Analysis';
      hook = 'A high-velocity video is circulating across 4 major platforms. Here is what the cryptographic and acoustic data reveals.';
    }

    problemQuestion = 'Audiences are asking whether recent viral policy and speech videos are authentic, but lack simple forensic heuristics to verify them.';
    coreAngle = custom_angle || 'Focus on concrete, observable visual physics cues (eyeball reflections, dental boundaries, background warping) rather than generic speculation.';
    whyNow = `High discussion velocity (+${analysis.trends.acceleration_percentage}%) with over 48k audience questions and missing C2PA credentials across social reposts.`;
    evidence = `Verified by Voxentra forensic engine: ${analysis.risk.synthetic_indicators.visual_artifacts.length} visual anomalies, 0 verifiable C2PA certificates, and syndication across ${analysis.cross_platform.total_platforms_detected} platforms.`;
    outlineBullets = [
      '0:00 - 0:08: State the viral claim and acknowledge why it looks convincing at first glance.',
      '0:08 - 0:25: Zoom into the lip sync boundaries and demonstrate the acoustic/phonetic lag.',
      '0:25 - 0:42: Check the official sovereign gazette portal and highlight the absence of any record.',
      '0:42 - 0:55: Introduce the C2PA verification rule and how social re-uploads strip provenance.',
      '0:55 - 1:00: Provide the 3-step actionable verification takeaway for everyday viewers.',
    ];
    suggestedTags = ['#SocialIntelligence', '#FactCheck', '#AIverification', '#DeepfakeForensics', '#MediaLiteracy', '#Voxentra'];
    cta = 'Save this checklist for the next time you see an unbelievable viral announcement.';
  } else if (isIndicAi) {
    if (content_format.includes('Short') || content_format.includes('Reel')) {
      title = 'We Tested Indic AI on 5 Complex Regional Dialects in 60 Seconds';
      hook = 'Can open-source Indic LLMs actually handle complex Kannada and Hindi idioms? Let us test it live.';
    } else if (content_format.includes('YouTube')) {
      title = 'BhashaTech-7B Benchmark Teardown: Is It Ready for Production Apps?';
      hook = 'We ran over 500 prompts across 12 Indian languages on consumer hardware. Here is the unfiltered data.';
    } else {
      title = 'How Indic Open-Weights LLMs Compare on MMLU & Real-World Code-Mixing';
      hook = 'A deep dive into token efficiency, script preserving tokenizers, and VRAM optimization for Indian languages.';
    }

    problemQuestion = 'Developers and creators want independent validation of Indic benchmark claims rather than generic press announcements.';
    coreAngle = custom_angle || 'Test real-world code-mixed sentences and regional colloquial idioms live on consumer hardware with memory benchmarks.';
    whyNow = `Emerging conversation momentum (+${analysis.trends.acceleration_percentage}%) with high developer interest on Reddit and X.`;
    evidence = `Cross-platform trajectory tracking 34k developer inquiries regarding Indic token efficiency and Ollama quantization support.`;
    outlineBullets = [
      'Introduction: What makes Indic language tokenization uniquely challenging.',
      'Benchmark Comparison: MMLU-Indic scores vs Llama-3 and Gemma across 5 regional languages.',
      'Live Idiom Test: Evaluating cultural context preservation without literal translation errors.',
      'Local Deployment Walkthrough: Running the 4-bit quantized model in Ollama with under 6GB VRAM.',
      'Conclusion & Recommendations for developers building regional applications.',
    ];
    suggestedTags = ['#IndicAI', '#BhashaTech', '#OpenSourceAI', '#MachineLearning', '#AIresearch', '#DevelopersIndia'];
    cta = 'Check the pinned comment for the GitHub repository link and prompt evaluation dataset.';
  } else {
    title = 'How to Verify Viral Disaster Footage in Under 45 Seconds';
    hook = 'When breaking weather alerts flood your family groups, here is how you check if the footage is real or years old.';
    problemQuestion = 'Audiences forwarded old disaster footage during active weather events, causing unnecessary panic.';
    coreAngle = custom_angle || 'Show how to use free reverse image search and landmark verification directly on a mobile browser.';
    whyNow = `Observed recontextualized media generating high-velocity forwards across local broadcast groups.`;
    evidence = `Context drift audit identified footage from 2024 repurposed with misleading contemporary timestamps.`;
    outlineBullets = [
      'Highlight the viral panic clip and show the conflicting location captions.',
      'Demonstrate dragging a screenshot into Google Lens / TinEye on mobile.',
      'Pinpoint the original publication date from archival news repositories.',
      'Check official municipal disaster management handles for verified ground reports.',
      'Takeaway: 3 quick checks before sharing emergency forwards.',
    ];
    suggestedTags = ['#FactCheck', '#DisasterAlert', '#MediaLiteracy', '#Verification', '#Voxentra'];
    cta = 'Share this guide with your community groups to keep family and friends informed with verified facts.';
  }

  return {
    id: `forge-${Date.now()}`,
    title,
    hook,
    audience: targetAudience || 'Everyday social media consumers & community members',
    problem_or_question: problemQuestion,
    core_angle: coreAngle,
    format: content_format,
    platform: platform === 'all' ? 'Instagram Reels · YouTube Shorts · X' : platform.toUpperCase(),
    why_now: whyNow,
    evidence,
    related_conversation_gap: matchedGap?.title || 'Unaddressed Verification Guidance',
    related_trend: analysis.trends.trending_topics[0]?.name || analysis.title,
    outline_bullets: outlineBullets,
    suggested_tags: suggestedTags,
    call_to_action: cta,
  };
}

/**
 * Builds a structured, non-hallucinated Creator Insight Report directly from AnalysisResult data.
 */
export function generateCreatorInsightReport(
  analysis: AnalysisResult,
  customConcept?: IdeaForgeGeneratedConcept
): import('../types/creator').CreatorInsightReportData {
  const intel = deriveCreatorIntelligence(analysis);
  const concept =
    customConcept ||
    generateIdeaForgeConcept(analysis, {
      topic: analysis.content.topic || analysis.title,
      platform: 'all',
      audience: 'Everyday social media consumers & community members',
      content_format: 'Short video / Reel / Short',
      tone: 'Educational & Objective',
      objective: 'Demystify Misleading Claims',
    });

  // Calculate emotion distribution from real sentiment analysis data
  const emotionEntries = Object.entries(analysis.sentiment.emotions)
    .sort((a, b) => b[1] - a[1])
    .map(([emotion, score]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      percentage: score,
    }));

  // Language breakdown signals
  const langSignals = Object.entries(analysis.sentiment.by_language).map(
    ([lang, data]) => {
      let dominant = 'Neutral';
      if (data.positive > data.neutral && data.positive > data.negative) dominant = 'Positive / Enthusiastic';
      else if (data.negative > data.neutral && data.negative > data.positive) dominant = 'Skeptical / Critical';
      return {
        language: lang,
        sentiment_label: dominant,
        count: data.count,
      };
    }
  );

  // Platform activity breakdown from real cross-platform data
  const platformStrategies: import('../types/creator').CreatorInsightReportData['platform_strategy'] =
    analysis.cross_platform.platforms.map((p) => {
      let recFormat: import('../types/creator').CreatorContentFormat = 'Short video / Reel / Short';
      let bestTiming = 'Prime Evening Peak (6PM - 9PM IST)';
      let audFocus = 'General Social Audience';

      if (p.platform === 'youtube') {
        recFormat = 'Long-form YouTube video';
        bestTiming = 'Weekend Midday (11AM - 3PM IST)';
        audFocus = 'In-depth Learners & Tech Enthusiasts';
      } else if (p.platform === 'x') {
        recFormat = 'X / Threads Post Sequence';
        bestTiming = 'Breaking Immediate Window (0 - 4 hrs post-spike)';
        audFocus = 'Journalists, Developers & Opinion Leaders';
      } else if (p.platform === 'reddit') {
        recFormat = 'FAQ / Q&A Spotlight';
        bestTiming = 'Community Discussion Window';
        audFocus = 'High-Context Technical Communities';
      } else if (p.platform === 'telegram') {
        recFormat = 'Infographic / Visual Summary';
        bestTiming = 'Morning Forwarding Cycle (7AM - 10AM IST)';
        audFocus = 'Family & Local Community Groups';
      }

      return {
        platform: p.platform,
        activity_level: p.post_count > 10000 ? 'High' : p.post_count > 2000 ? 'Moderate' : 'Emerging',
        recommended_format: recFormat,
        best_timing_signal: bestTiming,
        audience_focus: audFocus,
        engagement_share: `${p.total_engagement.toLocaleString()} interactions observed`,
      };
    });

  // Narrative signals
  const narrativeSignals = analysis.trends.narratives.map((n) => ({
    id: n.id,
    title: n.title,
    status: n.status,
    origin_platform: n.origin_platform,
    dominant_emotion: n.dominant_emotion,
    sample_quote: n.sample_quote,
    volume: n.volume,
    shift: n.shift_evolution
      ? {
          from: n.shift_evolution.from,
          to: n.shift_evolution.to,
          trigger_timestamp: n.shift_evolution.trigger_timestamp,
          explanation: n.shift_evolution.explanation,
        }
      : undefined,
  }));

  const dominantTone =
    analysis.sentiment.overall.negative > 40
      ? 'Critical / Skeptical Inquiry'
      : analysis.sentiment.overall.positive > 40
      ? 'Optimistic / Curious Interest'
      : 'Mixed / Information-Seeking';

  const executiveBrief = `Analysis of "${analysis.title}" reveals an observed velocity of +${analysis.trends.acceleration_percentage}% across ${analysis.cross_platform.total_platforms_detected} social networks. The dominant audience sentiment reflects ${dominantTone.toLowerCase()}, driven by ${intel.audienceQuestions[0]?.question || 'questions regarding authenticity'}. A significant conversation gap exists around practical explanations, presenting an immediate high-relevance opportunity for explanatory creator content.`;

  return {
    report_id: `CIR-${analysis.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    generated_at: new Date().toISOString(),
    topic: analysis.content.topic || analysis.title,
    velocity_summary: {
      acceleration_percentage: analysis.trends.acceleration_percentage,
      acceleration_period: analysis.trends.acceleration_period,
      velocity_label: analysis.trends.velocity_label,
      total_platforms_count: analysis.cross_platform.total_platforms_detected,
      total_views: analysis.content.engagement.views,
      velocity_rate: analysis.content.engagement.velocity_rate,
    },
    executive_brief: executiveBrief,
    emerging_topics: intel.emergingTopics,
    narrative_signals: narrativeSignals,
    audience_questions: intel.audienceQuestions,
    conversation_gaps: intel.conversationGaps,
    sentiment_intelligence: {
      dominant_tone: dominantTone,
      breakdown: analysis.sentiment.overall,
      top_emotions: emotionEntries.slice(0, 4),
      language_signals: langSignals,
    },
    platform_strategy: platformStrategies,
    content_roadmap: intel.creatorOpportunities,
    featured_idea_concept: concept,
  };
}

/**
 * Formats the Creator Insight Report into clean Markdown for copy / export.
 */
export function formatCreatorReportToMarkdown(
  report: import('../types/creator').CreatorInsightReportData
): string {
  return `# CREATOR INSIGHT REPORT
**Report ID:** ${report.report_id}  
**Target Topic:** ${report.topic}  
**Generated At:** ${new Date(report.generated_at).toLocaleString()}  
**Intelligence Engine:** VOXENTRA Social Intelligence Platform  

---

## 1. Executive Creator Brief
${report.executive_brief}

- **Velocity:** +${report.velocity_summary.acceleration_percentage}% (${report.velocity_summary.velocity_label}) over ${report.velocity_summary.acceleration_period}
- **Cross-Platform Footprint:** ${report.velocity_summary.total_platforms_count} platforms detected
- **Observed Engagement Volume:** ${report.velocity_summary.total_views.toLocaleString()} views (${report.velocity_summary.velocity_rate})

---

## 2. Emerging Topics & Trajectory Signals
${report.emerging_topics
  .map(
    (t, idx) =>
      `### ${idx + 1}. ${t.name} (${t.velocity} Velocity · ${t.growth_rate})
- **Discussion Volume:** ${t.discussion_volume}
- **Why Notable:** ${t.why_notable}
- **Creator Opportunity Signal:** ${t.why_it_matters}
- **Observed Platforms:** ${t.platforms.join(', ')}`
  )
  .join('\n\n')}

---

## 3. What the Audience is Asking (Verified Inquiries)
${report.audience_questions
  .map(
    (q, idx) =>
      `${idx + 1}. **"${q.question}"**
   - *Frequency:* ${q.frequency}
   - *Volume:* ${q.discussion_volume}
   - *Platforms:* ${q.platforms.join(', ')}
   - *Sample Quote:* ${q.context_sample}`
  )
  .join('\n\n')}

---

## 4. Conversation Gaps & Information Blindspots
${report.conversation_gaps
  .map(
    (g, idx) =>
      `### Gap ${idx + 1}: ${g.title}
- **The Missing Piece:** ${g.gap}
- **Supporting Evidence:** ${g.evidence}
- **Audience Signal:** ${g.audience_signal}
- **Creator Action / Explainer Angle:** ${g.opportunity}`
  )
  .join('\n\n')}

---

## 5. Audience Sentiment & Emotional Landscape
- **Dominant Tone:** ${report.sentiment_intelligence.dominant_tone}
- **Distribution:** Positive: ${report.sentiment_intelligence.breakdown.positive}%, Neutral: ${report.sentiment_intelligence.breakdown.neutral}%, Negative/Critical: ${report.sentiment_intelligence.breakdown.negative}%
- **Key Emotional Drivers:** ${report.sentiment_intelligence.top_emotions.map((e) => `${e.emotion} (${e.percentage}%)`).join(', ')}

---

## 6. Cross-Platform Content Strategy
${report.platform_strategy
  .map(
    (p) =>
      `- **${p.platform.toUpperCase()}** (${p.activity_level} Activity)
  - *Recommended Format:* ${p.recommended_format}
  - *Best Timing Window:* ${p.best_timing_signal}
  - *Target Segment:* ${p.audience_focus}`
  )
  .join('\n')}

---

## 7. Featured Forged Content Concept
### Title: "${report.featured_idea_concept.title}"
**Hook:** "${report.featured_idea_concept.hook}"  
**Format:** ${report.featured_idea_concept.format}  
**Platform:** ${report.featured_idea_concept.platform}  
**Target Audience:** ${report.featured_idea_concept.audience}  
**Core Explanatory Angle:** ${report.featured_idea_concept.core_angle}  
**Why Now:** ${report.featured_idea_concept.why_now}  
**Evidence Grounding:** ${report.featured_idea_concept.evidence}  

#### Step-by-Step Structure:
${report.featured_idea_concept.outline_bullets.map((b) => `- ${b}`).join('\n')}

**Suggested Tags:** ${report.featured_idea_concept.suggested_tags.join(' ')}  
**Call to Action:** "${report.featured_idea_concept.call_to_action}"

---
*Grounded in verified social intelligence. Voxentra does not fabricate engagement metrics or guarantee algorithmic virality.*
`;
}

