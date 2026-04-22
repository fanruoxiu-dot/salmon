/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Search, 
  Plus, 
  Settings, 
  Bell,
  Star,
  Zap,
  Info,
  X
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

// --- Constellation Patterns (Relative Coords) ---
const ZODIAC_PATTERNS = {
  LIBRA: [
    { x: 0, y: 150, z: 0 },   // Top
    { x: -100, y: 50, z: 20 }, // Left scale
    { x: 100, y: 50, z: -20 }, // Right scale
    { x: -120, y: -50, z: 40 }, // Left tip
    { x: 120, y: -50, z: -40 }, // Right tip
    { x: 0, y: -150, z: 0 },    // Bottom post
  ],
  ARIES: [
    { x: -150, y: 100, z: 0 },
    { x: 0, y: 50, z: 50 },
    { x: 100, y: -50, z: -20 },
    { x: 150, y: -120, z: 10 },
  ],
  LYRA: [
    { x: -50, y: 120, z: 0 },  // Vega
    { x: 50, y: 80, z: 30 },
    { x: 80, y: -20, z: -10 },
    { x: 20, y: -100, z: 20 },
    { x: -60, y: -60, z: -30 },
  ],
  SCORPIUS: [
    { x: 0, y: 150, z: 0 },     // Head
    { x: -50, y: 100, z: 20 },
    { x: 50, y: 100, z: -20 },
    { x: 0, y: 20, z: 0 },      // Body
    { x: -20, y: -50, z: 10 },
    { x: -60, y: -100, z: 30 }, // Tail
    { x: -30, y: -150, z: 50 },
    { x: 30, y: -180, z: 20 },  // Stinger
  ]
};

// --- Types ---
type CelestialType = 'Planet' | 'Ringed' | 'Star' | 'Nebula' | 'Comet';

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  size: number;
  color: string;
  gradient: string;
  x: number; // 3D coordinates
  y: number;
  z: number;
  lastMessage: string;
  category: 'Close' | 'New' | 'Colleague' | 'Family';
  interactionStrength: number;
  type: CelestialType;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

// --- Mock Data ---
const INITIAL_FRIENDS: Friend[] = [
  { id: '1', name: 'Alina', size: 55, color: '#FF6B6B', gradient: 'from-[#FF6B6B] via-[#FF8E8E] to-[#FF4B2B]', x: 250, y: 150, z: 100, lastMessage: 'Looking forward to the trip!', category: 'Close', interactionStrength: 0.9, type: 'Ringed' },
  { id: '2', name: 'Bob', size: 40, color: '#4ECDC4', gradient: 'from-[#4ECDC4] via-[#45B7AF] to-[#07D1C1]', x: -300, y: -200, z: 150, lastMessage: 'Check this repo out.', category: 'Colleague', interactionStrength: 0.6, type: 'Planet' },
  { id: '3', name: 'Charlie', size: 30, color: '#FFE66D', gradient: 'from-[#FFE66D] via-[#FFCC33] to-[#FFB90F]', x: 400, y: -200, z: -100, lastMessage: 'See you tonight!', category: 'Family', interactionStrength: 0.8, type: 'Star' },
  { id: '4', name: 'Diana', size: 65, color: '#FF61D2', gradient: 'from-[#FF61D2] via-[#FE9090] to-[#FF00E4]', x: -100, y: 300, z: -200, lastMessage: 'The report is ready.', category: 'Close', interactionStrength: 0.95, type: 'Nebula' },
  { id: '5', name: 'Ethan', size: 35, color: '#2BC0E4', gradient: 'from-[#2BC0E4] via-[#5DADE2] to-[#2471A3]', x: -350, y: 100, z: -150, lastMessage: 'Where are we meet?', category: 'New', interactionStrength: 0.3, type: 'Comet' },
  { id: '6', name: 'Fiona', size: 45, color: '#A262FF', gradient: 'from-[#A262FF] via-[#7B2CFE] to-[#673AB7]', x: 200, y: -350, z: 200, lastMessage: 'Happy birthday!', category: 'Close', interactionStrength: 0.7, type: 'Planet' },
  { id: '7', name: 'Garry', size: 25, color: '#00F260', gradient: 'from-[#00F260] via-[#0575E6] to-[#00F260]', x: 150, y: 400, z: -50, lastMessage: 'Sent a file.', category: 'Colleague', interactionStrength: 0.2, type: 'Planet' },
  { id: '8', name: 'Hannah', size: 45, color: '#FF9966', gradient: 'from-[#FF9966] to-[#FF5E62]', x: -150, y: -450, z: -100, lastMessage: 'Call me back.', category: 'New', interactionStrength: 0.4, type: 'Star' },
];

const CONNECTIONS: Connection[] = [
  { from: '1', to: '4', strength: 0.8 },
  { from: '1', to: '2', strength: 0.4 },
  { from: '4', to: '6', strength: 0.6 },
  { from: '2', to: '7', strength: 0.3 },
  { from: '3', to: '6', strength: 0.5 },
  { from: '5', to: '1', strength: 0.2 },
  { from: '4', to: '3', strength: 0.4 },
  { from: '7', to: '8', strength: 0.5 },
];

// --- Components ---

const BackgroundStars = () => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.2,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// --- Secondary Components ---

const CelestialBody = ({ friend, isHighlighted, depth, visualStyle }: { friend: Friend, isHighlighted: boolean, depth: number, visualStyle: 'Celestial' | 'Constellation' }) => {
  const commonStyles = "relative rounded-full shadow-[inset_-4px_-4px_12px_rgba(0,0,0,0.5)] border border-white/20 transition-all duration-500";
  // Depth affects scale and opacity
  const opacity = Math.max(0.2, (depth + 500) / 1000);
  
  if (visualStyle === 'Constellation') {
    return (
      <div style={{ opacity }} className="relative transition-opacity duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Constellation Glow Aura */}
          <AnimatePresence>
            {isHighlighted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 2 }}
                className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"
              />
            )}
          </AnimatePresence>
          <Star className={`w-4 h-4 ${isHighlighted ? 'text-white' : 'text-white/40'} fill-current drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-colors duration-300`} />
          <motion.div 
            className="absolute inset-0 bg-white/10 rounded-full blur-xl scale-150"
            animate={{ opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ opacity }} className="relative transition-all duration-500">
      {/* Ethereal Halo Glow on Hover */}
      <AnimatePresence>
        {isHighlighted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1.3 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 rounded-full blur-2xl"
            style={{ 
              background: `radial-gradient(circle, ${friend.color} 0%, transparent 70%)`,
              zIndex: -1
            }}
          />
        )}
      </AnimatePresence>

      {(() => {
        switch (friend.type) {
          case 'Ringed':
            return (
              <div className="relative">
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-white/20 rounded-[100%] skew-x-[45deg] scale-x-[1.8] scale-y-[0.4]"
                  style={{ width: friend.size * 1.5, height: friend.size * 1.5 }}
                />
                <div 
                  className={`${commonStyles} bg-gradient-to-br ${friend.gradient}`}
                  style={{ width: friend.size, height: friend.size }}
                >
                  <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white/30 rounded-full blur-sm" />
                </div>
              </div>
            );
          case 'Star':
            return (
              <div 
                className={`${commonStyles} bg-white shadow-[0_0_30px_rgba(255,255,255,0.6)]`}
                style={{ 
                  width: friend.size, 
                  height: friend.size,
                  backgroundColor: friend.color
                }}
              >
                <motion.div 
                  className="absolute inset-0 bg-white/40 rounded-full blur-md"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            );
          case 'Nebula':
            return (
              <div 
                className="relative rounded-full blur-md animate-pulse"
                style={{ 
                  width: friend.size, 
                  height: friend.size,
                  background: `radial-gradient(circle, ${friend.color} 0%, transparent 70%)` 
                }}
              >
                <div className="absolute inset-0 border border-white/10 rounded-full" />
              </div>
            );
          case 'Comet':
            return (
              <div className="relative">
                <div 
                  className="absolute top-1/2 left-1/2 -translate-y-1/2 w-20 h-4 bg-gradient-to-l from-transparent to-white/20 blur-sm -rotate-45 origin-left"
                  style={{ left: friend.size / 2 }}
                />
                <div 
                  className={`${commonStyles} bg-gradient-to-br ${friend.gradient}`}
                  style={{ width: friend.size, height: friend.size }}
                >
                  <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white/30 rounded-full blur-sm" />
                </div>
              </div>
            );
          default:
            return (
              <div 
                className={`${commonStyles} bg-gradient-to-br ${friend.gradient}`}
                style={{ width: friend.size, height: friend.size }}
              >
                <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white/30 rounded-full blur-sm" />
              </div>
            );
        }
      })()}
    </div>
  );
};

const InteractionFeed = () => {
  const [events, setEvents] = useState([
    { id: 1, text: "Satellite Link Established", time: "Just now" },
    { id: 2, text: "Alina sent a pulse signal", time: "2m ago" },
    { id: 3, text: "New Constellation detected", time: "5m ago" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const texts = [
        "Data sync completed",
        "Orbital path synchronized",
        "Encrypted packet received",
        "Proximity alert: Diana",
      ];
      setEvents(prev => [
        { id: Date.now(), text: texts[Math.floor(Math.random() * texts.length)], time: "Just now" },
        ...prev.slice(0, 3)
      ]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col border-l-2 border-purple-500/30 pl-3 py-1"
          >
            <span className="text-[10px] text-white/80 font-medium">{event.text}</span>
            <span className="text-[8px] text-white/30 uppercase tracking-widest">{event.time}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- Stellar Canvas Renderer (High Performance 3D-on-2D) ---
const StellarCanvas = ({ stars, lines, rotation, zoom }: { stars: any[], lines: any[], rotation: {x: number, y: number}, zoom: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const project = (x3d: number, y3d: number, z3d: number, width: number, height: number) => {
    const radY = (rotation.y * Math.PI) / 180;
    const xRotY = x3d * Math.cos(radY) - z3d * Math.sin(radY);
    const zRotY = x3d * Math.sin(radY) + z3d * Math.cos(radY);
    const radX = (rotation.x * Math.PI) / 180;
    const yRotX = y3d * Math.cos(radX) - zRotY * Math.sin(radX);
    const zRotX = y3d * Math.sin(radX) + zRotY * Math.cos(radX);
    const factor = (zRotX + 1000) / 1000 * zoom;
    return {
      x: xRotY * factor + width / 2,
      y: yRotX * factor + height / 2,
      z: zRotX,
      scale: factor
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const render = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Pre-calculate projections and create a map for fast line lookups
      const projectionMap: { [key: number]: any } = {};
      const sortedProjections = [];
      
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const proj = project(star.x, star.y, star.z, width, height);
        const data = { ...star, id: i, p: proj };
        projectionMap[i] = proj;
        sortedProjections.push(data);
      }
      
      sortedProjections.sort((a, b) => a.p.z - b.p.z);

      // Draw Lines
      ctx.beginPath();
      lines.forEach(line => {
        const s1 = projectionMap[line.from];
        const s2 = projectionMap[line.to];
        if (!s1 || !s2) return;
        
        const lineOpacity = Math.max(0, (s1.z + s2.z + 1000) / 1000) * 0.15;
        if (lineOpacity <= 0) return;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
        ctx.lineWidth = 0.5 * zoom;
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
      });
      ctx.stroke();

      // Draw Star Points
      sortedProjections.forEach(star => {
        const { x, y, scale, z } = star.p;
        const isNode = star.isNode;
        // Adjusted fade for clearer visibility
        const distFade = Math.max(0, (z + 1000) / 1000);
        const starOpacity = (isNode ? 1 : 0.6) * distFade;
        
        if (starOpacity <= 0.05) return;

        ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
        const size = (isNode ? 1.8 : 0.8) * scale;
        
        if (isNode) {
          ctx.shadowBlur = 4 * scale;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.1, size), 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [stars, lines, rotation, zoom]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[10]" />;
};

export default function App() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [hoveredFriend, setHoveredFriend] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [friends] = useState(INITIAL_FRIENDS);
  const [visualStyle, setVisualStyle] = useState<'Celestial' | 'Constellation'>('Celestial');
  const [formation, setFormation] = useState<keyof typeof ZODIAC_PATTERNS | 'SCATTER'>('SCATTER');
  const [myThought, setMyThought] = useState<string>('Listening to the whispers of the universe...');
  const [isEditingThought, setIsEditingThought] = useState(false);
  const [customStars, setCustomStars] = useState<{x: number, y: number, z: number, opacity: number, isNode: boolean, label?: string}[]>([]);
  const [customLines, setCustomLines] = useState<{from: number, to: number}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);

  // --- Dynamic Positioning ---
  const getPositionedFriends = () => {
    if (formation === 'SCATTER') {
      return friends.map(f => ({ ...f }));
    }

    const pattern = ZODIAC_PATTERNS[formation];
    return friends.map((f, i) => {
      // Map friends to pattern nodes, loop if pattern is smaller than friend count
      const node = pattern[i % pattern.length];
      return {
        ...f,
        x: node.x,
        y: node.y,
        z: node.z
      };
    });
  };

  const currentFriends = getPositionedFriends();

  const filteredFriends = filter === 'All' 
    ? currentFriends 
    : currentFriends.filter(f => f.category === filter);

  // --- 3D Projection Calculation ---
  const project = (x3d: number, y3d: number, z3d: number) => {
    // Rotation around Y axis
    const radY = (rotation.y * Math.PI) / 180;
    const xRotY = x3d * Math.cos(radY) - z3d * Math.sin(radY);
    const zRotY = x3d * Math.sin(radY) + z3d * Math.cos(radY);

    // Rotation around X axis
    const radX = (rotation.x * Math.PI) / 180;
    const yRotX = y3d * Math.cos(radX) - zRotY * Math.sin(radX);
    const zRotX = y3d * Math.sin(radX) + zRotY * Math.cos(radX);

    // Perspective projection
    const factor = (zRotX + 1000) / 1000 * zoom;
    return {
      x: xRotY * factor,
      y: yRotX * factor,
      z: zRotX,
      scale: factor
    };
  };

  const friendProjections = filteredFriends.map(f => ({
    ...f,
    projected: project(f.x, f.y, f.z)
  }));

  // Render lines in projected space
  const renderLines = () => {
    const isConstellation = visualStyle === 'Constellation';
    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
        {/* Friend Connections */}
        {CONNECTIONS.map((conn, idx) => {
          const f1 = friendProjections.find(f => f.id === conn.from);
          const f2 = friendProjections.find(f => f.id === conn.to);
          if (!f1 || !f2) return null;

          const isHighlighted = hoveredFriend === f1.id || hoveredFriend === f2.id;
          const avgZ = (f1.projected.z + f2.projected.z) / 2;
          const lineOpacity = Math.max(0.05, (avgZ + 500) / 1000) * (isHighlighted ? 1 : 0.4);

          return (
            <line
              key={`line-${idx}`}
              x1={f1.projected.x}
              y1={f1.projected.y}
              x2={f2.projected.x}
              y2={f2.projected.y}
              stroke={isConstellation ? "#60A5FA" : "white"}
              style={{ 
                opacity: isConstellation ? lineOpacity * 0.8 : lineOpacity,
                strokeDasharray: isConstellation ? '4 4' : 'none'
              }}
              strokeWidth={isHighlighted ? 2 : (isConstellation ? 0.3 : 0.5)}
            />
          );
        })}

        {/* Custom Neural Constellation Lines */}
        {customLines.map((line, idx) => {
          const s1 = customStars[line.from];
          const s2 = customStars[line.to];
          if (!s1 || !s2) return null;

          const p1 = project(s1.x, s1.y, s1.z);
          const p2 = project(s2.x, s2.y, s2.z);
          
          const avgZ = (p1.z + p2.z) / 2;
          const lineOpacity = Math.max(0.01, (avgZ + 500) / 1000) * 0.2;

          return (
            <line 
              key={`custom-line-${idx}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="white"
              style={{ opacity: lineOpacity }}
              strokeWidth={0.2}
            />
          );
        })}
      </svg>
    );
  };

  // --- Handlers ---
  const handlePointerDown = () => { isDragging.current = true; };
  const handlePointerUp = () => { isDragging.current = false; };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    setRotation(prev => ({
      x: prev.x - e.movementY * 0.4,
      y: prev.y + e.movementX * 0.4
    }));
  };

  const processImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) { setIsProcessing(false); return; }

          const aspect = img.height / img.width;
          const w = 100; 
          const h = Math.floor(w * aspect);
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);

          const data = ctx.getImageData(0, 0, w, h).data;
          let totalB = 0;
          for (let i = 0; i < data.length; i += 4) totalB += (data[i] + data[i+1] + data[i+2]) / 3;
          const isLightBg = (totalB / (w * h)) > 128;

          const stars: any[] = [];
          const getB = (tx: number, ty: number) => {
            if (tx < 0 || tx >= w || ty < 0 || ty >= h) return isLightBg ? 255 : 0;
            const i = (ty * w + tx) * 4;
            const val = (data[i] + data[i+1] + data[i+2]) / 3 * (data[i+3] / 255);
            return isLightBg ? 255 - val : val;
          };

          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const b = getB(x, y);
              if (b > 35) {
                const bUp = getB(x, y - 1);
                const bLeft = getB(x - 1, y);
                const dX = Math.abs(b - bLeft);
                const dY = Math.abs(b - bUp);
                const isEdge = dX > 30 || dY > 30;
                const isStrongEdge = dX > 60 || dY > 60;

                const prob = isStrongEdge ? 0.95 : (isEdge ? 0.7 : 0.05);
                if (Math.random() < prob) {
                  stars.push({
                    x: (x - w / 2) * 11 - 500,
                    y: (y - h / 2) * 11,
                    z: (Math.random() - 0.5) * 40 - 20,
                    opacity: b / 255,
                    isNode: isStrongEdge || (isEdge && Math.random() > 0.92),
                    isFeature: isStrongEdge
                  });
                }
              }
            }
          }

          const finalStars = stars.slice(0, 4000);

          // SPATIAL GRID FOR O(N) WIRING
          const cellSize = 50;
          const grid: { [key: string]: number[] } = {};
          const nodeIdxs = finalStars.map((s, i) => (s as any).isNode ? i : -1).filter(i => i !== -1);

          nodeIdxs.forEach(idx => {
            const s = finalStars[idx];
            const key = `${Math.floor(s.x / cellSize)},${Math.floor(s.y / cellSize)}`;
            if (!grid[key]) grid[key] = [];
            grid[key].push(idx);
          });

          const lines: {from: number, to: number}[] = [];
          nodeIdxs.forEach(idx1 => {
            const s1 = finalStars[idx1];
            const gx = Math.floor(s1.x / cellSize);
            const gy = Math.floor(s1.y / cellSize);
            let count = 0;
            const limit = (s1 as any).isFeature ? 4 : 1;

            for (let dx = -1; dx <= 1; dx++) {
              for (let dy = -1; dy <= 1; dy++) {
                const neighbors = grid[`${gx + dx},${gy + dy}`];
                if (!neighbors) continue;
                for (const idx2 of neighbors) {
                  if (idx1 >= idx2 || count >= limit) continue;
                  const s2 = finalStars[idx2];
                  const d = Math.sqrt((s1.x - s2.x)**2 + (s1.y - s2.y)**2);
                  if (d < 40) {
                    lines.push({ from: idx1, to: idx2 });
                    count++;
                  }
                }
              }
            }
          });

          setCustomStars(finalStars);
          setCustomLines(lines);
          setIsProcessing(false);
          e.target.value = '';
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }, 100);
  };

  return (
    <div 
      className="relative h-screen w-full bg-[#050505] text-white font-sans overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <BackgroundStars />
      
      {/* Neural Syncing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="relative w-32 h-32 mb-8">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                 className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full"
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                 className="absolute inset-4 border border-blue-500/20 rounded-full"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                 <Zap className="w-8 h-8 text-purple-400 animate-pulse" />
               </div>
            </div>
            <h3 className="text-xl font-bold tracking-[0.2em] text-white/90 mb-2 font-mono uppercase">Neural_Syncing</h3>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Reconstructing stellar matrix from biometric input...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-Performance Stellar Sketch Canvas */}
      {customStars.length > 0 && (
        <StellarCanvas 
          stars={customStars} 
          lines={customLines} 
          rotation={rotation} 
          zoom={zoom} 
        />
      )}
      
      {/* My Thought / Cosmic Broadcast Overlay */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[80] w-[90%] max-w-2xl text-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto group cursor-help"
          onClick={() => setIsEditingThought(true)}
        >
          {isEditingThought ? (
            <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.2)]">
              <textarea
                autoFocus
                value={myThought}
                onChange={(e) => setMyThought(e.target.value)}
                onBlur={() => setIsEditingThought(false)}
                onKeyDown={(e) => e.key === 'Enter' && e.shiftKey === false && setIsEditingThought(false)}
                className="w-full bg-transparent border-none text-white text-lg font-medium tracking-wide focus:ring-0 resize-none h-24 placeholder:text-white/20"
                placeholder="What are your thoughts in this deep space?"
              />
              <div className="flex justify-between items-center mt-2 px-2">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Shift + Enter to finish</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsEditingThought(false); }}
                  className="bg-white/10 hover:bg-white text-white hover:text-black text-[10px] px-3 py-1 rounded-full transition-all uppercase font-bold"
                >
                  Confirm Broadcast
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <motion.p 
                key={myThought}
                initial={{ filter: 'blur(10px)', opacity: 0 }}
                animate={{ filter: 'blur(0px)', opacity: 1 }}
                className="text-xl md:text-2xl font-light italic tracking-[0.05em] text-white/80 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] px-6"
              >
                {myThought || "Silence in the cosmos..."}
              </motion.p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] text-purple-400/60 uppercase tracking-[0.3em] font-bold">
                <span className="w-8 h-[1px] bg-purple-500/20" />
                Click to update your signal
                <span className="w-8 h-[1px] bg-purple-500/20" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* UI Overlay: Top Navigation */}
      <div className="absolute top-0 left-0 w-full p-6 z-[100] flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Constellation</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium font-mono italic">Kinetic Matrix</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Stellar Canvas Upload */}
          <div className="relative group overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-2xl">
            <input 
              type="file" 
              accept="image/*" 
              onChange={processImage} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <button className="px-3 py-1.5 flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/40 group-hover:text-white transition-colors">
              <Plus className="w-3 h-3 text-purple-400" />
              STELLAR IMAGE
            </button>
          </div>

          {/* Formation Selector */}
          <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-2xl overflow-hidden">
            <select 
              value={formation}
              onChange={(e) => setFormation(e.target.value as any)}
              className="bg-transparent text-[10px] font-bold tracking-widest text-white/70 px-3 py-1 outline-none cursor-pointer hover:text-white"
            >
              <option value="SCATTER" className="bg-[#111]">SCATTER CLUSTER</option>
              <option value="LIBRA" className="bg-[#111]">LIBRA SHAPE</option>
              <option value="ARIES" className="bg-[#111]">ARIES SHAPE</option>
              <option value="LYRA" className="bg-[#111]">LYRA SHAPE</option>
              <option value="SCORPIUS" className="bg-[#111]">SCORPIUS SHAPE</option>
            </select>
          </div>

          <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-2xl">
            {['Celestial', 'Constellation'].map((style) => (
              <button 
                key={style}
                onClick={() => setVisualStyle(style as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${
                  visualStyle === style ? 'bg-purple-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {style.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-2xl">
            {['All', 'Close', 'Colleague', 'Family'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${
                  filter === cat ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
             <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white/60">-</button>
             <span className="text-[10px] w-12 text-center text-white/40 font-mono">{(zoom * 100).toFixed(0)}%</span>
             <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white/60">+</button>
          </div>
        </div>
      </div>

      {/* Center Anchor for 3D View */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none">
        {renderLines()}

        {/* Orbitals */}
        {friendProjections
          .sort((a, b) => a.projected.z - b.projected.z) // Render back to front
          .map((friend) => (
            <motion.div
              key={friend.id}
              className="absolute pointer-events-auto cursor-pointer group"
              style={{
                left: friend.projected.x,
                top: friend.projected.y,
                transform: 'translate(-50%, -50%)',
                zIndex: Math.round(friend.projected.z + 500)
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFriend(friend);
              }}
              onMouseEnter={() => setHoveredFriend(friend.id)}
              onMouseLeave={() => setHoveredFriend(null)}
              animate={{ 
                scale: hoveredFriend === friend.id ? friend.projected.scale * 1.2 : friend.projected.scale,
                filter: hoveredFriend === friend.id ? 'brightness(1.2)' : 'brightness(1)'
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 20,
                filter: { duration: 0.3 }
              }}
            >
              <CelestialBody friend={friend} isHighlighted={hoveredFriend === friend.id} depth={friend.projected.z} visualStyle={visualStyle} />

              {/* Label */}
              <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/90 drop-shadow-[0_0_5px_rgba(0,0,0,1)] bg-black/20 px-1 rounded">
                  {friend.name}
                </span>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Friend Info Panel (Right) */}
      <AnimatePresence>
        {selectedFriend ? (
          <motion.div
            key="info-panel"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute top-0 right-0 h-full w-80 bg-[#0A0A0A]/80 backdrop-blur-xl border-l border-white/10 z-[110] flex flex-col p-8"
          >
            <div className="flex justify-between items-start mb-8">
              <div 
                className="w-16 h-16 rounded-full"
                style={{ backgroundColor: selectedFriend.color }}
              />
              <button 
                onClick={() => setSelectedFriend(null)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-1">{selectedFriend.name}</h2>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium bg-white/5 px-2 py-1 rounded">
                {selectedFriend.category}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-yellow-400/80">
                <Star className="w-3 h-3 fill-current" />
                <span>{(selectedFriend.interactionStrength * 100).toFixed(0)} Points</span>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">Last Transmission</h3>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-sm text-white/80 italic">"{selectedFriend.lastMessage}"</p>
                  <p className="text-[10px] text-white/20 mt-2">Received 12m ago via StarPort</p>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">Interaction Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-purple-400">
                      <Zap className="w-3 h-3" />
                      <span className="text-[10px] font-bold">FREQUENCY</span>
                    </div>
                    <span className="text-lg font-mono tracking-tighter">XL-04</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-1 text-green-400">
                      <MessageSquare className="w-3 h-3" />
                      <span className="text-[10px] font-bold">MESSAGES</span>
                    </div>
                    <span className="text-lg font-mono tracking-tighter">1,240</span>
                  </div>
                </div>
              </section>

              <button className="w-full py-4 mt-auto bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-white/10 rounded-xl flex items-center justify-center gap-3 transition-all group">
                <MessageSquare className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                <span className="text-sm font-semibold tracking-wide">Open Channel</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="neural-hud"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-24 right-8 z-[100] w-64 pointer-events-none space-y-6"
          >
            {/* Neural Matrix Monitor */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl ">
              <div className="flex items-center justify-between mb-4 pb-2 border-bottom border-white/5">
                <span className="text-[10px] font-mono text-purple-400 tracking-widest">NEURAL_MATRIX_v4.2</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              
              <div className="space-y-3 font-mono">
                {[
                  { label: "NODE_COUNT", val: `${friendProjections.length + customStars.length}` },
                  { label: "LATENCY", val: "12ms" },
                  { label: "SYNC_STATUS", val: "ENCRYPTED" },
                  { label: "CAM_COORD", val: `${Math.round(rotation.x)}° ${Math.round(rotation.y)}°` }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center text-[9px] group pointer-events-auto">
                    <span className="text-white/40 group-hover:text-white/80 transition-colors">{stat.label}</span>
                    <span className="text-white/80 group-hover:text-purple-400 transition-colors">{stat.val}</span>
                  </div>
                ))}
              </div>

              {/* Decorative Mini-Graph */}
              <div className="mt-4 h-12 flex items-end gap-1 px-1">
                {[40, 70, 45, 90, 65, 30, 85, 50, 75, 40, 60, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-purple-500/20 to-purple-500/60 rounded-t-sm"
                  />
                ))}
              </div>
            </div>

            {/* Cosmic Radar */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-xl overflow-hidden relative group pointer-events-auto cursor-crosshair">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,theme(colors.purple.500)_0%,transparent_70%)]" />
                <span className="text-[10px] font-mono text-white/30 tracking-widest mb-4 block">SECTOR_SCAN</span>
                
                <div className="relative w-full aspect-square border border-white/5 rounded-full flex items-center justify-center">
                    {/* Pulsing rings */}
                    <div className="absolute inset-2 border border-white/5 rounded-full" />
                    <div className="absolute inset-6 border border-white/5 rounded-full" />
                    <div className="absolute inset-10 border border-white/5 rounded-full" />
                    
                    {/* Scanning Line */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-purple-500 origin-center"
                    />

                    {/* Entities in radar */}
                    {friends.slice(0, 5).map((f, i) => (
                        <div 
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]"
                          style={{
                            left: `${50 + (Math.cos(i * 72) * (30 + i * 5))}%`,
                            top: `${50 + (Math.sin(i * 72) * (30 + i * 5))}%`
                          }}
                        />
                    ))}
                </div>
                
                <div className="mt-4 p-2 bg-white/5 rounded border border-white/5 flex items-center justify-between">
                    <span className="text-[8px] text-white/40 uppercase font-mono tracking-tighter">Sector alpha-9 active</span>
                    <Search className="w-3 h-3 text-white/20" />
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-[#1A1A1A]/40 backdrop-blur-2xl border border-white/10 rounded-2xl z-50">
        <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          <Info className="w-5 h-5" />
        </button>
        <button className="p-4 rounded-xl bg-white text-black hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <Plus className="w-5 h-5" />
        </button>
        <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Hint */}
      <div className="absolute bottom-6 left-6 text-white/20 text-[10px] uppercase tracking-[0.3em] font-medium pointer-events-none">
        System: Active Constellation Matrix
      </div>
    </div>
  );
}
