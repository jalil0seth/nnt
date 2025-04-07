import React from 'react';
import { Search, Filter, AlertTriangle, TrendingUp, Users } from 'lucide-react';

interface SearchPanelProps {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  minEngagement: number;
  setMinEngagement: (value: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  metrics: {
    totalNodes: number;
    avgEngagement: number;
    riskScore: number;
    trendingTopics: string[]; // Added trendingTopics to the interface
  };
}

export function SearchPanel({
  selectedPlatform,
  setSelectedPlatform,
  selectedType,
  setSelectedType,
  minEngagement,
  setMinEngagement,
  searchQuery,
  setSearchQuery,
  metrics
}: SearchPanelProps) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background pl-10 pr-4 py-2 rounded-md border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Advanced Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-foreground/60" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          <select
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="twitter">Twitter</option>
            <option value="reddit">Reddit</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>

        <div className="space-y-2">
          <select
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="influencer">Influencers</option>
            <option value="community">Communities</option>
            <option value="account">Accounts</option>
            <option value="brand">Brands</option>
            <option value="competitor">Competitors</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Min Engagement</label>
            <span className="text-sm text-foreground/60">{minEngagement}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={minEngagement}
            onChange={(e) => setMinEngagement(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Total Nodes</span>
          </div>
          <p className="text-2xl font-semibold">{metrics.totalNodes}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Avg Engagement</span>
          </div>
          <p className="text-2xl font-semibold">{metrics.avgEngagement}%</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Risk Score</span>
          </div>
          <p className="text-2xl font-semibold">{metrics.riskScore}</p>
        </div>

        <div className="space-y-1">
          <span className="text-sm font-medium">Trending Topics</span>
          <div className="flex flex-wrap gap-2">
            {metrics.trendingTopics.map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}