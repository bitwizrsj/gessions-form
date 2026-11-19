import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, Clock, ExternalLink } from 'lucide-react';
import { responseAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface MyResponse {
  _id: string;
  formId: string;
  formTitle: string;
  responses: Array<{
    fieldLabel: string;
    value: any;
  }>;
  submittedAt: string;
  completionTime?: number;
  isEditable?: boolean;
  shareUrl?: string;
}

interface MyResponsesModalProps {
  onClose: () => void;
}

const MyResponsesModal: React.FC<MyResponsesModalProps> = ({ onClose }) => {
  const [responses, setResponses] = useState<MyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<MyResponse | null>(null);

  useEffect(() => {
    loadMyResponses();
  }, []);

  const loadMyResponses = async () => {
    try {
      const response = await responseAPI.getMyResponses();
      setResponses(response.data);
    } catch (error) {
      console.error('Error loading my responses:', error);
      toast.error('Failed to load your responses');
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value?.toString() || 'No answer';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-[#DDD5C7] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-[#EDE5D8] bg-[#FAF7F2] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2C2520]">My Responses</h2>
            <p className="text-xs text-[#786E64] font-medium mt-0.5">Forms you have submitted responses to</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5EFE6] rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-2xl p-5 space-y-3">
                  <div className="h-4 w-48 bg-[#ECE8E1] rounded" />
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-28 bg-[#ECE8E1] rounded" />
                    <div className="h-3 w-20 bg-[#ECE8E1] rounded" />
                  </div>
                  <div className="h-12 w-full bg-white border border-[#E5DFD5] rounded-xl" />
                </div>
              ))}
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E5DFD5]">
                <FileText className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-[#2C2520] mb-1">No responses yet</h3>
              <p className="text-sm text-slate-400">You haven't submitted any form responses yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response._id} className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl p-5 hover:border-[#5C4A3E]/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2C2520] text-base mb-2">{response.formTitle}</h3>
                      <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400 mb-3">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(response.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(response.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {response.completionTime && (
                          <div className="flex items-center space-x-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{response.completionTime}s completion</span>
                          </div>
                        )}
                      </div>
                      <div className="grid gap-2">
                        {response.responses.slice(0, 2).map((fieldResponse, index) => (
                          <div key={index} className="text-xs">
                            <span className="font-bold text-slate-700">{fieldResponse.fieldLabel}:</span>
                            <span className="ml-2 text-slate-600">{formatValue(fieldResponse.value)}</span>
                          </div>
                        ))}
                        {response.responses.length > 2 && (
                          <div className="text-[11px] text-slate-400 font-medium">
                            +{response.responses.length - 2} more fields
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedResponse(response)}
                        className="px-3.5 py-1.5 text-[#5C4A3E] hover:bg-[#F5EFE6] rounded-xl text-xs font-bold transition-colors"
                      >
                        View Details
                      </button>
                      {response.isEditable && response.shareUrl && (
                        <button
                          onClick={() => window.open(`/form/${response.shareUrl}?edit=${response._id}`, '_self')}
                          className="px-3.5 py-1.5 bg-[#5C4A3E] text-white hover:bg-[#483A30] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-[#5C4A3E]/20 transition-all active:scale-95"
                        >
                          <Clock size={12} />
                          Edit Response
                        </button>
                      )}
                      <button
                        onClick={() => window.open(`/form/${response.formId}`, '_blank')}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-[#F5EFE6] rounded-xl transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl border border-[#DDD5C7] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#EDE5D8] bg-[#FAF7F2] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#2C2520]">Response Details</h3>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-2 hover:bg-[#F5EFE6] rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <h4 className="font-bold text-[#2C2520] text-base mb-1">{selectedResponse.formTitle}</h4>
                <div className="text-xs text-slate-400 font-medium">
                  Submitted on {new Date(selectedResponse.submittedAt).toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedResponse.responses.map((fieldResponse, index) => (
                  <div key={index} className="border-l-4 border-[#5C4A3E] pl-4 bg-[#F5EFE6] rounded-r-xl p-4">
                    <h5 className="font-bold text-[#5C4A3E] text-xs uppercase tracking-wider mb-1.5">
                      {fieldResponse.fieldLabel}
                    </h5>
                    <p className="text-slate-700 text-sm break-words leading-relaxed font-medium">
                      {formatValue(fieldResponse.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyResponsesModal;