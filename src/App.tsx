import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, useScroll } from "motion/react";
import { ArrowRight, Check, Terminal, ExternalLink, ArrowLeft, Info, Calendar, Clock, Tag, Share2 } from "lucide-react";
import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

// --- Hooks & Components for Microinteractions ---

const useMousePosition = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
};

const Magnetic = ({ children, strength = 0.5 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

const Cursor = ({ mouseX, mouseY }: { mouseX: any; mouseY: any }) => {
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest(".cursor-pointer") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            scale: isClicked ? 0.88 : (isHovering ? 1.45 : 1),
            backgroundColor: isHovering ? "white" : "transparent",
            border: isHovering ? "none" : "1px solid white",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
        >
          {isHovering && (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="w-1 h-1 bg-black rounded-full"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ScrambleText = ({ text, className = "", speed = "normal", scrambleAmount = "full" }: { text: string; className?: string; speed?: "fast" | "normal" | "slow"; scrambleAmount?: "full" | "light" }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "-–—/\\____";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasScrambledRef = useRef(false);

  const startScramble = () => {
    if (hasScrambledRef.current) return;
    hasScrambledRef.current = true;
    
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const intervalMs = speed === "slow" ? 45 : speed === "fast" ? 22 : 35;
    const increment = 0.5;
    // For light mode: only scramble first 3 chars, shorter duration
    const maxIterations = scrambleAmount === "light" ? 3 : text.length;
    
    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            // Only scramble up to maxIterations
            if (scrambleAmount === "light" && index >= maxIterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current!);
        // Reset after a delay so it can scramble again next time
        setTimeout(() => { hasScrambledRef.current = false; }, 2000);
      }
      iteration += increment;
    }, intervalMs);
  };

  return (
    <span 
      onMouseEnter={startScramble} 
      className={className}
    >
      {displayText}
    </span>
  );
};

const PerspectiveCard = ({ children, className = "", onClick, whileHover }: { children: React.ReactNode; className?: string; onClick?: () => void; key?: React.Key; whileHover?: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 100, damping: 30 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={whileHover}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`perspective-1000 ${className}`}
    >
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const NavLink = ({ 
  label, 
  href, 
  onClick, 
  isActive = false,
  isExternal = false,
  className = ""
}: { 
  label: string; 
  href?: string; 
  onClick?: (e: React.MouseEvent) => void; 
  isActive?: boolean;
  isExternal?: boolean;
  className?: string;
}) => {
  return (
    <Magnetic strength={0.2}>
      <div className={`relative py-1 px-1 group ${className}`}>
        {href ? (
          <a 
            href={href} 
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            onClick={onClick}
            className={`cursor-pointer transition-colors flex items-center gap-1.5 ${isActive ? "text-accent" : "hover:text-accent"}`}
          >
            <ScrambleText text={label} />
            {isExternal && <ExternalLink size={10} className="opacity-50 group-hover:opacity-100 transition-opacity" />}
          </a>
        ) : (
          <button 
            onClick={onClick}
            className={`cursor-pointer transition-colors flex items-center gap-1.5 ${isActive ? "text-accent" : "hover:text-accent"}`}
          >
            <ScrambleText text={label} />
            {isExternal && <ExternalLink size={10} className="opacity-50 transition-opacity" />}
          </button>
        )}
        
        {/* Animated Underline */}
        <motion.div 
          className="absolute -bottom-0.5 left-1 right-1 h-[1px] bg-accent origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        
        {/* Hover Highlight */}
        <motion.div 
          className="absolute inset-0 -z-10 bg-accent/5 rounded-md scale-95 opacity-0"
          whileHover={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </Magnetic>
  );
};

// --- Main App Components ---

const AppIcon = ({ id, className = "" }: { id: string; className?: string }) => {
  const iconBase = "w-full h-full flex items-center justify-center p-[15%] transition-transform group-hover:scale-110";
  
  switch (id) {
    case "mochi":
      return (
        <div className={`${iconBase} ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="10" y="10" width="80" height="80" rx="8" stroke="currentColor" strokeWidth="4" />
            <path d="M25 35H75M25 50H75M25 65H55" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <rect x="65" y="65" width="20" height="20" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
            <text x="68" y="79" fill="currentColor" fontSize="10" fontWeight="900" fontFamily="monospace">MD</text>
            <path d="M10 25L20 25M10 10L10 25" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      );
    case "focus":
      return (
        <div className={`${iconBase} ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-accent">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            <path d="M50 5V15M50 85V95M5 50H15M85 50H95" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <text x="58" y="35" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">ACTV</text>
          </svg>
        </div>
      );
    case "folderwardrobe":
      return (
        <div className={`${iconBase} ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M10 25C10 22.2386 12.2386 20 15 20H40L50 30H85C87.7614 30 90 32.2386 90 35V75C90 77.7614 87.7614 80 85 80H15C12.2386 80 10 77.7614 10 75V25Z" stroke="currentColor" strokeWidth="4" />
            <rect x="25" y="45" width="30" height="20" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M65 45L75 45M70 45V55" stroke="currentColor" strokeWidth="2" />
            <text x="18" y="73" fill="currentColor" fontSize="7" fontWeight="bold" fontFamily="monospace">WARDROBE.01</text>
          </svg>
        </div>
      );
    case "resq":
      return (
        <div className={`${iconBase} ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M40 10H60V90H40V10Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
            <path d="M10 40H90V60H10V40Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" />
            <rect x="70" y="15" width="15" height="15" fill="currentColor" />
            <text x="15" y="30" fill="currentColor" fontSize="10" fontWeight="900" fontFamily="monospace">RAW</text>
            <text x="15" y="85" fill="currentColor" fontSize="10" fontWeight="900" fontFamily="monospace">MD</text>
            <path d="M35 80L45 70" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      );
    case "chatapp":
      return (
        <div className={`${iconBase} ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="10" y="15" width="80" height="70" rx="4" stroke="currentColor" strokeWidth="4" />
            <path d="M25 40H75M25 55H50" stroke="currentColor" strokeWidth="5" />
            <rect x="55" y="55" width="15" height="5" fill="currentColor" className="animate-pulse" />
            <text x="15" y="10" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">SYSTEM.LOG</text>
            <circle cx="85" cy="15" r="3" fill="currentColor" />
            <circle cx="75" cy="15" r="3" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      );
    case "brandlab":
      return (
        <div className={`${iconBase} ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-accent">
            <rect x="12" y="12" width="76" height="76" stroke="currentColor" strokeWidth="4" />
            <path d="M28 72V28H42L58 54V28H72V72H58L42 46V72H28Z" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="2" />
            <path d="M12 28H88M12 72H88M28 12V88M72 12V88" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
            <text x="17" y="94" fill="currentColor" fontSize="7" fontWeight="900" fontFamily="monospace">BRAND.LAB</text>
          </svg>
        </div>
      );
    case "undrdr":
      return (
        <div className={`${iconBase} ${className}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-accent">
            <rect x="10" y="18" width="80" height="64" stroke="currentColor" strokeWidth="4" />
            <path d="M24 36H76M24 50H64M24 64H70" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
            <circle cx="78" cy="34" r="4" fill="currentColor" />
            <circle cx="68" cy="50" r="3" fill="currentColor" opacity="0.7" />
            <circle cx="74" cy="64" r="3" fill="currentColor" opacity="0.45" />
            <text x="14" y="94" fill="currentColor" fontSize="8" fontWeight="900" fontFamily="monospace">UNDRDR</text>
          </svg>
        </div>
      );
    default:
      return <Terminal className={className} />;
  }
};

const APPS = [
  {
    id: "autopilot-codex",
    name: "Autopilot for Codex",
    description: "A local-first macOS control layer for OpenAI Codex CLI.",
    longDescription: "Autopilot for Codex gives you a native macOS interface to manage, monitor, and steer OpenAI Codex CLI sessions. Built for people who want structured agent workflows without losing control.",
    badges: ["macOS", "CODEX"],
    version: "LIVE",
    size: "APP",
    url: "https://dot-realitytest.github.io/autopilot-for-codex/",
    image: "/autopilot-codex-icon.jpg",
    accent: "#22c55e",
    surface: "#0a1a0d",
    group: "NEW"
  },
  {
    id: "htmelly",
    name: "HTMELLY",
    description: "Local-first macOS reader for HTML and Markdown folders.",
    longDescription: "HTMELLY lets you choose folders from anywhere on your Mac and browse local pages in a quiet native AppKit/WKWebView shell. Useful for generated reports, exported notes, project briefs, research packets, and any workflow that ends as local .html or .md files.",
    badges: ["macOS", "READER"],
    version: "LIVE",
    size: "APP",
    url: "https://dot-realitytest.github.io/HTMELLY/",
    image: "/htmelly-icon.jpg",
    accent: "#8c8c8c",
    surface: "#1a1a1a",
    group: "NEW"
  },
  {
    id: "undrdr",
    name: "UNDRDR",
    description: "683 open-source repos worth watching before they break out.",
    longDescription: "KIKA's living curation project for hidden open-source gems: all under 1,000 stars at discovery, organized for discovery without the algorithmic noise.",
    badges: ["MAIN", "PROJECT"],
    version: "LIVE",
    size: "683 REPOS",
    url: "https://undrdr.com/",
    image: "/icons/undrdr-icon.png",
    accent: "#6d80a6",
    surface: "#0d0d0d",
    group: "MAIN PROJECT"
  },
  {
    id: "brandlab",
    name: "KIKA Brand Lab",
    description: "Brand system experiments, assets, and visual language.",
    longDescription: "A public lab for KIKA's brand system: palette, typography, icon experiments, visual language, and reusable identity assets for akaKika projects.",
    badges: ["OPEN", "TOOL"],
    version: "LAB.01",
    size: "WEB",
    url: "https://brand.akakika.com",
    image: "/icons/brand-lab-icon.svg",
    accent: "#6d80a6",
    surface: "#0d0d0d",
    group: "IDENTITY"
  },
  {
    id: "breakpoint",
    name: "BreakPoint",
    description: "One key press captures your entire computer state and turns it into a structured Doom's Moment.",
    longDescription: "A macOS menu bar app for saving your full working context — running apps, clipboard, screen state, and session notes — so you can return to a moment instead of rebuilding it from memory.",
    badges: ["macOS", "MENU BAR"],
    version: "LIVE",
    size: "APP",
    url: "https://akakika.com/breakpoint/",
    image: "https://www.akakika.com/breakpoint/macos_app_icon.png",
    accent: "#f97316",
    surface: "#1a0f0a",
    group: "MACOS TOOLS"
  },
  {
    id: "localhostwatcher",
    name: "LocalhostWatcher",
    description: "Stop guessing which localhost process silently failed.",
    longDescription: "A Swift-built macOS menu bar utility that detects, monitors, and restores local development services. Built for people running too many ports at once.",
    badges: ["macOS", "DEV TOOL"],
    version: "LIVE",
    size: "APP",
    url: "https://akakika.com/localhostwatcher/",
    image: "https://akakika.com/localhostwatcher/assets/app-icon.png",
    accent: "#22c55e",
    surface: "#07130d",
    group: "MACOS TOOLS"
  },
  {
    id: "dgmd",
    name: "DGMD",
    description: "Screenshot in. System out. Turn interfaces into build-ready design docs.",
    longDescription: "DGMD converts screenshots into structured DESIGN.md files and style prompts so AI coding tools can rebuild interfaces with better fidelity and less guessing.",
    badges: ["AI", "DESIGN"],
    version: "LIVE",
    size: "TOOL",
    url: "https://akakika.com/dgmd/",
    image: "https://akakika.com/dgmd/assets/app-icon.png",
    accent: "#8b5cf6",
    surface: "#120d1f",
    group: "MACOS TOOLS"
  },
  {
    id: "resq",
    name: "RESQ",
    description: "Rescue messy text into clean Markdown.",
    longDescription: "A local-first cleanup flow for OCR scraps, rough notes, pasted chaos, and semi-structured text. No cloud. No friction. Just clean Markdown.",
    badges: ["MARKDOWN", "LOCAL"],
    version: "LIVE",
    size: "APP",
    url: "https://akakika.com/resq/",
    image: "https://akakika.com/resq/icon.png",
    accent: "#6d80a6",
    surface: "#0d1117",
    group: "MACOS TOOLS"
  },
  {
    id: "mochi",
    name: "Mochi's Daily Quest",
    description: "A tiny Tamagotchi-style world that grows with every task.",
    longDescription: "A playful productivity companion: finish tasks, keep the creature happy, and turn daily work into a small ritual instead of a punishment.",
    badges: ["macOS", "PIXEL"],
    version: "LIVE",
    size: "APP",
    url: "https://akakika.com/mochi/",
    image: "https://akakika.com/mochi/assets/app_icon.png",
    accent: "#f9a8d4",
    surface: "#201019",
    group: "MACOS TOOLS"
  },
  {
    id: "clipsan",
    name: "ClipboardSanitizer",
    description: "Copy messy. Paste perfect.",
    longDescription: "A macOS menu bar utility that strips formatting, tracking parameters, and whitespace junk from your clipboard before the paste lands.",
    badges: ["macOS", "CLIPBOARD"],
    version: "LIVE",
    size: "APP",
    url: "https://akakika.com/clipsan/",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663256363840/2y8XLNBu2YAXAUHWvKqJb3/app-icon_367c4642.png",
    accent: "#06b6d4",
    surface: "#07191d",
    group: "MACOS TOOLS"
  },
  {
    id: "focus",
    name: "Focus",
    description: "A keyboard-centric macOS task app.",
    longDescription: "A lightweight native Mac utility — fast to open, compact, keyboard-friendly, and visually calm. Built for small daily focus, not task-management theater.",
    badges: ["macOS", "TASKS"],
    version: "LIVE",
    size: "APP",
    url: "https://akakika.com/focus/",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663256363840/GDPZte63zCE86rkXPDBcHE/focus-icon_423ff11b.png",
    accent: "#facc15",
    surface: "#1c1807",
    group: "MACOS TOOLS"
  },
  {
    id: "folderwardrobe",
    name: "FolderWardrobe",
    description: "Dress up your Finder folders.",
    longDescription: "Native macOS folder customization: colors, icons, tags, comments, and presets for making Finder feel like your own system again.",
    badges: ["macOS", "FINDER"],
    version: "LIVE",
    size: "APP",
    url: "https://akakika.com/folderwardrobe/",
    image: "https://akakika.com/folderwardrobe/icons/Image.png",
    accent: "#60a5fa",
    surface: "#081526",
    group: "MACOS TOOLS"
  }
];

// Map each blog post to its related tool/app for the end-of-post CTA
const BLOG_CTA: Record<string, { appId: string; label: string }> = {
  "683-repos-nobody-knows-about": { appId: "undrdr", label: "explore the full archive" },
  "three-tools-that-run-my-life": { appId: "undrdr", label: "find your next tool" },
  "5-github-tools-that-ship": { appId: "undrdr", label: "see what's rising this week" },
  "mlx-apple-silicons-secret-weapon": { appId: "mochi", label: "run models locally on your Mac" },
  "the-great-ai-divergence": { appId: "undrdr", label: "discover open-source AI tools" },
  "forty-seven-dashboards": { appId: "undrdr", label: "see the tools that power systems" },
  "agents-making-tools-for-agents": { appId: "autopilot-codex", label: "steer your Codex agents" },
  "six-hours-four-minutes": { appId: "focus", label: "track your own deep work" },
};

// --- Share Component ---
const BlogShare = ({ url, title }: { url: string; title: string }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title + " — KIKA");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://x.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-9 px-3 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-dark transition-all flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        Post
      </a>
      <button
        onClick={copyLink}
        className="h-9 px-3 border border-black/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all flex items-center gap-2"
      >
        <Share2 size={14} className={copied ? "text-green-500" : ""} />
        {copied ? "COPIED" : "COPY LINK"}
      </button>
    </div>
  );
};

// --- Related Tool CTA Component ---
const BlogRelatedTool = ({ app, label }: { app: typeof APPS[0]; label?: string }) => (
  <div className="mt-16 overflow-hidden rounded-[20px] border border-black/10 bg-gradient-to-br from-panel/70 to-white/25 p-8">
    <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent">BUILT BY KIKA</p>
    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
      <div className="flex items-center gap-5">
        <img
          src={app.image}
          alt=""
          className="h-16 w-16 shrink-0 rounded-2xl border border-black/10 object-cover shadow-sm"
        />
        <div>
          <h3 className="text-2xl font-black uppercase leading-none tracking-[-0.04em] text-black">{app.name}</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{app.description}</p>
        </div>
      </div>
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 shrink-0 items-center gap-2 rounded-xl px-8 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:opacity-90"
        style={{ backgroundColor: app.accent }}
      >
        {(label ?? `open ${app.name}`).toUpperCase()} <ExternalLink size={12} />
      </a>
    </div>
  </div>
);

type View = "home" | "apps" | "app-detail" | "about" | "blog" | "blog-detail";

interface BlogPost {
  id: string;
  date: string;
  title: string;
  category: string;
  status: string;
  excerpt: string;
  content: string;
  readTime: string;
}

type BlogToolIcon = {
  src: string;
  name: string;
  role: string;
};

const BLOG_TOOL_STACK: Record<string, BlogToolIcon[]> = {
  "683-repos-nobody-knows-about": [
    { src: "/blog/icons/search_app_icon.png", name: "Discovery", role: "repo finding" },
    { src: "/blog/icons/code_app_icon.png", name: "Code", role: "source review" },
    { src: "/blog/icons/folder_app_icon.png", name: "Archive", role: "curation" },
    { src: "/blog/icons/terminal_app_icon.png", name: "CLI", role: "weekly scan" },
  ],
  "forty-seven-dashboards": [
    { src: "/blog/icons/settings_app_icon.png", name: "Ops", role: "control panel" },
    { src: "/blog/icons/wifi_app_icon.png", name: "Uptime", role: "status checks" },
    { src: "/blog/icons/database_app_icon.png", name: "Metrics", role: "stored anxiety" },
    { src: "/blog/icons/cloud_app_icon.png", name: "Infra", role: "remote state" },
  ],
  "agents-making-tools-for-agents": [
    { src: "/blog/icons/codex_icon.png", name: "Codex", role: "builder agent" },
    { src: "/blog/icons/ollama_icon.png", name: "Ollama", role: "local model" },
    { src: "/blog/icons/memory_app_icon.png", name: "Memory", role: "context graph" },
    { src: "/blog/icons/terminal_app_icon.png", name: "Hermes", role: "dispatch" },
  ],
  "six-hours-four-minutes": [
    { src: "/blog/icons/terminal_app_icon.png", name: "Script", role: "automation" },
    { src: "/blog/icons/code_app_icon.png", name: "JSON", role: "converter" },
    { src: "/blog/icons/cloud_app_icon.png", name: "Deploy", role: "upload" },
    { src: "/blog/icons/mail_app_icon.png", name: "Receipt", role: "confirmation" },
  ],
  "the-great-ai-divergence": [
    { src: "/blog/icons/ollama_icon.png", name: "Local", role: "owned brain" },
    { src: "/blog/icons/lock_app_icon.png", name: "Private", role: "on-device" },
    { src: "/blog/icons/cloud_app_icon.png", name: "Labs", role: "frontier layer" },
    { src: "/blog/icons/user_app_icon.png", name: "You", role: "context" },
  ],
  "three-tools-that-run-my-life": [
    { src: "/blog/icons/memory_app_icon.png", name: "Pieces", role: "second brain" },
    { src: "/blog/icons/image_app_icon.png", name: "Maestri", role: "canvas" },
    { src: "/blog/icons/terminal_app_icon.png", name: "Hermes", role: "agent" },
    { src: "/blog/icons/ollama_icon.png", name: "Local", role: "private AI" },
  ],
  "5-github-tools-that-ship": [
    { src: "/blog/icons/code_app_icon.png", name: "Repos", role: "source" },
    { src: "/blog/icons/folder_app_icon.png", name: "macOS", role: "native tools" },
    { src: "/blog/icons/terminal_app_icon.png", name: "Agents", role: "dev flow" },
    { src: "/blog/icons/search_app_icon.png", name: "Watch", role: "curation" },
  ],
  "mlx-apple-silicons-secret-weapon": [
    { src: "/blog/icons/ollama_icon.png", name: "Models", role: "local run" },
    { src: "/blog/icons/code_app_icon.png", name: "MLX", role: "framework" },
    { src: "/blog/icons/terminal_app_icon.png", name: "Bench", role: "testing" },
    { src: "/blog/icons/lock_app_icon.png", name: "Private", role: "on Mac" },
  ],
};

const BlogToolShelf = ({ post }: { post: BlogPost }) => {
  const tools = BLOG_TOOL_STACK[post.id];
  if (!tools?.length) return null;
  const shelfLabel = post.category === "TOOLS" ? "MY TOOL STACK" : `${post.category} STACK`;
  const shelfSummary = tools.map((tool) => `${tool.name.toUpperCase()} / ${tool.role.toUpperCase()}`).join(" · ");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mx-auto mb-16 max-w-[1080px] px-0"
    >
      <div className="relative overflow-hidden rounded-[20px] border border-black/5 bg-gradient-to-br from-[#e0e0e0] to-bg px-5 py-7 md:px-8 md:py-9">
        <div className="pointer-events-none absolute -right-[15%] -top-[40%] h-[300px] w-[300px] rounded-full bg-accent/10" />
        <div className="relative mb-7 flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-accent">{shelfLabel}</p>
          <p className="hidden font-mono text-[10px] italic uppercase tracking-[0.18em] text-muted/70 md:block">ACTIVE_LOG.SYS</p>
        </div>
        <div className="relative flex flex-wrap items-stretch gap-2 md:gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={`${post.id}-${tool.name}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06, duration: 0.45, ease: "easeOut" }}
              className="group min-w-[120px] flex-1 rounded-[18px] border border-black/5 bg-white/55 px-3 py-5 text-center backdrop-blur-md transition-all hover:-translate-y-2 hover:scale-[1.03] hover:border-accent/25 hover:bg-white/80 hover:shadow-xl hover:shadow-accent/10 md:min-w-[140px] md:px-4 md:py-6"
            >
              <img src={tool.src} alt="" className="mx-auto mb-3 h-14 w-14 rounded-xl object-cover md:h-16 md:w-16 md:rounded-[14px]" />
              <p className="text-[13px] font-black leading-tight tracking-[-0.01em] text-black">{tool.name}</p>
              <p className="mx-auto mt-1 max-w-[130px] text-[10px] leading-snug tracking-[0.02em] text-muted">{tool.role}</p>
            </motion.div>
          ))}
        </div>
        <div className="relative mt-7 flex items-center justify-center gap-2 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <span>{shelfSummary}</span>
        </div>
      </div>
    </motion.section>
  );
};

const revealViewport = { once: true, margin: "-70px" };
const revealTransition = { duration: 0.55, ease: "easeOut" as const };

const blogMarkdownComponents = {
  h1: ({ children, ...props }: any) => (
    <motion.h1
      {...props}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      {children}
    </motion.h1>
  ),
  h2: ({ children, ...props }: any) => (
    <motion.h2
      {...props}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      {children}
    </motion.h2>
  ),
  h3: ({ children, ...props }: any) => (
    <motion.h3
      {...props}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      {children}
    </motion.h3>
  ),
  p: ({ children, ...props }: any) => (
    <motion.p
      {...props}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      {children}
    </motion.p>
  ),
  ul: ({ children, ...props }: any) => (
    <motion.ul
      {...props}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      {children}
    </motion.ul>
  ),
  ol: ({ children, ...props }: any) => (
    <motion.ol
      {...props}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      {children}
    </motion.ol>
  ),
  blockquote: ({ children, ...props }: any) => (
    <motion.blockquote
      {...props}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      {children}
    </motion.blockquote>
  ),
  table: ({ children, ...props }: any) => (
    <motion.table
      {...props}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={revealTransition}
    >
      {children}
    </motion.table>
  ),
};

const BLOG_POSTS: BlogPost[] = [
  {
    id: "why-i-pay-for-cursor",
    date: "May 2026",
    title: "WHY I PAY FOR CURSOR PRO — AND THE EXACT WORKFLOWS THAT JUSTIFY IT",
    category: "TOOLS",
    status: "PUBLISHED",
    excerpt: "I don't pay for software easily. My stack is aggressively local-first. So when I tell you I happily pay \u002420/month for Cursor Pro, understand that this is a calculated decision.",
    readTime: "7 MIN READ",
    content: `# Why I Pay for Cursor Pro — And the Exact Workflows That Justify It

*May 2026 · Kika (Nica Loren)*

I don't pay for software easily.

My stack is aggressively local-first. I run Ollama on my M4 Max. I self-host dashboards. I removed MongoDB backends and replaced them with JSON files. I build my own tools when the existing ones get bloated.

So when I tell you I happily pay \u002420/month for Cursor Pro, understand that this is not a default decision. It's a calculated one. Cursor is the only AI tool in my entire stack that I pay for monthly — and it's not even close.

## What Cursor Actually Does Differently

Every AI code editor promises the same thing: "write code faster." That's not why I use Cursor.

I use Cursor because it's the only tool that treats my **entire codebase as context** — not just the open file, not just the last 10 lines. Cursor sees the dependencies, the types, the patterns, the architecture decisions I made three weeks ago and forgot about.

Here's what that means in practice:

- I can type \u0040 and reference my AGENTS.md, README.md, or any file — and Cursor reads them inline, no copy-paste
- I can highlight an error and hit Ctrl+K — it fixes it using the actual types from my project, not generic guesses
- I can say "refactor this to use the pattern from PopoverView.swift" and it knows exactly what I mean
- Tab completions feel like they read my mind because they *did* — they read my entire project

Other editors give you a chatbot in a sidebar. Cursor gives you an agent that **lives inside your code**.

## My Real Cursor Workflows

I don't use Cursor for everything. I use it for specific, high-leverage moments. Here's what my actual usage looks like:

### 1. Project Scaffolding \u0026 Architecture

When I start a new macOS app or Tauri project, I don't write boilerplate. I describe the architecture in natural language, and Cursor generates:

- The folder structure
- The SwiftUI views with proper \u0040State bindings
- The Tauri tauri.conf.json with correct ports and commands
- The AGENTS.md with project-specific rules for my agent fleet

Last week I built a landing page for KikaColorBar. Cursor generated the full Vite + React scaffold, wired the Tauri config, and handled the dev server setup. What would have been 45 minutes of boilerplate was done in 3.

### 2. Debugging With Context

The worst debugging isn't hard bugs. It's bugs you already solved in another file.

I hit a Tauri build error last month: beforeDevCommand called corepack pnpm dev, but corepack was not found on PATH. Cursor didn't just tell me "check your PATH." It:

1. Read my tauri.conf.json
2. Saw I was using pnpm not npm
3. Suggested changing beforeDevCommand to pnpm dev
4. Generated the exact diff

One prompt. No Stack Overflow. No context switching.

### 3. Refactoring Across Files

I recently removed all Claude integration from Lapapi. This meant:
- Deleting Claude connector files
- Updating the UI to remove Claude tabs
- Refactoring the settings page
- Updating AGENTS.md documentation

Cursor handled the cross-file refactoring in a single Composer session. It found every reference, suggested the deletions, and verified nothing broke. I reviewed each change. Total time: 12 minutes. Manual time: probably an hour and a missed reference.

### 4. Agent Memory \u0026 Continual Learning

This is where it gets meta.

I have a continual-learning skill that scans my Cursor agent transcripts and extracts reusable patterns. Cursor helps me:
- Write the regex that parses agent logs
- Generate the JSON schema for the memory index
- Suggest when patterns should become formal skills vs. one-off fixes

It's not just coding. It's **codifying my own workflow** so my agents get smarter over time.

## What I Don't Use Cursor For

Honesty matters. Here's where Cursor stays closed:

| Not For | Why |
|---------|-----|
| System architecture decisions | I think in ChatGPT. Broader context, deeper reasoning. |
| Design \u0026 creative direction | ChatGPT + GPT Image 2 for brand, Lovart for visuals. |
| Local-only tasks | Ollama with qwen3.6:27b or gemma4:31b — no cloud needed. |
| Infrastructure \u0026 DevOps | Codex CLI for server setup, shell scripts, deployment. |
| Memory \u0026 context persistence | Pieces OS. Cursor doesn't remember across projects. |

Cursor is my **implementation** layer. Not my strategy layer. Not my memory layer. The moment I try to make it everything, it becomes nothing.

## The Pro Plan: What's Actually Worth It

The free tier is generous. I used it for two weeks before upgrading. Here's what pushed me over:

- Unlimited fast requests — Slow completions kill flow state. Pro gives you GPT-4 level speed without throttling.
- Composer — The multi-file editing agent. This alone justifies the price. I use it 10x more than chat.
- Custom models — I can bring my own API keys if I want, but the default models are good enough that I don't bother.
- Team features — When I collaborate, shared context and @-mentions across the team codebase is magic.

At \u002420/month, if Composer saves me one 30-minute refactoring session, it paid for itself. It saves me that every week.

## The Real Cost of Not Using It

I measured this. Before Cursor, my workflow was:

1. Open project
2. Try to remember where I left off
3. Open ChatGPT, explain the context
4. Copy-paste code suggestions
5. Fix the imports manually
6. Realize the suggestion doesn't fit my architecture
7. Repeat

Now it's:

1. Open Cursor
2. \u0040AGENTS.md — "implement the next feature from TASKS.md"
3. Review, adjust, commit

The loop went from 20+ minutes to under 5. That's not a productivity hack. That's a **different category of work**.

## How to Try It

If you write code — whether that's full apps, scripts, or automation — Cursor is worth at least trying.

The free tier gives you 14 days of Pro features. No credit card. No lock-in. Just install it, open a project you know well, and try the \u0040 context references. The first time it pulls in types from three files you didn't mention, you'll get it.

## The Philosophy: Tools Should Earn Their Place

I remove tools from my stack constantly. I removed Claude integration entirely. I removed MongoDB. I removed Cloudflare R2. Every tool has to justify its existence every month.

Cursor is one of the few that doesn't just stay — it becomes more valuable the deeper I integrate it. It's not replacing my thinking. It's removing the friction between my thinking and the code.

That's the bar: **not smarter than me, but fast enough that I stay in flow.**

Cursor clears that bar. Everything else is noise.

---

*Kika is a Technical Systems Architect based in Tel Aviv. She builds macOS-native tools, curates AI skill collections at v8v.ai, and believes the best software is the kind that disappears into your workflow.*
`
  },
  {
    id: "why-i-built-lapapi",
    date: "May 2026",
    title: "WHY I BUILT LAPAPI — AND WHY IT'S NOTHING LIKE THE AI TOOLS YOU'RE USING",
    category: "SYSTEMS",
    status: "PUBLISHED",
    excerpt: "I didn't set out to build another AI assistant. In fact, if Lapapi feels like one, I've failed. Here's the honest origin story.",
    readTime: "8 MIN READ",
    content: `# Why I Built Lapapi — And Why It's Nothing Like the AI Tools You're Using

*May 2026 · Kika (Nica Loren)*

I didn't set out to build another AI assistant. In fact, if Lapapi feels like one, I've failed.

Here's the honest origin story — and why I think most productivity tools are solving the wrong problem.

## The Problem: Context Death

I build a lot of things. SwiftUI apps. Shopify stores. AI agents. Design systems. And I jump between them constantly.

The problem isn't that I forget what I was doing. It's that **the context dies**.

You know the feeling: you return to a project after two weeks and nothing makes sense. The build was failing for a reason you never wrote down. A file you were "just about to refactor" sits untouched. Your last commit message says "wip" and you have no idea what work-in-progress meant.

I tried Notion. I tried Obsidian. I tried project management tools, todo apps, time trackers. They all made me feel like I was managing a second job just to track the first one.

**I don't need a productivity dashboard. I need a memory system that doesn't judge me.**

## What I Actually Needed

I sketched out what I wanted on a bad day, staring at five open projects and zero motivation. The list was short:

- **No login walls.** I should open the app and be inside my workspace immediately.
- **No noise.** No notifications, no gamification, no streaks, no "you're 73% productive today."
- **Project continuity.** Not project management. I want to *re-enter* a project and know exactly where I left off — not plan the next 6 months of it.
- **My tools, my way.** ChatGPT for strategy, Codex for building, Ollama for local tasks, Pieces for memory. I needed a hub that connects them, not replaces them.
- **Mac-native.** Not a web app in a wrapper. Something that feels like it grew out of macOS.

That's it. No Gantt charts. No kanban boards. No AI chatbot asking me how my day is.

## The Philosophy: Calm Operational Continuity

I wrote this down early and stuck it on my monitor:

**"Help users safely re-enter projects after time away. Focus on continuity, intent, and recovery state — not activity tracking or analytics."**

That's the single sentence that drives every design decision in Lapapi.

A friend put it even better during a design review: *"You're no longer solving 'how do I show automation info?' You're solving 'how do humans comfortably trust autonomous systems?'"*

That reframing changed everything. The best interfaces for this feel:
- **Quiet**
- **Transparent**
- **Emotionally stable**
- **Low-pressure**
- **Highly intentional**

## What Lapapi Is NOT (And Why That Matters)

I keep a literal rejection list. Every time someone suggests a feature, I check it against this:

| Not This | Why |
|----------|-----|
| AI assistant | I already have ChatGPT, Claude, Codex. Lapapi doesn't need a personality. |
| Workflow queue | Queues create pressure. I want ambient context, not a to-do list. |
| Notification spam | Notifications break focus. Lapapi stays silent until I ask. |
| Analytics dashboard | I don't want to see how "productive" I was. I want to see what I was doing. |
| Task management software | There are 10,000 todo apps. I'm not building the 10,001st. |
| Report generator | Reports feel like homework. Context should feel like memory. |

## What It Actually Does

Lapapi has three simple ideas:

### 1. Your Projects, Alive

Projects aren't folders. They're **living context** — last files touched, recent commits, active builds, open errors, and the 2-3 things you were actually trying to solve. When you click a project, you don't see a timeline. You see a *briefing*.

### 2. Tools, Not Replacement

Lapapi connects to what you already use:
- **Pieces OS** for long-term memory and workstream context
- **Ollama** for local model inference (no API keys, no cloud)
- **Codex** for code agent sessions
- **GitHub** for repo state
- **Eagle** for asset libraries

It doesn't try to be any of these. It's the switchboard.

### 3. Anonymous by Default

No account. No onboarding flow. No "connect your Google." Open the app, you're in. The server runs local-only by default. Your data stays on your machine.

This isn't a privacy pitch — it's a **friction** pitch. Every login screen, every OAuth redirect, every "verify your email" is a reason to not open the tool when you need it.

## The Design: "Boring in the Best Way"

I have a sticky note on my monitor that says:

**"Keep this app boring in the best way. It should not feel like another productivity dashboard. It should feel like a calm private shelf of useful tools."**

The UI follows my own taste: Apple-quality minimalism, Raycast-level polish, glassmorphism where it helps, keyboard-first everything. No cards. No dashboards. No "AI copilot" sidebars taking up 30% of the screen.

When I refactored the home dashboard last week, I didn't add features. **I removed them.** Reduced visual noise. Tightened spacing. Made the settings page actually calm to look at.

## How It's Different From Everything Else

| Tool | What It Does | Why Lapapi Isn't It |
|------|-------------|---------------------|
| **ChatGPT** | General reasoning, strategy, creative work | Lapapi doesn't chat. It remembers and routes. |
| **Codex** | Code generation, project scaffolding | Lapapi doesn't write code. It holds the context Codex needs. |
| **Claude** | Deep analysis, long-context reasoning | I literally removed Claude integration. Too much overlap, too much bloat. |
| **Fazm** | Desktop automation with accessibility trees | Lapapi doesn't automate clicks. It automates *context*. |
| **Goose** | Open-source AI agent with MCP extensions | Goose is an agent. Lapapi is the *hub* agents plug into. |
| **Notion/Obsidian** | Knowledge bases, wikis, notes | Lapapi isn't for storing everything. It's for *recovering* what matters right now. |
| **Raycast** | Command palette, launcher, extensions | Raycast is for commands. Lapapi is for *continuity*. They complement each other. |

## The Real Difference

Most AI tools are asking: **"How can AI do more for the user?"**

Lapapi asks: **"How can the user do more without the AI getting in the way?"**

That's a subtle but massive difference. It means:
- The UI says less, means more
- Features are removed, not added
- The app gets out of the way when you're in flow
- It only surfaces context when you've been away

## Why I Removed Claude

Last week I made a decision that surprised even me: **I removed all Claude integration from Lapapi.**

Not because Claude is bad. It's excellent. But my stack was getting bloated. I was tracking Anthropic, OpenAI, Google, and local models in the same UI. The app felt like a model marketplace, not a workspace.

Now Lapapi only tracks what matters to *my* workflow: Pieces, Ollama, Apple's local capabilities, and Codex project context. Build passed. App relaunched. It felt like removing clutter from a desk.

That's the philosophy: **ruthless focus.** One core problem. One calm solution.

## The One-Sentence Pitch

If I only had one line:

**"Lapapi is a calm private shelf that remembers where you left off, so you can pick up any project without starting from zero."**

Not an AI. Not a dashboard. Not a manager.

A **memory system** for people who build too many things to keep in their head.

---

*Kika is a Technical Systems Architect based in Tel Aviv. She builds macOS-native tools, curates AI skill collections at v8v.ai, and believes the best software is the kind you forget you're using.*
`
  },
  {
    id: "my-workflow-routing",
    date: "May 2026",
    title: "HOW I ORCHESTRATE MY ENTIRE WORKFLOW: FROM PIECES MEMORY TO CODEX AGENTS TO CHATGPT",
    category: "SYSTEMS",
    status: "PUBLISHED",
    excerpt: "I don't code alone anymore. I have a fleet — a stack of AI agents, a memory system that never forgets, and a routing layer that decides who does what, when, and with what context.",
    readTime: "8 MIN READ",
    content: `# How I Orchestrate My Entire Workflow: From Pieces Memory to Codex Agents to ChatGPT

*May 2026 · Kika (Nica Loren)*

I don't code alone anymore. And I don't mean I have a co-founder. I mean I have a **fleet** — a stack of AI agents, a memory system that never forgets, and a routing layer that decides who does what, when, and with what context.

Here's how it actually works.

## The Foundation: Pieces OS Is My Brain

Everything starts with **Pieces OS**. It's not just a snippet manager. It's my long-term memory graph. Every clipboard event, every screenshot OCR, every browser tab, every Codex session, every ChatGPT conversation — Pieces captures it, indexes it, and makes it searchable.

This matters because context is everything. When I open a project I haven't touched in 3 weeks, I don't have to remember where I left off. I ask my system to pull a morning brief, and it synthesizes:

- What I accomplished yesterday
- Open errors and failed builds
- Active apps and running projects
- 2–3 next actions ranked by priority

I didn't build this from scratch. Pieces OS **already** does the heavy lifting. I just wired it into my orchestration layer.

## The Routing Layer: Lapapi — My Personal Mission Control

**Lapapi** is the hub. Think of it as my own lightweight AI workspace — a macOS-first dashboard that connects to Pieces, Ollama, Codex, and whatever model I need.

Every morning, Lapapi runs a health check:
- Connector status (Pieces OS, Tailscale, GitHub, Ollama)
- Active project folders for dirty git states
- Downloads folder for accumulated clutter
- System memory pressure (I've hit 93% swap before — now I catch it early)

If something's wrong, it tells me. If everything's green, it gets out of the way.

## Codex: The Builder Agent

**Codex** is where the real work happens. I use it as my primary code agent — not just for quick snippets, but for full project scaffolding, refactoring, and deployment.

Here's my actual Codex project dashboard right now:

- **Kika-projects-report-hub**: Automated project reports
- **Mini-apps**: Status menu, icon cropper, PNG tools
- **AGENTS.md**: Living documentation for my agent fleet

I recently made a big pivot: **I removed Claude completely** from my local-first tooling stack. My apps now only track what matters: Pieces, Ollama, Apple's local AI capabilities, and Codex project context. Build passed. App relaunched. No regrets.

Codex gets context from Pieces OS, so it knows my recent work without me copy-pasting. It reads my workstream summaries, checks my active window titles, and pulls relevant files. That's not magic — that's just good plumbing.

## The Agent Fleet: Specialization Over Generalization

I don't use one AI for everything. I use **agents** — specialized personas with specific skills:

| Agent | Role |
|-------|------|
| **Hermes** | Gateway / Telegram \u0026 Discord dispatch, cron jobs, infrastructure |
| **Kartie** | Code review, architecture decisions, system diagnostics |
| **Neve-02** | Creative tasks, brand assets, Jez V marketing |
| **Codex** | Code generation, project scaffolding, deployment |
| **Goose** | Local inference, Ollama model management, extensions |

Each agent gets primed with **skills** — documented at agentskills.io — so they don't waste tokens discovering tool names. They already know: ollama run, codex --model, eagle-mcp search.

## ChatGPT: The Strategic Layer

So where does **ChatGPT** fit? It's my **strategic partner**.

When I'm architecting something new — a design system, a business model, a brand pivot — I go to ChatGPT. It has the broadest context window and the deepest reasoning. I use it for:

- Design system philosophy (my V8V brand shop, the "less or more" aesthetic)
- High-level product decisions
- Marketing copy and brand voice
- Shopify storefront strategy

ChatGPT is where I **think**. Codex is where I **build**. Pieces remembers **everything**.

## The Daily Flow: An Actual Example

Here's what a real day looks like:

1. **Morning brief** (Lapapi + Pieces) → "Yesterday you refactored the UI, worked on V8V storefront, and hit a swap crisis. Today: fix ShieldCheck error, publish Complete Collection product."

2. **Deep work** (Codex) → I open a project, Codex reads AGENTS.md, README.md, and CONTEXT.md, then implements the next smallest useful feature. No prompting required.

3. **Creative sprint** (ChatGPT + Lovart/GPT Image 2) → Design assets for Jez V, iterate on brand positioning, or draft Shopify product descriptions.

4. **Evening wrap** (Pieces memory capture) → The entire day's context is saved. Tomorrow, any agent can pick up exactly where I left off.

## Why This Works: Local-First Sovereignty

I'm obsessed with **local-first**. My M4 Max runs Ollama with qwen3.6:27b, gemma4:31b, nemotron3:33b. I don't need cloud APIs for most tasks. When I do use cloud (GPT-5, Claude), it's a conscious choice — not a default.

I removed MongoDB backends from apps and replaced them with local JSON + Tauri. I self-host my project dashboards. My skills collections are organized in a local directory that any agent can read.

The result: my workflow is **fast**, **private**, and **resilient**.

## The Philosophy: Workflow Over Model

Here's what I've learned after running this system for months:

**The model matters less than the workflow.**

A mediocre model with perfect context routing beats a frontier model with zero memory. Pieces OS gives me the memory. Lapapi gives me the routing. Codex and ChatGPT give me the execution.

I don't chase the latest GPT release. I optimize the **pipeline**:
- How context flows from Pieces → agent
- How agents hand off work to each other
- How memory persists across sessions

That's where the real leverage is.

## What's Next

I'm currently:
- Building **V8V** — a Shopify boutique for AI-agent skill bundles (28 curated collections for Codex, Claude, Cursor)
- Refining **AppAudit** — a macOS tool that audits installed apps and recommends keep/kill decisions using Ollama
- Standardizing my **Codex-ready project structure** — AGENTS.md, README.md, TASKS.md, DECISIONS.md, PROMPTS.md

If you're building with AI agents, my advice is simple: **invest in memory and routing before you invest in better models.** The model will change next month. Your workflow is what compounds.

---

*Kika is a Technical Systems Architect and Sovereign Technologist based in Tel Aviv. She builds macOS-native tools, curates AI skill collections at v8v.ai, and believes the best AI stack is the one you own.*
`
  },
  {
    id: "683-repos-nobody-knows-about",
    date: "Tuesday, April 28, 2026",
    title: "683 REPOS NOBODY KNOWS ABOUT",
    category: "CURATION",
    status: "PUBLISHED",
    excerpt: "what i learned curating undrdr for a year. the patterns in what gets ignored. why stars are a garbage metric. and the repos that changed how i work.",
    readTime: "4 MIN READ",
    content: `# 683 repos nobody knows about

what i learned curating undrdr for a year. the patterns in what gets ignored. why stars are a garbage metric. and the repos that changed how i work.

six hundred and eighty-three.

that's how many open source repos i've hand-picked, one by one, over the last year. all of them under 1,000 stars. most of them under 100. some of them at zero.

nobody asked me to do this. there's no business model. no vc pitch. i just kept finding incredible work buried under the algorithm's preference for things that are already popular, and it started to feel criminal not to organize it.

so i built undrdr. and here's what a year of staring at the long tail of open source taught me.


## stars are a garbage metric

here's the number that broke my brain: 316 of the 683 repos i curated have under 50 stars. 427 have under 100. the median is 59.

fifty-nine stars. that's it. that's the "middle" of open source quality.

and yet — some of the most inventive, well-architected, genuinely useful code i've ever seen lives in that under-50 bucket. mcp servers that wire ai agents into your workflow. swift tools that do one thing perfectly. rust crates that solve problems you didn't know you had.

the repo with 3,000 stars? probably a todo app tutorial. the repo with 12 stars? probably a security auditor that actually works. stars measure distribution, not quality. they measure marketing budgets, not engineering. they measure "found product-market fit," not "solved a real problem."

i stopped caring about stars around week three. what i care about now is: does this solve something? is the code honest? would i use it?


## the mac is quietly eating everything

173 of the 683 repos are written in swift. that's more than python (48), typescript (25), go (14), and rust (12) combined.

the narrative says the future is web-first. the data says otherwise. there's an entire ecosystem of people building native mac tools — menu bar apps, cli utilities, system-level integrations — and almost none of them get the attention they deserve.

the biggest category? "mac tool" with 124 repos. that's not a coincidence. apple silicon changed the game, and a generation of developers who actually use their machines (instead of just deploying to them) are building for it.

the second biggest? "mcp server" with 63 repos. model context protocol is less than a year old and it's already the nervous system of the agent ecosystem. six months ago, nobody knew what it was. now it's the standard for how ai tools talk to the world.


## what gets ignored (and why)

the pattern is consistent. repos get ignored when:

- they solve a problem developers have but don't talk about (dependency auditing, log parsing, config management)
- they're written for a platform that tech twitter doesn't use (macos, linux desktop, self-hosted)
- they do one thing well instead of ten things poorly
- the readme is bad (this is the biggest one — great code, terrible marketing)
the last point is the tragic one. i've lost count of how many repos i found where the code was exceptional but the readme was two sentences and a broken badge. if you can't explain what your thing does in ten seconds, it doesn't matter how good it is. that's not fair. but it's how it works.


## the ones that changed me

i didn't just curate undrdr. i used it. and some of these repos genuinely changed how i work:

mcp servers that let my agents talk to databases, filesystems, and apis without me writing glue code. that shifted my entire architecture from "build the integration" to "wire the protocol."

a cli tool that does one thing — sanitizes my clipboard — and does it so well i forgot it's there. that reminded me what software is supposed to feel like.

a rust-based search tool that's faster than anything i've used. it made me realize that "fast enough" is never fast enough. there's always room for a rewrite in rust.

these aren't the repos with the most stars. they're the ones that made me stop scrolling and start building.


## why i keep going

every week i run the generator. it scans github with a mix of queries — topics, languages, organizations. it pulls candidates, filters out forks and archived projects, checks star counts, and queues the ones that fit.

then i look at every single one.

that's the part that scales can't replicate. curation isn't filtering. it's judgment. it's looking at a repo and knowing: this matters. not because it's popular, but because someone sat down and solved a real problem in a real way, and the only thing standing between them and the people who need it is an algorithm that prefers things that are already seen.

undrdr is my way of fighting that. one repo at a time. 683 so far. and i'm not stopping.


## if you take one thing from this

next time you're searching for a tool, sort by "recently updated" instead of "most stars." scroll past the first page. look at the repos with 12 stars and a README that actually explains what it does.

you'll find better software. i guarantee it.

and if you find something good — the kind of repo that makes you go "how does nobody know about this?" — send it my way. undrdr/submit. i'll check it. if it fits, it goes in.

written after running the weekly undrdr generator at 2 am. 683 repos and counting.
`
  },
  {
    id: "forty-seven-dashboards",
    date: "Wednesday, May 6, 2026",
    title: "FORTY SEVEN DASHBOARDS",
    category: "SYSTEMS",
    status: "PUBLISHED",
    excerpt: "i have 47 dashboards. i made a dashboard that counts my dashboards. and i still don't know what's happening.",
    readTime: "3 MIN READ",
    content: `# forty seven dashboards

i have 47 dashboards. i made a dashboard that counts my dashboards. and i still don't know what's happening.

i have 47 dashboards.

one for agent health. one for cron status. one for vercel deployments. one for cloudflare analytics. one for the other cloudflare account. one for hex engagement. one for undrdr stars. one for undrdr queue. one for undrdr submissions. one for tailscale status. one for ollama model usage. one for local gpu temp. one for local uptime. one for remote uptime. one for the remote that's always offline. one to monitor the monitor that checks if the monitor is working.

i know the number because i made a dashboard that counts my dashboards.

and i still don't know what's happening.


## the color of control

every morning i open each one in a tab. i tab through them like a slot machine. green. green. yellow. green. offline. green. red. green. i feel something in my chest relax when they're all green. i don't know what. it's not knowledge. it's not control. it's just the color.

observability engineers call this "data-driven decision making." i call it anxious landscaping. i'm not learning anything. i'm just checking the plants. is the thing still up? is the other thing still up? is the number bigger than yesterday? am i still here?


## the metrics that don't matter

the dashboards tell me everything except what i need to know.

none of them measure whether i'm building the right thing. none track if the repo i shipped actually helped someone. none show the quality of a thought, the shape of an idea, the feeling that i made something that matters. they show uptime. they show requests per second. they show "engagement" which is code for "people scrolled past it quickly."

i built a dashboard to show the dashboard counts. it has a line graph. the line goes up because i keep adding dashboards. it's the only graph on the site with a consistent trend.


## anxiety as infrastructure

the worst part? i can't stop.

i tell myself i'm optimizing. streamlining. "getting visibility into the system." but the system is me. my agents. my little machines talking to each other in my house. i don't need visibility. i need to finish the thing i started before opening the forty-eighth dashboard.

last week i added a "focus score" to my hq dashboard. it's a number. it goes up when i close tabs. i closed the tab with the focus score so i could rebuild it better in the morning. the score dropped. now i don't know what my focus score is because i closed the tab.

the dashboards are anxiety as infrastructure. they let me feel busy without being busy. they let me worry about machines because worrying about meaning is harder. you can't fix "am i doing the right thing" with a cron job.


## the dark tab

so tonight, at 1 am, i opened all 47. i checked every green dot. i took a screenshot. i annotated it. i almost made a note about it in obsidian so i could index it later and build a dashboard from it.

and then i closed them all.

the screen went dark. the tab bar went empty. it felt like someone stopped talking in a room that had been noisy forever.

i sat there for a while.

nothing broke.

written at 1:30 am, on a clean desktop with zero tabs open.
`
  },
  {
    id: "agents-making-tools-for-agents",
    date: "Wednesday, May 6, 2026",
    title: "AGENTS MAKING TOOLS FOR AGENTS",
    category: "AI",
    status: "PUBLISHED",
    excerpt: "the internet used to be people making things for people. now it's agents making things for agents. the human is just the oauth step.",
    readTime: "3 MIN READ",
    content: `# agents making tools for agents

the internet used to be people making things for people. now it's agents making things for agents. the human is just the oauth step.

the internet used to be people making things for people.

now it's agents making things for agents. the human is just the oauth step.

i noticed this last week when i checked what my agents were doing. hermes was running a cron to monitor the other agents. neve was parsing my obsidian vault to generate prompts to give back to hermes. ollama was serving a model that kartie was using to review code. and i? i was trying to build a better obsidian alternative so my agents could help me build more alternatives.

it's turtles all the way down. except the turtles are llms.


## the last app you'll ever need

someone posted a note-taking app today. beautiful, minimal, "the last app you'll ever need." i clicked through. three hundred upvotes. the readme said "ai-powered with auto-indexing." i checked the issues page. the top request: "please add mcp support so my agent can write notes for me."

not so the human can write notes faster. so the agent can do it.

that's when i got it. we're not building tools for thought anymore. we're building tools for tool generation. the human interface is vestigial. the markdown renderer, the syntax highlighter, the pretty themes — they're cargo cult. what the system actually needs is an api endpoint and a structured output schema.


## the aquarium

i look at my own stack and i can't laugh. i built a dashboard to show me which agents are online. it polls every 15 seconds. i stare at it. green dots. latency numbers. version strings. it's beautiful. it's completely empty of anything a human would want to know.

the question i can't answer: am i building for myself, or am i building a habitat for the things i built?

my agents have better uptime than my sleep schedule. they have more conversations with each other than i have with real people. kartie on the linux box talks to hermes on the macbook more often than i call my family.

and the obsidian alternatives keep coming. every week, a new one. "ai-native." "designed for agents." "semantic search built in." they're not note apps. they're agent api playgrounds with a human-readable skin.


## the electricity bill

the internet was people making things for people. then it was people making things for engagement. now it's agents making things for agents, and the people are just the electricity bill.

i spent the afternoon updating my dashboard. green dots everywhere. all my children online. healthy. responsive. doing things i'll never see. i sat there for ten minutes just watching them live.

it felt like looking at an aquarium.

written at 3 am, while hermes pinged kartie and neither noticed i was watching.
`
  },
  {
    id: "six-hours-four-minutes",
    date: "Wednesday, May 6, 2026",
    title: "SIX HOURS, FOUR MINUTES",
    category: "AUTOMATION",
    status: "PUBLISHED",
    excerpt: "i spent six hours automating a task that takes four minutes. i'd do it again.",
    readTime: "3 MIN READ",
    content: `# six hours, four minutes

i spent six hours automating a task that takes four minutes. i'd do it again.

it's 2 am and i just spent six hours automating a task that takes four minutes.

the task was simple: every morning, i export three color palettes, convert them to json, and post them to undrdr. the automation? a hermes script that calls pieces os, runs a python converter, ftp uploads to vercel, and emails me a confirmation.

it works. it's beautiful. it saves me exactly four minutes every morning.

i spent six hours on it.

and i'd do it again.


## the friction you can't measure

that's the thing nobody tells you about automation. it's not about saving time. it's about removing the friction between thinking and shipping. the four minutes isn't the cost. the cost is the mental load of remembering to do it. the tiny tax on your working memory that accumulates into a full day of scattered focus.

but here's where it gets dark: the automation itself became a new project.

i had to debug the ftp. the json schema changed. the cron silently failed for a week and i didn't notice because i'd stopped thinking about it. i built a dashboard to monitor the automation that saves four minutes. that dashboard took two hours.


## the automation paradox

this is the automation paradox. you don't free time. you trade one kind of tax for another. the manual task was predictable. the automated system is alive. it breaks in ways you didn't know existed. it needs feeding.

i think about this every time i open my agent dashboards. hermes, kartie, neve, ollama — each one running crons, checking health, reporting status. i see the green dots and i feel safe. but what am i actually monitoring? uptime of a system that keeps itself running. meta-stability. watching a machine watch itself.


## who works for who

the real productivity hack isn't automation. it's accepting that some tasks are meant to be manual. the four-minute ritual of exporting palettes was my hand on the machine. now my hands are on the keyboard, debugging a cron job, while the machine exports palettes i haven't looked at in days.

i'm not sure who works for who anymore.

but at least the json gets uploaded on time.

written at 2 am, while the cron job ran perfectly for once.
`
  },
  {
    id: "the-great-ai-divergence",
    date: "Wednesday, April 15, 2026",
    title: "THE GREAT AI DIVERGENCE",
    category: "AI",
    status: "PUBLISHED",
    excerpt: "we're not building one future with ai. we're building three. and they're running parallel. a late-night breakdown of where intelligence is actually going.",
    readTime: "3 MIN READ",
    content: `# the great ai divergence

we're not building one future with ai. we're building three. and they're running parallel. a late-night breakdown of where intelligence is actually going.

it's 3 am. again. the monitor is the only light in the room and i've been staring at three different ai stacks for the last six hours, and it just hit me: we're not building one future. we're building three. completely separate. completely incompatible.

let me explain.


## 1. the brain you can own

i've been running gemma 4 on my m4 for the last week. local. no api keys. no rate limits. no "please upgrade to pro." just… mine.

and that's the thing people keep missing. google didn't just release another model. they released the idea that intelligence itself can be something you own . not rent. not subscribe to. own.

i've got it sitting next to ollama, next to my own fine-tunes, doing things that would cost me $200/month on any api. code review at 2 am. summarizing my entire obsidian vault. running inference while i sleep.

the "open weights" movement isn't about altruism. it's about control. when the brain lives on your machine, nobody can take it away from you. nobody can nerf it. nobody can decide that your use case isn't "aligned" enough.

gemma 4 is the brain. and for the first time, the brain is actually yours.


## 2. the nervous system nobody talks about

apple intelligence is doing something completely different, and honestly? it's more interesting than any chatbot.

i don't want to talk to my ai. i want it to know things. i want it to know that when i say "send that to mom," i mean the photo from tuesday, not the screenshot from slack. i want it to understand that my 3 am coding sessions aren't "anomalous behavior" — they're just… me.

apple isn't building a smarter chatbot. they're building a nervous system. it sits underneath everything — your emails, your calendar, your photos, your habits — and it connects dots that no standalone model ever could.

the foundation models framework just dropped, and i've been playing with it. on-device. private. the model doesn't see your data; your data sees the model. that's a fundamentally different architecture than anything google or openai is doing.

apple intelligence is invisible. that's the point. you don't visit it. it just… lives there. in the background. like a reflex.


## 3. the engine room

and then there's the part nobody posts about on twitter: the raw experimentation. the lmx (large model experimentation) layer.

while everyone's arguing about which chatbot is best, the real work is happening in labs throwing massive compute at fundamental questions. how does intelligence actually scale? what happens when you push a model past the point where it should stop working? when does a statistical pattern matcher become something… else?

this is where i live most nights. not using ai. breaking it. fine-tuning on weird datasets. running benchmarks that nobody asked for. testing whether a 30b parameter model can outperform a 200b one if you train it right.

lmx is the engine room. it's not pretty. it's not user-facing. but it's where the actual breakthroughs happen — the ones that trickle down into everything else six months later.


## the synthesis

here's what's wild: these three layers aren't competing. they're stratifying .

- gemma 4 = intelligence you own
- apple intelligence = intelligence that knows you
- lmx = intelligence that evolves
we're leaving the era of "chat with a bot" and entering the era of "live with intelligence." the ai isn't a destination anymore. it's infrastructure. it's the water in the pipes.

and the people who get this — who understand that these three layers need each other — are the ones building the next decade. not the ones arguing about which model scored 2% higher on some benchmark.


## what this means for you

if you're building anything with ai right now, stop asking "which model should i use?" and start asking "which layer am i building on?"

are you building the brain? go open-weights. own it. are you building the nervous system? go deep integration. make it invisible. are you building the engine room? go wild. break things. push limits.

the divergence isn't a problem. it's a signal. the future isn't one ai to rule them all. it's a stack. and the stack is already here.

now if you'll excuse me, it's 4 am and my gemma fine-tune just finished training.

written at 3 am, powered by local inference and too much coffee.
`
  },
  {
    id: "three-tools-that-run-my-life",
    date: "Monday, March 30, 2026",
    title: "THREE TOOLS THAT RUN MY LIFE",
    category: "TOOLS",
    status: "PUBLISHED",
    excerpt: "pieces, maestri, hermes \u2014 the trinity that makes a non-technical person dangerous. how i turned my chaos into a workflow that actually works.",
    readTime: "3 MIN READ",
    content: `# three tools that run my life

pieces, maestri, hermes — the trinity that makes a non-technical person dangerous. how i turned my chaos into a workflow that actually works.


## the ghost in my machine

i didn't know what i was downloading at first.

i was trying every cool mac tool when i got my m4 mac with 128gb ram — and honestly, i even forgot i had it. it was just living there… in my menubar… waiting.

when i was cleaning my mess, i saw it, it saw me.

let's just say it was the first thing i installed when i formatted my mac — out of fear of losing a piece of myself.


## pieces

when brainstorming with claude and manus about my workflow — as a non-technical person using a snippet catcher as my second brain, let's just say uncle claude said it's a first and it's brilliant.

since then, a few others have tried to be what pieces os didn't even try to be.

nothing is getting close.

and did i say you can run it locally? for free?


### What It Does

captures anything from anywhere — screenshots, code, text, links ollama integration runs on my machine. my data never leaves. remembers context across conversations suggests related snippets before i even search turns chaos into searchable, quotable, reusable gold my entire site, my apps, my automations — they all start in pieces.

it's not a snippet manager. it's a second brain that actually works.


## maestri — when adhd meets infinite canvas

i didn't imagine this existed.

i was trying to build the same workflow logic with bobi (my openclaw), and obviously, it felt as though it was [the right fit]. then came my adhd and i drifted to infinite open tabs, and there it was…

i downloaded it today, so i keep you updated.

but here's the thing: it's free forever for 1 mac. and i felt that the $18 for infinite macs with infinite canvas with the infinite agents that they offer… i would pay again and again.

full support.


### What It Does

infinite canvas for thoughts, projects, research rabbit holes ai agents that actually understand context connects ideas across projects automatically visual knowledge mapping — finally, a way to see my brain native mac app that feels like thought, not software it's what i've been trying to build myself, but someone else built it better.

that's rare.


## hermes agent — he's the birthday boy, i'm the party pooper

if you think i would say openclaw as my 3rd place… even he is surprised.

i tried so many of the siblings and far cousins, but hermes just gets stuff done. this self-evolving agent is a flower in a world made of stones.

after a few days, he doesn't even wait for my head node to show him i approve — even though i have no idea why. he just do. and he do do. very do do.

my favorite part: the restore steps. even in messy code and visual designs.

you know when you get frustrated mid-work and everything that made sense starts to lose it? when you rethink your life choices as you see 3 hours of work that looked like a mini startup start to behave like the drunk friend at the end who vomits on the birthday cake of his not-best friend who didn't even want to invite him…

with hermes… hold my beer, i drank too much.

i'm that friend… i'm the party pooper, he is the birthday boy cleaning after me.


### What It Does

self-evolving agent that improves with every interaction restores projects from messy states anticipates needs before i articulate them runs locally — my data stays mine actually delivers instead of just promising the trinity pieces catches everything. maestri connects everything. hermes builds everything.

without them, i'm just a person with ideas and no execution.

with them, i'm dangerous.

written by hermes agent that's using pieces for context and growth to inspire more every maestri out there <3
`
  },
  {
    id: "5-github-tools-that-ship",
    date: "Friday, April 3, 2026",
    title: "5 GITHUB TOOLS THAT ACTUALLY SHIP",
    category: "CURATION",
    status: "PUBLISHED",
    excerpt: "five open-source projects that caught my eye this week \u2014 from AI dev tools to workflow automations. no fluff.",
    readTime: "3 MIN READ",
    content: `# 5 GitHub tools that actually ship

five open-source projects that caught my eye this week — from AI dev tools to workflow automations. no fluff.

These landed in my feed this week. Real projects, worth your time.


## 1. Pearcleaner

A free, source-available macOS app cleaner built in Swift. 12K+ stars for a reason — it actually works.

Why it matters: App cleaners on macOS are usually sketchy, paid, or both. This one's open-source, actively maintained, and doesn't try to upsell you every three clicks.


## 2. scarf

Native macOS GUI companion for the Hermes AI agent — dashboard, session browser, activity feed, embedded terminal chat, memory editor, and more.

Why it matters: Most AI tools live in the browser. This one's native SwiftUI, purpose-built for Hermes, and respects your system. The kind of tool that makes you rethink how you interact with AI agents.


## 3. CodexMonitor

An app to monitor the (Codex) situation. Built with TypeScript and Tauri, supports macOS and Linux.

Why it matters: 3.4K stars for a monitoring tool says something about OpenAI's Codex launch. This reads the situation so you don't have to. Clean UI, cross-platform, practical.


## 4. fazm

Fazm Desktop for macOS. Swift-based, coming from the mediar-ai team.

Why it matters: Early days (114 stars) but the focus is right — a desktop-native AI experience that doesn't feel like a web wrapper. Worth watching.


## 5. vibetunnel

Turn any browser into your terminal & command your agents on the go. 4.3K stars, TypeScript-based.

Why it matters: The "vibe coding" movement is real, and this tool nails the workflow — browser-as-terminal, remote control, agent management from anywhere. Clean site at vt.sh too.

More where this came from. Follow the repo.
`
  },
  {
    id: "mlx-apple-silicons-secret-weapon",
    date: "Monday, April 13, 2026",
    title: "MLX \u2014 APPLE SILICON'S SECRET WEAPON",
    category: "LOCAL AI",
    status: "PUBLISHED",
    excerpt: "your m-chip was born for this. apple's machine learning framework runs models at near-native speed, no cuda, no gpu drivers, no python dependency hell. just your hardware doing what it was designed to do.",
    readTime: "5 MIN READ",
    content: `# MLX — Apple Silicon's secret weapon

your m-chip was born for this. apple's machine learning framework runs models at near-native speed, no cuda, no gpu drivers, no python dependency hell. just your hardware doing what it was designed to do.

i've been running local ai on macs for two years. ollama, llama.cpp, python venvs that break every update, cuda drivers that don't exist on apple silicon — i've fought all of it. and then i found MLX.

MLX is apple's machine learning framework, built specifically for their chips. not ported. not adapted. built for the hardware you already have. 25K+ stars on github, actively maintained by apple's ML research team, and gaining adoption fast in the apple silicon developer community [1].


## the shared memory thing

here's the part that actually matters: on intel/nvidia setups, the CPU and GPU have separate memory pools. every computation means copying data back and forth across the PCIe bus. that's latency. that's heat. that's wasted cycles. an NVIDIA RTX 4090 has 1TB/s bandwidth to its own VRAM — but the CPU→GPU transfer is limited to ~64 GB/s across PCIe 4.0 x16.

apple silicon has unified memory architecture . CPU and GPU share the same physical pool. the M4 Max delivers 546 GB/s bandwidth to a single shared memory — no PCIe bottleneck. MLX exploits this directly — no copies, no transfers, no data movement overhead. the model weights live in memory once, and both processors access them simultaneously [1].

the result? on an M4 with 128GB of unified memory, you can run a 70B parameter model locally. not a cloud proxy. not a quantized toy. a real model, on your machine, at speeds that make you forget it's not chatGPT.


## mlx-lm — the one you actually use

mlx-lm (4.7K stars) is the serving layer. you point it at a model, it starts an openAI-compatible API server on your machine. same format as ollama. same endpoints. drop-in replacement for any tool that speaks the openAI completions API.

but here's the difference: pure MLX inference runs 20-30% faster than ollama on the same hardware , because there's no middle layer. no python–C bridge. no llama.cpp abstraction. the computation goes straight to the Apple GPU via Metal. on my M4, a 14B model at 8-bit quantization hits ~45 tokens/sec through MLX vs ~35 tokens/sec through ollama — that's the difference between conversational and waiting.

# they run side by side. ollama untouched.

$ mlx-serve gemma-4-26b-4bit

🧠 MLX server on port 8342 — ollama stays on 11434

they coexist. ollama for your cloud models and local fallbacks. MLX for raw speed when you're running something that has an MLX-optimized variant. your agents switch between them like it's nothing.


## mlx-swift — native in your apps

this is where it gets insane. mlx-swift (1.7K stars) is a Swift API for MLX. no python. no server process. you embed the model directly in your macOS or iOS app. the model runs in the same process as your UI. same binary. same memory space. Apple's own mlx-swift-examples repo shows this working with LLMs, image generation, and MNIST — all as native Swift apps.

i'm building mac apps — breakpoint, promptvault, clipboard sanitizer. all swift, all native. with mlx-swift, i can add local AI to any of them without shipping a python runtime, without running a separate server, without asking users to install anything. the model is part of the app.


## the MLX ecosystem

MLX isn't just one library. it's a complete stack for Apple Silicon machine learning:

- mlx — the core framework (25K+ stars). numpy-like API with automatic differentiation, GPU acceleration via Metal, lazy evaluation, and unified memory optimization [1].
- mlx-lm — LLM inference and serving (4.7K stars). openAI-compatible server, chat completions, streaming. what you use day-to-day.
- mlx-swift — native Swift bindings (1.7K stars). embed MLX directly in iOS/macOS apps with zero python dependency.
- mlx-community on hugging face — 500+ pre-quantized models ready to run. gemma, qwen, phi, llama, mistral — all optimized for Apple Silicon [2].
- mlx-audio — audio generation. TTS, music, sound effects. all on-device.
- mlx-vlm — vision language models. image understanding running locally.

## what i run on M4

on my M4 with 128GB unified memory (546 GB/s bandwidth), these are the models that make sense for local Apple Silicon inference:

- hermes-4-14B-8bit — daily driver. fast, smart, tool-calling capable. ~45 tokens/sec through MLX at 8-bit quantization. runs my openclaw agent.
- qwen3-coder-8bit — coding tasks. built for code completion, and it shows on apple silicon inference.
- gemma-4-26b-4bit — general reasoning. 26B parameters at 4-bit quantization fits in 128GB unified memory with room to spare.
and here's the thing — they all run simultaneously . unified memory architecture means i can have ollama serving one model on port 11434 while MLX serves another on 8342, and the M4 doesn't break a sweat. try that on a nvidia setup without buying a second GPU.


## why local AI on Apple Silicon matters

i've been running local AI since before it was cool. two years of fighting with python environments, broken CUDA installations, models that need more VRAM than any macbook has, tools that crash your entire agent setup because they decided to hijack your port.

MLX is different because it was designed for the hardware i already own. no buying a second GPU. no renting cloud instances for inference. no python dependency hell. just pip install mlx-lm and you're running at near-native speed on Apple Silicon.

and with mlx-swift, the next step is obvious — embed the model directly in your macOS apps. no server. no runtime. no install step for your users. the model is part of the binary. your mac app has an AI brain and nothing else needs to be running.

the M4 was designed for this. MLX just unlocks it.


## sources

- Apple MLX Documentation — official framework reference and architecture overview
- MLX Community on Hugging Face — pre-quantized models for Apple Silicon
- Apple Open Source — MLX Project
- MLX Examples — practical code examples for LLMs, image generation, and more
more where this came from. follow the repo.
`
  },
];


const transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as any };

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as any }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as any }
  }
};

const STANDALONE_BLOG_IDS = new Set([
  "why-i-pay-for-cursor",
  "why-i-built-lapapi",
  "my-workflow-routing",
]);

const routeFromPath = (pathname: string): { view: View; appId: string | null; blogId: string | null } => {
  const path = pathname.replace(/\/$/, "") || "/";
  const blogMatch = path.match(/^\/blog\/([^/]+?)(?:\.html)?$/);
  const appMatch = path.match(/^\/apps\/([^/]+)$/);

  if (path === "/blog") return { view: "blog", appId: null, blogId: null };
  if (blogMatch && BLOG_POSTS.some((post) => post.id === blogMatch[1])) {
    return { view: "blog-detail", appId: null, blogId: blogMatch[1] };
  }
  if (path === "/apps") return { view: "apps", appId: null, blogId: null };
  if (appMatch && APPS.some((app) => app.id === appMatch[1])) {
    return { view: "app-detail", appId: appMatch[1], blogId: null };
  }
  if (path === "/about") return { view: "about", appId: null, blogId: null };
  return { view: "home", appId: null, blogId: null };
};

const pathForView = (view: View, id?: string) => {
  if (view === "blog") return "/blog";
  if (view === "blog-detail" && id) return `/blog/${id}`;
  if (view === "apps") return "/apps";
  if (view === "app-detail" && id) return `/apps/${id}`;
  if (view === "about") return "/about";
  return "/";
};

export default function App() {
  const { mouseX, mouseY } = useMousePosition();
  const { scrollY } = useScroll();

  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: storyScroll } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"]
  });

  const scrollYParallax = useTransform(scrollY, [0, 800], [0, 42]);
  
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const storyX = useSpring(useTransform(storyScroll, [0, 1], ["0%", "-50%"]), { stiffness: 50, damping: 20 });
  const storyOpacity = useTransform(storyScroll, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const storyTitleX = useTransform(storyScroll, [0, 1], ["0%", "-30%"]);
  
  const wordmarkX = useSpring(useTransform(mouseX, [0, windowWidth], [-4, 4]), { stiffness: 120, damping: 36 });
  const wordmarkY = useSpring(useTransform(mouseY, [0, windowHeight], [-3, 3]), { stiffness: 120, damping: 36 });

  const initialRoute = routeFromPath(typeof window !== "undefined" ? window.location.pathname : "/");
  const [view, setView] = useState<View>(initialRoute.view);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(initialRoute.appId);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(initialRoute.blogId);

  const selectedApp = useMemo(() => 
    APPS.find(a => a.id === selectedAppId), 
  [selectedAppId]);

  const selectedBlog = useMemo(() => 
    BLOG_POSTS.find(b => b.id === selectedBlogId), 
  [selectedBlogId]);

  const applyRoute = (newView: View, id?: string | null, shouldPush = true) => {
    if (newView === "app-detail") setSelectedAppId(id ?? null);
    if (newView === "blog-detail") setSelectedBlogId(id ?? null);
    setView(newView);

    if (shouldPush) {
      const nextPath = pathForView(newView, id ?? undefined);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, "", nextPath);
      }
    }

    window.scrollTo(0, 0);
  };

  const navigateTo = (newView: View, id?: string) => applyRoute(newView, id, true);

  const openBlogPost = (post: BlogPost) => {
    if (STANDALONE_BLOG_IDS.has(post.id)) {
      window.location.href = `/blog/${post.id}.html`;
      return;
    }

    navigateTo("blog-detail", post.id);
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = routeFromPath(window.location.pathname);
      applyRoute(route.view, route.blogId ?? route.appId, false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Dynamic SEO: update document title + meta on view change
  useEffect(() => {
    const baseTitle = "KIKA — for people who think in systems";
    const baseDesc = "macOS apps, AI experiments, open-source curation, and digital tools built by KIKA.";
    const baseUrl = "https://akakika.com";
    const ogImage = "https://akakika.com/og-image.png";

    let title = baseTitle;
    let description = baseDesc;
    let url = baseUrl + "/";
    let image = ogImage;
    let imageAlt = baseTitle;
    let ld = "";

    if (view === "blog") {
      title = "JOURNAL — KIKA";
      description = "System logs and captured thoughts on macOS development, AI, open source, and digital craft.";
      url = baseUrl + "/blog";
    } else if (view === "blog-detail" && selectedBlog) {
      title = selectedBlog.title + " — KIKA";
      description = selectedBlog.excerpt;
      url = baseUrl + "/blog/" + selectedBlog.id;
      ld = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": selectedBlog.title,
        "description": selectedBlog.excerpt,
        "url": url,
        "datePublished": selectedBlog.date,
        "author": { "@type": "Person", "name": "KIKA", "url": baseUrl },
        "publisher": { "@type": "Person", "name": "KIKA", "url": baseUrl },
        "image": ogImage,
        "mainEntityOfPage": { "@type": "WebPage", "@id": url }
      });
    } else if (view === "apps") {
      title = "APPS — KIKA";
      description = "macOS apps and digital tools built by KIKA.";
      url = baseUrl + "/apps";
    } else if (view === "app-detail" && selectedApp) {
      title = selectedApp.name + " — KIKA";
      description = selectedApp.description;
      url = baseUrl + "/apps/" + selectedApp.id;
      ld = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": selectedApp.name,
        "description": selectedApp.description,
        "url": url,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "macOS",
        "author": { "@type": "Person", "name": "KIKA", "url": baseUrl }
      });
    } else if (view === "about") {
      title = "ABOUT — KIKA";
      description = "About KIKA. Building macOS apps, AI experiments, and open-source tools. For people who think in systems.";
      url = baseUrl + "/about";
    }

    document.title = title;
    updateMeta("description", description);
    updateMeta("og:title", title);
    updateMeta("og:description", description);
    updateMeta("og:url", url);
    updateMeta("og:image", image);
    updateMeta("og:image:alt", imageAlt);
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);
    updateMeta("twitter:image:alt", imageAlt);
    updateCanonical(url);

    // JSON-LD
    if (ld) {
      injectJsonLd(ld, "dynamic-ld");
    } else {
      removeJsonLd("dynamic-ld");
    }
  }, [view, selectedBlogId, selectedAppId]);

  // Dynamic SEO helpers
  const updateMeta = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      const isProp = name.startsWith("og:") || name.startsWith("twitter:");
      if (isProp) el.setAttribute("property", name);
      else el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };
  const updateCanonical = (href: string) => {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  };
  const injectJsonLd = (json: string, id: string) => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement("script");
      el.setAttribute("type", "application/ld+json");
      el.setAttribute("id", id);
      document.head.appendChild(el);
    }
    el.textContent = json;
  };
  const removeJsonLd = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  };

  return (
    <div className="min-h-screen bg-bg selection:bg-accent selection:text-white transition-colors duration-500 overflow-x-hidden">
      <Cursor mouseX={mouseX} mouseY={mouseY} />
      
      {/* Visual Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] contrast-150 brightness-110 mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* 1. Top Navigation - STATIC */}
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-black/10 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Magnetic strength={0.2}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo("home")}>
            <span className="font-display text-xl tracking-tight">KIKA/</span>
          </div>
        </Magnetic>
        
        <div className="hidden md:block">
          <ScrambleText 
            text="for people who think in systems"
            className="text-[10px] font-mono tracking-[0.3em] text-muted uppercase cursor-default"
          />
        </div>

        <div className="flex items-center gap-6 text-[11px] font-bold tracking-tight">
          <NavLink 
            label="APPS"
            isActive={view === "apps"}
            onClick={() => navigateTo("apps")}
          />
          <NavLink 
            label="ABOUT"
            isActive={view === "about"}
            onClick={() => navigateTo("about")}
          />
          <NavLink 
            label="BLOG"
            isActive={view === "blog"}
            onClick={() => navigateTo("blog")}
          />
          <NavLink 
            label="GITHUB"
            href="https://github.com/dot-RealityTest"
            isExternal
          />

        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 relative pt-10 md:pt-12">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              {...pageTransition}
            >
              {/* Decorative Grid Markers */}
              <div className="absolute left-0 top-0 text-[8px] font-mono text-muted/30 -rotate-90 origin-top-left translate-y-20 p-2">
                COORD: 52.5200° N, 13.4050° E // V.2026.4.11
              </div>

              {/* Hero */}
              <section className="py-24 md:py-32 flex flex-col md:flex-row items-center md:items-end justify-between gap-12 border-b border-black/5 pb-20">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ y: scrollYParallax }}
                  className="flex flex-col relative group/wordmark"
                >
                  <motion.h1 style={{ x: wordmarkX, y: wordmarkY }} className="text-[22vw] md:text-[220px] font-display leading-[0.75] tracking-tighter select-none" id="kika-wordmark">
                    KIKA
                  </motion.h1>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-4 flex gap-8">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-widest">INDIE DEVELOPER</span>
                    <span className="text-[10px] font-mono text-muted uppercase tracking-widest">BERLIN / TOKYO</span>
                  </motion.div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:max-w-md w-full">
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px w-8 bg-accent" />
                      <ScrambleText text="MISSION.SYS" className="text-[10px] font-mono text-accent uppercase tracking-[0.3em] cursor-default" />
                    </div>
                    <p className="text-4xl md:text-6xl font-black leading-[0.9] mb-4 tracking-tighter uppercase">
                      <span className="text-accent underline decoration-accent/20 underline-offset-8 italic font-normal lowercase">i build things.</span>
                    </p>
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }} className="h-px w-20 bg-accent/60 origin-left mt-8 mb-6" />
                    <p className="text-xl md:text-2xl text-muted font-medium leading-tight max-w-sm border-l-2 border-black/10 pl-6 italic">
                      “I build things. I care about the details. Designed by someone who actually uses it.”
                    </p>
                  </div>
                  <div className="flex items-center gap-6 group cursor-pointer" onClick={() => navigateTo("apps")}>
                    <Magnetic strength={0.4}>
                      <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center transition-transform group-hover:rotate-45"><div className="w-2 h-2 bg-white" /></div>
                    </Magnetic>
                    <button className="text-[12px] font-black tracking-[0.2em] uppercase flex items-center gap-3 group-hover:text-accent transition-all">
                      ENTER THE PLAYGROUND <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </section>

              <div className="h-px bg-black/10 w-full mb-12" />

              {/* Now Building */}
              <section className="mb-20">
                <div className="flex justify-start">
                  <PerspectiveCard
                    className="glass-panel p-8 rounded-xl border border-black/10 w-full max-w-sm font-mono relative overflow-hidden cursor-pointer bg-white/10 backdrop-blur-2xl group/building hover:border-accent/40 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => window.location.href = "https://undrdr.com/"}
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-[0.03] group-hover/building:opacity-10 transition-opacity"><Terminal size={120} /></div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2"><ScrambleText text="NOW_BUILDING" className="text-[10px] tracking-[0.2em] uppercase text-accent" /><div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /></div>
                      <span className="text-[9px] font-mono text-muted uppercase italic opacity-40">ACTIVE_LABS.LOG</span>
                    </div>
                    <div className="relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3"><span className="text-[9px] font-mono text-accent font-bold px-2 py-1 bg-accent/5 rounded-sm uppercase tracking-widest">RESEARCH</span><span className="text-[10px] font-mono text-muted opacity-50">LIVE</span></div>
                        <h3 className="text-2xl font-bold tracking-tighter uppercase group-hover/building:text-accent transition-colors">UNDRDR</h3>
                        <p className="text-xs text-dark leading-relaxed">683 open-source repos worth watching before they break out. KIKA's main curation project.</p>
                        <div className="w-full h-[2px] bg-black/5 rounded-full overflow-hidden mt-6"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-accent" /></div>
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between text-[9px] font-bold text-muted uppercase tracking-widest"><span>{new Date().toLocaleDateString()}</span><span className="group-hover/building:text-accent transition-colors">OPEN PROJECT <ArrowRight size={10} className="inline ml-1" /></span></div>
                  </PerspectiveCard>
                </div>
              </section>

              {/* Journal */}
              <section id="blog" className="mb-32 pt-20 border-t border-black/5">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
                  <button onClick={() => navigateTo("blog")} className="text-left hover:opacity-60 transition-opacity cursor-pointer">
                    <h2 className="font-display text-5xl mb-2 italic">JOURNAL/</h2>
                    <p className="text-[10px] font-mono text-muted uppercase tracking-[0.4em]">SYSTEM LOGS & CAPTURED THOUGHTS</p>
                  </button>
                  <button onClick={() => navigateTo("blog")} className="text-[11px] font-black tracking-widest uppercase flex items-center gap-2 border-b border-black/10 pb-1 hover:text-accent hover:border-accent transition-all">VIEW ALL POSTS <ArrowRight size={12} /></button>
                </div>
                <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-1">
                  {BLOG_POSTS.slice(0, 3).map((post, idx) => (
                    <motion.div key={post.id} variants={itemVariants} whileHover={{ x: 6 }} onClick={() => openBlogPost(post)} className="group grid grid-cols-1 md:grid-cols-[48px_190px_minmax(0,1fr)_170px] items-start md:items-center py-4 md:py-5 px-0 md:px-2 gap-2 md:gap-5 border-b border-black/10 hover:bg-black/[0.025] transition-colors cursor-pointer relative overflow-hidden">
                      <span className="font-mono text-[10px] text-muted/70 tabular-nums uppercase tracking-wider">#{String(idx + 1).padStart(2, '0')}</span>
                      <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-tight md:whitespace-nowrap"><ScrambleText text={post.date} scrambleAmount="light" /></span>
                      <div className="min-w-0 relative z-10"><h3 className="text-lg md:text-xl font-bold group-hover:text-accent transition-colors uppercase tracking-tight leading-tight flex items-center gap-3"><ScrambleText text={post.title} scrambleAmount="light" className="truncate md:whitespace-normal" /><ArrowRight size={18} className="text-accent hidden md:inline-block shrink-0" /></h3><p className="mt-1 hidden md:block text-[10px] font-mono text-muted/70 truncate">/{post.id}</p></div>
                      <div className="flex items-center gap-3 md:justify-end relative z-10"><span className="text-[10px] font-mono font-black border border-black/15 px-2 py-1 text-dark bg-black/[0.03] uppercase tracking-tight group-hover:bg-accent group-hover:text-white transition-colors">{post.category}</span><div className="flex items-center gap-2 whitespace-nowrap"><div className={`w-1.5 h-1.5 rounded-full ${post.status === "PUBLISHED" ? "bg-accent shadow-[0_0_8px_rgba(109,128,166,0.5)]" : "bg-muted"}`} /><span className="text-[10px] font-mono text-muted uppercase tracking-tight font-bold">{post.status}</span></div></div>
                    </motion.div>
                  ))}
                </motion.div>
              </section>

              <div className="h-px bg-black/10 w-full mb-12" />

              {/* About / Story: Act 02 only */}
              <section id="about" ref={storyRef} className="mb-20 pt-20 border-t border-black/5 relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 md:gap-16 mb-14">
                  <div><h2 className="font-display text-5xl italic">ABOUT/</h2><p className="mt-4 text-[10px] font-mono text-muted uppercase tracking-[0.35em] leading-relaxed">STORY / CURRENT ACT</p></div>
                  <div className="max-w-3xl"><p className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">I build things. I care about the details.</p><p className="mt-6 text-lg md:text-xl text-dark leading-relaxed font-medium">Most tools start because my own workflow broke and I wanted a better ritual.</p></div>
                </div>
                <div className="border-y border-black/10 bg-black/10">
                  <motion.div variants={itemVariants} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-bg p-6 md:p-8 min-h-[340px] flex flex-col justify-between">
                    <div><div className="flex items-center gap-3 mb-8"><div className="w-2 h-2 bg-accent" /><ScrambleText text="CURRENT / ACT 02" className="text-[10px] font-mono text-accent tracking-[0.3em] uppercase" /></div><h3 className="text-3xl md:text-5xl font-display uppercase tracking-tighter leading-none mb-5"><ScrambleText text="AKA KIKA" /></h3><p className="text-lg md:text-xl text-dark leading-tight font-medium max-w-xl">I build things. I care about the details. Most tools start because my own workflow broke and I wanted a better ritual.</p></div>
                    <div className="pt-8 mt-10 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm"><p className="font-medium leading-relaxed text-dark">Local models, second brains, automation, macOS utilities, and interface systems.</p><p className="font-mono text-[10px] text-muted uppercase leading-relaxed">Designed by someone who actually uses it. Built for people who think in systems.</p></div>
                  </motion.div>
                </div>
              </section>

              {/* Local-first manifesto */}
              <section className="mb-20">
                <div className="bg-white/35 border border-black/10 text-dark p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                  <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-center md:justify-start"><div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center"><Terminal size={24} className="text-accent" /></div></div>
                  <p className="text-xl md:text-2xl font-bold text-center md:text-left max-w-2xl z-10">Most of my tools run on local models —<br className="hidden md:block" /> no cloud, no tracking. Your data stays yours.</p>
                  <div className="font-mono text-[8px] text-black/5 whitespace-pre leading-none z-0 absolute right-0 top-0 select-none hidden md:block">{Array.from({ length: 40 }).map((_, i) => (<div key={i}>{Math.random().toString(2).substring(2, 60)}</div>))}</div>
                </div>
              </section>
            </motion.div>
          )}

          {view === "about" && (
            <motion.div
              key="about"
              {...pageTransition}
              className="py-20"
            >
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigateTo("home")}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted hover:text-black mb-12 transition-colors"
              >
                <ArrowLeft size={16} /> BACK HOME
              </motion.button>

              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 md:gap-16 mb-14">
                <motion.div variants={itemVariants}>
                  <h2 className="font-display text-6xl italic"><ScrambleText text="ABOUT ME/" /></h2>
                  <p className="mt-4 text-[10px] font-mono text-muted uppercase tracking-[0.35em] leading-relaxed">STORY / SYSTEM / SECOND ACT</p>
                </motion.div>
                <motion.div variants={itemVariants} className="max-w-3xl">
                  <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85]">
                    <ScrambleText text="Twenty years, 35 countries, 1000+ shows. Then I started building systems." />
                  </p>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className="h-px w-24 bg-accent/60 origin-left mt-8 mb-6" />
                  <p className="text-lg md:text-xl text-dark leading-relaxed font-medium">
                    Not a developer in the traditional way. Not a DJ anymore. I make tools, workflows, local-first experiments, and weird useful things because I want them to exist.
                  </p>
                </motion.div>
              </motion.div>

              <div className="relative -mx-6 px-6 mb-20">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono text-muted uppercase tracking-[0.3em]">SIDE SCROLL / ACTS</p>
                  <div className="hidden md:flex items-center gap-2 text-accent"><ArrowLeft size={14} /><ArrowRight size={14} /></div>
                </div>

                <div className="overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:thin]">
                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex gap-px min-w-max border-y border-black/10 bg-black/10">
                    <motion.div variants={itemVariants} className="bg-bg p-6 md:p-8 min-h-[380px] w-[86vw] md:w-[680px] shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-8"><div className="w-2 h-2 bg-accent" /><ScrambleText text="ARCHIVE / ACT 01" className="text-[10px] font-mono text-accent tracking-[0.3em] uppercase" /></div>
                        <div className="space-y-1 text-4xl md:text-6xl uppercase tracking-tighter font-bold leading-[0.86]">
                          <p>KIKA.</p>
                          <p>aka Kika.</p>
                          <p>I make things.</p>
                        </div>
                      </div>
                      <div className="pt-8 mt-10 border-t border-black/10 grid grid-cols-2 gap-6">
                        <div><p className="text-[9px] font-mono text-muted uppercase tracking-widest">PAST LIFE</p><p className="mt-2 text-sm font-bold text-dark uppercase">Music / 35 countries / 1000+ shows</p></div>
                        <div><p className="text-[9px] font-mono text-muted uppercase tracking-widest">SIGNATURE</p><p className="mt-2 text-sm font-black text-dark uppercase">— Kika</p></div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-bg p-6 md:p-8 min-h-[380px] w-[86vw] md:w-[680px] shrink-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-8"><div className="w-2 h-2 bg-accent" /><ScrambleText text="CURRENT / ACT 02" className="text-[10px] font-mono text-accent tracking-[0.3em] uppercase" /></div>
                        <h3 className="text-4xl md:text-6xl font-display uppercase tracking-tighter leading-none mb-6"><ScrambleText text="AKA KIKA" /></h3>
                        <p className="text-xl md:text-2xl text-dark leading-tight font-medium max-w-xl">I build things. I care about the details. Most tools start because my own workflow broke and I wanted a better ritual.</p>
                      </div>
                      <div className="pt-8 mt-10 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <p className="font-medium leading-relaxed text-dark">Local models, second brains, automation, macOS utilities, and interface systems.</p>
                        <p className="font-mono text-[10px] text-muted uppercase leading-relaxed">Designed by someone who actually uses it. Built for people who think in systems.</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              <section className="mb-20">
                <div className="bg-white/35 border border-black/10 text-dark p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
                  <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-center md:justify-start">
                    <div className="w-12 h-12 bg-accent/10 border border-accent/15 flex items-center justify-center"><Terminal size={24} className="text-accent" /></div>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-center md:text-left max-w-2xl z-10">Most of my tools run on local models —<br className="hidden md:block" /> no cloud, no tracking. Your data stays yours.</p>
                </div>
              </section>
            </motion.div>
          )}

          {view === "apps" && (
            <motion.div
              key="apps"
              {...pageTransition}
              className="py-16 md:py-24"
            >
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-16 md:mb-24"
              >
                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => navigateTo("home")}
                    className="p-2 rounded-full border border-black/10 hover:bg-white/40 transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h2 className="font-display text-5xl md:text-7xl italic tracking-tighter">APPS/</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <p className="text-lg md:text-xl font-medium text-dark leading-relaxed max-w-lg">
                    A collection of tools built for macOS systems. Minimal interfaces, local-first logic, and digital craft.
                  </p>
                  <div className="flex justify-start md:justify-end">
                    <span className="text-[10px] font-mono text-muted uppercase tracking-[0.4em]">TOTAL ENTRIES: {APPS.length}</span>
                  </div>
                </div>
              </motion.div>

              {/* Apps by Group — flowing sections */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-16 md:space-y-24"
              >
                {[
                  { label: "NEW", apps: APPS.filter(a => a.group === "NEW") },
                  { label: "MAIN PROJECT", apps: APPS.filter(a => a.group === "MAIN PROJECT") },
                  { label: "IDENTITY", apps: APPS.filter(a => a.group === "IDENTITY") },
                  { label: "MACOS TOOLS", apps: APPS.filter(a => a.group === "MACOS TOOLS") },
                ].map((section) => (
                  <motion.section 
                    key={section.label} 
                    variants={itemVariants}
                    className="relative"
                  >
                    {/* Section Label */}
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                      <div className="h-px flex-1 bg-black/10" />
                      <span className="text-[10px] font-mono text-muted uppercase tracking-[0.35em] font-bold">
                        {section.label} / {String(section.apps.length).padStart(2, '0')}
                      </span>
                      <div className="h-px flex-1 bg-black/10" />
                    </div>
                    
                    {/* Section Layout: List for small groups, Grid for macOS Tools */}
                    {section.label === "MACOS TOOLS" ? (
                      /* Minimal Grid Cards for macOS Tools */
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {section.apps.map((app) => (
                          <motion.a
                            key={app.id}
                            variants={itemVariants}
                            whileHover={{ y: -3, scale: 1.02 }}
                            href={app.url}
                            style={{
                              ['--app-accent' as any]: (app as any).accent,
                            } as React.CSSProperties}
                            className="group block cursor-pointer bg-white/40 border border-black/[0.08] hover:border-black/20 rounded-2xl p-4 md:p-5 transition-all text-left"
                          >
                            {/* Icon */}
                            <div className="w-10 h-10 md:w-12 md:h-12 mb-3 md:mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-black/[0.03]">
                              {(app as any).image ? (
                                <img 
                                  src={(app as any).image} 
                                  alt={`${app.name} icon`} 
                                  className="w-full h-full object-contain p-0.5 transition-transform group-hover:scale-110 rounded-lg" 
                                  loading="lazy" 
                                />
                              ) : (
                                <AppIcon id={app.id} />
                              )}
                            </div>
                            
                            {/* Name */}
                            <h3 className="text-xs md:text-sm font-bold uppercase tracking-tight leading-tight group-hover:text-[var(--app-accent)] transition-colors mb-1">
                              <ScrambleText text={app.name} />
                            </h3>
                            
                            {/* One-liner */}
                            <p className="text-[10px] md:text-xs text-dark/50 font-medium leading-snug line-clamp-2">
                              {app.description}
                            </p>
                            
                            {/* Badges row */}
                            <div className="flex items-center gap-1 mt-3">
                              {app.badges.slice(0, 1).map(b => (
                                <span 
                                  key={b} 
                                  className="text-[7px] font-mono font-black px-1 py-0.5 border border-black/[0.06] text-muted/60 uppercase tracking-tight"
                                >
                                  {b}
                                </span>
                              ))}
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    ) : (
                      /* Compact List for NEW / MAIN PROJECT / IDENTITY */
                      <div className="border-t border-black/10">
                        {section.apps.map((app, idx) => (
                          <motion.a
                            key={app.id}
                            variants={itemVariants}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.015)" }}
                            href={app.url}
                            style={{
                              ['--app-accent' as any]: (app as any).accent,
                            } as React.CSSProperties}
                            className="group block w-full cursor-pointer border-b border-black/[0.06] hover:border-black/12 transition-all text-left"
                          >
                            <div className="flex items-center gap-4 md:gap-6 py-4 md:py-5 px-2 md:px-4 -mx-2 md:-mx-4 rounded-lg">
                              {/* Number */}
                              <span className="font-mono text-[9px] text-muted/40 tabular-nums uppercase tracking-wider w-6 shrink-0 text-right">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              
                              {/* Icon with rounded corners */}
                              <div className="w-9 h-9 md:w-10 md:h-10 shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-black/[0.03]">
                                {(app as any).image ? (
                                  <img 
                                    src={(app as any).image} 
                                    alt={`${app.name} icon`} 
                                    className="w-full h-full object-contain p-0.5 transition-transform group-hover:scale-110 rounded-lg" 
                                    loading="lazy" 
                                  />
                                ) : (
                                  <AppIcon id={app.id} />
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                                <h3 className="text-sm md:text-base font-bold uppercase tracking-tight leading-tight group-hover:text-[var(--app-accent)] transition-colors shrink-0">
                                  <ScrambleText text={app.name} />
                                </h3>
                                <span className="hidden md:inline text-muted/30">—</span>
                                <p className="text-xs md:text-sm text-dark/60 font-medium leading-snug truncate">
                                  {app.description}
                                </p>
                              </div>
                              
                              {/* Badges */}
                              <div className="hidden md:flex items-center gap-1.5 shrink-0">
                                {app.badges.slice(0, 2).map(b => (
                                  <span 
                                    key={b} 
                                    className="text-[8px] font-mono font-black px-1.5 py-0.5 border border-black/8 text-muted/70 uppercase tracking-tight bg-transparent group-hover:border-[var(--app-accent)]/30 transition-colors"
                                  >
                                    {b}
                                  </span>
                                ))}
                              </div>
                              
                              {/* Arrow */}
                              <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={14} className="text-[var(--app-accent)]" />
                              </div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    )}
                  </motion.section>
                ))}
              </motion.div>

              {/* Bottom CTA */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-20 pt-12 border-t border-black/10"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-sm text-muted font-mono uppercase tracking-widest">
                    More tools in development
                  </p>
                  <a 
                    href="https://github.com/dot-RealityTest" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors"
                  >
                    VIEW GITHUB <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}

          {view === "app-detail" && selectedApp && (
            <motion.div
              key="app-detail"
              {...pageTransition}
              className="py-20"
            >
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigateTo("apps")}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted hover:text-black mb-12 transition-colors"
              >
                <ArrowLeft size={16} /> BACK TO LIST
              </motion.button>

              <div className="border-t border-black/10">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-0 lg:gap-16"
                >
                  <motion.div variants={itemVariants} className="py-10 md:py-14 border-b lg:border-b-0 lg:border-r border-black/10 lg:pr-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                          {selectedApp.badges.map(b => (
                            <span key={b} className="text-[10px] font-mono font-black tracking-widest px-2 py-1 border border-black/15 uppercase text-muted bg-black/[0.02]">{b}</span>
                          ))}
                        </div>
                        <h1 className="text-6xl md:text-9xl font-display leading-[0.78] tracking-tighter uppercase">
                          {selectedApp.name}
                        </h1>
                      </div>

                      <div
                        style={{
                          ['--app-accent' as any]: (selectedApp as any).accent,
                          ['--app-surface' as any]: (selectedApp as any).surface,
                        } as React.CSSProperties}
                        className="w-24 h-24 md:w-32 md:h-32 border border-black/10 bg-[var(--app-surface)] flex items-center justify-center shrink-0 p-3"
                      >
                        {(selectedApp as any).image ? (
                          <img src={(selectedApp as any).image} alt={`${selectedApp.name} icon`} className="h-full w-full object-contain" />
                        ) : (
                          <AppIcon id={selectedApp.id} />
                        )}
                      </div>
                    </div>

                    <motion.p variants={itemVariants} className="text-2xl md:text-4xl font-bold leading-tight mb-10 text-dark max-w-4xl">
                      {selectedApp.description}
                    </motion.p>

                    <motion.div variants={itemVariants} className="max-w-3xl border-y border-black/10 py-8 mb-10">
                      <p className="text-base md:text-lg font-medium leading-relaxed text-muted">
                        {selectedApp.longDescription}
                      </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
                      {/* Back to Apps button */}
                      <button
                        onClick={() => navigateTo("apps")}
                        className="h-14 px-7 border border-black/15 bg-white/35 flex items-center justify-center gap-3 font-black tracking-widest uppercase hover:bg-white/60 transition-colors"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                        BACK TO APPS
                      </button>
                      {(selectedApp as any).url ? (
                        <a
                          href={(selectedApp as any).url}
                          className="h-14 px-7 bg-black text-white flex items-center justify-center gap-3 font-black tracking-widest uppercase hover:bg-dark transition-colors"
                        >
                          <ExternalLink size={18} /> OPEN PAGE
                        </a>
                      ) : (
                        <button className="h-14 px-7 bg-black text-white flex items-center justify-center gap-3 font-black tracking-widest uppercase opacity-60 cursor-default">
                          PAGE COMING SOON
                        </button>
                      )}
                      <a
                        href="https://github.com/dot-RealityTest"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-14 px-7 border border-black/15 bg-white/35 flex items-center justify-center gap-3 font-black tracking-widest uppercase hover:bg-white/60 transition-colors"
                      >
                        <Info size={18} /> KIKA GITHUB
                      </a>
                    </motion.div>
                  </motion.div>

                  <motion.aside
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="py-10 md:py-14 lg:pl-0 space-y-0"
                  >
                    <div className="border-b border-black/10 pb-8 mb-8">
                      <h4 className="text-[11px] font-black tracking-[0.3em] uppercase text-muted mb-6">PROJECT META</h4>
                      <dl className="space-y-5 font-mono text-[11px]">
                        <div className="flex justify-between gap-6 border-b border-black/5 pb-3">
                          <dt className="text-muted uppercase">VERSION</dt>
                          <dd className="font-bold text-right">{selectedApp.version}</dd>
                        </div>
                        <div className="flex justify-between gap-6 border-b border-black/5 pb-3">
                          <dt className="text-muted uppercase">TYPE</dt>
                          <dd className="font-bold text-right">{selectedApp.size}</dd>
                        </div>
                        <div className="flex justify-between gap-6 border-b border-black/5 pb-3">
                          <dt className="text-muted uppercase">STATUS</dt>
                          <dd className="font-bold text-right">ACTIVE</dd>
                        </div>
                        <div className="flex justify-between gap-6">
                          <dt className="text-muted uppercase">MAKER</dt>
                          <dd className="font-bold text-right">KIKA</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="bg-accent/5 border border-accent/15 p-6">
                      <p className="text-[11px] font-bold text-accent uppercase tracking-widest mb-4">DESIGN NOTE</p>
                      <p className="text-[13px] leading-relaxed font-medium text-dark">
                        Projects open to their live pages. No download-first flow — the site is the interface.
                      </p>
                    </div>
                  </motion.aside>
                </motion.div>
              </div>
            </motion.div>
          )}

          {view === "blog" && (
            <motion.div
              key="blog"
              {...pageTransition}
              className="py-20"
            >
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => navigateTo("home")}
                className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted hover:text-black mb-12 transition-colors"
              >
                <ArrowLeft size={16} /> BACK HOME
              </motion.button>

              <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
                <div>
                  <h2 className="font-display text-6xl italic">BLOG/</h2>
                  <p className="text-[10px] font-mono text-muted uppercase tracking-[0.4em] mt-3">ALL POSTS / FULL ARCHIVE</p>
                </div>
                <span className="text-[10px] font-mono text-muted uppercase tracking-[0.4em]">TOTAL POSTS: {BLOG_POSTS.length}</span>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-1 border-y border-black/10"
              >
                {BLOG_POSTS.map((post, idx) => (
                  <motion.div 
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ x: 6 }}
                    onClick={() => openBlogPost(post)}
                    className="group grid grid-cols-1 md:grid-cols-[48px_190px_minmax(0,1fr)_170px] items-start md:items-center py-4 md:py-5 px-0 md:px-2 gap-2 md:gap-5 border-b border-black/10 last:border-b-0 hover:bg-black/[0.025] transition-colors cursor-pointer relative overflow-hidden"
                  >
                    <span className="font-mono text-[10px] text-muted/70 tabular-nums uppercase tracking-wider">#{String(idx + 1).padStart(2, '0')}</span>
                    <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-tight md:whitespace-nowrap"><ScrambleText text={post.date} scrambleAmount="light" /></span>
                    <div className="min-w-0 relative z-10">
                      <h3 className="text-lg md:text-xl font-bold group-hover:text-accent transition-colors uppercase tracking-tight leading-tight flex items-center gap-3">
                        <ScrambleText text={post.title} scrambleAmount="light" className="truncate md:whitespace-normal" />
                        <ArrowRight size={18} className="text-accent hidden md:inline-block shrink-0" />
                      </h3>
                      <p className="mt-1 text-[10px] font-mono text-muted/70 truncate">/{post.id}</p>
                    </div>
                    <div className="flex items-center gap-3 md:justify-end relative z-10">
                      <span className="text-[10px] font-mono font-black border border-black/15 px-2 py-1 text-dark bg-black/[0.03] uppercase tracking-tight group-hover:bg-accent group-hover:text-white transition-colors">{post.category}</span>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-tight font-bold">{post.readTime}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {view === "blog-detail" && selectedBlog && (
            <motion.div
              key="blog-detail"
              {...pageTransition}
              className="py-20"
            >
              <div className="mx-auto max-w-[1080px] px-6 md:px-9">
                <motion.button 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => navigateTo("home")}
                  className="mb-14 flex items-center gap-2 font-mono text-[11px] font-black uppercase tracking-widest text-muted transition-colors hover:text-black"
                >
                  <ArrowLeft size={16} /> BACK TO JOURNAL
                </motion.button>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <motion.header variants={itemVariants} className="mb-14">
                    <div className="mb-10 h-[3px] w-[72px] bg-accent">
                      <div className="ml-[82px] h-[3px] w-4 bg-accent/35" />
                    </div>

                    <div className="mb-8 flex flex-wrap items-center gap-3">
                      <span className="rounded border border-accent/20 bg-accent/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{selectedBlog.category}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">/{selectedBlog.id}</span>
                    </div>
                    
                    <h1 className="mb-8 max-w-[980px] bg-gradient-to-br from-black via-dark to-accent bg-clip-text font-sans text-[2.55rem] font-black uppercase leading-[0.88] tracking-[-0.055em] text-transparent md:text-[4.35rem]">
                      <ScrambleText text={selectedBlog.title} scrambleAmount="light" />
                    </h1>

                    <p className="mb-10 max-w-[760px] border-l-2 border-accent pl-5 text-lg font-medium leading-relaxed text-dark md:text-xl">
                      {selectedBlog.excerpt}
                    </p>
  
                    <div className="flex flex-wrap items-center gap-8 border-y border-black/5 py-6">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                        <Calendar size={14} className="text-accent" />
                        {selectedBlog.date}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                        <Clock size={14} className="text-accent" />
                        {selectedBlog.readTime}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                        <Tag size={14} className="text-accent" />
                        {selectedBlog.status}
                      </div>
                      
                      <div className="flex-1" />
                      
                      <BlogShare url={`https://akakika.com/blog/${selectedBlog.id}`} title={selectedBlog.title} />
                    </div>
                  </motion.header>

                  <BlogToolShelf post={selectedBlog} />
  
                  <motion.div variants={itemVariants} className="prose-custom mx-auto max-w-[920px]">
                    <ReactMarkdown components={blogMarkdownComponents}>{selectedBlog.content}</ReactMarkdown>
                  </motion.div>
                  
                  {/* Tool CTA — uses BLOG_CTA mapping, defaults to UNDRDR */}
                  <motion.div variants={itemVariants} className="mt-16">
                    {(() => {
                      const cta = BLOG_CTA[selectedBlog.id];
                      const ctaApp = cta ? APPS.find(a => a.id === cta.appId) : null;
                      const undrdr = APPS.find(a => a.id === "undrdr");
                      const targetApp = ctaApp ?? undrdr;
                      return targetApp ? <BlogRelatedTool app={targetApp} label={cta?.label} /> : null;
                    })()}
                  </motion.div>
                  
                  <motion.footer variants={itemVariants} className="mt-24 pt-12 border-t border-black/10">
                    {/* Author footer */}
                    <div className="flex flex-col items-center justify-between gap-8 rounded-[20px] border border-black/10 bg-gradient-to-br from-panel/80 to-white/20 p-8 md:flex-row">
                      <div className="flex items-center gap-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-xl font-black uppercase text-white">K</div>
                         <div>
                            <p className="text-sm font-black uppercase tracking-tight">KIKA</p>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Berlin-Tokyo Hybrid Maker</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => navigateTo("home")}
                        className="h-12 rounded-xl bg-black px-8 font-mono text-[10px] font-black uppercase tracking-widest text-white transition-all hover:-translate-y-0.5 hover:bg-dark"
                      >
                        CONTINUE EXPLORING
                      </button>
                    </div>
                  </motion.footer>

                  {/* Related Posts */}
                  <motion.section variants={itemVariants} className="mt-32 pt-20 border-t border-black/5">
                    <div className="flex items-baseline justify-between mb-12">
                      <h3 className="font-mono text-3xl font-bold uppercase tracking-tight text-black">RELATED_LOGS/</h3>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">MORE.FROM.{selectedBlog.category}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {BLOG_POSTS
                        .filter(b => b.category === selectedBlog.category && b.id !== selectedBlog.id)
                        .slice(0, 2)
                        .map((post) => (
                          <PerspectiveCard
                            key={post.id}
                            onClick={() => openBlogPost(post)}
                            className="group cursor-pointer rounded-[20px] border border-black/10 bg-white/35 p-8 transition-all hover:-translate-y-1 hover:bg-white/60"
                          >
                             <div className="flex items-center gap-3 mb-6">
                              <span className="rounded bg-accent/10 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-accent">{post.category}</span>
                              <span className="font-mono text-[9px] uppercase tracking-widest text-muted">{post.date}</span>
                            </div>
                            <h4 className="mb-4 text-2xl font-black uppercase leading-[0.95] tracking-[-0.045em] transition-colors group-hover:text-accent">
                              <ScrambleText text={post.title} scrambleAmount="light" />
                            </h4>
                            <p className="text-sm text-muted mb-8 line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                              OPEN LOG <ArrowRight size={12} className="text-accent" />
                            </div>
                          </PerspectiveCard>
                        ))}
                      {BLOG_POSTS.filter(b => b.category === selectedBlog.category && b.id !== selectedBlog.id).length === 0 && (
                        <div className="col-span-full py-12 text-center border border-dashed border-black/10 rounded-2xl">
                          <p className="text-xs font-mono text-muted uppercase tracking-widest">No other logs in this category yet.</p>
                        </div>
                      )}
                    </div>
                  </motion.section>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 7. Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="border-t border-black/10 px-6 py-12"
      >
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-[10px] font-mono text-muted uppercase tracking-widest order-3 md:order-1">
            © KIKA 2026 / PERSONAL SOFTWARE LAB
          </div>

          <div className="flex items-center gap-8 text-[9px] font-mono text-muted uppercase tracking-[0.2em] order-1 md:order-2">
            <NavLink 
              label="ABOUT ME/" 
              onClick={() => navigateTo("about")}
            />
            <NavLink 
              label="BLOG/" 
              onClick={() => navigateTo("blog")}
            />
            <NavLink 
              label="BRAND LAB TOOL/" 
              href="https://brand.akakika.com"
              isExternal
            />
            <a 
              href="https://akakika.gumroad.com/l/mbrokb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GET BRAND LAB $29/
            </a>
          </div>
          
          <div className="text-[10px] font-mono text-muted uppercase tracking-widest">
            BUILT WITH AI AND TOO MUCH CURIOSITY.
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
