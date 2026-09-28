-- ============================================================================
-- VOXENTRA Social Intelligence Analyzer
-- Supabase PostgreSQL Schema with Row Level Security (RLS)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users / Analysts Table (Anonymized)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pseudonym TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'analyst',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Analyses Master Table
CREATE TABLE IF NOT EXISTS public.analyses (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  input_type TEXT NOT NULL CHECK (input_type IN ('content', 'topic', 'account')),
  target_platform TEXT NOT NULL,
  target_query TEXT NOT NULL,
  title TEXT NOT NULL,
  data_source_type TEXT NOT NULL,
  ai_engine TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'CAUTION', 'HIGH')),
  risk_confidence TEXT NOT NULL,
  what_is_happening TEXT,
  who_is_driving_it TEXT,
  how_is_it_spreading TEXT,
  what_are_people_feeling TEXT,
  what_are_the_main_narratives TEXT,
  raw_payload JSONB NOT NULL
);

-- 3. Social Content Items
CREATE TABLE IF NOT EXISTS public.social_content (
  id TEXT PRIMARY KEY,
  analysis_id TEXT REFERENCES public.analyses(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  author_pseudonym TEXT NOT NULL,
  content_type TEXT NOT NULL,
  text_content TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  views_count BIGINT DEFAULT 0,
  likes_count BIGINT DEFAULT 0,
  shares_count BIGINT DEFAULT 0,
  comments_count BIGINT DEFAULT 0,
  velocity_rate TEXT,
  primary_language TEXT,
  location_region TEXT,
  source_reference TEXT
);

-- 4. Risk Signals Table
CREATE TABLE IF NOT EXISTS public.risk_signals (
  id TEXT PRIMARY KEY,
  analysis_id TEXT REFERENCES public.analyses(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('synthetic_media', 'provenance', 'context', 'propagation')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'caution', 'high')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence TEXT[] DEFAULT '{}',
  technical_details TEXT
);

-- 5. Audience Segments (Aggregated & Anonymized Only)
CREATE TABLE IF NOT EXISTS public.audience_segments (
  id TEXT PRIMARY KEY,
  analysis_id TEXT REFERENCES public.analyses(id) ON DELETE CASCADE,
  segment_name TEXT NOT NULL,
  age_band TEXT NOT NULL,
  share_percentage NUMERIC NOT NULL,
  dominant_stance TEXT NOT NULL,
  support_percentage NUMERIC NOT NULL,
  oppose_percentage NUMERIC NOT NULL,
  sample_size INTEGER NOT NULL,
  key_drivers TEXT
);

-- 6. Network Topology Nodes
CREATE TABLE IF NOT EXISTS public.network_nodes (
  id TEXT PRIMARY KEY,
  analysis_id TEXT REFERENCES public.analyses(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  node_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  centrality NUMERIC NOT NULL,
  cluster_id INTEGER NOT NULL
);

-- 7. Network Topology Edges
CREATE TABLE IF NOT EXISTS public.network_edges (
  id TEXT PRIMARY KEY,
  analysis_id TEXT REFERENCES public.analyses(id) ON DELETE CASCADE,
  source_node TEXT NOT NULL,
  target_node TEXT NOT NULL,
  edge_type TEXT NOT NULL,
  weight NUMERIC NOT NULL DEFAULT 1.0
);

-- 8. Timeline Events
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id TEXT PRIMARY KEY,
  analysis_id TEXT REFERENCES public.analyses(id) ON DELETE CASCADE,
  event_timestamp TIMESTAMPTZ NOT NULL,
  platform TEXT NOT NULL,
  phase TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sentiment_snapshot TEXT,
  risk_indicator TEXT
);

-- 9. Generated Reports
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  analysis_id TEXT REFERENCES public.analyses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  summary TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  report_data JSONB NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Read policy for public/authenticated users
CREATE POLICY "Allow read analyses" ON public.analyses FOR SELECT USING (true);
CREATE POLICY "Allow insert analyses" ON public.analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Allow insert reports" ON public.reports FOR INSERT WITH CHECK (true);

-- Indexing for high-throughput queries
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_risk_level ON public.analyses (risk_level);
CREATE INDEX IF NOT EXISTS idx_social_content_analysis_id ON public.social_content (analysis_id);
CREATE INDEX IF NOT EXISTS idx_risk_signals_analysis_id ON public.risk_signals (analysis_id);
