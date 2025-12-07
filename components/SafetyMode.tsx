import React, { useState, useEffect, useRef } from 'react';
import { Shield, MapPin, AlertTriangle, Eye, EyeOff, CheckCircle2, Battery, Signal, Heart, Lock } from 'lucide-react';
import { SafetyStatus } from '../types';

const SafetyMode: React.FC = () => {
  const [status, setStatus] = useState<SafetyStatus>('IDLE');
  const [hasConsented, setHasConsented] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number, accuracy: number } | null>(null);
  const [partnerNotified, setPartnerNotified] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false); 
  const [sosCountdown, setSosCountdown] = useState(3);
  
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackingIdRef = useRef<number | null>(null);

  const EMERGENCY_NUMBER = "112"; 
  const PARTNER_NAME = "Partner";

  const handleConsent = () => {
    setHasConsented(true);
    startTracking();
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your device.");
      return;
    }
    setStatus('TRACKING');
    setPartnerNotified(true);
    trackingIdRef.current = navigator.geolocation.watchPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude, accuracy: position.coords.accuracy }),
      (error) => console.error("Location Error:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const stopTracking = () => {
    if (trackingIdRef.current) navigator.geolocation.clearWatch(trackingIdRef.current);
    setStatus('IDLE');
    setPartnerNotified(false);
    setLocation(null);
  };

  const startSosSequence = () => {
    setStatus('SOS_COUNTDOWN');
    setSosCountdown(3);
    countdownRef.current = setInterval(() => {
      setSosCountdown((prev) => {
        if (prev <= 1) {
          triggerEmergencyCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSos = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setStatus(prev => prev === 'SOS_COUNTDOWN' ? (hasConsented ? 'TRACKING' : 'IDLE') : prev);
    setSosCountdown(3);
  };

  const triggerEmergencyCall = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setStatus('SOS_ACTIVE');
    window.location.href = `tel:${EMERGENCY_NUMBER}`;
    setTimeout(() => setStatus('TRACKING'), 5000); 
  };

  // Disclosure Screen
  if (!hasConsented && status === 'IDLE') {
    return (
      <div className="h-full flex flex-col p-8 bg-lumina-base overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-lumina-rose/30 blur-2xl rounded-full animate-pulse-slow"></div>
            <div className="w-24 h-24 glass-panel rounded-full flex items-center justify-center relative z-10 border border-lumina-rose/40">
              <Shield className="w-10 h-10 text-lumina-rose" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-serif text-lumina-highlight mb-2">Guardian Mode</h2>
            <p className="text-lumina-highlight/60 font-serif italic">Walk with peace of mind</p>
          </div>
          
          <div className="bg-white/60 p-6 rounded-2xl border border-white/50 text-left max-w-sm shadow-sm">
            <h3 className="text-lumina-highlight font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
              <Eye className="w-4 h-4 text-lumina-soft" /> Transparency
            </h3>
            <p className="text-lumina-highlight/80 text-sm leading-relaxed font-light">
              FEM needs your permission to share your <strong>location</strong> with your safety partner. 
              This allows them to see you on a map in real-time, even if you close the app.
            </p>
          </div>

          <div className="space-y-4 w-full max-w-xs">
            <button 
              onClick={handleConsent}
              className="w-full py-4 bg-gradient-to-r from-lumina-rose to-pink-400 text-white font-medium tracking-wide rounded-2xl shadow-[0_10px_30px_rgba(253,164,175,0.4)] hover:scale-[1.02] transition-transform"
            >
              Enable Protection
            </button>
            <button 
              onClick={() => {}}
              className="w-full py-3 text-lumina-highlight/40 text-sm hover:text-lumina-highlight transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SOS Overlay
  if (status === 'SOS_COUNTDOWN') {
    return (
      <div className="absolute inset-0 z-50 bg-gradient-to-br from-red-50 to-pink-100 flex flex-col items-center justify-center">
        <div className="w-full h-full absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-20"></div>
        <AlertTriangle className="w-24 h-24 text-rose-500 mb-8 animate-bounce" />
        <h1 className="text-9xl font-serif text-rose-500 mb-4">{sosCountdown}</h1>
        <p className="text-rose-400 text-xl font-serif italic mb-12">Contacting Emergency Services...</p>
        <button 
          onClick={cancelSos}
          className="px-12 py-4 bg-white shadow-xl border border-rose-200 text-rose-500 font-bold rounded-full text-lg hover:bg-rose-50 transition-all"
        >
          CANCEL
        </button>
      </div>
    );
  }

  // Active Tracking
  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-gradient-to-b from-white to-lumina-base">
      {/* Elegant Header */}
      <div className="absolute top-0 w-full z-20 p-6 flex justify-between items-start bg-white/40 backdrop-blur-md">
        <div className="flex flex-col">
            <h2 className="text-xl font-serif text-lumina-highlight flex items-center gap-2">
                Guardian Active
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
            </h2>
            <p className="text-lumina-highlight/50 text-xs mt-1 font-medium">
                {privacyMode ? "Curtain Active" : "Broadcasting Location"}
            </p>
        </div>
        <div className="flex gap-4 text-lumina-highlight/30">
            <Signal className="w-5 h-5" />
            <Battery className="w-5 h-5" />
        </div>
      </div>

      {/* Main Visualizer */}
      <div className="flex-1 relative w-full overflow-hidden flex flex-col items-center justify-center">
        {privacyMode && (
             <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center">
                 <Lock className="w-12 h-12 text-lumina-highlight/30 mb-4" />
                 <p className="text-lumina-highlight/50 font-serif italic">Discrete Mode Active</p>
             </div>
        )}

        {/* Soft Map Visuals */}
        <div className="absolute inset-0 opacity-20">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-lumina-rose/40 rounded-full"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-lumina-rose/40 rounded-full"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-lumina-rose/40 rounded-full"></div>
        </div>

        {/* Center Pulse */}
        <div className="relative z-10">
             {/* Ripples */}
             <div className="absolute inset-0 -m-8 border border-lumina-rose/30 rounded-full animate-ping-slow"></div>
             <div className="absolute inset-0 -m-16 border border-lumina-soft/30 rounded-full animate-ping-slow" style={{ animationDelay: '1s' }}></div>
             
             {/* Avatar/Pin */}
             <div className="w-24 h-24 bg-gradient-to-br from-lumina-rose/10 to-white backdrop-blur-md rounded-full border border-lumina-rose/20 flex items-center justify-center shadow-[0_10px_40px_rgba(253,164,175,0.3)]">
                <div className="w-3 h-3 bg-lumina-rose rounded-full shadow-[0_0_10px_rgba(253,164,175,1)]"></div>
             </div>
        </div>

        {/* Status Card */}
        <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-white p-5 rounded-2xl z-10 shadow-lg">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                        <h4 className="text-lumina-highlight font-serif text-sm">You are safe</h4>
                        <p className="text-lumina-highlight/40 text-[10px] uppercase tracking-wider font-bold">Signal Encrypted</p>
                    </div>
                </div>
                {partnerNotified && (
                    <div className="text-right">
                         <p className="text-[10px] text-lumina-highlight/40 uppercase tracking-wider mb-1 font-bold">Watching</p>
                         <div className="flex items-center gap-2 justify-end">
                            <span className="text-lumina-highlight text-sm font-medium">{PARTNER_NAME}</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                         </div>
                    </div>
                )}
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-lumina-rose to-lumina-lavender w-full animate-pulse"></div>
            </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="p-6 pb-8 bg-white/90 backdrop-blur-xl border-t border-white space-y-5 rounded-t-[2rem] shadow-[0_-5px_30px_rgba(0,0,0,0.05)]">
        
        <div className="grid grid-cols-5 gap-3">
             <button 
                onClick={() => setPrivacyMode(!privacyMode)}
                className={`col-span-1 rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 ${privacyMode ? 'bg-lumina-highlight text-white' : 'bg-gray-50 text-lumina-highlight/40 hover:bg-gray-100'}`}
             >
                 {privacyMode ? <EyeOff className="w-5 h-5 mb-1" /> : <Eye className="w-5 h-5 mb-1" />}
                 <span className="text-[10px] uppercase font-bold tracking-wider">Mask</span>
             </button>

             <button 
                onClick={status === 'TRACKING' ? stopTracking : handleConsent}
                className={`col-span-4 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all shadow-md
                    ${status === 'TRACKING' 
                        ? 'bg-gray-100 text-lumina-highlight border border-gray-200 hover:bg-gray-200' 
                        : 'bg-gradient-to-r from-lumina-rose to-pink-400 text-white shadow-lumina-rose/20'}
                `}
             >
                 {status === 'TRACKING' ? "End Walk" : "Start Walk"}
             </button>
        </div>

        {/* SOS Button */}
        <button
            onMouseDown={startSosSequence}
            onMouseUp={cancelSos}
            onMouseLeave={cancelSos}
            onTouchStart={startSosSequence}
            onTouchEnd={cancelSos}
            className="w-full h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center relative overflow-hidden group hover:bg-red-100 transition-colors"
        >
             <div className="absolute inset-0 flex items-center justify-center gap-3 z-10">
                 <Heart className="w-5 h-5 text-red-400 fill-red-400/20" />
                 <span className="text-red-400 font-serif tracking-widest text-sm font-bold">HOLD FOR HELP</span>
             </div>
             <div className="absolute bottom-0 left-0 h-[3px] w-full bg-red-200"></div>
        </button>
      </div>
    </div>
  );
};

export default SafetyMode;