import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Eye, 
  CheckCircle,
  Calendar,
  Download,
  X
} from 'lucide-react';
import { formAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface AnalyticsData {
  totalViews: number;
  totalResponses: number;
  completionRate: number;
  averageCompletionTime: number;
  recentResponses: number;
  conversionTrend: Array<{ date: string; views: number; responses: number }>;
  fieldAnalytics: Array<{ fieldId: string; fieldLabel: string; completionRate: number; averageTime: number }>;
}

interface FormAnalyticsProps {
  formId: string;
  onClose: () => void;
}

const FormAnalytics: React.FC<FormAnalyticsProps> = ({ formId, onClose }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    loadAnalytics();
  }, [formId, timeRange]);

  const loadAnalytics = async () => {
    try {
      const response = await formAPI.getAnalytics(formId);
      
      // Simulate additional analytics data
      const mockData: AnalyticsData = {
        ...response.data,
        conversionTrend: [
          { date: '2024-01-01', views: 45, responses: 12 },
          { date: '2024-01-02', views: 52, responses: 18 },
          { date: '2024-01-03', views: 38, responses: 15 },
          { date: '2024-01-04', views: 61, responses: 22 },
          { date: '2024-01-05', views: 49, responses: 19 },
          { date: '2024-01-06', views: 55, responses: 25 },
          { date: '2024-01-07', views: 43, responses: 16 }
        ],
        fieldAnalytics: [
          { fieldId: '1', fieldLabel: 'Name', completionRate: 98, averageTime: 5 },
          { fieldId: '2', fieldLabel: 'Email', completionRate: 95, averageTime: 8 },
          { fieldId: '3', fieldLabel: 'Message', completionRate: 87, averageTime: 45 },
          { fieldId: '4', fieldLabel: 'Phone', completionRate: 72, averageTime: 12 }
        ]
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl border border-[#DDD5C7] shadow-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between border-b border-[#EDE5D8] pb-4">
            <div className="space-y-2">
              <div className="h-6 w-44 bg-[#ECE8E1] rounded-lg" />
              <div className="h-3.5 w-60 bg-[#ECE8E1] rounded" />
            </div>
            <div className="h-8 w-20 bg-[#ECE8E1] rounded-xl" />
          </div>

          {/* 4 Stat Cards Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl p-4 space-y-2">
                <div className="h-3.5 w-16 bg-[#ECE8E1] rounded" />
                <div className="h-6 w-20 bg-[#ECE8E1] rounded" />
                <div className="h-2.5 w-24 bg-[#ECE8E1] rounded" />
              </div>
            ))}
          </div>

          {/* Chart Placeholder Skeleton */}
          <div className="h-56 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl p-6 flex flex-col justify-between">
            <div className="h-4 w-32 bg-[#ECE8E1] rounded" />
            <div className="flex items-end justify-between gap-3 h-32 px-4">
              {[40, 65, 30, 80, 55, 90, 70].map((h, idx) => (
                <div key={idx} className="w-full bg-[#ECE8E1] rounded-t" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }: any) => (
    <div className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-[#2C2520] mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 bg-[#F5EFE6] rounded-xl flex items-center justify-center text-[#5C4A3E]">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center text-xs font-bold text-emerald-700">
          <TrendingUp className="w-3.5 h-3.5 mr-1" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={e => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="bg-white rounded-xl border border-[#DDD5C7] shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#FAF7F2] border-b border-[#EDE5D8] p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#F5EFE6] rounded-xl flex items-center justify-center text-[#5C4A3E]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2C2520]">Form Analytics</h2>
              <p className="text-xs text-[#786E64] font-medium">Detailed insights and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3.5 py-2 bg-white border border-[#E5DFD5] rounded-xl text-xs font-bold text-[#2C2520] outline-none focus:border-[#5C4A3E]"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-[#F5EFE6] rounded-xl text-slate-400 hover:text-[#2C2520] transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Eye}
              title="Total Views"
              value={analytics.totalViews.toLocaleString()}
              trend="+12% from last period"
            />
            <StatCard
              icon={Users}
              title="Total Responses"
              value={analytics.totalResponses.toLocaleString()}
              trend="+8% from last period"
            />
            <StatCard
              icon={CheckCircle}
              title="Completion Rate"
              value={`${analytics.completionRate.toFixed(1)}%`}
              subtitle="Views to submissions"
            />
            <StatCard
              icon={Clock}
              title="Avg. Completion Time"
              value={`${Math.round(analytics.averageCompletionTime)}s`}
              subtitle="Time to complete form"
            />
          </div>

          {/* Conversion Trend Chart */}
          <div className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-[#2C2520]">Conversion Trend</h3>
              <button 
                onClick={() => toast.success('Exporting trend data...')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-[#DDD5C7] text-xs font-bold text-slate-700 hover:bg-[#FAF7F2] rounded-xl transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#5C4A3E]" />
                <span>Export</span>
              </button>
            </div>
            
            <div className="h-64 flex items-end space-x-2">
              {analytics.conversionTrend.map((day, index) => {
                const maxViews = Math.max(...analytics.conversionTrend.map(d => d.views));
                const viewHeight = (day.views / maxViews) * 200;
                const responseHeight = (day.responses / maxViews) * 200;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex items-end space-x-1 mb-2">
                      <div
                        className="bg-[#DDD5C7] rounded-t"
                        style={{ height: `${viewHeight}px`, width: '50%' }}
                        title={`${day.views} views`}
                      />
                      <div
                        className="bg-[#5C4A3E] rounded-t"
                        style={{ height: `${responseHeight}px`, width: '50%' }}
                        title={`${day.responses} responses`}
                      />
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs font-semibold">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#DDD5C7] rounded"></div>
                <span className="text-slate-500">Views</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#5C4A3E] rounded"></div>
                <span className="text-[#2C2520]">Responses</span>
              </div>
            </div>
          </div>

          {/* Field Analytics */}
          <div className="bg-white border border-[#E5DFD5] rounded-xl p-6">
            <h3 className="text-base font-bold text-[#2C2520] mb-4">Field Performance</h3>
            
            <div className="space-y-3">
              {analytics.fieldAnalytics.map((field, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-bold text-[#2C2520] text-sm">{field.fieldLabel}</h4>
                    <div className="flex items-center space-x-4 mt-1.5 text-xs text-slate-500 font-medium">
                      <div className="flex items-center space-x-1 text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{field.completionRate}% completion</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{field.averageTime}s avg time</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-32">
                    <div className="w-full bg-[#E5DFD5] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#5C4A3E] h-2 rounded-full"
                        style={{ width: `${field.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAnalytics;