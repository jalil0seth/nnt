import React, { useState, useMemo } from 'react';
import { Shield, AlertTriangle, Radio, Wifi, Activity, Target, Zap, Shield as ShieldIcon, Network, Server, Database, Lock } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { Graph } from './components/Graph';
import { NetworkGraph } from './components/NetworkGraph';
import { AdvancedMetrics } from './components/AdvancedMetrics';
import { SearchPanel } from './components/SearchPanel';

// Enhanced network data with social media nodes
const networkData = {
  nodes: [
    // Twitter Nodes
    { id: "@tech_news", platform: "twitter", type: "news", group: 1, value: 18, sentiment: 0.85, engagement: 92, status: "active", threatLevel: "low", connections: 25000, followers: 180000, posts: 15000 },
    { id: "@security_alert", platform: "twitter", type: "security", group: 1, value: 16, sentiment: 0.78, engagement: 88, status: "active", threatLevel: "low", connections: 18000, followers: 150000, posts: 12000 },
    { id: "@cyber_updates", platform: "twitter", type: "tech", group: 1, value: 15, sentiment: 0.82, engagement: 90, status: "active", threatLevel: "low", connections: 20000, followers: 160000, posts: 13000 },
    
    // Reddit Communities
    { id: "r/cybersecurity", platform: "reddit", type: "community", group: 2, value: 20, sentiment: 0.88, engagement: 95, status: "active", threatLevel: "low", connections: 50000, followers: 500000, posts: 25000 },
    { id: "r/netsec", platform: "reddit", type: "community", group: 2, value: 17, sentiment: 0.86, engagement: 93, status: "active", threatLevel: "low", connections: 35000, followers: 300000, posts: 20000 },
    { id: "r/privacy", platform: "reddit", type: "community", group: 2, value: 16, sentiment: 0.84, engagement: 91, status: "active", threatLevel: "low", connections: 30000, followers: 250000, posts: 18000 },
    
    // LinkedIn Profiles
    { id: "security_expert", platform: "linkedin", type: "professional", group: 3, value: 14, sentiment: 0.92, engagement: 87, status: "active", threatLevel: "low", connections: 15000, followers: 50000, posts: 5000 },
    { id: "network_admin", platform: "linkedin", type: "professional", group: 3, value: 13, sentiment: 0.90, engagement: 85, status: "active", threatLevel: "low", connections: 12000, followers: 40000, posts: 4000 },
    
    // Malicious Actors
    { id: "suspicious_bot_1", platform: "twitter", type: "threat", group: 4, value: 8, sentiment: -0.9, engagement: 75, status: "blocked", threatLevel: "critical", connections: 5000, followers: 20000, posts: 50000 },
    { id: "spam_network_1", platform: "reddit", type: "threat", group: 4, value: 7, sentiment: -0.85, engagement: 70, status: "blocked", threatLevel: "high", connections: 4000, followers: 15000, posts: 40000 },
    
    // System Nodes
    { id: "CORE-01", platform: "system", type: "core", group: 5, value: 20, sentiment: 0.95, engagement: 98, status: "active", threatLevel: "low", connections: 15, uptime: "99.9%" },
    { id: "SEC-FW-01", platform: "security", type: "firewall", group: 5, value: 15, sentiment: 0.88, engagement: 94, status: "active", threatLevel: "low", connections: 25, uptime: "99.9%" },
    { id: "NET-MON-01", platform: "monitoring", type: "monitor", group: 5, value: 16, sentiment: 0.90, engagement: 96, status: "active", threatLevel: "low", connections: 30, uptime: "99.8%" }
  ],
  links: [
    // Twitter Interactions
    { source: "@tech_news", target: "@security_alert", value: 9, type: "strong", sentiment: 0.85, interactions: 12000, status: "active" },
    { source: "@tech_news", target: "@cyber_updates", value: 8, type: "strong", sentiment: 0.82, interactions: 10000, status: "active" },
    { source: "@security_alert", target: "@cyber_updates", value: 7, type: "strong", sentiment: 0.80, interactions: 8000, status: "active" },
    
    // Reddit Community Interactions
    { source: "r/cybersecurity", target: "r/netsec", value: 10, type: "strong", sentiment: 0.88, interactions: 25000, status: "active" },
    { source: "r/cybersecurity", target: "r/privacy", value: 9, type: "strong", sentiment: 0.85, interactions: 20000, status: "active" },
    { source: "r/netsec", target: "r/privacy", value: 8, type: "strong", sentiment: 0.83, interactions: 18000, status: "active" },
    
    // Cross-Platform Interactions
    { source: "@tech_news", target: "r/cybersecurity", value: 8, type: "strong", sentiment: 0.84, interactions: 15000, status: "active" },
    { source: "security_expert", target: "@security_alert", value: 7, type: "strong", sentiment: 0.86, interactions: 8000, status: "active" },
    { source: "network_admin", target: "r/netsec", value: 6, type: "strong", sentiment: 0.85, interactions: 7000, status: "active" },
    
    // System Monitoring
    { source: "NET-MON-01", target: "@tech_news", value: 7, type: "strong", sentiment: 0.88, interactions: 5000, status: "active" },
    { source: "NET-MON-01", target: "r/cybersecurity", value: 8, type: "strong", sentiment: 0.89, interactions: 6000, status: "active" },
    { source: "SEC-FW-01", target: "NET-MON-01", value: 9, type: "strong", sentiment: 0.92, interactions: 8000, status: "active" },
    
    // Threat Detection
    { source: "suspicious_bot_1", target: "@tech_news", value: 4, type: "risk", sentiment: -0.9, interactions: 3000, status: "blocked" },
    { source: "spam_network_1", target: "r/cybersecurity", value: 3, type: "risk", sentiment: -0.85, interactions: 2500, status: "blocked" },
    { source: "SEC-FW-01", target: "suspicious_bot_1", value: 5, type: "risk", sentiment: -0.88, interactions: 4000, status: "blocked" }
  ]
};

const threatData = [
  { name: '0000', value: 1200 },
  { name: '0200', value: 980 },
  { name: '0400', value: 1100 },
  { name: '0600', value: 2400 },
  { name: '0800', value: 1398 },
  { name: '1000', value: 3800 },
  { name: '1200', value: 9800 },
  { name: '1400', value: 7600 },
  { name: '1600', value: 3908 },
  { name: '1800', value: 4800 },
  { name: '2000', value: 3800 },
  { name: '2200', value: 4300 },
];

const securityData = [
  { name: '0000', value: 4200 },
  { name: '0200', value: 3800 },
  { name: '0400', value: 4100 },
  { name: '0600', value: 3490 },
  { name: '0800', value: 4300 },
  { name: '1000', value: 5800 },
  { name: '1200', value: 2300 },
  { name: '1400', value: 4600 },
  { name: '1600', value: 5300 },
  { name: '1800', value: 4890 },
  { name: '2000', value: 8390 },
  { name: '2200', value: 6390 },
];

const operationalData = [
  { name: '0000', defensive: 3200, offensive: 1800 },
  { name: '0200', defensive: 2800, offensive: 1600 },
  { name: '0400', defensive: 3100, offensive: 1900 },
  { name: '0600', defensive: 4000, offensive: 2400 },
  { name: '0800', defensive: 3000, offensive: 1398 },
  { name: '1000', defensive: 4800, offensive: 3800 },
  { name: '1200', defensive: 2000, offensive: 9800 },
  { name: '1400', defensive: 3600, offensive: 7600 },
  { name: '1600', defensive: 2780, offensive: 3908 },
  { name: '1800', defensive: 1890, offensive: 4800 },
  { name: '2000', defensive: 2390, offensive: 3800 },
  { name: '2200', defensive: 3490, offensive: 4300 },
];

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [minEngagement, setMinEngagement] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Calculate metrics
  const metrics = useMemo(() => {
    const nodes = networkData.nodes;
    const activeNodes = nodes.filter(node => node.status === "active");
    const threatNodes = nodes.filter(node => node.threatLevel === "high" || node.threatLevel === "critical");
    
    return {
      totalNodes: nodes.length,
      activeNodes: activeNodes.length,
      avgEngagement: Math.round(nodes.reduce((acc, node) => acc + node.engagement, 0) / nodes.length),
      riskScore: Math.round((threatNodes.length / nodes.length) * 100),
      avgUptime: "99.7%",
      totalConnections: nodes.reduce((acc, node) => acc + node.connections, 0),
      threatNodes: threatNodes.length,
      systemHealth: "98.5%",
      trendingTopics: [] // Initialize trendingTopics as an empty array
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
      return filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target);
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [selectedPlatform, selectedType, minEngagement, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 military-grid">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Defense Network Command Center</h1>
          </div>
          <p className="text-foreground/60 font-mono">Advanced Network Defense & Monitoring System</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-threat-low">
              <div className="w-2 h-2 rounded-full bg-threat-low animate-pulse"></div>
              <span className="text-sm">System Status: Active</span>
            </div>
            <div className="text-sm text-foreground/60">|</div>
            <div className="text-sm text-foreground/60">Defense Mode: Adaptive</div>
            <div className="text-sm text-foreground/60">|</div>
            <div className="text-sm text-foreground/60">Last Update: T-minus 5s</div>
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
            title="Network Defense Analysis"
            data={filteredData}
          />
        </div>

        <div className="grid grid-cols-dashboard gap-6 mb-8">
          <MetricCard
            title="System Health"
            value={metrics.systemHealth}
            change="+1.2%"
            icon={Server}
            trend="up"
          />
          <MetricCard
            title="Active Threats"
            value={metrics.threatNodes.toString()}
            change="-2"
            icon={AlertTriangle}
            trend="down"
          />
          <MetricCard
            title="Network Load"
            value="67%"
            change="+5%"
            icon={Network}
            trend="up"
          />
          <MetricCard
            title="Security Score"
            value="94.8"
            change="+2.3"
            icon={Lock}
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Graph
            title="Threat Detection Timeline"
            data={threatData}
          />
          <Graph
            title="Security Status"
            data={securityData}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AdvancedMetrics
            title="Defense Operations"
            data={operationalData}
          />
          <div className="grid grid-cols-1 gap-6">
            <MetricCard
              title="Active Nodes"
              value={metrics.activeNodes.toString()}
              change="+3"
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
              title="Avg Uptime"
              value={metrics.avgUptime}
              change="+0.2%"
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