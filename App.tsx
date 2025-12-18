
import React, { useState, useEffect, useRef } from 'react';
import { EDAGeminiService } from './geminiService';
import { Message, Sender, UserContext, EDAStep, DatasetId, DatasetInfo, Theme, AUTHOR } from './types';
import ChatBubble from './components/ChatBubble';
import WorkflowSidebar from './components/WorkflowSidebar';
import StepDisplay from './components/StepDisplay';
import DatasetSelector from './components/DatasetSelector';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('neon');
  const [userContext, setUserContext] = useState<UserContext>({
    currentStep: EDAStep.Clarification,
    datasetId: 'unknown',
    theme: 'neon'
  });
  
  const aiServiceRef = useRef<EDAGeminiService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    aiServiceRef.current = new EDAGeminiService();
    
    const startIntro = async () => {
      setIsLoading(true);
      const intro = await aiServiceRef.current?.startLesson(userContext);
      if (intro) {
        setMessages([
          {
            id: '1',
            sender: Sender.AI,
            text: intro,
            timestamp: Date.now(),
          },
        ]);
      }
      setIsLoading(false);
    };

    startIntro();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'neon' ? 'art' : prev === 'art' ? 'classic' : 'neon');
  };

  const triggerRoundtable = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setMessages(prev => [...prev, {
      id: `rt-${Date.now()}`,
      sender: Sender.User,
      text: "Gather the roundtable of experts. Give me a multi-perspective critique of our current EDA progress.",
      timestamp: Date.now()
    }]);

    try {
      const response = await aiServiceRef.current?.sendMessage(
        "Act as a roundtable of 3 expert critics: The Data Scientist (logical), The Educator (empathetic), and The UI/UX Designer (aesthetic). Provide a circular discussion reviewing our current EDA step."
      );
      setMessages(prev => [...prev, {
        id: `rt-resp-${Date.now()}`,
        sender: Sender.AI,
        text: response || "The roundtable has concluded.",
        timestamp: Date.now()
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepClick = async (step: EDAStep) => {
    if (step === userContext.currentStep || isLoading) return;
    setUserContext(prev => ({ ...prev, currentStep: step }));
    
    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: Sender.AI,
        text: `📍 Module switched to: **${step}**.\nI'm ready to guide you through this phase.`,
        timestamp: Date.now(),
      }
    ]);

    setIsLoading(true);
    try {
      await aiServiceRef.current?.sendMessage(`I have navigated to the "${step}" step. Please adjust our lesson focus.`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatasetSelect = async (ds: DatasetInfo) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: `🎨 Selection: **${ds.name}** (Artistic Data Module). Let's explore.`,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    setUserContext(prev => ({ 
      ...prev, 
      datasetId: ds.id, 
      datasetName: ds.name,
      skillLevel: ds.complexity.toLowerCase() as any
    }));

    try {
      const response = await aiServiceRef.current?.sendMessage(`I've selected the ${ds.name} dataset. Analyze it as an AI Implementation Director.`);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: Sender.AI,
          text: response || "Analysis module initialized.",
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now().toString(), sender: Sender.User, text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiServiceRef.current?.sendMessage(input);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: Sender.AI, text: response || "I'm listening.", timestamp: Date.now() }]);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <WorkflowSidebar currentStep={userContext.currentStep} onStepClick={handleStepClick} />

      <main id="main-content" className="flex-1 flex min-w-0" role="main">
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Accessible Header */}
          <header className="h-20 bg-card border-b border-slate-800/50 flex justify-between items-center px-8 z-20" role="banner">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Architectural Phase</span>
                <span className="text-sm font-black text-primary underline">{userContext.currentStep}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Masterwork</span>
                <span className="text-sm font-bold text-slate-300">{userContext.datasetName || 'Unselected'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={triggerRoundtable} 
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition-all focus-visible:ring-2"
                aria-label="Expert Roundtable Review"
              >
                <span>Expert Roundtable</span>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
              </button>
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary transition-all text-xs font-bold"
                aria-label={`Toggle Theme: current ${theme}`}
              >
                {theme.toUpperCase()}
              </button>
            </div>
          </header>

          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto px-8 pt-8 pb-32 scroll-smooth bg-pattern"
            aria-live="polite"
            role="log"
          >
            <div className="max-w-3xl mx-auto">
              {/* Hero Section */}
              {messages.length < 2 && (
                <div className="mb-12 text-center p-12 bg-card rounded-[3rem] border border-primary/20 relative overflow-hidden group">
                  <div className="absolute inset-0 art-pattern opacity-30"></div>
                  <h1 className="text-5xl font-black serif-font text-primary mb-4 leading-tight">Art Fusion &<br/>Data Insights</h1>
                  <p className="text-slate-400 max-w-lg mx-auto font-medium">
                    A collaborative space for learning EDA through high-fidelity analysis and artistic metaphors.
                  </p>
                  <p className="mt-8 text-[10px] font-black tracking-widest text-slate-500">CURATED BY {AUTHOR}</p>
                </div>
              )}

              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              
              {userContext.currentStep === EDAStep.Clarification && userContext.datasetId === 'unknown' && !isLoading && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <DatasetSelector onSelect={handleDatasetSelect} />
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start mb-8">
                  <div className="bg-card rounded-3xl p-6 shadow-2xl flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
                    </div>
                    <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Synthesizing Critique...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="max-w-3xl mx-auto relative">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Inquire with the Roundtable..."
                className="w-full bg-card border border-slate-700/50 rounded-[2rem] px-8 py-5 pr-20 shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none text-slate-200 placeholder:text-slate-500 font-medium"
                aria-label="Chat input"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isLoading || !input.trim() ? 'bg-slate-800 text-slate-600' : 'btn-primary shadow-xl active:scale-95'
                }`}
                aria-label="Send Message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        <aside className="w-[450px] shrink-0 hidden xl:block border-l border-slate-800/50 bg-card" aria-label="Visual Workbench">
          <StepDisplay step={userContext.currentStep} datasetId={userContext.datasetId} />
        </aside>
      </main>

      <footer className="fixed bottom-0 left-0 p-4 z-50 pointer-events-none">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          Engineered by <span className="text-primary">{AUTHOR}</span> | v2.2 WCAG
        </p>
      </footer>
    </div>
  );
};

export default App;
