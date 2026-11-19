import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Settings,
  BarChart3,
  LayoutDashboard,
  Users,
  Layers,
  ChevronDown,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  onCreateForm?: () => void;
  onEditForm?: (id: string) => void;
  currentView: string;
  onNavigate?: (view: string) => void;
  onToggle?: (minimized: boolean) => void;
  disableMinimize?: boolean;
}

/* ── Neutral Asterisk Logo ── */
const AsteriskLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <line x1="14" y1="2" x2="14" y2="26" stroke="#5C4A3E" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="2" y1="8" x2="26" y2="20" stroke="#5C4A3E" strokeWidth="4.5" strokeLinecap="round" />
    <line x1="26" y1="8" x2="2" y2="20" stroke="#5C4A3E" strokeWidth="4.5" strokeLinecap="round" />
  </svg>
);

/* ── Inline Safe SVG Icons ── */
const BuildingIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M8 10h.01" />
    <path d="M16 10h.01" />
    <path d="M8 14h.01" />
    <path d="M16 14h.01" />
  </svg>
);

const WorkflowIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="15" width="6" height="6" rx="1" />
    <path d="M6 9v3a3 3 0 0 0 3 3h6" />
  </svg>
);

const GridIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const SlidersIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const CrownIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

const NAV_ITEMS = [
  { view: 'ai-chat', label: 'New Chat', icon: Sparkles, badge: 'AI', isSpecial: true },
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'forms', label: 'Forms', icon: FileText },
  { view: 'my-responses', label: 'Responses', icon: BarChart3 },
  { view: 'workflows', label: 'Workflows', icon: WorkflowIcon },
  { view: 'templates', label: 'Templates', icon: GridIcon },
  { view: 'teams', label: 'Teams', icon: Users },
  { view: 'departments', label: 'Departments', icon: Layers },
  { view: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const BOTTOM_ITEMS = [
  { view: 'integrations', label: 'Integrations', icon: SlidersIcon },
  { view: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onToggle,
  disableMinimize = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    if (disableMinimize) return false;
    try {
      return localStorage.getItem('oorb_sidebar_minimized') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!disableMinimize) {
      onToggle?.(isMinimized);
    }
  }, [isMinimized, disableMinimize, onToggle]);

  if (!user) return null;

  const handleToggle = () => {
    if (disableMinimize) return;
    setIsMinimized(prev => {
      const next = !prev;
      try {
        localStorage.setItem('oorb_sidebar_minimized', String(next));
      } catch {}
      return next;
    });
  };

  const handleNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
      return;
    }
    if (view === 'ai-chat' || view === 'workflows') {
      navigate('/ai-chat');
    } else if (view === 'dashboard' || view === 'forms') {
      navigate('/dashboard');
    } else if (view === 'my-responses' || view === 'analytics') {
      navigate('/dashboard', { state: { view: 'my-responses' } });
    } else if (view === 'templates') {
      navigate('/dashboard', { state: { view: 'templates' } });
    } else if (view === 'settings') {
      navigate('/dashboard', { state: { view: 'settings' } });
    } else if (view === 'integrations') {
      navigate('/dashboard', { state: { view: 'integrations' } });
    } else {
      navigate('/dashboard', { state: { view } });
    }
  };

  return (
    <aside
      className="h-screen flex flex-col select-none border-r border-[#ECE8E1] bg-[#FAF7F2] text-slate-800 transition-all duration-300 ease-in-out shrink-0"
      style={{
        width: isMinimized ? 70 : 240,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* ── Brand Header ── */}
      <div className={`h-[68px] flex items-center border-b border-[#ECE8E1] flex-shrink-0 ${
        isMinimized ? 'justify-center px-2' : 'justify-between px-5'
      }`}>
        {isMinimized ? (
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={handleToggle}
              title="Expand sidebar"
              className="w-10 h-10 rounded-xl hover:bg-[#F5EFE6] flex items-center justify-center transition-colors relative group"
            >
              <AsteriskLogo size={24} />
              <div className="absolute inset-0 bg-[#F5EFE6] rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                <PanelLeftOpen className="w-4 h-4 text-[#5C4A3E]" />
              </div>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <AsteriskLogo size={24} />
              <span className="font-extrabold text-[17px] tracking-tight text-[#2C2520] truncate">
                Forms by Gessions
              </span>
            </div>
            {!disableMinimize && (
              <button
                type="button"
                onClick={handleToggle}
                title="Collapse sidebar"
                className="p-1.5 rounded-xl text-[#7D7368] hover:text-[#2C2520] hover:bg-[#F5EFE6] transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Workspace Selector ── */}
      <div className={`flex-shrink-0 ${isMinimized ? 'py-3 flex justify-center' : 'px-3.5 py-3.5'}`}>
        {isMinimized ? (
          <div
            className="w-10 h-10 rounded-xl border border-[#E5DFD5] bg-[#F5EFE6] flex items-center justify-center shadow-2xs"
            title={user?.organization || `${user?.name ? `${user.name.split(' ')[0]}'s` : 'My'} Workspace`}
          >
            <BuildingIcon size={16} className="text-[#5C4A3E]" />
          </div>
        ) : (
          <button
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#E5DFD5] bg-[#F5EFE6] hover:bg-[#EFEAE2] transition-colors text-left"
            type="button"
          >
            <div className="w-8 h-8 rounded-lg border border-[#E2DBD0] bg-white flex items-center justify-center text-slate-600 flex-shrink-0">
              <BuildingIcon size={16} className="text-[#8C8275]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-[13px] text-[#222] truncate leading-tight">
                {user?.organization || `${user?.name ? `${user.name.split(' ')[0]}'s` : 'My'} Workspace`}
              </div>
              <div className="text-[11px] text-[#8C8275] truncate">
                {user?.organization ? 'Institution Workspace' : 'Personal Workspace'}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>
        )}
      </div>

      {/* ── Nav Links ── */}
      <div
        className={`flex-1 overflow-y-auto space-y-1 py-1 ${isMinimized ? 'px-2 flex flex-col items-center' : 'px-3.5'}`}
        style={{ scrollbarWidth: 'none' }}
      >
        {NAV_ITEMS.map(({ view, label, icon: Icon, badge }) => {
          const active = currentView === view;
          return (
            <button
              key={view}
              onClick={() => handleNavigate(view)}
              title={label}
              className={`flex items-center rounded-xl text-[13.5px] font-semibold transition-all relative ${
                isMinimized
                  ? 'w-10 h-10 justify-center'
                  : 'w-full gap-3 px-3.5 py-2.5'
              } ${
                active
                  ? 'bg-[#F5EFE6] text-[#2C2520]'
                  : 'text-[#585149] hover:bg-[#F2ECE3] hover:text-[#201D1A]'
              }`}
            >
              <Icon
                size={18}
                className={`w-[18px] h-[18px] flex-shrink-0 ${
                  active ? 'text-[#5C4A3E]' : 'text-[#7D7368]'
                }`}
              />
              {!isMinimized && <span className="flex-1 text-left truncate">{label}</span>}
              {!isMinimized && badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE5D8] text-[#5C4A3E]">
                  {badge}
                </span>
              )}
              {isMinimized && badge && (
                <span className="w-2 h-2 rounded-full bg-[#5C4A3E] absolute top-2 right-2 ring-2 ring-[#FAF7F2]" />
              )}
            </button>
          );
        })}

        <div className="pt-3 pb-1 w-full">
          <div className="h-px bg-[#ECE8E1] mx-1" />
        </div>

        {BOTTOM_ITEMS.map(({ view, label, icon: Icon }) => {
          const active = currentView === view;
          return (
            <button
              key={view}
              onClick={() => handleNavigate(view)}
              title={label}
              className={`flex items-center rounded-xl text-[13.5px] font-semibold transition-all ${
                isMinimized
                  ? 'w-10 h-10 justify-center'
                  : 'w-full gap-3 px-3.5 py-2.5'
              } ${
                active
                  ? 'bg-[#F5EFE6] text-[#2C2520]'
                  : 'text-[#585149] hover:bg-[#F2ECE3] hover:text-[#201D1A]'
              }`}
            >
              <Icon size={18} className="w-[18px] h-[18px] flex-shrink-0 text-[#7D7368]" />
              {!isMinimized && <span className="flex-1 text-left truncate">{label}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Institution Plan Card ── */}
      <div className={`flex-shrink-0 ${isMinimized ? 'p-2 flex justify-center pb-3' : 'p-3.5'}`}>
        {isMinimized ? (
          <button
            type="button"
            title="Institution Plan - Unlimited forms & workflows"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-200 transition-transform active:scale-95 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #5C4A3E 0%, #483A30 100%)',
            }}
          >
            <CrownIcon size={18} />
          </button>
        ) : (
          <div
            className="rounded-2xl p-4 text-white relative overflow-hidden shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #5C4A3E 0%, #483A30 100%)',
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <CrownIcon size={16} className="text-amber-200" />
              <h4 className="font-bold text-[14px] tracking-tight">Institution Plan</h4>
            </div>
            <p className="text-[11.5px] text-white/80 leading-relaxed mb-3">
              Unlimited forms, workflows and team members.
            </p>
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-white text-[#5C4A3E] font-bold text-[12px] hover:bg-[#FAF7F2] active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-xs"
            >
              Manage plan →
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
