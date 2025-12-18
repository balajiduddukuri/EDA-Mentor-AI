
import React from 'react';
import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="my-4 rounded-xl bg-slate-900 overflow-hidden shadow-lg border border-slate-800">
      <div className="bg-slate-800 px-4 py-2 text-[10px] font-black text-slate-400 border-b border-slate-700/50 flex justify-between items-center uppercase tracking-widest">
        <span>Python Source</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>
      </div>
      <pre className="p-5 text-sm text-slate-200 code-font overflow-x-auto selection:bg-indigo-500/30">
        <code className="leading-relaxed">{code.trim()}</code>
      </pre>
    </div>
  );
};

const FormattedText: React.FC<{ text: string; isAI: boolean }> = ({ text, isAI }) => {
  // Helper to parse inline markdown: **bold**, `code`, *italic*
  const parseInline = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className={`font-black ${isAI ? 'text-indigo-700' : 'text-white'}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className={`font-mono text-[0.9em] px-1.5 py-0.5 rounded-md ${isAI ? 'bg-slate-100 text-pink-600' : 'bg-indigo-500 text-indigo-100'}`}>{part.slice(1, -1)}</code>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic opacity-90">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const segments = text.split(/(```python[\s\S]*?```|```[\s\S]*?```)/g);

  return (
    <div className="space-y-1.5 leading-relaxed">
      {segments.map((segment, i) => {
        if (segment.startsWith('```')) {
          const code = segment.replace(/```python|```/g, '');
          return <CodeBlock key={i} code={code} />;
        }

        const lines = segment.split('\n');
        return (
          <div key={i} className="space-y-2">
            {lines.map((line, j) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={j} className="h-1" />;

              // Handle Headings
              if (trimmed.startsWith('###')) {
                return <h4 key={j} className={`text-sm font-black mt-6 mb-2 uppercase tracking-widest ${isAI ? 'text-slate-900' : 'text-white'}`}>{parseInline(trimmed.replace(/^###\s*/, ''))}</h4>;
              }
              if (trimmed.startsWith('##') || (trimmed.startsWith('**') && trimmed.endsWith('**') && line.length < 50)) {
                 const cleanText = trimmed.replace(/^##\s*/, '').replace(/\*\*/g, '');
                 return <h3 key={j} className={`font-black text-lg mt-6 mb-3 tracking-tight ${isAI ? 'text-indigo-600' : 'text-white'}`}>{parseInline(cleanText)}</h3>;
              }

              // Handle Lists
              if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
                const isOrdered = /^\d+\./.test(trimmed);
                const content = trimmed.replace(/^[-*]\s*|^\d+\.\s*/, '');
                return (
                  <div key={j} className="flex items-start gap-3 ml-1 py-0.5">
                    <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${isAI ? 'bg-indigo-400' : 'bg-indigo-200'}`}></span>
                    <span className="flex-1">{parseInline(content)}</span>
                  </div>
                );
              }

              // Standard Paragraph
              return <p key={j} className={`${isAI ? 'text-slate-600 font-medium' : 'text-indigo-50'}`}>{parseInline(line)}</p>;
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
    <div className={`flex w-full mb-8 ${isAI ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`max-w-[88%] rounded-[2rem] p-6 shadow-sm relative group transition-all hover:shadow-md ${
          isAI
            ? 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
            : 'bg-indigo-600 text-white rounded-br-none shadow-indigo-200'
        }`}
      >
        <div className="flex items-center justify-between mb-4 border-b pb-2 border-slate-100/50">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAI ? 'bg-indigo-500 animate-pulse' : 'bg-indigo-300'}`}></div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isAI ? 'text-indigo-600' : 'text-indigo-100'}`}>
              {isAI ? 'Mentor AI' : 'Student'}
            </span>
          </div>
          <span className={`text-[10px] font-bold opacity-40 ${isAI ? 'text-slate-400' : 'text-indigo-200'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        {isAI ? (
          <FormattedText text={message.text} isAI={isAI} />
        ) : (
          <p className="whitespace-pre-wrap font-medium leading-relaxed">{message.text}</p>
        )}

        {/* Decorative corner tag for AI */}
        {isAI && (
          <div className="absolute -left-1 bottom-0 translate-y-full pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Verified Logic Engine</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
