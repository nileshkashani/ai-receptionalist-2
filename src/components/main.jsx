import React, { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Mic, X, Loader2 } from "lucide-react";

const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY) 
const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const Main = () => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // AI Volume
  const [userVolume, setUserVolume] = useState(0);   // User Volume (New!)
  const [transcript, setTranscript] = useState(""); 
  
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);

//   useEffect(() => {
//     console.log(process.env.REACT_APP_VAPI_API_KEY)
//   }, [])
  
  useEffect(() => {
    // --- VAPI EVENTS ---
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
      initializeAudioAnalyzer(); // Start listening to user mic
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
      setAssistantIsSpeaking(false);
      setTranscript("");
      stopAudioAnalyzer(); // Stop listening
    });

    vapi.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi.on("volume-level", (level) => {
      setVolumeLevel(level);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "partial") {
        setTranscript(message.transcript);
      }
    });

    vapi.on("error", (e) => {
      console.error(e);
      setConnecting(false);
    });
  }, []);

  // --- USER MICROPHONE ANALYZER (The Logic for Your Voice) ---
  const initializeAudioAnalyzer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      sourceRef.current = source;

      // Start reading volume
      updateUserVolume();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const updateUserVolume = () => {
    if (!connected || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    
    // Normalize to 0-1 range (roughly)
    const normalizedVolume = Math.min(average / 100, 1);
    
    setUserVolume(normalizedVolume);
    requestAnimationFrame(updateUserVolume);
  };

  const stopAudioAnalyzer = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setUserVolume(0);
  };

  // --- PARTICLE SPHERE ANIMATION ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    
    // Config
    const particles = [];
    const particleCount = 450; 
    const baseRadius = 110;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      particles.push({
        x: baseRadius * Math.sin(phi) * Math.cos(theta),
        y: baseRadius * Math.sin(phi) * Math.sin(theta),
        z: baseRadius * Math.cos(phi),
        originalX: baseRadius * Math.sin(phi) * Math.cos(theta),
        originalY: baseRadius * Math.sin(phi) * Math.sin(theta),
        originalZ: baseRadius * Math.cos(phi),
        size: Math.random() * 1.5 + 0.5,
      });
    }

    let angleY = 0;
    let angleX = 0;

    const render = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- LOGIC: DECIDE WHICH VOLUME TO USE ---
      // If AI is speaking, use AI volume. If AI is silent, use User volume.
      const activeVolume = assistantIsSpeaking ? volumeLevel : userVolume;
      
      // Rotation speed increases with activity
      const rotationSpeed = 0.002 + (activeVolume * 0.05);
      angleY += rotationSpeed;
      angleX += rotationSpeed * 0.2;

      // Expansion/Pulse effect
      // When speaking, the sphere expands outward
      const expansionFactor = 1 + (activeVolume * 0.5); 

      particles.forEach((p) => {
        // Expand particles based on volume
        const currentX = p.originalX * expansionFactor;
        const currentY = p.originalY * expansionFactor;
        const currentZ = p.originalZ * expansionFactor;

        // Rotation Math
        let x1 = currentX * Math.cos(angleY) - currentZ * Math.sin(angleY);
        let z1 = currentZ * Math.cos(angleY) + currentX * Math.sin(angleY);

        let y2 = currentY * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = z1 * Math.cos(angleX) + currentY * Math.sin(angleX);

        // Projection
        const scale = 300 / (300 + z2);
        const x2d = centerX + x1 * scale;
        const y2d = centerY + y2 * scale;

        // Draw
        ctx.beginPath();
        ctx.arc(x2d, y2d, p.size * scale, 0, Math.PI * 2);

        // --- COLOR LOGIC ---
        if (assistantIsSpeaking) {
           // TEAL glow for AI
           ctx.fillStyle = `rgba(34, 211, 238, ${0.5 + activeVolume})`; 
        } else if (userVolume > 0.05) {
           // WHITE/SILVER glow for USER
           ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + activeVolume * 2})`;
        } else {
           // DIM IDLE state
           ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + (z2/baseRadius)*0.2})`;
        }
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [assistantIsSpeaking, volumeLevel, userVolume]); // Re-run if these change

  const startCall = () => {
    setConnecting(true);
    vapi.start(assistantId);
  };

  const endCall = () => {
    vapi.stop();
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex flex-col items-center justify-between py-12 relative overflow-hidden font-sans">
      
      {/* Status Header */}
      <div className="z-10 text-center space-y-2">
        {connecting ? (
           <div className="flex items-center gap-2 text-gray-400">
             <Loader2 className="animate-spin w-4 h-4" />
             <span className="text-sm tracking-wider uppercase">Connecting...</span>
           </div>
        ) : (
          <div className="h-6"></div>
        )}
      </div>

      {/* Main Visual */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center">
        <div className="absolute top-1/4 w-full text-center px-4 z-20">
             {connected && !transcript && !assistantIsSpeaking && userVolume < 0.1 && (
                <p className="text-gray-500 animate-pulse text-lg">Say something...</p>
             )}
             {transcript && (
               <p className="text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto text-gray-100 fade-in">
                 "{transcript}"
               </p>
             )}
        </div>
        <canvas ref={canvasRef} className="w-full max-w-[600px] h-[400px] z-10" />
      </div>

      {/* Buttons */}
      <div className="z-10 flex flex-col items-center gap-6">
        {!connected ? (
          <button onClick={startCall} disabled={connecting} className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white hover:bg-gray-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
             <Mic className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
          </button>
        ) : (
          <button onClick={endCall} className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700">
             <X className="w-4 h-4 text-red-400" />
             <span className="text-sm font-medium">End Session</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Main;