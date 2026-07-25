import React from 'react';
import { SaveState } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface TutorialCoordinatorProps {
  saveState: SaveState;
  onUpdateState: (newState: SaveState) => void;
  onLaunchTutorial1: () => void;
  onLaunchTutorial2: () => void;
  activeCategory: string;
  activeTab: string;
  setActiveCategory: (cat: string) => void;
  setActiveTab: (tab: string) => void;
}

export const TutorialCoordinator: React.FC<TutorialCoordinatorProps> = ({
  saveState,
  onUpdateState,
  onLaunchTutorial1,
  onLaunchTutorial2,
  activeCategory,
  activeTab,
  setActiveCategory,
  setActiveTab
}) => {
  const step = saveState.tutorialStep || 0;

  function advanceStep(newStep: number) {
    const copy = { ...saveState, tutorialStep: newStep };
    onUpdateState(copy);
  }

  function finishTutorial() {
    const copy = { ...saveState, tutorialCompleted: true, tutorialStep: 99 };
    copy.credits += 250000;
    copy.crystals += 1000;
    copy.energy += 100;
    copy.inventory['carbonite_matrix'] = (copy.inventory['carbonite_matrix'] || 0) + 50;
    onUpdateState(copy);
  }

  // Define the overly/modal for each step
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
        <div className="bg-black/80 border border-cyan-500/30 p-8 rounded-3xl max-w-lg w-full text-center shadow-glow">
          <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black font-display text-white uppercase tracking-widest mb-2">Welcome Commander</h2>
          <p className="text-cyan-100/70 font-mono text-sm mb-8">
            You've been assigned command of a new sector. Let's begin with a rapid tactical simulation to cover combat basics.
          </p>
          <button 
            onClick={() => {
              advanceStep(1);
              onLaunchTutorial1();
            }}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 font-mono font-black text-sm px-6 py-4 rounded-xl transition uppercase tracking-widest flex items-center justify-center gap-2"
          >
            Start Combat Simulation <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={finishTutorial}
            className="mt-4 text-[10px] uppercase font-mono text-zinc-500 hover:text-zinc-300 transition"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) { // Finished battle 1
    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
        <div className="bg-black/80 border border-purple-500/30 p-8 rounded-3xl max-w-lg w-full text-center box-glow-purple">
          <ShieldCheck className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black font-display text-white uppercase tracking-widest mb-2">Advanced Tactics</h2>
          <div className="text-purple-100/70 font-mono text-[11px] mb-8 text-left space-y-4">
            <p>Excellent. Next, you must master the core flow of combat: <b>Status Effects, Assists, and Counters.</b></p>
            <ul className="list-disc pl-4 space-y-1 text-purple-200">
               <li><b>Buffs & Debuffs:</b> Green icons strengthen units (e.g. Defense Up), Red icons weaken them (e.g. Expose). Keep an eye on them!</li>
               <li><b>Assists:</b> Many abilities call an ally to attack immediately out of turn.</li>
               <li><b>Counterattacks:</b> Some units automatically strike back when damaged.</li>
            </ul>
            <p>Now, engage in the next simulation. You will be cleared to use <b>Special Abilities</b> to deploy these tactics.</p>
          </div>
          <button 
            onClick={() => {
              advanceStep(3);
              onLaunchTutorial2();
            }}
            className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400 text-purple-300 font-mono font-black text-sm px-6 py-4 rounded-xl transition uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-purple"
          >
            Start Simulator 2 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 4) { // Finished battle 2
    return (
      <>
        <div className="fixed inset-0 z-[100] bg-black/60 pointer-events-none transition-all"></div>
        <div className="fixed bottom-10 left-10 z-[101] bg-black/90 border border-amber-500/50 p-6 rounded-2xl max-w-sm pointer-events-auto shadow-glow">
          <h3 className="font-display font-black text-amber-400 uppercase tracking-widest mb-2">Squad Building</h3>
          <p className="font-mono text-xs text-amber-100/70 mb-4">
            A successful campaign requires a full 5-character squad. Navigate to the Squadrons menu to compile a blueprint!
          </p>
          {activeTab !== 'teams' && (
             <button 
               onClick={() => { setActiveCategory('units'); setActiveTab('teams'); }}
               className="w-full bg-amber-500/20 border border-amber-500/40 text-amber-400 py-2 rounded text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2"
             >
               Go to Squadrons
             </button>
          )}
          {activeTab === 'teams' && (
             <div className="text-xs font-mono text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-950/40 p-2 rounded text-center">
               Create and save any Squad Blueprint to continue!
             </div>
          )}
        </div>
      </>
    );
  }

  if (step === 5) { // Finished squad building
    return (
      <>
        <div className="fixed bottom-10 right-10 z-[101] bg-black/90 border border-emerald-500/50 p-6 rounded-2xl max-w-sm shadow-glow pointer-events-auto">
          <h3 className="font-display font-black text-emerald-400 uppercase tracking-widest mb-2">Character Upgrades</h3>
          <p className="font-mono text-xs text-emerald-100/70 mb-4">
            Units require constant upgrading. Go to your Database (Roster) and level up a character, or equip a gear piece!
          </p>
          {activeTab !== 'roster' && (
             <button 
               onClick={() => { setActiveCategory('units'); setActiveTab('roster'); }}
               className="w-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 py-2 rounded text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2"
             >
               Go to Roster
             </button>
          )}
          {activeTab === 'roster' && (
             <div className="text-xs font-mono text-amber-400 font-bold border border-amber-500/30 bg-amber-950/40 p-2 rounded text-center">
               Upgrade any character's Level or Gear to continue!
             </div>
          )}
        </div>
      </>
    );
  }

  if (step === 6) { // Finished upgrade
    return (
      <>
        <div className="fixed top-20 left-10 z-[101] bg-black/90 border border-cyan-500/50 p-6 rounded-2xl max-w-sm shadow-glow pointer-events-auto">
          <h3 className="font-display font-black text-cyan-400 uppercase tracking-widest mb-2">Events</h3>
          <p className="font-mono text-xs text-cyan-100/70 mb-4">
            Now that you are stronger, let's test your squad in the field. Open the Events menu and complete any event battle!
          </p>
          {activeCategory !== 'events' && (
             <button 
               onClick={() => { setActiveCategory('events'); setActiveTab('events_special'); }}
               className="w-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 py-2 rounded text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2"
             >
               Go to Events
             </button>
          )}
        </div>
      </>
    );
  }

  if (step === 7) { // Finished an event
    return (
      <>
        <div className="fixed bottom-10 right-10 z-[101] bg-black/90 border border-rose-500/50 p-6 rounded-2xl max-w-sm shadow-glow-rose pointer-events-auto">
          <h3 className="font-display font-black text-rose-400 uppercase tracking-widest mb-2">Character Finder</h3>
          <p className="font-mono text-xs text-rose-100/70 mb-4">
            Acquiring legendary characters is your primary objective. Click on a locked character in your Roster, then click "Find Shards" to see where they are earned!
          </p>
          {activeTab !== 'roster' && (
             <button 
               onClick={() => { setActiveCategory('units'); setActiveTab('roster'); }}
               className="w-full bg-rose-500/20 border border-rose-500/40 text-rose-400 py-2 rounded text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2"
             >
               Go to Roster
             </button>
          )}
        </div>
      </>
    );
  }

  if (step === 8) { // Finished finder
    return (
      <>
        <div className="fixed top-24 right-10 z-[101] bg-black/90 border border-amber-500/50 p-6 rounded-2xl max-w-xs shadow-glow pointer-events-auto">
          <h3 className="font-display font-black text-amber-400 uppercase tracking-widest mb-2">Daily Objectives</h3>
          <p className="font-mono text-xs text-amber-100/70 mb-4">
            Energy regenerates over time. Complete Daily Missions on your Home/Command screen to accelerate your progress. Claim your first Daily Mission reward!
          </p>
          {activeTab !== 'home' && (
             <button 
               onClick={() => { setActiveCategory('home'); setActiveTab('home'); }}
               className="w-full bg-amber-500/20 border border-amber-500/40 text-amber-400 py-2 rounded text-xs font-bold uppercase tracking-widest flex justify-center items-center gap-2"
             >
               Go to Command
             </button>
          )}
        </div>
      </>
    );
  }

  if (step === 9) { // Finished daily
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
        <div className="bg-black/80 border border-emerald-500/30 p-8 rounded-3xl max-w-lg w-full text-center shadow-glow">
          <Sparkles className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black font-display text-white uppercase tracking-widest mb-2">Simulation Complete</h2>
          <p className="text-emerald-100/70 font-mono text-sm mb-6">
            You are now ready to command the sector. The training wheels are off.
          </p>
          
          <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-4 mb-8 text-left space-y-2">
            <h4 className="text-[10px] font-black font-mono text-emerald-400 uppercase tracking-widest mb-2">Starter Resources Granted:</h4>
            <div className="text-xs font-mono text-white flex justify-between"><span>Credits</span> <span className="text-amber-400">+250,000</span></div>
            <div className="text-xs font-mono text-white flex justify-between"><span>Crystals</span> <span className="text-purple-400">+1,000</span></div>
            <div className="text-xs font-mono text-white flex justify-between"><span>Bonus Energy</span> <span className="text-emerald-400">+100</span></div>
            <div className="text-xs font-mono text-white flex justify-between"><span>Carbonite Matrices</span> <span className="text-zinc-400">+50</span></div>
          </div>

          <button 
            onClick={finishTutorial}
            className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400 text-emerald-300 font-mono font-black text-sm px-6 py-4 rounded-xl transition uppercase tracking-widest"
          >
            Acknowledge & Deploy
          </button>
        </div>
      </div>
    );
  }

  return null;
};
