
import React, { useState, useEffect, useRef } from 'react';
import { EDAGeminiService } from './geminiService';
import { Message, Sender, UserContext, EDAStep, DatasetId, DatasetInfo } from './types';
import ChatBubble from './components/ChatBubble';
import WorkflowSidebar from './components/WorkflowSidebar';
import StepDisplay from './components/StepDisplay';
import DatasetSelector from './components/DatasetSelector';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({
    currentStep: EDAStep.Clarification,
    datasetId: 'unknown'
  });
  
  const aiServiceRef = useRef<EDAGeminiService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const handleStepClick = async (step: EDAStep) => {
    if (step === userContext.currentStep || isLoading) return;

    setUserContext(prev => ({ ...prev, currentStep: step }));
    
    setMessages(prev => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: Sender.AI,
        text: `📍 Context switched to: **${step}**.\nLet's focus our exploration here. What specifics would you like to know about this phase?`,
        timestamp: Date.now(),
      }
    ]);

    setIsLoading(true);
    try {
      await aiServiceRef.current?.sendMessage(`I have navigated to the "${step}" step. Please adjust our lesson focus to this part of the EDA process.`);
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
      text: `🚀 I've selected the **${ds.name}** dataset for our exploration.`,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    // UI update for immediate feedback
    setUserContext(prev => ({ 
      ...prev, 
      datasetId: ds.id, 
      datasetName: ds.name,
      skillLevel: ds.complexity.toLowerCase() as any
    }));

    try {
      const response = await aiServiceRef.current?.sendMessage(`I've selected the ${ds.name} dataset (${ds.type}). Let's start the analysis with Step 1: Clarification. Ask me about my learning goals for this specific data.`);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: Sender.AI,
          text: response || "Excellent choice. Let's begin.",
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

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.User,
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiServiceRef.current?.sendMessage(input);
      
      const responseLower = response?.toLowerCase() || "";
      let newStep = userContext.currentStep;
      let newDatasetId = userContext.datasetId;

      // Smart Phase Detection
      const steps = Object.values(EDAStep);
      steps.forEach(s => {
        if (responseLower.includes(s.toLowerCase())) newStep = s;
      });
      
      // Fallback keyword mapping
      if (responseLower.includes("overview") || responseLower.includes("snapshot")) newStep = EDAStep.Overview;
      else if (responseLower.includes("quality") || responseLower.includes("missing")) newStep = EDAStep.Quality;
      else if (responseLower.includes("univariate") || responseLower.includes("distribution")) newStep = EDAStep.Univariate;
      else if (responseLower.includes("bivariate") || responseLower.includes("correlation")) newStep = EDAStep.Bivariate;
      else if (responseLower.includes("outlier")) newStep = EDAStep.Outliers;
      else if (responseLower.includes("engineering") || responseLower.includes("feature transform")) newStep = EDAStep.FeatureEng;
      else if (responseLower.includes("summary") || responseLower.includes("recap")) newStep = EDAStep.Summary;

      if (newStep !== userContext.currentStep) {
        setUserContext(prev => ({ ...prev, currentStep: newStep }));
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: Sender.AI,
          text: response || "I'm listening. Please continue.",
          timestamp: Date.now(),
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 selection:bg-indigo-100">
      <WorkflowSidebar 
        currentStep={userContext.currentStep} 
        onStepClick={handleStepClick} 
      />

      <main className="flex-1 flex min-w-0">
        <div className="flex-1 flex flex-col min-w-0 relative">
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-8 flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Phase</span>
                <span className="text-sm font-black text-slate-900">{userContext.currentStep}</span>
              </div>
              <div className="h-8 w-px bg-slate-100"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dataset</span>
                <span className="text-sm font-bold text-indigo-600">{userContext.datasetName || 'None'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${isLoading ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className="text-[10px] font-black uppercase tracking-widest">{isLoading ? 'AI Analyzing' : 'AI Online'}</span>
              </div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 pt-8 pb-32 scroll-smooth">
            <div className="max-w-3xl mx-auto">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              
              {userContext.currentStep === EDAStep.Clarification && userContext.datasetId === 'unknown' && !isLoading && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                   <div className="mb-8 text-center">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ready to start?</h2>
                    <p className="text-sm text-slate-500 mt-1">Select a dataset from the library to begin your lesson.</p>
                  </div>
                  <DatasetSelector onSelect={handleDatasetSelect} />
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start mb-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mentor is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent">
            <div className="max-w-3xl mx-auto relative group">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask your mentor about correlations, outliers, or code..."
                className="w-full bg-white border border-slate-200 rounded-[2rem] px-8 py-5 pr-20 shadow-2xl shadow-indigo-100/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none text-slate-700 placeholder:text-slate-400 font-medium"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isLoading || !input.trim()
                    ? 'bg-slate-100 text-slate-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 active:scale-90 active:rotate-3'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <aside className="w-[500px] shrink-0 hidden xl:block">
          <StepDisplay step={userContext.currentStep} datasetId={userContext.datasetId} />
        </aside>
      </main>
    </div>
  );
};

export default App;
