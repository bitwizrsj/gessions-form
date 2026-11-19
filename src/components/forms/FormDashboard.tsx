import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Plus, Search, BarChart3, ExternalLink, FileText, Folder, FolderOpen,
  FolderPlus, MoreVertical, Edit, Edit3, Trash2, Copy, Users,
  ChevronDown, Bell, Star, Clock, Sparkles, Lock, Rocket
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import FolderModal from './FolderModal';
import toast from 'react-hot-toast';
import { formAPI, folderAPI } from '../../services/api';
import AIFormBuilder from './AIFormBuilder';
import TemplateLibrary from './TemplateLibrary';
import FolderContentsModal from './FolderContentsModal';
import MyResponsesModal from './MyResponsesModal';

/* ── Types ─────────────────────────────────────────── */
interface FormItem {
  _id: string;
  title: string;
  description: string;
  responses: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
  status: 'published' | 'draft' | 'closed';
  shareUrl?: string;
  folderId?: string;
  department?: string;
  collaborators?: string[];
  createdBy?: { _id: string; name: string; email: string };
}

interface FolderItem {
  _id: string;
  name: string;
  description: string;
  color: string;
  formCount: number;
  createdAt: string;
}

interface FormDashboardProps {
  onCreateForm: () => void;
  onEditForm: (id: string) => void;
  onViewResponses: (id: string) => void;
}

type FilterTab = 'all' | 'published' | 'draft' | 'archived';

/* ── Inline Safe SVG Icons ── */
const LinkIcon = ({ size = 12, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ShieldCheckIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const ListIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const GridIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ArchiveIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="3" width="20" height="5" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
);

/* ── Big Decorative Asterisk ── */
const BigDecorativeAsterisk = () => (
  <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="opacity-30">
    <line x1="110" y1="10" x2="110" y2="210" stroke="#D3C7B6" strokeWidth="32" strokeLinecap="round" />
    <line x1="15" y1="65" x2="205" y2="155" stroke="#D3C7B6" strokeWidth="32" strokeLinecap="round" />
    <line x1="205" y1="65" x2="15" y2="155" stroke="#D3C7B6" strokeWidth="32" strokeLinecap="round" />
  </svg>
);

/* ── Time Formatter ── */
function timeAgo(dateStr: string): string {
  if (!dateStr) return 'recently';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} hours ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Status Badge ── */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'published') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#EAF7EE] text-[#1D8348]">
        Published
        <LinkIcon size={11} className="opacity-80" />
      </span>
    );
  }
  if (status === 'closed') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FDECEB] text-[#C0392B]">
        Closed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#F4F3F0] text-[#6E6A63]">
      Draft
    </span>
  );
};

/* ── Department Badge ── */
const DepartmentBadge: React.FC<{ department?: string }> = ({ department }) => {
  if (!department) {
    return <span className="text-[13px] text-slate-400">—</span>;
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#F5EFEB] text-[#705A4F]">
      {department}
    </span>
  );
};

/* ── Context Menu Item ── */
const CtxBtn: React.FC<{ icon: React.FC<any>; label: string; onClick: () => void; danger?: boolean }> = ({
  icon: Icon,
  label,
  onClick,
  danger
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium transition-colors text-left ${
      danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-[#F9F7F4]'
    }`}
  >
    <Icon className="w-4 h-4 flex-shrink-0 opacity-70" />
    <span className="flex-1">{label}</span>
  </button>
);

/* ── "+ Create form" Dropdown Button ── */
const CreateFormDropdown: React.FC<{
  onBlank: () => void;
  onAI: () => void;
  onTemplate: () => void;
}> = ({ onBlank, onAI, onTemplate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative z-20">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5C4A3E] text-white font-bold text-[14px] hover:bg-[#483A30] active:scale-[0.98] transition-all shadow-sm"
      >
        <Plus className="w-4 h-4 text-white" />
        <span>Create form</span>
        <ChevronDown className={`w-3.5 h-3.5 text-white/80 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] w-60 rounded-2xl bg-white border border-[#E5DFD5] shadow-xl overflow-hidden py-1.5 z-50">
          <button
            onClick={() => { onAI(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAF7F2] transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#5C4A3E]" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1F1C19]">AI Builder</div>
              <div className="text-[11px] text-slate-400">Describe it, AI builds it</div>
            </div>
          </button>

          <button
            onClick={() => { onTemplate(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAF8F5] transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-[#EAF7EE] flex items-center justify-center flex-shrink-0">
              <Folder className="w-4 h-4 text-[#1D8348]" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1F1C19]">Templates</div>
              <div className="text-[11px] text-slate-400">Pre-built, ready to launch</div>
            </div>
          </button>

          <div className="h-px bg-slate-100 my-1 mx-2" />

          <button
            onClick={() => { onBlank(); setOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#FAF8F5] transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 border border-dashed border-slate-300">
              <FileText className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#1F1C19]">Blank Form</div>
              <div className="text-[11px] text-slate-400">Start from scratch</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
const FormDashboard: React.FC<FormDashboardProps> = ({ onCreateForm, onEditForm, onViewResponses }) => {
  const { user, getInitials } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [forms, setForms] = useState<FormItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);
  const [openFolderModal, setOpenFolderModal] = useState<FolderItem | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showAIBuilder, setShowAIBuilder] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggedForm, setDraggedForm] = useState<FormItem | null>(null);
  const [showMyResponses, setShowMyResponses] = useState(false);
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [renamingForm, setRenamingForm] = useState<{ id: string; title: string } | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  /* ── Load Data ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [formsRes, foldersRes] = await Promise.all([formAPI.getForms(), folderAPI.getFolders()]);
      setForms(formsRes.data || []);
      setFolders(foldersRes.data || []);
    } catch {
      toast.error('Failed to load data');
      setForms([]);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handleCloseMenus = () => setActiveDropdown(null);
    document.addEventListener('mousedown', handleCloseMenus);
    return () => document.removeEventListener('mousedown', handleCloseMenus);
  }, []);

  /* ── Folder Actions ── */
  const createFolder = async (data: any) => {
    try {
      const r = await folderAPI.createFolder(data);
      setFolders(p => [r.data, ...p]);
      toast.success('Folder created');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to create folder');
    }
  };

  const updateFolder = async (data: any) => {
    if (!selectedFolder) return;
    try {
      const r = await folderAPI.updateFolder(selectedFolder._id, data);
      setFolders(p => p.map(f => (f._id === selectedFolder._id ? r.data : f)));
      toast.success('Folder updated');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to update folder');
    }
  };

  const deleteFolder = async (id: string) => {
    if (!confirm('Delete this folder?')) return;
    try {
      await folderAPI.deleteFolder(id);
      setFolders(p => p.filter(f => f._id !== id));
      toast.success('Folder deleted');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed');
    }
  };

  const deleteForm = async (id: string) => {
    if (!confirm('Delete this form?')) return;
    try {
      await formAPI.deleteForm(id);
      setForms(p => p.filter(f => f._id !== id));
      toast.success('Form deleted');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed');
    }
  };

  const duplicateForm = async (id: string) => {
    try {
      const res = await formAPI.getForm(id);
      if (!res.data) {
        toast.error('Failed to load form details');
        return;
      }
      const orig = res.data;
      const duplicatedData = {
        title: `${orig.title || 'Untitled Form'} (Copy)`,
        description: orig.description || '',
        fields: (orig.fields || []).map((f: any, idx: number) => ({
          ...f,
          id: `field_${Date.now()}_${idx}`,
          _id: undefined
        })),
        status: 'draft',
        headerImage: orig.headerImage,
        settings: orig.settings,
        submitButtonText: orig.submitButtonText || 'Submit',
        department: orig.department || 'Operations',
        folderId: orig.folderId || null
      };
      const createdRes = await formAPI.createForm(duplicatedData);
      setForms(p => [createdRes.data, ...p]);
      toast.success('Form duplicated successfully!');
    } catch (err: any) {
      console.error('Duplication error:', err);
      toast.error(err.response?.data?.error || 'Failed to duplicate form');
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingForm || !renameInput.trim()) return;
    try {
      await formAPI.updateForm(renamingForm.id, { title: renameInput.trim() });
      setForms(p => p.map(f => (f._id === renamingForm.id ? { ...f, title: renameInput.trim(), updatedAt: new Date().toISOString() } : f)));
      toast.success('Form renamed successfully!');
      setRenamingForm(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to rename form');
    }
  };

  const toggleFormStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'closed' ? 'published' : 'closed';
    try {
      await formAPI.updateForm(id, { status: newStatus });
      setForms(p => p.map(f => (f._id === id ? { ...f, status: newStatus as any, updatedAt: new Date().toISOString() } : f)));
      toast.success(newStatus === 'closed' ? 'Form closed to new responses' : 'Form reopened');
    } catch {
      toast.error('Failed to update form status');
    }
  };

  const copyShareLink = (url: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/form/${url}`);
    toast.success('Link copied to clipboard');
  };

  const createFormFromData = async (fd: any) => {
    try {
      const r = await formAPI.createForm(fd);
      setForms(p => [r.data, ...p]);
      onEditForm(r.data._id);
      toast.success('Form created!');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to create form');
    }
  };

  const handleAIFormGenerated = (f: any) => {
    createFormFromData({
      ...f,
      fields: f.fields.map((field: any, i: number) => ({ ...field, id: `field_${Date.now()}_${i}` }))
    });
    setShowAIBuilder(false);
  };

  const handleTemplateSelected = (t: any) => {
    createFormFromData(t);
    setShowTemplates(false);
  };

  const handleDrop = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (!draggedForm) return;
    try {
      await folderAPI.moveForms(folderId, [draggedForm._id]);
      setForms(p => p.map(f => (f._id === draggedForm._id ? { ...f, folderId } : f)));
      setFolders(p => p.map(f => (f._id === folderId ? { ...f, formCount: f.formCount + 1 } : f)));
      toast.success('Form moved to folder');
    } catch {
      toast.error('Failed to move form');
    }
    setDraggedForm(null);
  };

  const toggleSelectForm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFormIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedFormIds.length === forms.length) {
      setSelectedFormIds([]);
    } else {
      setSelectedFormIds(forms.map(f => f._id));
    }
  };

  /* ── Filtered Data ── */
  const filteredForms = useMemo(() => {
    return forms.filter(f => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        f.title.toLowerCase().includes(q) ||
        (f.description && f.description.toLowerCase().includes(q));

      const matchesTab =
        filterTab === 'all' ||
        f.status === filterTab ||
        (filterTab === 'archived' && f.status === 'closed');

      const matchesFolder = !selectedFolderId || f.folderId === selectedFolderId;

      return matchesSearch && matchesTab && matchesFolder;
    });
  }, [forms, searchTerm, filterTab, selectedFolderId]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredForms.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTab, selectedFolderId]);

  const paginatedForms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredForms.slice(start, start + pageSize);
  }, [filteredForms, currentPage, pageSize]);

  const getPageNumbers = useCallback((current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  }, []);

  /* ── Stats Calculations ── */
  const stats = useMemo(() => {
    const total = forms.length;
    const published = forms.filter(f => f.status === 'published').length;
    const drafts = forms.filter(f => f.status === 'draft').length;
    const archived = forms.filter(f => f.status === 'closed').length;
    const totalResponses = forms.reduce((sum, f) => sum + (f.responses || 0), 0);
    const totalViews = forms.reduce((sum, f) => sum + (f.views || 0), 0);

    const completionRate = totalViews > 0
      ? `${Math.min(100, Math.round((totalResponses / totalViews) * 100))}%`
      : totalResponses > 0 ? '100%' : '0%';

    return {
      total,
      published,
      drafts,
      archived,
      responsesText: totalResponses > 999 ? `${(totalResponses / 1000).toFixed(1)}K` : totalResponses.toString(),
      approvalsCount: drafts,
      completionRate
    };
  }, [forms]);

  const recentCount = useMemo(() => {
    return forms.filter(f => {
      const diff = Date.now() - new Date(f.updatedAt || f.createdAt).getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;
  }, [forms]);

  /* ── Context Menu ── */
  const renderContextMenu = (form: FormItem, isNearBottom: boolean = false) => {
    if (activeDropdown !== form._id) return null;
    return (
      <div
        className={`absolute right-0 ${
          isNearBottom ? 'bottom-8 mb-1' : 'top-8 mt-1'
        } w-48 rounded-xl bg-white border border-[#DDD5C7] shadow-2xl py-1.5 z-50`}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        <CtxBtn icon={Edit} label="Edit form" onClick={() => { onEditForm(form._id); setActiveDropdown(null); }} />
        <CtxBtn icon={Edit3} label="Rename form" onClick={() => { setRenamingForm({ id: form._id, title: form.title }); setRenameInput(form.title); setActiveDropdown(null); }} />
        <CtxBtn icon={Copy} label="Duplicate form" onClick={() => { duplicateForm(form._id); setActiveDropdown(null); }} />
        <CtxBtn icon={BarChart3} label="View responses" onClick={() => { onViewResponses(form._id); setActiveDropdown(null); }} />
        {form.status === 'closed' ? (
          <CtxBtn icon={Rocket} label="Reopen form" onClick={() => { toggleFormStatus(form._id, form.status); setActiveDropdown(null); }} />
        ) : (
          <CtxBtn icon={Lock} label="Close form" onClick={() => { toggleFormStatus(form._id, form.status); setActiveDropdown(null); }} />
        )}
        <CtxBtn icon={FolderOpen} label="Move to folder ›" onClick={() => { setActiveDropdown(null); }} />
        <div className="h-px bg-[#ECE8E1] my-1 mx-2" />
        <CtxBtn icon={ArchiveIcon} label="Archive" onClick={() => { setActiveDropdown(null); }} />
        <CtxBtn icon={Trash2} label="Delete" danger onClick={() => { deleteForm(form._id); setActiveDropdown(null); }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="w-9 h-9 border-3 border-[#F5EFE6] border-t-[#5C4A3E] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] font-medium text-slate-400">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-800 relative overflow-hidden flex flex-col font-sans">
      {/* ── Big decorative neutral asterisk watermark top-right ── */}
      <div className="absolute -top-12 -right-8 pointer-events-none select-none z-0">
        <BigDecorativeAsterisk />
      </div>

      {/* ── Top Header Bar ── */}
      <header className="px-8 py-4 flex items-center justify-between relative z-10">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search forms, responses, or people..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-16 py-2 text-[13.5px] bg-white border border-[#E5DFD5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C4A3E]/15 focus:border-[#5C4A3E] transition-all placeholder:text-slate-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400 border border-slate-200 bg-[#F5F2EC] px-1.5 py-0.5 rounded-md">
              Ctrl K
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white/80 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-[#5C4A3E] absolute top-2 right-2 ring-2 ring-[#FAF7F2]" />
          </button>

          <div className="flex items-center gap-1.5 cursor-pointer pl-1">
            <div className="w-8 h-8 rounded-full bg-[#5C4A3E] text-white flex items-center justify-center font-bold text-[12px]">
              {getInitials() || 'RS'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </header>

      {/* ── Main View Content ── */}
      <main className="flex-1 px-8 pb-10 space-y-6 relative z-10 overflow-y-auto">
        {/* Title & Actions Row */}
        <div className="flex items-start justify-between gap-4 pt-2">
          <div>
            <h1 className="text-[36px] font-serif font-black tracking-tight text-[#1A1A1A] leading-tight">
              Forms
            </h1>
            <p className="text-[14px] text-[#706B63] mt-1">
              Create, organize, and manage all your institution's forms in one place.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <CreateFormDropdown
              onBlank={onCreateForm}
              onAI={() => setShowAIBuilder(true)}
              onTemplate={() => setShowTemplates(true)}
            />
          </div>
        </div>

        {/* ── 4 Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#ECE8E1] rounded-2xl p-5 flex items-center justify-between animate-pulse">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-16 bg-[#ECE8E1] rounded-md" />
                    <div className="h-4 w-12 bg-[#ECE8E1] rounded-full" />
                  </div>
                  <div className="h-3.5 w-24 bg-[#ECE8E1] rounded" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#ECE8E1] shrink-0" />
              </div>
            ))
          ) : (
            <>
              {/* Card 1: Total Forms */}
              <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[28px] font-black text-[#2C2520] leading-none">
                      {stats.total}
                    </span>
                    <span className="text-[11px] font-bold text-[#1D8348] flex items-center">
                      ↑ +14%
                    </span>
                  </div>
                  <div className="text-[12.5px] font-medium text-[#7A746B]">Total forms</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#5C4A3E]" />
                </div>
              </div>

              {/* Card 2: Total Responses */}
              <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[28px] font-black text-[#2C2520] leading-none">
                      {stats.responsesText}
                    </span>
                    <span className="text-[11px] font-bold text-[#1D8348] flex items-center">
                      ↑ +32%
                    </span>
                  </div>
                  <div className="text-[12.5px] font-medium text-[#7A746B]">Total responses</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#5C4A3E]" />
                </div>
              </div>

              {/* Card 3: Pending Approvals */}
              <div className="bg-white border border-[#ECE8E1] rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[28px] font-black text-[#2C2520] leading-none">
                    {stats.approvalsCount}
                  </div>
                  <div className="text-[12.5px] font-medium text-[#7A746B]">Pending approvals</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] flex items-center justify-center">
                  <ShieldCheckIcon size={20} className="text-[#5C4A3E]" />
                </div>
              </div>

              {/* Card 4: Avg Completion Rate (Warm Neutral card) */}
              <div className="bg-[#F5EFE6] border border-[#DDD5C7] rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[28px] font-black text-[#2C2520] leading-none">
                    {stats.completionRate}
                  </div>
                  <div className="text-[12.5px] font-semibold text-[#5C4A3E]">Avg. completion rate</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#EDE5D8] flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#5C4A3E]" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex items-center gap-6 border-b border-[#ECE8E1] pt-1">
          {[
            { key: 'all', label: 'All Forms', count: stats.total },
            { key: 'published', label: 'Published', count: stats.published },
            { key: 'draft', label: 'Drafts', count: stats.drafts },
            { key: 'archived', label: 'Archived', count: stats.archived },
          ].map(({ key, label, count }) => {
            const active = filterTab === key;
            return (
              <button
                key={key}
                onClick={() => setFilterTab(key as FilterTab)}
                className={`flex items-center gap-2 pb-3 text-[14px] font-bold transition-all border-b-2 ${
                  active
                    ? 'border-[#5C4A3E] text-[#2C2520]'
                    : 'border-transparent text-[#706B63] hover:text-[#2C2520]'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    active ? 'bg-[#F5EFE6] text-[#5C4A3E]' : 'bg-[#EFEAE2] text-[#706B63]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Two-Column Main Section (Folders + Table) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 items-start">
          {/* ── Folders Column ── */}
          <div className="bg-white border border-[#ECE8E1] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-extrabold text-[15px] text-[#1A1A1A]">Folders</h3>
              <button
                onClick={() => { setSelectedFolder(null); setShowFolderModal(true); }}
                className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                title="New folder"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {/* All Forms item */}
              <button
                onClick={() => setSelectedFolderId(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-semibold transition-all ${
                  selectedFolderId === null
                    ? 'bg-[#F5EFE6] text-[#2C2520]'
                    : 'text-[#615A52] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className={`w-4 h-4 ${selectedFolderId === null ? 'text-[#5C4A3E]' : 'text-slate-400'}`} />
                  <span>All Forms</span>
                </div>
                <span className="text-[11.5px] font-bold text-slate-400">{stats.total}</span>
              </button>

              {/* Dynamic Folders */}
              {loading ? (
                <div className="space-y-1.5 py-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl animate-pulse">
                      <div className="flex items-center gap-2.5 w-full">
                        <div className="w-4 h-4 rounded bg-[#ECE8E1] shrink-0" />
                        <div className="h-3.5 bg-[#ECE8E1] rounded w-28" />
                      </div>
                      <div className="w-4 h-3 bg-[#ECE8E1] rounded shrink-0" />
                    </div>
                  ))}
                </div>
              ) : folders.length > 0 ? (
                folders.map((f: FolderItem) => {
                  const isSelected = selectedFolderId === f._id;
                  return (
                    <button
                      key={f._id}
                      onClick={() => setSelectedFolderId(f._id)}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => handleDrop(e, f._id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-semibold transition-all ${
                        isSelected ? 'bg-[#F5EFE6] text-[#2C2520]' : 'text-[#615A52] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Folder className="w-4 h-4 flex-shrink-0" style={{ color: f.color || '#94a3b8' }} />
                        <span className="truncate">{f.name}</span>
                      </div>
                      <span className="text-[11.5px] font-bold text-slate-400 flex-shrink-0">
                        {f.formCount || 0}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-1.5 text-[12px] text-slate-400 italic">
                  No folders yet
                </div>
              )}

              <div className="pt-2 pb-1">
                <div className="h-px bg-[#ECE8E1] mx-1" />
              </div>

              {/* Starred, Recent, Trash */}
              {[
                { label: 'Starred', icon: Star, count: 0 },
                { label: 'Recent', icon: Clock, count: recentCount },
                { label: 'Trash', icon: Trash2, count: stats.archived },
              ].map(({ label, icon: Icon, count }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13.5px] font-medium text-[#615A52] hover:bg-[#FAF8F5] transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{label}</span>
                  </div>
                  <span className="text-[11.5px] font-semibold text-slate-400">{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Forms Table Column ── */}
          <div className="bg-white border border-[#ECE8E1] rounded-2xl relative">
            {/* Table Toolbar */}
            <div className="p-4 border-b border-[#ECE8E1] flex flex-wrap items-center justify-between gap-3 rounded-t-2xl">
              <div className="flex-1 min-w-[240px] max-w-sm relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search forms in this workspace..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl focus:outline-none focus:border-[#5C4A3E] focus:ring-1 focus:ring-[#5C4A3E] transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Department filter */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white text-[12.5px] font-medium text-[#4A453F] hover:bg-[#FAF8F5]"
                >
                  <span>Department</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Status filter */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white text-[12.5px] font-medium text-[#4A453F] hover:bg-[#FAF8F5]"
                >
                  <span>Status</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Created by filter */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white text-[12.5px] font-medium text-[#4A453F] hover:bg-[#FAF8F5]"
                >
                  <span>Created by</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* View Switcher */}
                <div className="flex items-center border border-[#E5DFD5] rounded-xl overflow-hidden bg-[#FAF8F5] p-0.5 ml-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'list' ? 'bg-white text-[#1A1A1A]' : 'text-slate-400'
                    }`}
                  >
                    <ListIcon size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid' ? 'bg-white text-[#1A1A1A]' : 'text-slate-400'
                    }`}
                  >
                    <GridIcon size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[36px_2.4fr_1.2fr_1fr_1fr_1fr_36px] items-center px-4 py-2.5 bg-[#FAF7F2] border-b border-[#ECE8E1] text-[11px] font-bold text-[#8C8479] uppercase tracking-wider">
              <div>
                <input
                  type="checkbox"
                  checked={forms.length > 0 && selectedFormIds.length === forms.length}
                  onChange={toggleSelectAll}
                  className="rounded border-[#D0C8BC] text-[#5C4A3E] focus:ring-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <span>Form name</span>
                <span>↑</span>
              </div>
              <div>Department</div>
              <div>Status</div>
              <div>Responses</div>
              <div className="flex items-center gap-1 cursor-pointer">
                <span>Updated</span>
                <span>↓</span>
              </div>
              <div />
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#ECE8E1]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[36px_2.4fr_1.2fr_1fr_1fr_1fr_36px] items-center px-4 py-3.5 animate-pulse"
                  >
                    <div className="w-4 h-4 rounded border border-[#E5DFD5] bg-[#FAF7F2]" />
                    <div className="flex items-center gap-3 pr-3">
                      <div className="w-8 h-8 rounded-lg bg-[#ECE8E1] shrink-0" />
                      <div className="space-y-1.5 flex-1 max-w-[220px]">
                        <div className="h-3.5 bg-[#ECE8E1] rounded w-4/5" />
                        <div className="h-2.5 bg-[#ECE8E1] rounded w-3/5" />
                      </div>
                    </div>
                    <div><div className="h-3 bg-[#ECE8E1] rounded w-20" /></div>
                    <div><div className="h-5 bg-[#ECE8E1] rounded-full w-16" /></div>
                    <div><div className="h-3 bg-[#ECE8E1] rounded w-10" /></div>
                    <div><div className="h-3 bg-[#ECE8E1] rounded w-16" /></div>
                    <div className="w-4 h-4 bg-[#ECE8E1] rounded justify-self-center" />
                  </div>
                ))
              ) : filteredForms.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-[#5C4A3E]" />
                  </div>
                  <h4 className="font-bold text-[15px] text-[#2C2520] mb-1">No forms found</h4>
                  <p className="text-[13px] text-slate-400 mb-4 max-w-sm mx-auto">
                    Try adjusting your search query, or create a new form using the Create form button.
                  </p>
                  <button
                    onClick={onCreateForm}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5C4A3E] text-white text-[13px] font-bold hover:bg-[#483A30] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create form
                  </button>
                </div>
              ) : (
                paginatedForms.map((form, index) => {
                  const isChecked = selectedFormIds.includes(form._id);
                  const isNearBottom = index >= Math.max(0, paginatedForms.length - 2) || paginatedForms.length <= 2;
                  return (
                    <div
                      key={form._id}
                      draggable
                      onDragStart={e => {
                        setDraggedForm(form);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onClick={() => onEditForm(form._id)}
                      className={`grid grid-cols-[36px_2.4fr_1.2fr_1fr_1fr_1fr_36px] items-center px-4 py-3.5 hover:bg-[#FAF8F5]/80 cursor-pointer transition-colors relative ${
                        isChecked ? 'bg-[#F5EFE6]/50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <div onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => toggleSelectForm(form._id, e as any)}
                          className="rounded border-[#D0C8BC] text-[#5C4A3E] focus:ring-0 cursor-pointer"
                        />
                      </div>

                      {/* Title & icon */}
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F5EFE6] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-[#5C4A3E]" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[13.5px] text-[#2C2520] truncate">
                            {form.title}
                          </div>
                          <div className="text-[11.5px] text-slate-400 truncate">
                            {form.description || 'No description provided'}
                          </div>
                        </div>
                      </div>

                      {/* Department */}
                      <div>
                        <DepartmentBadge department={form.department} />
                      </div>

                      {/* Status */}
                      <div>
                        <StatusBadge status={form.status} />
                      </div>

                      {/* Responses */}
                      <div
                        onClick={e => {
                          e.stopPropagation();
                          onViewResponses(form._id);
                        }}
                        className="text-[13px] font-semibold text-[#2C2520] hover:text-[#5C4A3E] transition-colors"
                      >
                        {form.responses ? form.responses.toLocaleString() : '—'}
                      </div>

                      {/* Updated */}
                      <div className="text-[12.5px] text-slate-500">
                        {timeAgo(form.updatedAt || form.createdAt)}
                      </div>

                      {/* Actions */}
                      <div
                        className="relative flex justify-end"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setActiveDropdown(p => (p === form._id ? null : form._id));
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {renderContextMenu(form, isNearBottom)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Footer */}
            {filteredForms.length > 0 && (
              <div className="p-4 border-t border-[#ECE8E1] flex items-center justify-between text-[12.5px] text-[#706B63] rounded-b-2xl">
                <div>
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredForms.length)}–
                  {Math.min(currentPage * pageSize, filteredForms.length)} of {filteredForms.length} forms
                </div>

                <div className="flex items-center gap-1.5 font-bold">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded-md border border-[#E5DFD5] text-slate-500 hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ‹
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((p, idx) => {
                    if (p === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 select-none">
                          ...
                        </span>
                      );
                    }
                    const pageNum = Number(p);
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={`page-${pageNum}`}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                          isActive
                            ? 'bg-[#5C4A3E] text-white'
                            : 'hover:bg-[#FAF7F2] text-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 rounded-md border border-[#E5DFD5] text-slate-600 hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── MODALS ── */}
      <FolderModal
        isOpen={showFolderModal}
        onClose={() => {
          setShowFolderModal(false);
          setSelectedFolder(null);
        }}
        onSubmit={selectedFolder ? updateFolder : createFolder}
        title={selectedFolder ? 'Edit Folder' : 'Create New Folder'}
        initialData={
          selectedFolder
            ? {
                name: selectedFolder.name,
                description: selectedFolder.description,
                color: selectedFolder.color
              }
            : undefined
        }
      />

      {openFolderModal && (
        <FolderContentsModal
          folder={openFolderModal}
          forms={forms.filter(f => f.folderId === openFolderModal._id)}
          onClose={() => setOpenFolderModal(null)}
          onCreateForm={onCreateForm}
          onEditForm={onEditForm}
          onViewResponses={onViewResponses}
          onDeleteForm={deleteForm}
          onCopyShareLink={copyShareLink}
        />
      )}

      {showAIBuilder && (
        <AIFormBuilder
          onFormGenerated={handleAIFormGenerated}
          onClose={() => setShowAIBuilder(false)}
        />
      )}

      {showTemplates && (
        <TemplateLibrary
          onSelectTemplate={handleTemplateSelected}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showMyResponses && (
        <MyResponsesModal onClose={() => setShowMyResponses(false)} />
      )}

      {/* Rename Form Modal */}
      {renamingForm && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setRenamingForm(null); }}
        >
          <div className="bg-white rounded-xl border border-[#DDD5C7] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-[#EDE5D8] bg-[#FAF7F2]">
              <h2 className="text-lg font-bold text-[#2C2520]">Rename Form</h2>
              <button
                type="button"
                onClick={() => setRenamingForm(null)}
                className="p-2 hover:bg-[#F5EFE6] rounded-xl text-slate-400 hover:text-[#2C2520] transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleRenameSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#786E64] uppercase tracking-wider mb-2">
                  Form Title *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={renameInput}
                  onChange={e => setRenameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm focus:border-[#5C4A3E] focus:bg-white outline-none transition-colors text-[#2C2520]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRenamingForm(null)}
                  className="px-4 py-2 border border-[#DDD5C7] text-slate-600 rounded-xl hover:bg-[#FAF7F2] text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!renameInput.trim()}
                  className="px-5 py-2 bg-[#5C4A3E] text-white rounded-xl hover:bg-[#483A30] text-sm font-bold shadow-sm shadow-[#5C4A3E]/20 transition-all disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDashboard;
