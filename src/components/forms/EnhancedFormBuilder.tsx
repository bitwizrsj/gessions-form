import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, CheckSquare, Circle, Calendar, Mail, Phone, Upload, Star,
  Plus, Trash2, Settings, Eye, Copy, ArrowLeft,
  BarChart3, X, GripVertical, Check, Folder, ChevronDown, ChevronUp,
  Search, Bell, Rocket, Link2, CreditCard, MapPin, Edit3,
  Sliders, SlidersHorizontal, CheckCircle2, Cloud, Lock
} from 'lucide-react';
import { formAPI, folderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import TemplateLibrary from './TemplateLibrary';
import IntegrationsPanel from './IntegrationsPanel';
import FormAnalytics from './FormAnalytics';

/* ── Inline Safe SVG Icons ── */
const WorkflowIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="6" height="6" rx="1" />
    <rect x="15" y="15" width="6" height="6" rx="1" />
    <path d="M6 9v3a3 3 0 0 0 3 3h6" />
  </svg>
);

const SignatureIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 19c-1.5 0-3-1-3-3 0-2 2-3 2-5 0-3.5-3-5.5-6-5.5-4 0-7 3-7 7 0 2.5 1.5 4.5 4 4.5 2 0 3.5-1 4.5-2" />
    <path d="M17 14l3 3 4-4" />
  </svg>
);

const NumberIcon = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <text x="2" y="18" fontSize="14" fontWeight="bold" fill="currentColor">123</text>
  </svg>
);

const BuildIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

/* ── Field Types Definitions ── */
export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  required: boolean;
  options?: string[];
  maxLength?: number;
  validation?: any;
}

export interface Form {
  _id?: string;
  title: string;
  description: string;
  fields: FormField[];
  headerImage?: string;
  status: 'draft' | 'published' | 'closed';
  shareUrl?: string;
  submitButtonText?: string;
  settings?: any;
}

interface EnhancedFormBuilderProps {
  formId?: string;
  onBack: () => void;
  onNavigate?: (view: string) => void;
  onViewResponses?: (formId: string) => void;
}

const AVAILABLE_FIELD_TYPES = [
  { type: 'text', label: 'Text Input' },
  { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' },
  { type: 'select', label: 'Dropdown' },
  { type: 'radio', label: 'Radio Group' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'textarea', label: 'Textarea' },
  { type: 'date', label: 'Date Picker' },
  { type: 'file', label: 'File Upload' },
  { type: 'rating', label: 'Rating' },
  { type: 'phone', label: 'Phone' },
];

const BuilderSkeleton = () => (
  <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden animate-pulse">
    {/* Sub-header skeleton */}
    <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#ECE8E1] flex items-center justify-between shrink-0">
      <div className="space-y-2">
        <div className="h-6 w-56 bg-[#ECE8E1] rounded-lg" />
        <div className="h-3.5 w-80 bg-[#ECE8E1] rounded" />
      </div>
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-20 bg-white border border-[#E5DFD5] rounded-xl" />
        <div className="h-9 w-24 bg-white border border-[#E5DFD5] rounded-xl" />
        <div className="h-9 w-28 bg-[#ECE8E1] rounded-xl" />
      </div>
    </div>

    {/* Tabs skeleton */}
    <div className="px-6 h-11 bg-[#FAF8F5] border-b border-[#ECE8E1] flex items-center gap-6 shrink-0">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="h-4 w-16 bg-[#ECE8E1] rounded" />
      ))}
    </div>

    {/* 3 columns skeleton */}
    <div className="flex-1 flex min-h-0 overflow-hidden">
      {/* Palette skeleton */}
      <div className="w-[280px] bg-white border-r border-[#ECE8E1] p-4 space-y-4 shrink-0 hidden md:block">
        <div className="h-4 w-24 bg-[#ECE8E1] rounded" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#FAF8F5] border border-[#ECE8E1] rounded-xl" />
          ))}
        </div>
      </div>

      {/* Center canvas skeleton */}
      <div className="flex-1 bg-[#FAF8F5] p-8 overflow-y-auto">
        <div className="max-w-[620px] mx-auto bg-white border border-[#ECE8E1] rounded-2xl p-8 space-y-6 shadow-xs">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-[#ECE8E1] rounded-lg" />
            <div className="h-4 w-72 bg-[#ECE8E1] rounded" />
          </div>
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-4 border border-[#ECE8E1] rounded-xl space-y-2 bg-[#FAF8F5]/60">
                <div className="h-4 w-32 bg-[#ECE8E1] rounded" />
                <div className="h-9 w-full bg-white border border-[#E5DFD5] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right inspector skeleton */}
      <div className="w-[300px] bg-white border-l border-[#ECE8E1] p-4 space-y-4 shrink-0 hidden lg:block">
        <div className="h-5 w-28 bg-[#ECE8E1] rounded" />
        <div className="space-y-3 pt-2">
          <div className="h-3.5 w-16 bg-[#ECE8E1] rounded" />
          <div className="h-9 w-full bg-[#FAF8F5] border border-[#ECE8E1] rounded-xl" />
          <div className="h-3.5 w-20 bg-[#ECE8E1] rounded mt-4" />
          <div className="h-9 w-full bg-[#FAF8F5] border border-[#ECE8E1] rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const EnhancedFormBuilder: React.FC<EnhancedFormBuilderProps> = ({ formId, onBack, onNavigate, onViewResponses }) => {
  const { user, getInitials } = useAuth();
  const navigate = useNavigate();
  const [loadingForm, setLoadingForm] = useState<boolean>(Boolean(formId));
  const [form, setForm] = useState<Form>({
    title: 'Untitled Form',
    description: '',
    fields: [],
    status: 'draft',
    submitButtonText: 'Submit',
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'build' | 'settings' | 'workflows' | 'integrations' | 'analytics'>('build');
  const [paletteTab, setPaletteTab] = useState<'fields' | 'templates'>('fields');
  const [inspectorTab, setInspectorTab] = useState<'properties' | 'settings'>('properties');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [publishMenuOpen, setPublishMenuOpen] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  const selectedField = form.fields.find(f => f.id === selectedFieldId) || form.fields[0];

  /* ── Load Form if formId is present ── */
  useEffect(() => {
    if (formId) {
      loadForm(formId);
    } else {
      isInitialLoad.current = false;
    }
  }, [formId]);

  const loadForm = async (id: string) => {
    setLoadingForm(true);
    try {
      const res = await formAPI.getForm(id);
      if (res.data) {
        const rawFields = Array.isArray(res.data.fields) ? res.data.fields : [];
        const mappedFields: FormField[] = rawFields.map((f: any, idx: number) => ({
          ...f,
          id: f.id || (f._id ? f._id.toString() : `field_${Date.now()}_${idx}`),
          type: f.type || 'text',
          label: f.label || `Field ${idx + 1}`,
          placeholder: f.placeholder || '',
          required: Boolean(f.required),
          options: Array.isArray(f.options) ? f.options : [],
        }));

        setForm(prev => ({
          ...prev,
          ...res.data,
          title: res.data.title || 'Untitled Form',
          description: res.data.description || '',
          fields: mappedFields,
          status: res.data.status || 'draft',
          submitButtonText: res.data.submitButtonText || 'Submit',
        }));

        if (mappedFields.length > 0) {
          setSelectedFieldId(mappedFields[0].id);
        } else {
          setSelectedFieldId('');
        }
        setSaveStatus('saved');
      }
    } catch {
      toast.error('Failed to load form details');
    } finally {
      setLoadingForm(false);
      setTimeout(() => {
        isInitialLoad.current = false;
      }, 500);
    }
  };

  /* ── Auto-save Debounce ── */
  useEffect(() => {
    if (isInitialLoad.current) return;
    if (!form._id) return;

    setSaveStatus('unsaved');
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await formAPI.updateForm(form._id!, form);
        setSaveStatus('saved');
      } catch (e) {
        console.error('Auto-save error:', e);
        setSaveStatus('unsaved');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [form.title, form.description, form.fields, form.submitButtonText, form.settings]);

  /* ── Ctrl + S Keybinding ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form]);

  /* ── Add Field from Left Palette ── */
  const addField = (type: string, label: string) => {
    const newId = `field_${Date.now()}`;
    const newField: FormField = {
      id: newId,
      type,
      label,
      placeholder: `Enter ${label.toLowerCase()}`,
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setSelectedFieldId(newId);
    setInspectorTab('properties');
  };

  /* ── Update Selected Field ── */
  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(f => (f.id === fieldId ? { ...f, ...updates } : f)),
    }));
  };

  /* ── Duplicate Field ── */
  const duplicateField = (field: FormField, e: React.MouseEvent) => {
    e.stopPropagation();
    const newId = `field_${Date.now()}`;
    const cloned: FormField = {
      ...field,
      id: newId,
      label: `${field.label} (Copy)`,
    };
    const index = form.fields.findIndex(f => f.id === field.id);
    const newFields = [...form.fields];
    newFields.splice(index + 1, 0, cloned);

    setForm(prev => ({ ...prev, fields: newFields }));
    setSelectedFieldId(newId);
    toast.success('Field duplicated');
  };

  /* ── Delete Field ── */
  const deleteField = (fieldId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = form.fields.filter(f => f.id !== fieldId);
    setForm(prev => ({ ...prev, fields: updated }));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(updated[0]?.id || '');
    }
    toast.success('Field removed');
  };

  /* ── Field Reordering Helpers ── */
  const moveField = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= form.fields.length) return;
    const reordered = Array.from(form.fields);
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setForm(prev => ({ ...prev, fields: reordered }));
  };

  const reorderFields = (sourceId: string, targetId: string) => {
    if (!sourceId || !targetId || sourceId === targetId) return;
    const sourceIndex = form.fields.findIndex(f => f.id === sourceId);
    const targetIndex = form.fields.findIndex(f => f.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;
    const reordered = Array.from(form.fields);
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setForm(prev => ({ ...prev, fields: reordered }));
    toast.success('Field reordered');
  };

  /* ── Save Draft ── */
  const handleSaveDraft = async () => {
    setSaving(true);
    setSaveStatus('saving');
    try {
      if (form._id) {
        await formAPI.updateForm(form._id, form);
      } else {
        const res = await formAPI.createForm(form);
        setForm(prev => ({ ...prev, _id: res.data._id }));
      }
      setSaveStatus('saved');
      toast.success('Draft saved successfully');
    } catch {
      setSaveStatus('unsaved');
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  /* ── Publish Form ── */
  const handlePublish = async () => {
    setPublishing(true);
    try {
      let activeId = form._id;
      if (!activeId) {
        const createRes = await formAPI.createForm(form);
        activeId = createRes.data._id;
        setForm(prev => ({ ...prev, _id: activeId }));
      }
      const pubRes = await formAPI.publishForm(activeId!);
      setForm(prev => ({
        ...prev,
        status: 'published',
        shareUrl: pubRes.data?.shareUrl || prev.shareUrl,
      }));
      toast.success('Form published live!');
    } catch {
      toast.error('Failed to publish form');
    } finally {
      setPublishing(false);
      setPublishMenuOpen(false);
    }
  };

  const handleCopyLink = () => {
    if (form.shareUrl) {
      navigator.clipboard.writeText(`${window.location.origin}/form/${form.shareUrl}`);
      toast.success('Share link copied to clipboard!');
    } else {
      toast('Please publish the form first to get a shareable link', { icon: 'ℹ️' });
    }
  };

  return (
    <div className="flex h-screen bg-[#FAF8F5] text-slate-800 overflow-hidden font-sans">
      {/* ── LEFT-MOST SIDEBAR (Reused clean design) ── */}
      <Sidebar
        currentView="forms"
        onNavigate={(view) => {
          if (view === 'ai-chat' || view === 'workflows') {
            navigate('/ai-chat');
          } else if (view === 'templates') {
            setShowTemplatesModal(true);
          } else if (view === 'forms' || view === 'dashboard') {
            onBack();
          } else if (onNavigate) {
            onNavigate(view);
          } else {
            navigate('/dashboard', { state: { view } });
          }
        }}
        onCreateForm={() => {}}
        onEditForm={(id) => {
          loadForm(id);
        }}
      />

      {/* ── MAIN BUILDER COLUMN ── */}
      <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-hidden">
        {/* ── TOP HEADER BAR ── */}
        <header className="h-[60px] px-6 bg-white border-b border-[#ECE8E1] flex items-center justify-between shrink-0">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[13px] font-bold text-[#4A453F] hover:text-[#E8601C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Forms</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search forms, responses..."
                className="w-full pl-8 pr-12 py-1.5 text-[12.5px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl focus:outline-none focus:border-[#E8601C]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                Ctrl K
              </span>
            </div>

            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#E8601C] absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-1.5 pl-1 cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-[#302B27] text-white flex items-center justify-center font-bold text-[11px]">
                {getInitials() || 'RS'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </header>

        {loadingForm ? (
          <BuilderSkeleton />
        ) : (
          <>
            {/* ── SUB-HEADER: FORM TITLE & PUBLISH ACTIONS ── */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] border-b border-[#ECE8E1] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={e => e.key === 'Enter' && setIsEditingTitle(false)}
                  autoFocus
                  className="text-[22px] font-serif font-black text-[#1A1A1A] bg-white border border-[#E8601C] rounded-lg px-2 py-0.5 outline-none"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-[22px] font-serif font-black text-[#1A1A1A] cursor-pointer hover:text-[#E8601C] transition-colors flex items-center gap-2"
                >
                  <span>{form.title}</span>
                  <Edit3 className="w-4 h-4 text-slate-400 hover:text-[#E8601C]" />
                </h1>
              )}

              <div className={`flex items-center gap-1.5 ml-3 text-[12px] font-medium px-2.5 py-0.5 rounded-full border transition-all ${
                saveStatus === 'saving'
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                  : saveStatus === 'unsaved'
                  ? 'text-slate-600 bg-slate-50 border-slate-200'
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200'
              }`}>
                {saveStatus === 'saving' ? (
                  <>
                    <div className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === 'unsaved' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>Unsaved changes</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>All changes saved</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-[12.5px] text-[#706B63] mt-0.5">{form.description}</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5DFD5] text-[13px] font-semibold text-[#4A453F] hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>{showPreview ? 'Exit Preview' : 'Preview'}</span>
            </button>

            {/* Save Draft Button */}
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-white border border-[#E5DFD5] text-[13px] font-semibold text-[#4A453F] hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>

            {/* Publish Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setPublishMenuOpen(p => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] font-bold active:scale-[0.98] transition-all shadow-sm ${
                  form.status === 'closed'
                    ? 'bg-amber-800 hover:bg-amber-900'
                    : 'bg-[#5C4A3E] hover:bg-[#483A30]'
                }`}
              >
                {form.status === 'closed' ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Rocket className="w-4 h-4" />
                )}
                <span>{form.status === 'published' ? 'Published' : form.status === 'closed' ? 'Closed' : 'Publish'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {publishMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-52 rounded-xl bg-white border border-[#E5DFD5] shadow-xl py-1.5 z-50">
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-semibold text-slate-800 hover:bg-[#FAF7F2] text-left"
                  >
                    <Rocket className="w-4 h-4 text-[#5C4A3E]" />
                    <span>{form.status === 'published' ? 'Re-publish Form' : 'Publish Form Now'}</span>
                  </button>

                  {form.status === 'published' && (
                    <button
                      onClick={async () => {
                        setForm(p => ({ ...p, status: 'closed' }));
                        if (form._id) {
                          try {
                            await formAPI.updateForm(form._id, { status: 'closed' });
                            toast.success('Form closed to new responses');
                          } catch {
                            toast.error('Failed to close form');
                          }
                        }
                        setPublishMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-amber-800 hover:bg-[#FAF7F2] text-left"
                    >
                      <Lock className="w-4 h-4 text-amber-700" />
                      <span>Close Form</span>
                    </button>
                  )}

                  {form.status === 'closed' && (
                    <button
                      onClick={async () => {
                        setForm(p => ({ ...p, status: 'published' }));
                        if (form._id) {
                          try {
                            await formAPI.updateForm(form._id, { status: 'published' });
                            toast.success('Form reopened');
                          } catch {
                            toast.error('Failed to reopen form');
                          }
                        }
                        setPublishMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-emerald-800 hover:bg-[#FAF7F2] text-left"
                    >
                      <Rocket className="w-4 h-4 text-emerald-700" />
                      <span>Reopen Form</span>
                    </button>
                  )}

                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium text-slate-800 hover:bg-[#FAF7F2] text-left"
                  >
                    <Link2 className="w-4 h-4 text-slate-400" />
                    <span>Copy Share Link</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── NAVIGATION TABS (Build, Settings, Workflows, Integrations, Analytics) ── */}
        <div className="px-6 bg-[#FAF7F2] border-b border-[#ECE8E1] flex items-center gap-6 shrink-0">
          {[
            { id: 'build', label: 'Build', icon: BuildIcon },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'workflows', label: 'Workflows', icon: WorkflowIcon },
            { id: 'integrations', label: 'Integrations', icon: Link2 },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map(({ id, label, icon: Icon }: any) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-2.5 text-[13.5px] font-bold transition-all border-b-2 ${
                  active
                    ? 'border-[#5C4A3E] text-[#2C2520]'
                    : 'border-transparent text-[#7A7165] hover:text-[#2C2520]'
                }`}
              >
                <Icon size={16} className={active ? 'text-[#5C4A3E]' : 'text-slate-400'} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT: BUILD VIEW (3 Columns) ── */}
        {showPreview ? (
          <div className="flex-1 h-full min-h-0 overflow-y-auto p-6 md:p-8 bg-[#FAF7F2]">
            <div className="w-full max-w-[620px] mx-auto bg-white rounded-2xl border border-[#ECE8E1] shadow-sm overflow-hidden flex flex-col mb-16">
              <div className="bg-[#FAF7F2] border-b border-[#ECE8E1] px-6 py-3 flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#5C4A3E] uppercase tracking-wider">Preview Mode (Interactive)</span>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="px-3 py-1 bg-white border border-[#E5DFD5] text-[12px] font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Exit Preview
                </button>
              </div>

              <div className="p-8">
                <h1 className="text-[26px] font-serif font-black text-[#2C2520] mb-2">{form.title}</h1>
                {form.description && <p className="text-[14px] text-slate-500 mb-6">{form.description}</p>}

                <div className="space-y-5">
                  {form.fields.map(field => (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-[13px] font-bold text-[#2C2520]">
                        {field.label}
                        {field.required && <span className="text-[#5C4A3E] ml-1">*</span>}
                      </label>
                      {field.helperText && <p className="text-[11.5px] text-slate-400">{field.helperText}</p>}

                      {field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={previewValues[field.id] || ''}
                          onChange={e => setPreviewValues(p => ({ ...p, [field.id]: e.target.value }))}
                          placeholder={field.placeholder || 'Enter your message'}
                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E]"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={previewValues[field.id] || ''}
                          onChange={e => setPreviewValues(p => ({ ...p, [field.id]: e.target.value }))}
                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E]"
                        >
                          <option value="">{field.placeholder || 'Select an option'}</option>
                          {(field.options || []).map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : field.type === 'radio' ? (
                        <div className="space-y-2 pt-1">
                          {(field.options || []).map((opt, i) => (
                            <label key={i} className="flex items-center gap-2.5 text-[13px] text-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                name={field.id}
                                checked={previewValues[field.id] === opt}
                                onChange={() => setPreviewValues(p => ({ ...p, [field.id]: opt }))}
                                className="accent-[#5C4A3E]"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === 'checkbox' ? (
                        <div className="space-y-2 pt-1">
                          {(field.options || []).map((opt, i) => {
                            const current = Array.isArray(previewValues[field.id]) ? previewValues[field.id] : [];
                            return (
                              <label key={i} className="flex items-center gap-2.5 text-[13px] text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={current.includes(opt)}
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setPreviewValues(p => ({ ...p, [field.id]: [...current, opt] }));
                                    } else {
                                      setPreviewValues(p => ({ ...p, [field.id]: current.filter((x: string) => x !== opt) }));
                                    }
                                  }}
                                  className="rounded accent-[#5C4A3E]"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : field.type === 'rating' ? (
                        <div className="flex items-center gap-1.5 pt-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              onClick={() => setPreviewValues(p => ({ ...p, [field.id]: star }))}
                              className={`w-6 h-6 cursor-pointer ${
                                (previewValues[field.id] || 0) >= star ? 'fill-current' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      ) : field.type === 'date' ? (
                        <input
                          type="date"
                          value={previewValues[field.id] || ''}
                          onChange={e => setPreviewValues(p => ({ ...p, [field.id]: e.target.value }))}
                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E]"
                        />
                      ) : field.type === 'file' ? (
                        <div className="border border-dashed border-[#D5CFC5] bg-[#FAF7F2] rounded-xl p-5 text-center flex flex-col items-center justify-center">
                          <Upload className="w-5 h-5 text-[#5C4A3E] mb-1" />
                          <p className="text-[12.5px] text-slate-600 font-medium">Click to upload or drag & drop</p>
                        </div>
                      ) : (
                        <input
                          type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                          value={previewValues[field.id] || ''}
                          onChange={e => setPreviewValues(p => ({ ...p, [field.id]: e.target.value }))}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E]"
                        />
                      )}
                    </div>
                  ))}

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => toast.success('Preview mode: Form response submitted successfully!')}
                      className="w-full py-3 px-4 rounded-xl bg-[#5C4A3E] text-white font-bold text-[14px] hover:bg-[#483A30] active:scale-[0.98] transition-all shadow-sm"
                    >
                      {form.submitButtonText || 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'build' ? (
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* ════════════════════════════════════════════
                COLUMN 1: LEFT PALETTE (Add Fields / Templates)
            ════════════════════════════════════════════ */}
            <div className="w-[280px] min-w-[280px] bg-white border-r border-[#ECE8E1] flex flex-col h-full min-h-0 overflow-hidden">
              {/* Palette Tabs */}
              <div className="flex border-b border-[#ECE8E1] px-4 pt-3 gap-4 shrink-0">
                <button
                  onClick={() => setPaletteTab('fields')}
                  className={`pb-2.5 text-[13px] font-bold border-b-2 transition-all ${
                    paletteTab === 'fields'
                      ? 'border-[#5C4A3E] text-[#2C2520]'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Add Fields
                </button>
                <button
                  onClick={() => setShowTemplatesModal(true)}
                  className={`pb-2.5 text-[13px] font-bold border-b-2 transition-all ${
                    paletteTab === 'templates'
                      ? 'border-[#5C4A3E] text-[#2C2520]'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Templates
                </button>
              </div>

              {/* Palette Scrollable List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5" style={{ scrollbarWidth: 'thin' }}>
                {/* 1. Basic Fields */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Basic Fields
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'text', label: 'Text Input', icon: Edit3 },
                      { type: 'email', label: 'Email', icon: Mail },
                      { type: 'number', label: 'Number', icon: NumberIcon },
                      { type: 'select', label: 'Dropdown', icon: CheckSquare },
                      { type: 'radio', label: 'Radio Group', icon: Circle },
                      { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
                      { type: 'textarea', label: 'Textarea', icon: FileText },
                      { type: 'date', label: 'Date Picker', icon: Calendar },
                    ].map(({ type, label, icon: Icon }: any) => (
                      <button
                        key={type}
                        onClick={() => addField(type, label)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white hover:border-[#5C4A3E] hover:shadow-2xs transition-all text-center group"
                      >
                        <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#5C4A3E] mb-1.5 transition-colors" />
                        <span className="text-[12px] font-semibold text-[#302B27] group-hover:text-[#2C2520]">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Advanced Fields */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Advanced Fields
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'file', label: 'File Upload', icon: Upload },
                      { type: 'rating', label: 'Rating', icon: Star },
                      { type: 'phone', label: 'Phone', icon: Phone },
                      { type: 'address', label: 'Address', icon: MapPin },
                      { type: 'signature', label: 'Signature', icon: SignatureIcon },
                      { type: 'payment', label: 'Payment', icon: CreditCard },
                    ].map(({ type, label, icon: Icon }: any) => (
                      <button
                        key={type}
                        onClick={() => addField(type, label)}
                        className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white hover:border-[#5C4A3E] hover:shadow-2xs transition-all text-center group"
                      >
                        <Icon className="w-5 h-5 text-slate-600 group-hover:text-[#5C4A3E] mb-1.5 transition-colors" />
                        <span className="text-[12px] font-semibold text-[#302B27] group-hover:text-[#2C2520]">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Layout Fields */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Layout
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addField('section', 'Section Header')}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white hover:border-[#5C4A3E] transition-all"
                    >
                      <span className="font-serif font-black text-slate-600 text-[14px]">H</span>
                      <span className="text-[11.5px] font-semibold text-[#302B27]">Section Header</span>
                    </button>
                    <button
                      onClick={() => addField('divider', 'Divider')}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E5DFD5] bg-[#FAF7F2] hover:bg-white hover:border-[#5C4A3E] transition-all"
                    >
                      <span className="font-bold text-slate-600 text-[16px]">—</span>
                      <span className="text-[11.5px] font-semibold text-[#302B27]">Divider</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════
                COLUMN 2: CENTER CANAVS (Interactive Form)
            ════════════════════════════════════════════ */}
            <div className="flex-1 h-full min-h-0 overflow-y-auto p-6 md:p-8 bg-[#FAF7F2]">
              <div className="w-full max-w-[620px] mx-auto bg-white rounded-2xl border border-[#ECE8E1] shadow-sm overflow-hidden flex flex-col mb-16">
                {/* ── Form Header Banner ── */}
                {form.headerImage ? (
                  <div className="relative h-44 border-b border-[#ECE8E1] overflow-hidden">
                    <img src={form.headerImage} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative h-32 bg-gradient-to-r from-[#FDF6EE] to-[#FBEBE2] flex items-center justify-between px-8 border-b border-[#ECE8E1] overflow-hidden">
                    <div className="flex items-center gap-3.5 z-10">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E2DBD0] flex items-center justify-center shadow-xs">
                        <FileText className="w-5 h-5 text-[#C94D10]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-[18px] text-[#222] leading-tight">
                          {user?.organization || `${user?.name ? `${user.name.split(' ')[0]}'s` : 'My'} Workspace`}
                        </h3>
                        <p className="text-[12px] text-slate-500 font-medium">
                          {form.title}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Form Title & Subtitle in Canvas ── */}
                <div className="p-6 pb-2">
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Form Title"
                    className="w-full text-[26px] font-serif font-black text-[#1A1A1A] leading-tight bg-transparent border-b border-transparent hover:border-[#ECE8E1] focus:border-[#C94D10] rounded px-1 py-0.5 outline-none transition-colors"
                  />
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Add a description for your form..."
                    className="w-full text-[13.5px] text-[#706B63] mt-1.5 bg-transparent border-b border-transparent hover:border-[#ECE8E1] focus:border-[#C94D10] rounded px-1 py-0.5 outline-none resize-none transition-colors"
                  />
                </div>

                {/* ── Form Fields (Drag & Drop Canvas) ── */}
                <div className="p-6 pt-2 space-y-4">
                  {form.fields.length === 0 ? (
                    <div className="py-12 px-6 text-center border-2 border-dashed border-[#ECE8E1] rounded-2xl bg-[#FAF7F2]/60 my-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-[#5C4A3E]" />
                      </div>
                      <h4 className="font-bold text-[15px] text-[#2C2520] mb-1">Your form is empty</h4>
                      <p className="text-[12.5px] text-slate-500 mb-4 max-w-xs mx-auto">
                        Click any field from the left panel to add it to your form.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.fields.map((field, index) => {
                        const isSelected = selectedFieldId === field.id;
                        const isDragging = draggedFieldId === field.id;
                        const isOver = dragOverFieldId === field.id && !isDragging;

                        return (
                          <div
                            key={field.id}
                            draggable
                            onDragStart={e => {
                              const target = e.target as HTMLElement;
                              if (
                                ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(target.tagName) ||
                                target.closest('button')
                              ) {
                                e.preventDefault();
                                return;
                              }
                              setDraggedFieldId(field.id);
                              e.dataTransfer.effectAllowed = 'move';
                              e.dataTransfer.setData('text/plain', field.id);
                            }}
                            onDragOver={e => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                              if (draggedFieldId && draggedFieldId !== field.id && dragOverFieldId !== field.id) {
                                setDragOverFieldId(field.id);
                              }
                            }}
                            onDragLeave={e => {
                              if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                              if (dragOverFieldId === field.id) {
                                setDragOverFieldId(null);
                              }
                            }}
                            onDrop={e => {
                              e.preventDefault();
                              const sourceId = e.dataTransfer.getData('text/plain') || draggedFieldId;
                              if (sourceId) {
                                reorderFields(sourceId, field.id);
                              }
                              setDraggedFieldId(null);
                              setDragOverFieldId(null);
                            }}
                            onDragEnd={() => {
                              setDraggedFieldId(null);
                              setDragOverFieldId(null);
                            }}
                            onClick={() => {
                              setSelectedFieldId(field.id);
                              setInspectorTab('properties');
                            }}
                            className={`relative rounded-xl p-4 transition-all cursor-pointer ${
                              isDragging
                                ? 'opacity-40 border-2 border-dashed border-[#5C4A3E] bg-[#FAF8F5]'
                                : isOver
                                ? 'border-2 border-[#5C4A3E] bg-[#FAF7F2] ring-2 ring-[#5C4A3E]/20 scale-[1.01]'
                                : isSelected
                                ? 'border-2 border-dashed border-[#5C4A3E] bg-white shadow-sm'
                                : 'border border-[#ECE8E1] bg-white hover:border-[#D5CFC5]'
                            }`}
                          >
                            {/* Selected Floating Action Toolbar */}
                            {isSelected && (
                              <div
                                className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg p-1 shadow-xs z-10"
                                onClick={e => e.stopPropagation()}
                              >
                                {index > 0 && (
                                  <button
                                    type="button"
                                    onClick={e => moveField(index, 'up', e)}
                                    title="Move Up"
                                    className="p-1 hover:bg-[#F5EFE6] text-slate-600 hover:text-[#5C4A3E] rounded transition-colors"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {index < form.fields.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={e => moveField(index, 'down', e)}
                                    title="Move Down"
                                    className="p-1 hover:bg-[#F5EFE6] text-slate-600 hover:text-[#5C4A3E] rounded transition-colors"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={e => duplicateField(field, e)}
                                  title="Duplicate"
                                  className="p-1 hover:bg-[#F5EFE6] text-slate-600 hover:text-[#5C4A3E] rounded transition-colors"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={e => deleteField(field.id, e)}
                                  title="Delete"
                                  className="p-1 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div
                                  draggable
                                  onDragStart={e => {
                                    e.stopPropagation();
                                    setDraggedFieldId(field.id);
                                    e.dataTransfer.effectAllowed = 'move';
                                    e.dataTransfer.setData('text/plain', field.id);
                                  }}
                                  onDragEnd={() => {
                                    setDraggedFieldId(null);
                                    setDragOverFieldId(null);
                                  }}
                                  title="Drag to reorder"
                                  className="p-1 text-slate-400 hover:text-[#5C4A3E] hover:bg-[#F5EFE6] rounded cursor-grab active:cursor-grabbing transition-colors"
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            )}

                                      {/* Field Label (except divider) */}
                                      {field.type !== 'divider' && (
                                        isSelected ? (
                                          <div className="mb-2" onClick={e => e.stopPropagation()}>
                                            <input
                                              type="text"
                                              value={field.label}
                                              onChange={e => updateField(field.id, { label: e.target.value })}
                                              placeholder="Enter field label"
                                              className="w-full font-bold text-[#2C2520] text-[14px] bg-transparent border-b border-dashed border-[#5C4A3E] outline-none pb-0.5"
                                            />
                                            {field.required && <span className="text-[#5C4A3E] text-[11px] font-semibold">* Required</span>}
                                          </div>
                                        ) : (
                                          <label className={`block font-bold text-[#2C2520] mb-1 ${field.type === 'section' ? 'text-[16px]' : 'text-[13.5px]'}`}>
                                            {field.label}
                                            {field.required && <span className="text-[#5C4A3E] ml-1">*</span>}
                                          </label>
                                        )
                                      )}

                                      {field.helperText && (
                                        <p className="text-[11.5px] text-slate-400 mb-2">{field.helperText}</p>
                                      )}

                                      {/* Field Preview Control */}
                                      {field.type === 'textarea' ? (
                                        <textarea
                                          rows={3}
                                          disabled
                                          placeholder={field.placeholder || 'Enter your message'}
                                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl outline-none"
                                        />
                                      ) : field.type === 'select' ? (
                                        <div className="relative">
                                          <select
                                            disabled
                                            className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl outline-none appearance-none text-slate-500"
                                          >
                                            <option>{field.placeholder || 'Select an option'}</option>
                                            {(field.options || []).map((opt, i) => (
                                              <option key={i}>{opt}</option>
                                            ))}
                                          </select>
                                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                      ) : field.type === 'radio' ? (
                                        <div className="space-y-2 pt-1">
                                          {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map((opt, i) => (
                                            <label key={i} className="flex items-center gap-2.5 text-[13px] text-slate-700 pointer-events-none">
                                              <input type="radio" disabled checked={i === 0} className="text-[#C94D10]" />
                                              <span>{opt}</span>
                                            </label>
                                          ))}
                                        </div>
                                      ) : field.type === 'checkbox' ? (
                                        <div className="space-y-2 pt-1">
                                          {(field.options && field.options.length > 0 ? field.options : ['Option 1', 'Option 2']).map((opt, i) => (
                                            <label key={i} className="flex items-center gap-2.5 text-[13px] text-slate-700 pointer-events-none">
                                              <input type="checkbox" disabled checked={i === 0} className="rounded text-[#C94D10]" />
                                              <span>{opt}</span>
                                            </label>
                                          ))}
                                        </div>
                                      ) : field.type === 'date' ? (
                                        <input
                                          type="date"
                                          disabled
                                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl outline-none text-slate-500"
                                        />
                                      ) : field.type === 'rating' ? (
                                        <div className="flex items-center gap-1 pt-1 text-amber-400">
                                          {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} className="w-5 h-5 fill-current" />
                                          ))}
                                        </div>
                                      ) : field.type === 'section' ? (
                                        <div className="border-b border-[#ECE8E1] my-1" />
                                      ) : field.type === 'divider' ? (
                                        <div className="py-2">
                                          <hr className="border-[#ECE8E1]" />
                                        </div>
                                      ) : field.type === 'file' ? (
                                        <div className="border border-dashed border-[#D5CFC5] bg-[#FAF8F5] rounded-xl p-5 text-center flex flex-col items-center justify-center">
                                          <Upload className="w-5 h-5 text-[#C94D10] mb-1" />
                                          <p className="text-[12.5px] text-slate-600 font-medium">
                                            Drag and drop your file here or <span className="text-[#C94D10] font-bold underline cursor-pointer">Browse files</span>
                                          </p>
                                        </div>
                                      ) : (
                                        <input
                                          type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                                          disabled
                                          placeholder={field.placeholder || 'Enter value'}
                                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl outline-none"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                  {/* Big Submit Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      className="w-full py-3 px-4 rounded-xl bg-[#5C4A3E] text-white font-bold text-[14px] hover:bg-[#483A30] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>{form.submitButtonText || 'Register Now'}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════
                COLUMN 3: RIGHT INSPECTOR (Field Properties / Settings)
            ════════════════════════════════════════════ */}
            <div className="w-[300px] min-w-[300px] bg-white border-l border-[#ECE8E1] flex flex-col h-full min-h-0 overflow-hidden">
              {/* Inspector Tabs */}
              <div className="flex border-b border-[#ECE8E1] px-4 pt-3 gap-4 shrink-0">
                <button
                  onClick={() => setInspectorTab('properties')}
                  className={`pb-2.5 text-[13px] font-bold border-b-2 transition-all ${
                    inspectorTab === 'properties'
                      ? 'border-[#5C4A3E] text-[#2C2520]'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Field Properties
                </button>
                <button
                  onClick={() => setInspectorTab('settings')}
                  className={`pb-2.5 text-[13px] font-bold border-b-2 transition-all ${
                    inspectorTab === 'settings'
                      ? 'border-[#5C4A3E] text-[#2C2520]'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Form Settings
                </button>
              </div>

              {/* Inspector Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
                {inspectorTab === 'properties' && selectedField ? (
                  <>
                    {/* Field Type Badge with Change Button */}
                    <div className="relative">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#ECE8E1]">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[14px] text-slate-700">T</span>
                          <span className="text-[13px] font-bold text-[#2C2520] capitalize">{selectedField.type} Input</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowTypePicker(p => !p)}
                          className="px-2.5 py-1 text-[11.5px] font-semibold text-slate-700 bg-white border border-[#E5DFD5] rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          Change
                        </button>
                      </div>

                      {showTypePicker && (
                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#ECE8E1] rounded-xl shadow-lg p-2 z-30 max-h-56 overflow-y-auto">
                          {AVAILABLE_FIELD_TYPES.map(ft => (
                            <button
                              key={ft.type}
                              type="button"
                              onClick={() => {
                                updateField(selectedField.id, {
                                  type: ft.type,
                                  options: ['select', 'radio', 'checkbox'].includes(ft.type)
                                    ? (selectedField.options && selectedField.options.length > 0 ? selectedField.options : ['Option 1', 'Option 2', 'Option 3'])
                                    : selectedField.options,
                                });
                                setShowTypePicker(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-[12.5px] rounded-lg transition-colors flex items-center justify-between ${
                                selectedField.type === ft.type ? 'bg-[#F5EFE6] text-[#5C4A3E] font-bold' : 'hover:bg-[#FAF7F2] text-slate-700'
                              }`}
                            >
                              <span>{ft.label}</span>
                              {selectedField.type === ft.type && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Label Input */}
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1">Label</label>
                      <input
                        type="text"
                        value={selectedField.label}
                        onChange={e => updateField(selectedField.id, { label: e.target.value })}
                        className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E]"
                      />
                    </div>

                    {/* Helper Text Input */}
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1">Helper Text</label>
                      <input
                        type="text"
                        value={selectedField.helperText || ''}
                        onChange={e => updateField(selectedField.id, { helperText: e.target.value })}
                        placeholder="e.g. Enter as per official records"
                        className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E]"
                      />
                    </div>

                    {/* Required Toggle */}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[12.5px] font-bold text-slate-700">Required</span>
                      <button
                        type="button"
                        onClick={() => updateField(selectedField.id, { required: !selectedField.required })}
                        className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
                          selectedField.required ? 'bg-[#5C4A3E]' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                            selectedField.required ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Placeholder Input */}
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1">Placeholder</label>
                      <input
                        type="text"
                        value={selectedField.placeholder || ''}
                        onChange={e => updateField(selectedField.id, { placeholder: e.target.value })}
                        className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#E5DFD5] rounded-xl outline-none focus:border-[#C94D10]"
                      />
                    </div>

                    {/* Max Length */}
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1">Max Length</label>
                      <input
                        type="number"
                        value={selectedField.maxLength || 100}
                        onChange={e => updateField(selectedField.id, { maxLength: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#E5DFD5] rounded-xl outline-none focus:border-[#C94D10]"
                      />
                    </div>

                    {/* Options Editor for Choice Fields */}
                    {['select', 'radio', 'checkbox'].includes(selectedField.type) && (
                      <div className="border-t border-[#ECE8E1] pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-[12px] font-bold text-slate-700">Options</label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentOpts = selectedField.options || [];
                              updateField(selectedField.id, {
                                options: [...currentOpts, `Option ${currentOpts.length + 1}`]
                              });
                            }}
                            className="text-[11.5px] font-bold text-[#C94D10] hover:underline"
                          >
                            + Add Option
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {(selectedField.options || []).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={opt}
                                onChange={e => {
                                  const updatedOpts = [...(selectedField.options || [])];
                                  updatedOpts[optIdx] = e.target.value;
                                  updateField(selectedField.id, { options: updatedOpts });
                                }}
                                className="flex-1 px-2.5 py-1 text-[12.5px] bg-white border border-[#E5DFD5] rounded-lg outline-none focus:border-[#C94D10]"
                              />
                              {(selectedField.options || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedOpts = (selectedField.options || []).filter((_, i) => i !== optIdx);
                                    updateField(selectedField.id, { options: updatedOpts });
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-500 rounded"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collapsible Accordions (Advanced Options, Validation, etc.) */}
                    <div className="border-t border-[#ECE8E1] pt-3 space-y-2">
                      {/* Validation Rules */}
                      <div className="border border-[#ECE8E1] rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenSection(openSection === 'validation' ? null : 'validation')}
                          className="w-full flex items-center justify-between p-2.5 text-[12.5px] font-bold text-slate-700 bg-[#FAF8F5] hover:bg-slate-100"
                        >
                          <span>Validation Rules</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSection === 'validation' ? 'rotate-180' : ''}`} />
                        </button>
                        {openSection === 'validation' && (
                          <div className="p-3 space-y-2.5 bg-white border-t border-[#ECE8E1]">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Character Length</label>
                              <input
                                type="number"
                                value={selectedField.maxLength || ''}
                                onChange={e => updateField(selectedField.id, { maxLength: e.target.value ? Number(e.target.value) : undefined })}
                                placeholder="e.g. 100"
                                className="w-full px-2.5 py-1 text-[12px] border border-[#E5DFD5] rounded-lg outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Custom Pattern (Regex)</label>
                              <input
                                type="text"
                                value={selectedField.validation?.pattern || ''}
                                onChange={e => updateField(selectedField.id, { validation: { ...selectedField.validation, pattern: e.target.value } })}
                                placeholder="e.g. ^[A-Za-z]+$"
                                className="w-full px-2.5 py-1 text-[12px] border border-[#E5DFD5] rounded-lg outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Advanced Options */}
                      <div className="border border-[#ECE8E1] rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenSection(openSection === 'advanced' ? null : 'advanced')}
                          className="w-full flex items-center justify-between p-2.5 text-[12.5px] font-bold text-slate-700 bg-[#FAF8F5] hover:bg-slate-100"
                        >
                          <span>Advanced Options</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openSection === 'advanced' ? 'rotate-180' : ''}`} />
                        </button>
                        {openSection === 'advanced' && (
                          <div className="p-3 space-y-2.5 bg-white border-t border-[#ECE8E1]">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 mb-1">Field ID</label>
                              <input
                                type="text"
                                disabled
                                value={selectedField.id}
                                className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded-lg text-slate-400"
                              />
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[12px] text-slate-600 font-medium">Read Only</span>
                              <input
                                type="checkbox"
                                checked={Boolean(selectedField.validation?.readOnly)}
                                onChange={e => updateField(selectedField.id, { validation: { ...selectedField.validation, readOnly: e.target.checked } })}
                                className="rounded accent-[#C94D10]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Field Button */}
                    <div className="pt-3">
                      <button
                        onClick={() => deleteField(selectedField.id)}
                        className="w-full py-2.5 px-3 rounded-xl bg-red-50 text-red-600 font-bold text-[13px] hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Field</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Form Settings Tab */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1">Form Title</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#E5DFD5] rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#E5DFD5] rounded-xl outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-bold text-slate-700 mb-1">Submit Button Text</label>
                      <input
                        type="text"
                        value={form.submitButtonText || 'Register Now'}
                        onChange={e => setForm(p => ({ ...p, submitButtonText: e.target.value }))}
                        className="w-full px-3 py-1.5 text-[13px] bg-white border border-[#E5DFD5] rounded-xl outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="flex-1 p-8 bg-[#FAF8F5] overflow-y-auto">
            <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-[#ECE8E1] space-y-6">
              <div>
                <h3 className="font-serif font-bold text-[20px] text-[#1A1A1A]">General Settings</h3>
                <p className="text-[13px] text-slate-500">Configure access, notifications, and response behavior.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-[#ECE8E1]">
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1A1A1A]">Require Login</h4>
                    <p className="text-[11.5px] text-slate-500">Users must be logged in to submit this form</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings?.requireLogin ?? true}
                    onChange={e => setForm(p => ({ ...p, settings: { ...p.settings, requireLogin: e.target.checked } }))}
                    className="w-4 h-4 accent-[#5C4A3E] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#ECE8E1]">
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1A1A1A]">Allow Multiple Responses</h4>
                    <p className="text-[11.5px] text-slate-500">Let a user submit the form more than once</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings?.allowMultipleResponses ?? true}
                    onChange={e => setForm(p => ({ ...p, settings: { ...p.settings, allowMultipleResponses: e.target.checked } }))}
                    className="w-4 h-4 accent-[#5C4A3E] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-[#ECE8E1]">
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1A1A1A]">Show Progress Bar</h4>
                    <p className="text-[11.5px] text-slate-500">Display completion progress while filling</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.settings?.showProgressBar ?? true}
                    onChange={e => setForm(p => ({ ...p, settings: { ...p.settings, showProgressBar: e.target.checked } }))}
                    className="w-4 h-4 accent-[#5C4A3E] rounded cursor-pointer"
                  />
                </div>

                <div className="py-2.5 border-b border-[#ECE8E1]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[13.5px] font-bold text-[#1A1A1A]">Email Notifications</h4>
                      <p className="text-[11.5px] text-slate-500">Receive an email when a response is submitted</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={form.settings?.emailNotifications ?? true}
                      onChange={e => setForm(p => ({ ...p, settings: { ...p.settings, emailNotifications: e.target.checked } }))}
                      className="w-4 h-4 accent-[#5C4A3E] rounded cursor-pointer"
                    />
                  </div>

                  {(form.settings?.emailNotifications ?? true) && (
                    <div className="mt-3 pt-3 border-t border-[#ECE8E1]/70 animate-in fade-in duration-200">
                      <label className="block text-[12px] font-bold text-[#2C2520] mb-1">
                        Coworker / Additional Notification Email
                      </label>
                      <input
                        type="text"
                        value={form.settings?.notificationEmail || ''}
                        onChange={e => setForm(p => ({ ...p, settings: { ...p.settings, notificationEmail: e.target.value } }))}
                        placeholder="e.g. coworker@company.com"
                        className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E] transition-colors text-[#2C2520]"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Form creator always receives notifications. Add a coworker's email address here so they receive notifications too (supports multiple separated by comma).
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Form Availability / Manual Close ── */}
                <div className="flex items-center justify-between py-2 border-b border-[#ECE8E1]">
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#1A1A1A]">Accepting Responses</h4>
                    <p className="text-[11.5px] text-slate-500">
                      {form.status === 'closed'
                        ? 'Form is closed to responses'
                        : 'Form is active and accepting submissions'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.status !== 'closed'}
                    onChange={e =>
                      setForm(p => ({
                        ...p,
                        status: e.target.checked ? 'published' : 'closed'
                      }))
                    }
                    className="w-4 h-4 accent-[#5C4A3E] rounded cursor-pointer"
                  />
                </div>

                {/* ── Form Valid Till / Closing Date ── */}
                <div className="py-2.5 border-b border-[#ECE8E1]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[13.5px] font-bold text-[#1A1A1A]">Form Valid Till (Closing Date)</h4>
                      <p className="text-[11.5px] text-slate-500">Automatically close this form after a specific date & time</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(form.settings?.expiryDate)}
                      onChange={e => {
                        if (e.target.checked) {
                          const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                          const localIso = new Date(nextWeek.getTime() - nextWeek.getTimezoneOffset() * 60000)
                            .toISOString()
                            .slice(0, 16);
                          setForm(p => ({
                            ...p,
                            settings: { ...p.settings, expiryDate: localIso }
                          }));
                        } else {
                          setForm(p => ({
                            ...p,
                            settings: { ...p.settings, expiryDate: null }
                          }));
                        }
                      }}
                      className="w-4 h-4 accent-[#5C4A3E] rounded cursor-pointer"
                    />
                  </div>

                  {Boolean(form.settings?.expiryDate) && (
                    <div className="mt-3 pt-3 border-t border-[#ECE8E1]/70 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-[12px] font-bold text-[#2C2520] mb-1">
                          Closing Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={
                            form.settings?.expiryDate
                              ? (() => {
                                  try {
                                    const d = new Date(form.settings.expiryDate);
                                    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                                      .toISOString()
                                      .slice(0, 16);
                                  } catch {
                                    return '';
                                  }
                                })()
                              : ''
                          }
                          onChange={e => {
                            const val = e.target.value;
                            setForm(p => ({
                              ...p,
                              settings: {
                                ...p.settings,
                                expiryDate: val ? new Date(val).toISOString() : null
                              }
                            }));
                          }}
                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E] transition-colors text-[#2C2520]"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Responders attempting to access or submit after this time will see the Form Closed screen.
                        </p>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-[#2C2520] mb-1">
                          Custom Closed Message (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={form.settings?.closedMessage || ''}
                          onChange={e =>
                            setForm(p => ({
                              ...p,
                              settings: { ...p.settings, closedMessage: e.target.value }
                            }))
                          }
                          placeholder="e.g. Submissions for this application round are now closed. Please contact us for inquiries."
                          className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E] transition-colors text-[#2C2520] resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Submit Button Text</label>
                  <input
                    type="text"
                    value={form.submitButtonText || 'Submit'}
                    onChange={e => setForm(p => ({ ...p, submitButtonText: e.target.value }))}
                    className="w-full px-3.5 py-2 text-[13px] bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl outline-none focus:border-[#5C4A3E] transition-colors text-[#2C2520]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#5C4A3E] text-white font-bold rounded-xl text-[13px] hover:bg-[#483A30] transition-colors shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'integrations' ? (
          <IntegrationsPanel
            formId={form._id || 'temp'}
            formTitle={form.title}
            formSettings={form.settings}
            onClose={() => setActiveTab('build')}
            onSettingsChange={settings => {
              setForm(prev => ({
                ...prev,
                settings: { ...prev.settings, ...settings }
              }));
            }}
          />
        ) : activeTab === 'analytics' ? (
          <FormAnalytics
            formId={form._id || 'temp'}
            onClose={() => setActiveTab('build')}
          />
        ) : (
          <div className="flex-1 p-8 bg-[#FAF8F5] flex items-center justify-center">
            <div className="text-center">
              <WorkflowIcon size={32} className="mx-auto text-slate-400 mb-2" />
              <h3 className="font-bold text-[16px]">Workflows Configuration</h3>
              <p className="text-[13px] text-slate-400">Configure multi-stage approvals and conditional logic.</p>
            </div>
          </div>
        )}
      </>
    )}
  </div>

      {/* ── TEMPLATES MODAL ── */}
      {showTemplatesModal && (
        <TemplateLibrary
          onSelectTemplate={tpl => {
            setForm(prev => ({
              ...prev,
              title: tpl.title,
              description: tpl.description,
              fields: (tpl.fields || []).map((f: any, i: number) => ({ ...f, id: `field_${Date.now()}_${i}` })),
            }));
            setShowTemplatesModal(false);
            toast.success('Template loaded into editor!');
          }}
          onClose={() => setShowTemplatesModal(false)}
        />
      )}
    </div>
  );
};

export default EnhancedFormBuilder;
