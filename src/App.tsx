import React, { useState, useMemo } from 'react';
import { Shield, AlertTriangle, Radio, Wifi, Activity, Target, Zap, Shield as ShieldIcon } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { Graph } from './components/Graph';
import { NetworkGraph } from './components/NetworkGraph';
import { AdvancedMetrics } from './components/AdvancedMetrics';
import { SearchPanel } from './components/SearchPanel';

// Enhanced social media network data
const networkData = {
  nodes: [
    // Twitter Influencers
    { id: "@techleader", platform: "twitter", type: "influencer", group: 1, value: 15, sentiment: 0.9, engagement: 95, followers: 250000, posts: 1200, threatLevel: "low" },
    { id: "@newsbreaker", platform: "twitter", type: "influencer", group: 1, value: 12, sentiment: 0.7, engagement: 88, followers: 180000, posts: 3400, threatLevel: "medium" },
    { id: "@viral_tweets", platform: "twitter", type: "influencer", group: 1, value: 10, sentiment: 0.6, engagement: 92, followers: 120000, posts: 5600, threatLevel: "low" },
    
    // Reddit Communities
    { id: "r/technology", platform: "reddit", type: "community", group: 2, value: 14, sentiment: 0.8, engagement: 90, followers: 500000, posts: 8900, threatLevel: "low" },
    { id: "r/programming", platform: "reddit", type: "community", group: 2, value: 13, sentiment: 0.85, engagement: 87, followers: 450000, posts: 7800, threatLevel: "low" },
    { id: "r/conspiracy", platform: "reddit", type: "community", group: 2, value: 11, sentiment: -0.4, engagement: 75, followers: 200000, posts: 12000, threatLevel: "high" },
    
    // LinkedIn Profiles
    { id: "tech_ceo", platform: "linkedin", type: "account", group: 3, value: 12, sentiment: 0.95, engagement: 89, followers: 80000, posts: 450, threatLevel: "low" },
    { id: "startup_founder", platform: "linkedin", type: "account", group: 3, value: 10, sentiment: 0.9, engagement: 86, followers: 60000, posts: 380, threatLevel: "low" },
    
    // Facebook Pages
    { id: "TechNews", platform: "facebook", type: "brand", group: 4, value: 13, sentiment: 0.8, engagement: 85, followers: 300000, posts: 2300, threatLevel: "medium" },
    { id: "InnovationDaily", platform: "facebook", type: "brand", group: 4, value: 11, sentiment: 0.75, engagement: 82, followers: 250000, posts: 1900, threatLevel: "low" },
    
    // YouTube Channels
    { id: "TechReviewer", platform: "youtube", type: "influencer", group: 5, value: 14, sentiment: 0.85, engagement: 93, followers: 750000, posts: 520, threatLevel: "low" },
    { id: "CodeTutor", platform: "youtube", type: "influencer", group: 5, value: 12, sentiment: 0.9, engagement: 91, followers: 500000, posts: 480, threatLevel: "low" },
    
    // Competitor Accounts
    { id: "rival_tech", platform: "twitter", type: "competitor", group: 6, value: 11, sentiment: -0.2, engagement: 88, followers: 150000, posts: 4500, threatLevel: "high" },
    { id: "anti_tech", platform: "reddit", type: "competitor", group: 6, value: 9, sentiment: -0.6, engagement: 85, followers: 90000, posts: 3200, threatLevel: "critical" },
    
    // Bot Networks
    { id: "bot_network_1", platform: "twitter", type: "competitor", group: 7, value: 8, sentiment: -0.8, engagement: 70, followers: 50000, posts: 15000, threatLevel: "critical" },
    { id: "spam_cluster", platform: "facebook", type: "competitor", group: 7, value: 7, sentiment: -0.7, engagement: 65, followers: 30000, posts: 12000, threatLevel: "high" }
  ],
  links: [
    // Twitter Connections
    { source: "@techleader", target: "@newsbreaker", value: 9, type: "strong", sentiment: 0.8, interactions: 1200 },
    { source: "@techleader", target: "@viral_tweets", value: 7, type: "strong", sentiment: 0.7, interactions: 800 },
    
    // Reddit Interactions
    { source: "r/technology", target: "r/programming", value: 8, type: "strong", sentiment: 0.9, interactions: 5000 },
    { source: "r/conspiracy", target: "anti_tech", value: 6, type: "risk", sentiment: -0.5, interactions: 3000 },
    
    // Cross-platform Influence
    { source: "@techleader", target: "tech_ceo", value: 7, type: "strong", sentiment: 0.85, interactions: 600 },
    { source: "TechNews", target: "r/technology", value: 6, type: "strong", sentiment: 0.8, interactions: 2500 },
    
    // YouTube Connections
    { source: "TechReviewer", target: "CodeTutor", value: 8, type: "strong", sentiment: 0.9, interactions: 1500 },
    { source: "TechReviewer", target: "@techleader", value: 7, type: "strong", sentiment: 0.85, interactions: 900 },
    
    // Competitor Activities
    { source: "rival_tech", target: "bot_network_1", value: 5, type: "risk", sentiment: -0.7, interactions: 4000 },
    { source: "anti_tech", target: "spam_cluster", value: 4, type: "risk", sentiment: -0.8, interactions: 3500 },
    
    // Community Connections
    { source: "r/technology", target: "TechNews", value: 7, type: "strong", sentiment: 0.75, interactions: 3200 },
    { source: "InnovationDaily", target: "tech_ceo", value: 6, type: "strong", sentiment: 0.8, interactions: 1800 },
    
    // Bot Network Activities
    { source: "bot_network_1", target: "@viral_tweets", value: 4, type: "risk", sentiment: -0.6, interactions: 2800 },
    { source: "spam_cluster", target: "TechNews", value: 3, type: "risk", sentiment: -0.5, interactions: 2000 },
    
    // Influencer Collaborations
    { source: "@techleader", target: "TechReviewer", value: 8, type: "strong", sentiment: 0.9, interactions: 1100 },
    { source: "CodeTutor", target: "r/programming", value: 7, type: "strong", sentiment: 0.85, interactions: 2200 }
  ]
};

const threatData = [
  { name: '0600', value: 2400 },
  { name: '0900', value: 1398 },
  { name: '1200', value: 9800 },
  { name: '1500', value: 3908 },
  { name: '1800', value: 4800 },
  { name: '2100', value: 3800 },
  { name: '2400', value: 4300 },
];

const securityData = [
  { name: '0600', value: 3490 },
  { name: '0900', value: 4300 },
  { name: '1200', value: 2300 },
  { name: '1500', value: 5300 },
  { name: '1800', value: 4890 },
  { name: '2100', value: 8390 },
  { name: '2400', value: 6390 },
];

const operationalData = [
  { name: '0600', defensive: 4000, offensive: 2400 },
  { name: '0900', defensive: 3000, offensive: 1398 },
  { name: '1200', defensive: 2000, offensive: 9800 },
  { name: '1500', defensive: 2780, offensive: 3908 },
  { name: '1800', defensive: 1890, offensive: 4800 },
  { name: '2100', defensive: 2390, offensive: 3800 },
  { name: '2400', defensive: 3490, offensive: 4300 },
];

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [minEngagement, setMinEngagement] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Calculate metrics
  const metrics = useMemo(() => {
    const nodes = networkData.nodes;
    return {
      totalNodes: nodes.length,
      avgEngagement: Math.round(nodes.reduce((acc, node) => acc + node.engagement, 0) / nodes.length),
      riskScore: Math.round(nodes.filter(node => node.threatLevel === "high" || node.threatLevel === "critical").length / nodes.length * 100),
      trendingTopics: ["#tech", "#innovation", "#security", "#data"]
    };
  }, []);

  // Enhanced filtering with search
  const filteredData = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    const filteredNodes = networkData.nodes.filter(node => {
      const matchesSearch = searchQuery === "" || 
        node.id.toLowerCase().includes(searchLower) ||
        node.type.toLowerCase().includes(searchLower) ||
        node.platform.toLowerCase().includes(searchLower);

      return (
        matchesSearch &&
        (selectedPlatform === "all" || node.platform === selectedPlatform) &&
        (selectedType === "all" || node.type === selectedType) &&
        node.engagement >= minEngagement
      );
    });

    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));

    const filteredLinks = networkData.links.filter(link => {
      const sourceNode = networkData.nodes.find(n => n.id === link.source);
      const targetNode = networkData.nodes.find(n => n.id === link.target);
      
      return (
        sourceNode && targetNode &&
        (filteredNodeIds.has(sourceNode.id) || filteredNodeIds.has(targetNode.id))
      );
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [selectedPlatform, selectedType, minEngagement, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 military-grid">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Social Network Analysis Command Center</h1>
          </div>
          <p className="text-foreground/60 font-mono">Advanced Social Intelligence & Network Analysis Platform</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-threat-low">
              <div className="w-2 h-2 rounded-full bg-threat-low animate-pulse"></div>
              <span className="text-sm">System Status: Active</span>
            </div>
            <div className="text-sm text-foreground/60">|</div>
            <div className="text-sm text-foreground/60">Analysis Mode: Real-time</div>
            <div className="text-sm text-foreground/60">|</div>
            <div className="text-sm text-foreground/60">Last Update: T-minus 30s</div>
          </div>
        </header>

        <SearchPanel
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          minEngagement={minEngagement}
          setMinEngagement={setMinEngagement}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          metrics={metrics}
        />

        <div className="mb-8">
          <NetworkGraph
            title="Advanced Network Analysis"
            data={filteredData}
          />
        </div>

        <div className="grid grid-cols-dashboard gap-6 mb-8">
          <MetricCard
            title="Network Health"
            value="97.5%"
            change="+2.3%"
            icon={Shield}
            trend="up"
          />
          <MetricCard
            title="Risk Level"
            value="Low"
            change="-1.2%"
            icon={AlertTriangle}
            trend="down"
          />
          <MetricCard
            title="Engagement"
            value="92%"
            change="+0.5"
            icon={Radio}
            trend="up"
          />
          <MetricCard
            title="Network Reach"
            value="8.7M"
            change="+0.3M"
            icon={Wifi}
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Graph
            title="Threat Detection Timeline"
            data={threatData}
          />
          <Graph
            title="Network Security Status"
            data={securityData}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AdvancedMetrics
            title="Defensive vs Offensive Operations"
            data={operationalData}
          />
          <div className="grid grid-cols-1 gap-6">
            <MetricCard
              title="Active Nodes"
              value="1,284"
              change="+24"
              icon={Target}
              trend="up"
            />
            <MetricCard
              title="System Load"
              value="48.6%"
              change="-2.3%"
              icon={Activity}
              trend="down"
            />
            <MetricCard
              title="Response Time"
              value="1.4ms"
              change="-18.2%"
              icon={Zap}
              trend="up"
            />
            <MetricCard
              title="Trust Score"
              value="9.2"
              change="+0.5"
              icon={Shield}
              trend="up"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;