import React, { useState } from 'react';
import { Upload, X, File, Image, CheckCircle } from 'lucide-react';
import { responseAPI } from '../../services/api';

interface FileUploadFieldProps {
  value?: string;
  onChange: (value: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  formId: string;
  fieldId: string;
  subfolderName?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  value,
  onChange,
  accept = "*/*",
  maxSize = 10,
  multiple = false,
  formId,
  fieldId,
  subfolderName
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('formId', formId);
    formData.append('fieldId', fieldId);
    if (subfolderName) {
      formData.append('subfolderName', subfolderName);
    }

    try {
      const response = await responseAPI.uploadFile(formData);
      return response.data.url;
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Upload failed';
      throw new Error(msg);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      const uploadedUrl = await uploadToServer(file);
      onChange(uploadedUrl);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    onChange('');
  };

  const getFileIcon = (url: string) => {
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <Image className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Uploaded file';
  };

  if (value) {
    return (
      <div className="border border-[#E5DFD5] bg-[#FAF7F2] rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            {getFileIcon(value)}
            <div>
              <p className="text-sm font-medium text-slate-800">
                {getFileName(value)}
              </p>
              <p className="text-xs text-slate-400">File uploaded successfully</p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {value.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
          <div className="mt-3">
            <img
              src={value}
              alt="Uploaded file"
              className="max-w-full h-32 object-cover rounded-lg border border-[#E5DFD5]"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`border border-dashed border-[#D5CFC5] bg-[#FAF7F2] rounded-xl p-5 text-center transition-colors cursor-pointer hover:bg-[#F5EFE6] ${dragOver
        ? 'border-[#5C4A3E] bg-[#F5EFE6]'
        : ''
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => {
        const input = document.getElementById(`file-upload-${fieldId}`);
        if (input) input.click();
      }}
    >
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-stone-300 border-t-[#5C4A3E] mb-2"></div>
          <p className="text-[12.5px] text-slate-600">Uploading...</p>
        </div>
      ) : (
        <>
          <Upload className="w-5 h-5 text-[#5C4A3E] mx-auto mb-1" />
          <input
            type="file"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id={`file-upload-${fieldId}`}
            accept={accept}
            multiple={multiple}
          />
          <p className="text-[12.5px] text-slate-600 font-medium">
            Click to upload or drag & drop
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Max file size: {maxSize}MB
          </p>
        </>
      )}
    </div>
  );
};

export default FileUploadField;