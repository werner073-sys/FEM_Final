import React from 'react';
import { Heart, Info, Coffee } from 'lucide-react';

interface PartnerSyncProps {
  currentDay: number;
  mood: string;
}

const PartnerSync: React.FC<PartnerSyncProps> = ({ currentDay, mood }) => {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center animate-fade-in">
        <div className="max-w-md w-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-lumina-lavender to-lumina-rose"></div>
            
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-lumina-highlight">The Bridge</h2>
                <div className="p-2 bg-lumina-rose/10 rounded-full">
                    <Heart className="w-6 h-6 text-lumina-rose fill-lumina-rose/20" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white/50 p-4 rounded-xl border border-white/50 shadow-sm">
                    <h4 className="text-lumina-soft text-xs uppercase tracking-wider mb-1 font-bold">Status</h4>
                    <p className="text-lumina-highlight text-lg font-medium">Cycle Day {currentDay}: Follicular Phase</p>
                    <p className="text-sm text-lumina-highlight/60 mt-1">Energy levels are rising. She might feel more social and creative today.</p>
                </div>

                <div className="bg-lumina-rose/10 p-4 rounded-xl border border-lumina-rose/20 shadow-sm">
                    <h4 className="text-lumina-rose text-xs uppercase tracking-wider mb-1 flex items-center gap-2 font-bold">
                        <Info className="w-3 h-3" /> Reported Mood
                    </h4>
                    <p className="text-lumina-highlight text-lg capitalize">{mood || "Feeling Balanced"}</p>
                </div>

                <div className="bg-lumina-gold/20 p-4 rounded-xl border border-lumina-gold/30 flex items-start gap-4 shadow-sm">
                    <div className="p-2 bg-white/50 rounded-lg">
                        <Coffee className="w-6 h-6 text-orange-300" />
                    </div>
                    <div>
                        <h4 className="text-orange-400 text-xs uppercase tracking-wider mb-1 font-bold">Suggested Gesture</h4>
                        <p className="text-lumina-highlight/80 text-sm italic">
                            "A surprise coffee or a shared walk would be perfect today to match her energy."
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-center text-lumina-highlight/30 text-xs">
                Sync active with FEM Main Account
            </p>
        </div>
    </div>
  );
};

export default PartnerSync;