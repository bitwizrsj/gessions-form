import React, { useState } from 'react';
import { X, Folder, Palette } from 'lucide-react';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (folderData: { name: string; description: string; color: string }) => void;
  title: string;
  initialData?: {
    name: string;
    description: string;
    color: string;
  };
}

const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [color, setColor] = useState(initialData?.color || '#3B82F6');

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      color
    });
    
    // Reset form
    setName('');
    setDescription('');
    setColor('#3B82F6');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-[#DDD5C7] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#EDE5D8] bg-[#FAF7F2]">
          <h2 className="text-lg font-bold text-[#2C2520]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5EFE6] rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#786E64] uppercase tracking-wider mb-2">
              Folder Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm outline-none focus:border-[#5C4A3E] focus:bg-white text-[#2C2520] transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#786E64] uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter folder description (optional)"
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl text-sm outline-none focus:border-[#5C4A3E] focus:bg-white text-[#2C2520] transition-all resize-none"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#786E64] uppercase tracking-wider mb-2">
              <Palette className="w-3.5 h-3.5 inline mr-1 text-[#5C4A3E]" />
              Color Accent
            </label>
            <div className="grid grid-cols-5 gap-2 pt-1">
              {colors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption 
                      ? 'border-[#2C2520] scale-110 shadow-sm' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#EDE5D8]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 border border-[#DDD5C7] rounded-xl hover:bg-[#FAF7F2] text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#5C4A3E] text-white rounded-xl hover:bg-[#483A30] text-sm font-bold shadow-sm shadow-[#5C4A3E]/20 transition-all active:scale-95"
            >
              {initialData ? 'Update' : 'Create'} Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderModal;