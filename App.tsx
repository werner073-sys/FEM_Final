import React, { useState, useEffect } from 'react';
import { Moon, MessageCircle, Users, Menu, X, Wind, Trash2, Shield, Sparkles, Flower2, LogOut } from 'lucide-react';
import LunarDial from './components/LunarDial';
import WombView from './components/WombView';
import TheSage from './components/TheSage';
import PartnerSync from './components/PartnerSync';
import SafetyMode from './components/SafetyMode';
import AuthPage from './components/AuthPage';
import { AppMode, View, CyclePhase, Symptom } from './types';
import { getDailyInsight } from './services/geminiService';
import { useAuth } from './contexts/AuthContext';
import { getTodaysCycleEntry, saveCycleEntry } from './services/cycleService';

const CYCLE_PHASES: CyclePhase[] = [
  { name: 'Menstruation', color: '#FFB7C5', startDay: 1, endDay: 5 }, // Pastel Pink
  { name: 'Follicular', color: '#E0BBE4', startDay: 6, endDay: 13 }, // Pastel Lilac
  { name: 'Ovulation', color: '#FDF2C6', startDay: 14, endDay: 16 }, // Pastel Gold
  { name: 'Luteal', color: '#D4F0F0', startDay: 17, endDay: 28 }, // Pastel Blue
];

const SYMPTOMS_DB: Symptom[] = [
  { id: 'calm', name: 'Calm', icon: '🌿', intensity: 1 },
  { id: 'energetic', name: 'Energetic', icon: '⚡', intensity: 1 },
  { id: 'creative', name: 'Creative', icon: '✨', intensity: 1 },
  { id: 'bloated', name: 'Bloated', icon: '💧', intensity: 1 },
  { id: 'cravings', name: 'Cravings', icon: '🍫', intensity: 1 },
  { id: 'cramps', name: 'Cramps', icon: '🔥', intensity: 1 },
  { id: 'sensitive', name: 'Sensitive', icon: '🌙', intensity: 1 },
  { id: 'fatigue', name: 'Fatigue', icon: '💤', intensity: 1 },
];

const App: React.FC = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [mode, setMode] = useState<AppMode>(AppMode.CYCLE);
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [currentDay, setCurrentDay] = useState(8);
  const [insight, setInsight] = useState<string>("Listening to the stars...");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Symptom Logging State
  const [loggedSymptoms, setLoggedSymptoms] = useState<Symptom[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-lumina-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lumina-rose/20 border-t-lumina-rose rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lumina-highlight/60 font-serif">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => window.location.reload()} />;
  }

  useEffect(() => {
    const loadTodayData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const entry = await getTodaysCycleEntry(today);
        if (entry) {
          setCurrentDay(entry.cycle_day);
          const symptoms = entry.logged_symptoms
            .map((id: string) => SYMPTOMS_DB.find(s => s.id === id))
            .filter(Boolean) as Symptom[];
          setLoggedSymptoms(symptoms);
        }
      } catch (err) {
        console.error('Error loading today data:', err);
      }
    };

    loadTodayData();
  }, []);

  useEffect(() => {
    const fetchInsight = async () => {
      const symptomNames = loggedSymptoms.length > 0
        ? loggedSymptoms.map(s => s.name)
        : ['No specific symptoms reported'];

      setInsight("Consulting the stars...");
      const text = await getDailyInsight(currentDay, mode, symptomNames);
      setInsight(text);
    };

    const timer = setTimeout(fetchInsight, 800);
    return () => clearTimeout(timer);
  }, [currentDay, mode, loggedSymptoms]);

  useEffect(() => {
    const saveTodayData = async () => {
      if (loggedSymptoms.length === 0) return;

      try {
        setIsSaving(true);
        const today = new Date().toISOString().split('T')[0];
        const symptomIds = loggedSymptoms.map(s => s.id);
        await saveCycleEntry(today, currentDay, symptomIds);
      } catch (err) {
        console.error('Error saving data:', err);
      } finally {
        setIsSaving(false);
      }
    };

    const timer = setTimeout(saveTodayData, 1000);
    return () => clearTimeout(timer);
  }, [loggedSymptoms, currentDay]);

  const toggleMode = () => {
    setMode(prev => prev === AppMode.CYCLE ? AppMode.PREGNANCY : AppMode.CYCLE);
    setCurrentView(View.DASHBOARD);
  };

  const handleDragStart = (e: React.DragEvent, symptom: Symptom) => {
    e.dataTransfer.setData("symptomId", symptom.id);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const id = e.dataTransfer.getData("symptomId");
    const symptom = SYMPTOMS_DB.find(s => s.id === id);
    
    if (symptom) {
        if (!loggedSymptoms.find(s => s.id === id)) {
            setLoggedSymptoms(prev => [...prev, symptom]);
        }
    }
  };

  const removeSymptom = (id: string) => {
      setLoggedSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const renderContent = () => {
    switch (currentView) {
      case View.SAGE:
        return <TheSage />;
      case View.PARTNER:
        return <PartnerSync currentDay={currentDay} mood={loggedSymptoms[0]?.name || "Balanced"} />;
      case View.SAFETY:
        return <SafetyMode />;
      case View.DASHBOARD:
      default:
        return (
          <div className="flex flex-col items-center h-full w-full overflow-y-auto pb-28 no-scrollbar">
            {/* Header / Mode Switch */}
            <div className="w-full flex justify-between items-center p-6">
               <button 
                onClick={() => setCurrentView(View.SAFETY)}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-lumina-rose/20 text-lumina-rose hover:bg-lumina-rose hover:text-white transition-all duration-500 shadow-sm hover:shadow-lg group"
               >
                  <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-serif tracking-widest uppercase">Guardian</span>
               </button>

               <button 
                onClick={toggleMode}
                className="px-6 py-2 rounded-full bg-white/40 border border-lumina-soft/30 hover:bg-white transition-all text-xs text-lumina-highlight/70 font-medium uppercase tracking-widest hover:tracking-[0.2em] duration-300 shadow-sm"
               >
                 {mode === AppMode.CYCLE ? 'Cycle' : 'Blossom'} Mode
               </button>
            </div>

            {/* Main Visualizer & Drop Zone */}
            <div 
                className={`
                    relative flex-grow flex flex-col items-center justify-center w-full max-w-2xl transition-all duration-700 ease-out p-8 rounded-[3rem] my-4
                    ${isDraggingOver ? 'bg-white/40 scale-105 shadow-[0_0_60px_rgba(255,183,197,0.3)] border border-lumina-rose/30' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
              {/* Floating Symptom Bubbles */}
              <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[3rem]">
                 {loggedSymptoms.map((s, i) => (
                    <div 
                        key={s.id}
                        className="absolute animate-float text-3xl opacity-80 filter blur-[0.5px]"
                        style={{
                            left: `${50 + (i % 2 === 0 ? 1 : -1) * (20 + i * 10)}%`,
                            top: `${40 + (i % 3 === 0 ? 1 : -1) * (10 + i * 5)}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${6 + i}s`
                        }}
                    >
                        {s.icon}
                    </div>
                 ))}
              </div>

              {/* Central Component */}
              <div className="z-10 relative">
                {mode === AppMode.CYCLE ? (
                    <LunarDial 
                    currentDay={currentDay} 
                    cycleLength={28} 
                    phases={CYCLE_PHASES} 
                    />
                ) : (
                    <WombView week={12} />
                )}
              </div>

              {isDraggingOver && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-white/60 backdrop-blur-md rounded-[3rem] transition-all">
                      <p className="text-3xl font-serif text-lumina-highlight tracking-widest drop-shadow-sm">Release to Plant</p>
                  </div>
              )}
            </div>

            {/* Logged Symptoms List */}
            <div className="flex flex-wrap gap-3 justify-center w-full max-w-md min-h-[40px] mb-8 z-10">
                {loggedSymptoms.length > 0 ? loggedSymptoms.map(s => (
                    <button 
                        key={s.id} 
                        onClick={() => removeSymptom(s.id)}
                        className="group flex items-center gap-2 px-4 py-2 bg-white/60 border border-white rounded-full text-lumina-highlight text-sm hover:bg-lumina-rose hover:text-white transition-all duration-300 shadow-sm"
                    >
                        <span className="filter drop-shadow-md">{s.icon}</span>
                        <span className="font-serif italic">{s.name}</span>
                        <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                )) : (
                    <p className="text-lumina-soft text-sm font-serif italic tracking-wide flex items-center gap-2">
                        <Flower2 className="w-3 h-3" />
                        Drag seeds here to log symptoms
                    </p>
                )}
            </div>

            {/* Daily Insight Card */}
            <div className="w-full max-w-md px-6 mb-8 z-10">
              <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:bg-white transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lumina-rose to-transparent opacity-50"></div>
                <div className="flex items-center justify-center gap-3 mb-4">
                   <Sparkles className="w-4 h-4 text-lumina-gold animate-pulse-slow" />
                   <h3 className="text-lumina-highlight/80 font-serif text-xl tracking-wide">Daily Wisdom</h3>
                   <Sparkles className="w-4 h-4 text-lumina-gold animate-pulse-slow" />
                </div>
                <p className="text-lumina-highlight font-light leading-relaxed text-center font-serif text-lg italic">
                  "{insight}"
                </p>
              </div>
            </div>
            
            {/* Draggable Symptom Palette */}
            <div className="w-full bg-white/80 backdrop-blur-xl border-t border-white/40 p-6 pb-10 z-20 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(255,183,197,0.1)]">
                <h4 className="text-lumina-highlight/40 text-xs uppercase mb-6 text-center tracking-[0.2em] font-medium">
                    Symptom Garden
                </h4>
                <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar px-4 justify-start md:justify-center">
                    {SYMPTOMS_DB.map((s) => (
                        <div 
                            key={s.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, s)}
                            className="flex flex-col items-center gap-3 min-w-[70px] group cursor-grab active:cursor-grabbing"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white border border-lumina-soft/20 flex items-center justify-center text-3xl shadow-sm group-hover:shadow-lg group-hover:shadow-lumina-rose/20 group-hover:scale-110 group-hover:border-lumina-rose/30 transition-all duration-300">
                                {s.icon}
                            </div>
                            <span className="text-xs text-lumina-highlight/60 group-hover:text-lumina-highlight font-medium transition-colors">
                                {s.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-lumina-base text-lumina-highlight overflow-hidden relative font-sans selection:bg-lumina-rose/20">
      {/* Pastel Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-lumina-base via-white to-lumina-base z-0 pointer-events-none"></div>
      
      {/* Orbs - Softened for light mode */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-lumina-lavender/30 blur-[100px] rounded-full pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-lumina-rose/20 blur-[100px] rounded-full pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-lumina-mint/30 blur-[80px] rounded-full pointer-events-none animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      {/* Main Container */}
      <div className="relative z-10 h-full flex flex-col md:flex-row">
        
        {/* Mobile Nav Header */}
        <div className="md:hidden flex items-center justify-between p-6 bg-white/80 backdrop-blur-xl border-b border-lumina-soft/10 z-50">
           <span className="font-serif text-2xl text-lumina-highlight tracking-wide">FEM</span>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-lumina-highlight/60 hover:text-lumina-rose transition-colors">
             {isSidebarOpen ? <X /> : <Menu />}
           </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className={`
            absolute md:relative z-50 h-full w-72 bg-white/95 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none border-r border-lumina-soft/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
            flex flex-col p-8
        `}>
            <div className="hidden md:block mb-12 pl-2">
                <h1 className="font-serif text-4xl text-lumina-highlight tracking-tight">FEM</h1>
                <p className="text-lumina-rose text-xs mt-3 uppercase tracking-[0.25em] font-medium">Elegant. Soft. You.</p>
            </div>

            <div className="space-y-3 flex-1">
                <NavButton 
                    active={currentView === View.DASHBOARD} 
                    onClick={() => { setCurrentView(View.DASHBOARD); setIsSidebarOpen(false); }}
                    icon={<Moon className="w-5 h-5" />} 
                    label="Lunar Dial" 
                />
                <NavButton 
                    active={currentView === View.SAGE} 
                    onClick={() => { setCurrentView(View.SAGE); setIsSidebarOpen(false); }}
                    icon={<MessageCircle className="w-5 h-5" />} 
                    label="The Sage" 
                />
                <NavButton 
                    active={currentView === View.PARTNER} 
                    onClick={() => { setCurrentView(View.PARTNER); setIsSidebarOpen(false); }}
                    icon={<Users className="w-5 h-5" />} 
                    label="The Bridge" 
                />
                 <NavButton 
                    active={currentView === View.SAFETY} 
                    onClick={() => { setCurrentView(View.SAFETY); setIsSidebarOpen(false); }}
                    icon={<Shield className="w-5 h-5" />} 
                    label="Guardian" 
                />
            </div>
            
            <div className="mt-auto pt-8 border-t border-lumina-soft/10">
                <div className="flex items-center gap-4 p-2 rounded-xl mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-lumina-rose to-lumina-lavender p-[2px]">
                        <img src="https://picsum.photos/100" alt="User" className="w-full h-full rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-serif text-lumina-highlight truncate">{user.email}</p>
                        <p className="text-xs text-lumina-highlight/40 truncate">Member</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-lumina-highlight/60 hover:text-lumina-rose hover:bg-white/40 rounded-xl transition-colors text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 relative overflow-hidden h-full">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            active 
            ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white text-lumina-highlight' 
            : 'text-lumina-highlight/50 hover:bg-white/40 hover:text-lumina-highlight'
        }`}
    >
        <span className={`${active ? 'text-lumina-rose' : 'text-lumina-highlight/40 group-hover:text-lumina-soft'} transition-colors duration-300`}>{icon}</span>
        <span className="font-serif tracking-wide text-lg">{label}</span>
    </button>
);

export default App;