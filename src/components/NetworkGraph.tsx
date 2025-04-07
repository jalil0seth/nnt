import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { cn } from '../lib/utils';

interface Node {
  id: string;
  platform: string;
  group: number;
  value: number;
  type: 'account' | 'influencer' | 'brand' | 'community' | 'competitor';
  sentiment: number;
  engagement: number;
  followers: number;
  posts: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface Link {
  source: string;
  target: string;
  value: number;
  type: 'strong' | 'weak' | 'potential' | 'risk';
  sentiment: number;
  interactions: number;
}

interface NetworkGraphProps {
  data: {
    nodes: Node[];
    links: Link[];
  };
  title: string;
  className?: string;
}

export function NetworkGraph({ data, title, className }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 600;

    // Modern color palette inspired by Palantir
    const colors = {
      node: {
        default: '#2D3748',
        highlight: '#4A5568',
        selected: '#718096'
      },
      link: {
        default: '#4A5568',
        highlight: '#718096',
        risk: '#F56565'
      },
      text: {
        default: '#A0AEC0',
        highlight: '#E2E8F0'
      }
    };

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG container with dark theme
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("background", "rgba(26, 32, 44, 0.4)");

    // Add definitions for gradients and filters
    const defs = svg.append("defs");

    // Create gradient for nodes
    const nodeGradient = defs.append("radialGradient")
      .attr("id", "nodeGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    nodeGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4A5568");

    nodeGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#2D3748");

    // Glow filter
    const glow = defs.append("filter")
      .attr("id", "glow")
      .attr("height", "300%")
      .attr("width", "300%")
      .attr("x", "-100%")
      .attr("y", "-100%");

    glow.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");

    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Hexagonal background pattern
    const pattern = defs.append("pattern")
      .attr("id", "hexPattern")
      .attr("width", 30)
      .attr("height", 25)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", "rotate(30)");

    pattern.append("path")
      .attr("d", "M0,0 l15,0 l7.5,12.99 l-7.5,12.99 l-15,0 l-7.5,-12.99 z")
      .attr("stroke", "#2D3748")
      .attr("stroke-width", "0.5")
      .attr("fill", "none");

    // Add background with pattern
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#hexPattern)");

    // Enhanced zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.2, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const g = svg.append("g");

    // Force simulation with improved parameters
    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5))
      .force("charge", d3.forceManyBody()
        .strength(-1000)
        .distanceMax(300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Create curved links
    const link = g.append("g")
      .selectAll("path")
      .data(data.links)
      .join("path")
      .attr("stroke", (d: any) => d.type === "risk" ? colors.link.risk : colors.link.default)
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value))
      .attr("fill", "none")
      .attr("marker-end", (d: any) => d.type === "risk" ? "url(#arrow-risk)" : "url(#arrow-default)");

    // Enhanced nodes with modern styling
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(drag(simulation) as any)
      .on("click", (event, d: any) => {
        setSelectedNode(d);
        event.stopPropagation();
      })
      .on("mouseover", (event, d: any) => {
        setHoveredNode(d);
        d3.select(event.currentTarget)
          .attr("filter", "url(#glow)");
      })
      .on("mouseout", (event) => {
        setHoveredNode(null);
        d3.select(event.currentTarget)
          .attr("filter", null);
      });

    // Node circles with gradient
    node.append("circle")
      .attr("r", (d: any) => Math.sqrt(d.value) * 5)
      .attr("fill", "url(#nodeGradient)")
      .attr("stroke", (d: any) => {
        switch(d.threatLevel) {
          case "critical": return "#F56565";
          case "high": return "#ED8936";
          case "medium": return "#ECC94B";
          default: return "#48BB78";
        }
      })
      .attr("stroke-width", 2);

    // Add pulse animation for critical nodes
    node.filter((d: any) => d.threatLevel === "critical")
      .append("circle")
      .attr("r", (d: any) => Math.sqrt(d.value) * 5 + 5)
      .attr("fill", "none")
      .attr("stroke", "#F56565")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5)
      .style("animation", "pulse 2s infinite");

    // Modern labels with background
    const label = node.append("g")
      .attr("transform", (d: any) => `translate(${Math.sqrt(d.value) * 5 + 8}, 0)`);

    label.append("rect")
      .attr("x", -4)
      .attr("y", -10)
      .attr("width", (d: any) => d.id.length * 7 + 8)
      .attr("height", 20)
      .attr("rx", 4)
      .attr("fill", "rgba(26, 32, 44, 0.8)")
      .attr("stroke", "#4A5568")
      .attr("stroke-width", 1);

    label.append("text")
      .text((d: any) => d.id)
      .attr("fill", colors.text.default)
      .attr("dy", 5)
      .style("font-family", "'JetBrains Mono', monospace")
      .style("font-size", "11px");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 2;
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag behavior
    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Clear selection on background click
    svg.on("click", () => {
      setSelectedNode(null);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  return (
    <div className={cn("bg-card p-6 rounded-lg border border-border shadow-glow", className)}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-foreground/60 font-mono">{title}</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#48BB78]"></span>
            <span>Low Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#ECC94B]"></span>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#ED8936]"></span>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#F56565]"></span>
            <span>Critical Risk</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <svg ref={svgRef} className="w-full h-[600px]" />
        
        {(selectedNode || hoveredNode) && (
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
            <h4 className="font-mono font-medium mb-2">{(selectedNode || hoveredNode)?.id}</h4>
            <div className="space-y-1 text-sm font-mono">
              <p>Platform: {(selectedNode || hoveredNode)?.platform}</p>
              <p>Type: {(selectedNode || hoveredNode)?.type}</p>
              <p>Followers: {(selectedNode || hoveredNode)?.followers?.toLocaleString()}</p>
              <p>Posts: {(selectedNode || hoveredNode)?.posts?.toLocaleString()}</p>
              <p>Engagement: {(selectedNode || hoveredNode)?.engagement}%</p>
              <p>Sentiment: {(selectedNode || hoveredNode)?.sentiment.toFixed(2)}</p>
              <p>Risk Level: {(selectedNode || hoveredNode)?.threatLevel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}