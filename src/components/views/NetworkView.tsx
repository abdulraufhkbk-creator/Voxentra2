import React, { useState, useEffect } from 'react';
import { AnalysisResult, NetworkNode, NetworkEdge } from '../../types/analysis';
import {
  Share2,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { PlatformIcon } from '../common/PlatformIcon';

import { EmptyAnalysisState } from '../common/EmptyAnalysisState';

interface NetworkViewProps {
  analysis: AnalysisResult | null;
  onNavigateToAnalyze?: () => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({ analysis, onNavigateToAnalyze }) => {
  if (!analysis) {
    return (
      <EmptyAnalysisState
        title="No Network Graph Available"
        description="Ingest real content or run an account audit to view network diffusion nodes and amplification reach."
        onAction={onNavigateToAnalyze}
      />
    );
  }

  const { network } = analysis;
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(
    network.nodes[0] || null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(network.edges.length);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= network.edges.length) {
            setIsPlaying(false);
            return network.edges.length;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isPlaying, network.edges.length]);

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setActiveStep(1);
  };

  const handlePlayToggle = () => {
    if (activeStep >= network.edges.length) {
      setActiveStep(1);
    }
    setIsPlaying(!isPlaying);
  };

  const totalNodes = network.nodes.length;
  const centerX = 360;
  const centerY = 240;
  const radius = 165;

  const nodePositions = new Map<string, { x: number; y: number }>();
  const nonSeedNodes = network.nodes.filter((n) => !n.is_seed);
  const totalNonSeed = Math.max(1, nonSeedNodes.length);

  let nonSeedIdx = 0;
  network.nodes.forEach((node) => {
    if (node.is_seed) {
      nodePositions.set(node.id, { x: centerX, y: centerY });
    } else {
      const angle = (nonSeedIdx / totalNonSeed) * 2 * Math.PI - Math.PI / 2;
      const dist = radius + (nonSeedIdx % 2 === 0 ? 25 : -20);
      nodePositions.set(node.id, {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
      });
      nonSeedIdx++;
    }
  });

  const visibleEdges = network.edges.slice(0, activeStep);

  return (
    <div className="p-4 sm:p-6 lg:p-9 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#111111] mb-1">
            <span>PROPAGATION TOPOLOGY</span>
            <span className="text-[#A39989]">/</span>
            <span>HOW IS IT SPREADING?</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Network & Influence Propagation Graph
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5A54] mt-1.5 max-w-2xl leading-relaxed">
            Interactive link topology mapping accounts, communities, broadcast hubs, and automated bot syndication rings driving message velocity.
          </p>
        </div>

        {/* Playback & Step Controls */}
        <div className="liquid-glass rounded-2xl p-2.5 flex items-center gap-2.5 text-xs border border-white/80 shadow-xs">
          <button
            onClick={handlePlayToggle}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#2A2A2A] text-[#F8F5EF] font-bold transition-all cursor-pointer shadow-xs"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
          </button>

          <button
            onClick={handleResetPlayback}
            className="p-2 text-[#5E5A54] hover:text-[#111111] rounded-xl hover:bg-white/60 transition-colors cursor-pointer"
            title="Reset to origin"
          >
            <RotateCcw size={15} />
          </button>

          <div className="text-[11px] text-[#5E5A54] px-2 font-mono font-bold">
            Hop {activeStep} of {network.edges.length}
          </div>
        </div>
      </div>

      {/* Primary Key Finding */}
      <div className="bg-[#111111] text-[#F8F5EF] rounded-3xl p-6 sm:p-8 space-y-2.5 shadow-md">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-[#D8CFC2] flex items-center gap-1.5">
          <Share2 size={14} />
          <span>Cross-Platform Propagation Pattern</span>
        </h2>
        <div className="text-base sm:text-xl font-bold leading-relaxed text-white">
          {analysis.answers.how_is_it_spreading}
        </div>
      </div>

      {/* Main Interactive Graph and Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Network Graph (2 Columns) */}
        <div className="lg:col-span-2 liquid-glass rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[520px] border border-white/80 shadow-sm">
          {/* Top Controls */}
          <div className="flex items-center justify-between z-10 text-xs pb-3 border-b border-[#D8CFC2]/60">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#111111] uppercase font-bold tracking-wider">
                Graph Topology
              </span>
              <span className="text-[#A39989]">·</span>
              <span className="text-[#5E5A54] font-mono text-[11px] font-semibold">
                {network.nodes.length} Nodes · {visibleEdges.length} Active Edges
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/80 border border-[#D8CFC2] rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                className="p-1 text-[#5E5A54] hover:text-[#111111] rounded"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-[10px] text-[#111111] font-mono font-bold px-1.5">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                className="p-1 text-[#5E5A54] hover:text-[#111111] rounded"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* SVG Canvas with warm cream aesthetic */}
          <div className="w-full flex-1 flex items-center justify-center overflow-hidden my-3">
            <svg
              viewBox="0 0 720 480"
              className="w-full h-full max-h-[460px] select-none rounded-2xl bg-[#F8F5EF]/90 border border-[#D8CFC2]/50 shadow-inner"
            >
              {/* Subtle warm dot pattern */}
              <defs>
                <pattern id="warmgrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#D8CFC2" />
                </pattern>
                <marker
                  id="arrow-black"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
                </marker>
              </defs>
              <rect width="720" height="480" fill="url(#warmgrid)" />

              {/* Scaled Graph Container */}
              <g
                transform={`translate(${centerX * (1 - zoomLevel)}, ${centerY * (1 - zoomLevel)}) scale(${zoomLevel})`}
                className="transition-transform duration-200 ease-out"
              >
                {/* Render Active Edges */}
                {visibleEdges.map((edge) => {
                  const src = nodePositions.get(edge.source);
                  const tgt = nodePositions.get(edge.target);
                  if (!src || !tgt) return null;
                  const isCrossPlatform = edge.type === 'cross_platform_propagation';

                  return (
                    <g key={edge.id} className="transition-all duration-300">
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={tgt.x}
                        y2={tgt.y}
                        stroke={isCrossPlatform ? '#8E44AD' : '#111111'}
                        strokeWidth={edge.weight * 2.2}
                        strokeDasharray={isCrossPlatform ? '4 2' : 'none'}
                        opacity={0.7}
                        markerEnd="url(#arrow-black)"
                      />
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {network.nodes.map((node) => {
                  const pos = nodePositions.get(node.id) || { x: centerX, y: centerY };
                  const isSelected = selectedNode?.id === node.id;
                  const radiusSize = node.is_seed ? 22 : 12 + node.centrality * 12;

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    >
                      {/* Ring indicator */}
                      {(node.is_seed || isSelected) && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={radiusSize + 6}
                          fill="none"
                          stroke="#111111"
                          strokeWidth="1.5"
                          strokeDasharray={node.is_seed ? 'none' : '3 2'}
                          className="animate-pulse"
                        />
                      )}

                      {/* Node circle */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={radiusSize}
                        fill={
                          node.is_seed
                            ? '#111111'
                            : node.type === 'content_cluster'
                            ? '#C0392B'
                            : node.type === 'channel'
                            ? '#2A86C8'
                            : '#5E5A54'
                        }
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        className="shadow-sm"
                      />

                      {/* Label */}
                      <text
                        x={pos.x}
                        y={pos.y + radiusSize + 15}
                        textAnchor="middle"
                        fill="#111111"
                        fontSize="10"
                        fontWeight={node.is_seed || isSelected ? '800' : '600'}
                        className="pointer-events-none"
                      >
                        {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Graph Legend */}
          <div className="pt-3 border-t border-[#D8CFC2]/60 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#5E5A54]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#111111] inline-block" />
                <span>Origin Seed</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A86C8] inline-block" />
                <span>Broadcast Hub</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B] inline-block" />
                <span>Bot / Coordinated Ring</span>
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-4 h-0.5 border-t border-dashed border-[#8E44AD] inline-block" />
                <span>Cross-Platform Hop</span>
              </span>
            </div>
            <div className="font-mono text-[#7D786F]">Click any node to inspect</div>
          </div>
        </div>

        {/* Selected Node Inspector Drawer (1 Column) */}
        <div className="space-y-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-4 border border-white/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8CFC2]/60">
              <h3 className="font-black text-[#111111] text-sm">Node Intelligence</h3>
              {selectedNode?.is_seed && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#111111] text-[#F8F5EF]">
                  SEED ORIGIN
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-[#7D786F] text-[10px] uppercase font-bold">Label</div>
                  <div className="font-black text-[#111111] text-sm mt-0.5">{selectedNode.label}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/80 p-3 rounded-xl border border-[#D8CFC2]/70 shadow-2xs">
                    <span className="text-[10px] text-[#7D786F] uppercase font-bold block">Platform</span>
                    <div className="flex items-center gap-1.5 font-bold text-[#111111] mt-1 capitalize">
                      <PlatformIcon platform={selectedNode.platform} size={14} />
                      <span>{selectedNode.platform}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-3 rounded-xl border border-[#D8CFC2]/70 shadow-2xs">
                    <span className="text-[10px] text-[#7D786F] uppercase font-bold block">Centrality</span>
                    <span className="font-mono text-[#111111] font-black text-sm block mt-1">
                      {(selectedNode.centrality * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[#7D786F] text-[10px] uppercase font-bold">Identified Role</div>
                  <p className="text-[#5E5A54] mt-1 leading-relaxed bg-white/70 p-3 rounded-xl border border-[#D8CFC2]/70 shadow-2xs font-medium">
                    {selectedNode.role_description || 'Participant in message amplification chain.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-[#7D786F]">
                  <span>First Observed:</span>
                  <span className="font-mono text-[#111111] font-bold">{selectedNode.first_seen} UTC</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#7D786F] italic py-8 text-center">
                Select a node from the network graph to inspect centrality and connection dynamics.
              </div>
            )}
          </div>

          {/* Propagation Reach & Metrics Summary */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-7 space-y-3.5 text-xs border border-white/80 shadow-xs">
            <h3 className="font-black text-[#111111] text-sm pb-2 border-b border-[#D8CFC2]/60">
              Macro Topology Metrics
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-[#5E5A54] font-medium">Estimated Reach:</span>
              <span className="font-mono font-bold text-[#111111]">
                {network.propagation_metrics.total_reach.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5E5A54] font-medium">Cross-Platform Hops:</span>
              <span className="font-mono font-bold text-[#111111]">
                {network.propagation_metrics.cross_platform_hops} platforms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5E5A54] font-medium">Amplification Factor:</span>
              <span className="font-mono font-bold text-[#111111]">
                {network.propagation_metrics.amplification_factor}
              </span>
            </div>

            <div className="pt-2 border-t border-[#D8CFC2]/60 space-y-1.5">
              <span className="text-[10px] uppercase text-[#7D786F] font-bold block">
                Primary Diffusion Hubs:
              </span>
              {network.propagation_metrics.primary_hubs.map((hub, i) => (
                <div key={i} className="text-[#111111] text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                  <span>{hub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
