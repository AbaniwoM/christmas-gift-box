"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, ChevronRight, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";

export default function ChristmasApp() {
  const [step, setStep] = useState<"box" | "input" | "opened">("box");
  const [userName, setUserName] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    // Matches your local filename in the public folder
    audioRef.current = new Audio("/maxkomusic-epic-christmas(chosic.com).mp3");
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const startExperience = () => {
    if (audioRef.current && step === "box") {
      audioRef.current.play().catch((e) => console.log("Audio play blocked", e));
    }
    setStep("input");
  };

  const handleOpenGift = () => {
    if (userName.trim() === "") return;
    setStep("opened");
    
    // Performance-aware confetti
    const count = window.innerWidth < 768 ? 60 : 150;
    confetti({
      particleCount: count,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#ffffff", "#ffd700"],
    });
  };

  return (
    <main className="relative min-h-dvh w-full flex flex-col items-center justify-center bg-linear-to-b from-red-800 via-red-900 to-green-950 overflow-hidden font-sans antialiased selection:bg-yellow-400 selection:text-red-900">
      
      {/* 1. AUDIO TOGGLE (Fixed Top Right) */}
      <button 
        onClick={toggleMute}
        className="fixed top-4 right-4 md:top-8 md:right-8 z-50 p-3 md:p-4 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="animate-pulse" />}
      </button>

      {/* 2. SNOWFLAKES BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="snowflake" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 12 + 8}s`,
            fontSize: `${Math.random() * 1 + 0.5}rem`
          }}>❄</div>
        ))}
      </div>

      <div className="z-10 flex flex-col items-center justify-center w-full px-4">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: FLOATING GIFT BOX */}
          {step === "box" && (
            <motion.div 
              key="box-step" 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-black mb-12 text-center drop-shadow-2xl tracking-tight">
                A Surprise <br className="sm:hidden" /> Awaits!
              </h1>
              
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, -2, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                onClick={startExperience}
                className="cursor-pointer relative group touch-manipulation"
              >
                <div className="absolute -inset-8 bg-yellow-400/20 rounded-full blur-3xl group-hover:bg-yellow-400/30 transition duration-500"></div>
                <div className="relative bg-red-600 p-8 sm:p-12 rounded-3xl shadow-2xl border-4 border-yellow-400">
                  <Gift className="text-white w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32" />
                  <div className="absolute top-1/2 left-0 w-full h-4 sm:h-6 bg-yellow-400 -translate-y-1/2"></div>
                  <div className="absolute left-1/2 top-0 w-4 sm:w-6 h-full bg-yellow-400 -translate-x-1/2"></div>
                </div>
                <p className="mt-8 text-white font-bold text-lg sm:text-2xl animate-bounce tracking-widest text-center">
                  TAP TO UNWRAP
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: NAME INPUT */}
          {step === "input" && (
            <motion.div 
              key="input-step" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full max-w-sm sm:max-w-md bg-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-white/20 shadow-2xl text-center"
            >
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-6">Who is opening this?</h2>
              <input
                autoFocus
                type="text"
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleOpenGift()}
                className="w-full px-6 py-4 rounded-full bg-white text-green-900 text-lg font-bold focus:ring-4 focus:ring-yellow-400 mb-6 outline-none"
              />
              <button
                onClick={handleOpenGift}
                disabled={!userName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-yellow-400 disabled:bg-gray-400 text-red-700 font-black py-4 rounded-full text-lg transition-all active:scale-95 shadow-lg cursor-pointer"
              >
                See Surprise <ChevronRight />
              </button>
            </motion.div>
          )}

          {/* STEP 3: THE MESSAGE (MAX RESPONSIVE) */}
          {step === "opened" && (
            <motion.div 
              key="opened-step" 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="
                w-[92%] sm:max-w-lg md:max-w-xl 
                h-auto max-h-[80vh] mb-10 
                bg-white rounded-[2.5rem] 
                shadow-[0_20px_60px_rgba(0,0,0,0.5)] 
                border-[6px] sm:border-10 border-yellow-400 
                relative text-center p-6 sm:p-10 md:p-12
                overflow-y-auto custom-scrollbar
              "
            >
              <Sparkles className="mx-auto text-yellow-500 mb-4 animate-spin-slow" size={36} />
              
              <div className="w-full">
                <h2 className="text-lg sm:text-2xl font-bold text-green-700 leading-tight">
                  Merry Christmas,
                </h2>
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-black text-red-800 my-2 sm:my-4 wrap-break-word uppercase tracking-tighter">
                  {userName}!
                </h3>
                <p className="text-lg sm:text-2xl text-green-800 font-bold mb-6 leading-tight">
                  & A Happy New Year, 2026
                </p>

                <div className="h-px w-full bg-linear-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

                <div className="space-y-6">
                  <p className="text-gray-600 italic text-base sm:text-lg leading-relaxed px-2">
                    "May your holiday season be filled with God's Presence, His abundant love, and endless joy. You're blessed on all sides in Jesus' name. Amen!"
                  </p>
                  
                  <div className="pt-4">
                    <div className="text-red-800 font-bold text-lg sm:text-xl">
                      Yours truly, Michael Abaniwo
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold italic">
                      ©2025
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setStep("box"); setUserName(""); }} 
                className="mt-8 text-gray-400 hover:text-red-500 text-sm font-medium transition underline underline-offset-4 decoration-dotted cursor-pointer"
              >
                Reset experience
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER (ATTRIBUTION) */}
      <footer className="absolute bottom-4 text-center w-full px-6 z-10">
        <div className="max-w-3xl mx-auto text-[10px] sm:text-[11px] md:text-xs text-white/40 leading-relaxed font-light">
          <p className="mb-1 uppercase tracking-[0.2em] opacity-40 font-bold">Music Credit</p>
          <div className="flex flex-wrap justify-center items-center gap-x-2">
            <a href="https://maxkomusic.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">Epic Christmas by MaxKoMusic</a>
            <span>|</span>
            <a href="https://www.chosic.com/free-music/all/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">via Chosic</a>
            <span>|</span>
            <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition underline">CC BY-SA 3.0</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .snowflake { position: absolute; top: -10%; color: white; user-select: none; animation: fall linear infinite; opacity: 0.4; }
        @keyframes fall {
          0% { transform: translateY(0vh) rotate(0deg); }
          100% { transform: translateY(110vh) rotate(360deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}