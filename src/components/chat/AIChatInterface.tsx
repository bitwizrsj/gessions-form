import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Home, LayoutGrid, Layers, Settings, Bell,
  ChevronDown, ArrowRight, ArrowLeft, Sparkles, Loader2, BarChart3,
  LogOut, User as UserIcon
} from 'lucide-react';
import { formAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import TemplateLibrary from '../forms/TemplateLibrary';
import Sidebar from '../forms/Sidebar';
import toast from 'react-hot-toast';

/* ── Groq API Configuration ── */
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/* ── Warm Mocha Neutral Asterisk Logo ── */
const AsteriskLogo = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line x1="14" y1="2" x2="14" y2="26" stroke="#5C4A3E" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="2" y1="8" x2="26" y2="20" stroke="#5C4A3E" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="26" y1="8" x2="2" y2="20" stroke="#5C4A3E" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

/* ── Large Decorative Neutral Asterisk Watermark ── */
const BigDecorativeAsterisk = () => (
  <svg width="340" height="340" viewBox="0 0 260 260" fill="none" className="opacity-30">
    <line x1="130" y1="10" x2="130" y2="250" stroke="#D3C7B6" strokeWidth="36" strokeLinecap="round" />
    <line x1="15" y1="75" x2="245" y2="185" stroke="#D3C7B6" strokeWidth="36" strokeLinecap="round" />
    <line x1="245" y1="75" x2="15" y2="185" stroke="#D3C7B6" strokeWidth="36" strokeLinecap="round" />
  </svg>
);

/* ── Safe Workflow Icon ── */
const WorkflowIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="15" width="6" height="6" rx="1" />
    <path d="M6 9v3a3 3 0 0 0 3 3h6" />
  </svg>
);

/* ── Three Sparkles Icon ── */
const TripleSparklesIcon = ({ size = 26, color = '#0F172A' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    <path d="M19 4v4" />
    <path d="M21 6h-4" />
  </svg>
);

/* ── AI Prompt Direct Form Generator ── */
async function generateFormFromPrompt(prompt: string) {
  const systemPrompt = `You are an expert AI form designer. Given a user's prompt or description, generate a complete, production-ready form schema in JSON.

Output ONLY valid JSON inside a \`\`\`json ... \`\`\` markdown block.
The JSON must follow this exact format:
\`\`\`json
{
  "title": "Clear Form Title",
  "description": "Short helpful description",
  "fields": [
    {
      "type": "text|email|phone|textarea|select|radio|checkbox|date|file|rating",
      "label": "Question or Field Label",
      "placeholder": "Helpful placeholder",
      "required": true,
      "options": ["Option 1", "Option 2"]
    }
  ]
}
\`\`\`
Generate 4 to 8 high-quality, relevant fields based on the description.`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    throw new Error('AI generation failed. Please try again.');
  }

  const data = await response.json();
  const rawText = data.choices[0]?.message?.content || '';

  const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : rawText.trim();

  const parsed = JSON.parse(jsonStr);
  const fields = (parsed.fields || []).map((f: any, i: number) => ({
    ...f,
    id: `field_${Date.now()}_${i}`,
  }));

  return {
    title: parsed.title || 'Untitled Form',
    description: parsed.description || '',
    fields,
    status: 'draft',
  };
}

const AIChatInterface: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [recentForms, setRecentForms] = useState<any[]>([]);
  const [loadingForms, setLoadingForms] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { user, logout, getInitials } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  useEffect(() => {
    loadRecentForms();
  }, []);

  const loadRecentForms = async () => {
    setLoadingForms(true);
    try {
      const res = await formAPI.getForms();
      if (Array.isArray(res.data)) {
        setRecentForms(res.data);
      }
    } catch (e) {
      console.error('Failed to load forms:', e);
    } finally {
      setLoadingForms(false);
    }
  };

  /* ── Generate form with AI from prompt ── */
  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = (customPrompt || prompt).trim();
    if (!textToUse || loading) return;

    setLoading(true);
    const toastId = toast.loading('Generating your form with AI...');

    try {
      let formPayload;
      if (GROQ_API_KEY) {
        formPayload = await generateFormFromPrompt(textToUse);
      } else {
        formPayload = {
          title: textToUse.slice(0, 50) || 'New Form',
          description: textToUse,
          fields: [],
          status: 'draft'
        };
      }

      const res = await formAPI.createForm(formPayload);
      toast.success('Form created!', { id: toastId });
      navigate('/dashboard', { state: { openFormId: res.data._id } });
    } catch (err: any) {
      console.error(err);
      toast.error('AI generation unavailable. Opening form in builder...', { id: toastId });
      handleStartFromScratch(textToUse);
    } finally {
      setLoading(false);
    }
  };

  /* ── Start from Scratch (Blank Form) ── */
  const handleStartFromScratch = async (title?: string) => {
    setLoading(true);
    try {
      const res = await formAPI.createForm({
        title: title || 'Untitled Form',
        description: '',
        fields: [],
        status: 'draft'
      });
      navigate('/dashboard', { state: { openFormId: res.data._id } });
    } catch (e: any) {
      toast.error('Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  /* ── Handle Template Selection ── */
  const handleSelectTemplate = async (template: any) => {
    setShowTemplates(false);
    setLoading(true);
    try {
      const fieldsWithIds = (template.fields || []).map((f: any, i: number) => ({
        ...f,
        id: `field_${Date.now()}_${i}`
      }));
      const res = await formAPI.createForm({
        title: template.title,
        description: template.description,
        fields: fieldsWithIds,
        status: 'draft'
      });
      toast.success('Template loaded!');
      navigate('/dashboard', { state: { openFormId: res.data._id } });
    } catch {
      toast.error('Failed to apply template');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div
      className="h-screen flex bg-[#FAF7F2] text-[#2C2520] relative overflow-hidden select-none"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* ── Decorative Organic Waves at Bottom-Left (Neutral Warm Sand) ── */}
      <svg
        className="absolute bottom-0 left-0 w-[540px] h-[220px] pointer-events-none z-0 opacity-70"
        viewBox="0 0 540 220"
        fill="none"
      >
        <path
          d="M0 130 C 140 80, 290 190, 540 100 L 540 220 L 0 220 Z"
          fill="#EDE5D8"
        />
        <path
          d="M0 160 C 130 120, 270 200, 540 140 L 540 220 L 0 220 Z"
          fill="#E2D7C5"
          opacity="0.8"
        />
      </svg>

      {/* ── Big Decorative Slate Asterisk on Right Edge ── */}
      <div className="absolute top-16 -right-24 pointer-events-none select-none z-0">
        <BigDecorativeAsterisk />
      </div>

      {/* ── LEFT NAVIGATION SIDEBAR (Unified Shared Sidebar) ── */}
      <div className="hidden lg:block z-20 shrink-0">
        <Sidebar
          currentView="ai-chat"
          onNavigate={(view) => {
            if (view === 'ai-chat' || view === 'workflows') {
              setPrompt('');
            } else if (view === 'templates') {
              setShowTemplates(true);
            } else if (view === 'dashboard' || view === 'forms') {
              navigate('/dashboard');
            } else if (view === 'my-responses' || view === 'analytics') {
              navigate('/dashboard', { state: { view: 'my-responses' } });
            } else if (view === 'integrations') {
              navigate('/dashboard', { state: { view: 'integrations' } });
            } else if (view === 'settings') {
              navigate('/dashboard', { state: { view: 'settings' } });
            } else {
              navigate('/dashboard', { state: { view } });
            }
          }}
        />
      </div>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Top Header Bar */}
        <header className="h-[56px] sm:h-[68px] px-4 sm:px-8 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="lg:hidden flex items-center gap-1.5 text-[13px] font-bold text-[#5C4A3E] hover:text-[#483A30]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white/80 transition-colors relative"
            >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#5C4A3E] absolute top-2 right-2 ring-2 ring-[#FAF7F2]" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/80 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#5C4A3E] text-white flex items-center justify-center font-bold text-[12px]">
                {getInitials() || 'RS'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-[calc(100%+8px)] w-48 rounded-2xl bg-white border border-[#ECE5DA] shadow-xl py-1.5 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-[13px] font-bold text-slate-800 truncate">{user?.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
          </div>
        </header>

        {/* Hero Body Content */}
        <div className="flex-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin' }}>
          <main className="px-6 py-10 max-w-4xl mx-auto w-full text-center flex flex-col items-center">
          {/* Welcome User Pill Badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/95 border border-[#E5DFD5] shadow-2xs">
            <span className="text-[13px] font-semibold text-[#4A3E36]">
              Welcome back, {firstName} 👋
            </span>
          </div>

          {/* Big Hero Title */}
          <h1 className="text-[46px] md:text-[56px] font-serif font-black tracking-tight text-[#2C2520] leading-tight mb-2">
            Create a Form
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] md:text-[17px] text-[#786E64] max-w-lg mb-8">
            Turn your idea into a professional form in seconds.
          </p>

          {/* Prompt Bar (Centered with Sparkles and Mocha Arrow) */}
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#DDD5C7] shadow-sm p-2 flex items-center gap-3 mb-10 transition-all focus-within:ring-2 focus-within:ring-[#5C4A3E]/15 focus-within:border-[#5C4A3E]">
            <div className="pl-3 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#5C4A3E]" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Describe the form you want to create..."
              className="flex-1 py-2 text-[15px] text-[#2C2520] placeholder:text-[#A3998E] bg-transparent outline-none"
            />

            <button
              onClick={() => handleGenerate()}
              disabled={loading || !prompt.trim()}
              className="w-11 h-11 rounded-xl bg-[#5C4A3E] text-white flex items-center justify-center hover:bg-[#483A30] active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <ArrowRight className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* 3 Action Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl text-left">
            {/* Card 1: Create with AI (Neutral Warm Oat Tint) */}
            <div
              onClick={() => inputRef.current?.focus()}
              className="group cursor-pointer rounded-2xl p-6 bg-[#F5EFE6] border border-[#DDD5C7] hover:border-[#5C4A3E]/60 hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <div className="mb-4 text-[#5C4A3E]">
                  <TripleSparklesIcon size={26} color="#5C4A3E" />
                </div>
                <h3 className="font-serif font-black text-[18px] text-[#2C2520] mb-1">
                  Create with AI
                </h3>
                <p className="text-[12.5px] text-[#6E645A] leading-relaxed">
                  Generate a complete form from a simple prompt.
                </p>
              </div>
              <div className="flex justify-end pt-3">
                <span className="text-[#5C4A3E] group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Card 2: Start from Scratch (White) */}
            <div
              onClick={() => handleStartFromScratch()}
              className="group cursor-pointer rounded-2xl p-6 bg-white border border-[#EAE4DC] hover:border-[#5C4A3E]/40 hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <div className="mb-4 text-[#2C2520]">
                  <FileText className="w-6 h-6 text-[#2C2520]" />
                </div>
                <h3 className="font-serif font-black text-[18px] text-[#2C2520] mb-1">
                  Start from Scratch
                </h3>
                <p className="text-[12.5px] text-[#6E645A] leading-relaxed">
                  Create a blank form and build it your way.
                </p>
              </div>
              <div className="flex justify-end pt-3">
                <span className="text-[#2C2520] group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Card 3: Use a Template (White) */}
            <div
              onClick={() => setShowTemplates(true)}
              className="group cursor-pointer rounded-2xl p-6 bg-white border border-[#EAE4DC] hover:border-[#5C4A3E]/40 hover:shadow-md transition-all flex flex-col justify-between min-h-[160px]"
            >
              <div>
                <div className="mb-4 text-[#2C2520]">
                  <LayoutGrid className="w-6 h-6 text-[#2C2520]" />
                </div>
                <h3 className="font-serif font-black text-[18px] text-[#2C2520] mb-1">
                  Use a Template
                </h3>
                <p className="text-[12.5px] text-[#6E645A] leading-relaxed">
                  Choose from ready-made forms for common use cases.
                </p>
              </div>
              <div className="flex justify-end pt-3">
                <span className="text-[#2C2520] group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* ── Real User Forms Section ── */}
          {recentForms.length > 0 && (
            <div className="w-full max-w-3xl mt-12 text-left">
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h3 className="font-serif font-black text-[20px] text-[#2C2520]">Your Forms</h3>
                  <p className="text-[12px] text-[#786E64]">Continue editing your existing forms</p>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-[12.5px] font-bold text-[#5C4A3E] hover:underline flex items-center gap-1"
                >
                  <span>View all in dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {recentForms.slice(0, 6).map(f => (
                  <div
                    key={f._id}
                    onClick={() => navigate('/dashboard', { state: { openFormId: f._id } })}
                    className="bg-white rounded-2xl p-4 border border-[#EAE4DC] hover:border-[#5C4A3E] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group min-h-[110px]"
                  >
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center shrink-0 border border-[#DDD5C7] group-hover:border-[#5C4A3E]/40">
                        <FileText className="w-4 h-4 text-[#5C4A3E]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-[13.5px] text-[#2C2520] truncate group-hover:text-[#5C4A3E] transition-colors">
                          {f.title || 'Untitled Form'}
                        </h4>
                        <p className="text-[11.5px] text-[#786E64] truncate">
                          {f.fields?.length || 0} fields
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#F5EFE6] text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${
                        f.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {f.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-[#5C4A3E] font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Edit <ArrowRight className="w-3 h-3 inline" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>

      {/* ── Template Library Modal ── */}
      {showTemplates && (
        <TemplateLibrary
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default AIChatInterface;
