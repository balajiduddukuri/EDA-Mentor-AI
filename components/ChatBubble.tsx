
import React from 'react';
import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="my-6 rounded-[2rem] bg-black overflow-hidden border border-slate-800/50 shadow-2xl">
      <div className="bg-slate-900/50 px-6 py-3 text-[10px] font-black text-primary border-b border-slate-800/50 flex justify-between items-center uppercase tracking-widest">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="ml-2">Algorithm Stream</span>
        </span>
        <button className="hover:text-white transition-colors">COPY</button>
      </div>
      <pre className="p-6 text-sm text-slate-300 code-font overflow-x-auto selection:bg-primary/30">
        <code className="leading-relaxed">{code.trim()}</code>
      </pre>
    </div>
  );
};

const FormattedText: React.FC<{ text: string; isAI: boolean }> = ({ text, isAI }) => {
  const parseInline = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className={`font-black underline decoration-primary/30 ${isAI ? 'text-primary' : 'text-white'}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="font-mono text-[0.9em] px-2 py-0.5 rounded-md bg-slate-800 text-primary border border-slate-700">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const segments = text.split(/(```python[\s\S]*?```|```[\s\S]*?```)/g);

  return (
    <div className="space-y-4">
      {segments.map((segment, i) => {
        if (segment.startsWith('```')) {
          return <CodeBlock key={i} code={segment.replace(/```python|```/g, '')} />;
        }

        const lines = segment.split('\n');
        return (
          <div key={i} className="space-y-3">
            {lines.map((line, j) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith('###')) {
                return <h4 key={j} className="text-xs font-black mt-8 mb-2 uppercase tracking-[0.3em] text-primary underline underline-offset-8 decoration-2">{parseInline(trimmed.replace(/^###\s*/, ''))}</h4>;
              }
              if (trimmed.startsWith('##')) {
                return <h3 key={j} className="font-black text-2xl mt-10 mb-4 serif-font text-white">{parseInline(trimmed.replace(/^##\s*/, ''))}</h3>;
              }

              if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                return (
                  <div key={j} className="flex items-start gap-3 ml-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shadow-[0_0_8px_rgba(0,242,255,0.6)] group-hover:scale-125 transition-transform"></div>
                    <span className="text-slate-300 font-medium leading-relaxed">{parseInline(trimmed.replace(/^[-*]\s*/, ''))}</span>
                  </div>
                );
              }

              return <p key={j} className={`leading-relaxed text-sm font-medium ${isAI ? 'text-slate-300' : 'text-slate-100'}`}>{parseInline(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isAI = message.sender === Sender.AI;

  return (
    <section 
      className={`flex w-full mb-10 ${isAI ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
      aria-labelledby={`msg-meta-${message.id}`}
    >
      <div
        className={`max-w-[90%] rounded-[2.5rem] p-8 relative overflow-hidden transition-all ${
          isAI
            ? 'bg-card border border-slate-800/50 shadow-2xl rounded-bl-none'
            : 'bg-indigo-900/30 border border-indigo-500/40 text-white rounded-br-none'
        }`}
      >
        <div id={`msg-meta-${message.id}`} className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/30">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isAI ? 'bg-primary animate-pulse' : 'bg-indigo-400'}`}></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isAI ? 'text-primary' : 'text-indigo-300'}`}>
              {isAI ? 'PROCTOR' : 'ARCHITECT'}
            </span>
          </div>
          <time className="text-[9px] font-bold text-slate-500 tracking-widest">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </time>
        </div>
        
        <FormattedText text={message.text} isAI={isAI} />
        
        {isAI && (
          <div className="mt-8 flex gap-2">
            <div className="px-3 py-1 bg-slate-800/50 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest border border-slate-700">Audit Pass</div>
            <div className="px-3 py-1 bg-primary/10 rounded-lg text-[8px] font-black text-primary uppercase tracking-widest border border-primary/20">Verified Insight</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChatBubble;
