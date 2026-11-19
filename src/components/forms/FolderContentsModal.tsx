import React from 'react';
import { ArrowLeft, X, FolderOpen, Plus, FileText, MoreVertical } from 'lucide-react';

interface FolderContentsModalProps {
  folder: any;
  forms: any[];
  onClose: () => void;
  onCreateForm: () => void;
  onEditForm: (id: string) => void;
  onViewResponses: (id: string) => void;
  onDeleteForm: (id: string) => void;
  onCopyShareLink: (shareUrl: string) => void;
}

const FolderContentsModal: React.FC<FolderContentsModalProps> = ({
  folder,
  forms,
  onClose,
  onCreateForm,
  onEditForm,
  onViewResponses,
  onDeleteForm,
  onCopyShareLink
}) => {
  if (!folder) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-[#DDD5C7] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
        <div className="bg-[#FAF7F2] border-b border-[#EDE5D8] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F5EFE6] rounded-xl transition-colors text-slate-500"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: folder.color + '20' }}
              >
                <FolderOpen className="w-5 h-5" style={{ color: folder.color }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2C2520]">{folder.name}</h2>
                <p className="text-xs text-slate-400 font-medium">{forms.length} forms in folder</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onCreateForm}
                className="flex items-center space-x-2 px-4 py-2 bg-[#5C4A3E] text-white rounded-xl hover:bg-[#483A30] text-sm font-bold shadow-sm shadow-[#5C4A3E]/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>New Form</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F5EFE6] rounded-xl transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-white">
          {forms.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {forms.map((form) => (
                <div
                  key={`form-${form._id}`}
                  className="group relative bg-[#FAF7F2] border border-[#E5DFD5] hover:border-[#5C4A3E] hover:bg-white hover:shadow-md rounded-2xl p-4 cursor-pointer transition-all duration-200"
                  onClick={() => onEditForm(form._id)}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-14 h-14 flex items-center justify-center relative">
                      <div className="w-12 h-12 bg-[#F5EFE6] rounded-2xl flex items-center justify-center text-[#5C4A3E]">
                        <FileText className="w-6 h-6 text-[#5C4A3E]" />
                      </div>
                      <div 
                        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          form.status === 'published' ? 'bg-emerald-500' :
                          form.status === 'draft' ? 'bg-amber-400' : 'bg-red-400'
                        }`}
                        title={`Status: ${form.status}`}
                      />
                    </div>

                    <div className="w-full">
                      <p className="text-sm font-bold text-[#2C2520] truncate mb-0.5">
                        {form.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {form.responses || 0} responses
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E5DFD5]">
                <FolderOpen className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-[#2C2520] mb-1">This folder is empty</h3>
              <p className="text-sm text-slate-400 mb-6">Create forms or drag and drop existing forms into this folder</p>
              <button
                onClick={onCreateForm}
                className="inline-flex items-center px-5 py-2.5 bg-[#5C4A3E] text-white rounded-xl hover:bg-[#483A30] text-sm font-bold shadow-sm shadow-[#5C4A3E]/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderContentsModal;