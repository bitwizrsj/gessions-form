import React, { useState } from 'react';
import { Sparkles, Wand2, Send, Loader2, X, Bot, ArrowRight, Zap, Stars } from 'lucide-react';
import toast from 'react-hot-toast';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface AIFormBuilderProps {
  onFormGenerated: (form: any) => void;
  onClose: () => void;
}

const AIFormBuilder: React.FC<AIFormBuilderProps> = ({ onFormGenerated, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const generateForm = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe the form you want to create');
      return;
    }

    setGenerating(true);

    try {
      const generatedForm = await generateFormWithAI(prompt);
      onFormGenerated(generatedForm);
      toast.success('AI magic complete!');
    } catch (error) {
      console.error('AI form generation error:', error);
      toast.error('Failed to generate form. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generateFormWithAI = async (prompt: string) => {
    const systemPrompt = `You are a form builder AI. Generate a JSON form structure based on the user's description. 

  Return ONLY a valid JSON object with this structure:
  {
    "title": "Form Title",
    "description": "Form description",
    "fields": [
      {
        "type": "text|email|phone|textarea|select|radio|checkbox|date|file|rating",
        "label": "Field Label",
        "placeholder": "Placeholder text (optional)",
        "required": true|false,
        "options": ["option1", "option2"] // only for select, radio, checkbox
      }
    ]
  }

  Available field types: text, email, phone, textarea, select, radio, checkbox, date, file, rating
  Make the form practical and user-friendly based on the description.`;

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
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText || 'Bad Request'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      const formData = JSON.parse(jsonString);

      if (!formData.title || !formData.fields || !Array.isArray(formData.fields)) {
        throw new Error('Invalid form structure from AI');
      }

      const fieldsWithIds = formData.fields.map((field: any, index: number) => ({
        ...field,
        id: field.id || `field_${Date.now()}_${index}`
      }));

      return {
        ...formData,
        fields: fieldsWithIds,
        status: 'draft'
      };
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Failed to parse AI response');
    }
  };

  const suggestions = [
    { title: "Job Board", desc: "Recruitment form with resume upload", icon: Zap },
    { title: "Survey", desc: "Customer feedback with star ratings", icon: Stars },
    { title: "Event", desc: "Registration with dietary preferences", icon: Wand2 },
    { title: "Contact", desc: "Premium lead generation interface", icon: Bot }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-hidden flex flex-col border border-[#DDD5C7] animate-in fade-in zoom-in duration-300">
        
        {/* Header - Warm Neutral Theme */}
        <div className="p-8 bg-[#FAF7F2] border-b border-[#EDE5D8] relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5C4A3E] rounded-xl flex items-center justify-center shadow-lg shadow-[#5C4A3E]/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-[#2C2520] tracking-tight">AI Form Builder</h2>
                <p className="text-[#786E64] text-[13px] font-medium">Harness AI to build high-converting forms in seconds</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#DDD5C7] hover:bg-[#F5EFE6] text-slate-500 rounded-xl transition-all group shadow-xs"
            >
              <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex-1 overflow-y-auto space-y-8 bg-white" style={{ scrollbarWidth: 'none' }}>
          
          {/* Main Input Area */}
          <div className="space-y-4">
            <label className="text-[11px] font-black text-[#786E64] uppercase tracking-[0.2em] flex items-center gap-2">
              <Stars size={14} className="text-[#5C4A3E]" />
              Describe Your Vision
            </label>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a high-fidelity job application form with name, email, resume upload, and experience ratings..."
                className="w-full px-5 py-5 bg-[#FAF7F2] border-2 border-[#E5DFD5] rounded-xl text-[15px] font-medium focus:ring-4 focus:ring-[#5C4A3E]/10 focus:bg-white focus:border-[#5C4A3E] outline-none transition-all placeholder:text-slate-400 min-h-[160px] resize-none pb-16 text-[#2C2520]"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                 <span className="text-[11px] font-bold text-slate-400 mr-2 flex items-center gap-1">
                    <Zap size={10} className="text-[#5C4A3E]" /> Powered by Groq
                 </span>
                 <button
                    onClick={generateForm}
                    disabled={generating || !prompt.trim()}
                    className={`h-11 px-5 bg-[#5C4A3E] text-white rounded-xl text-[13.5px] font-black shadow-md shadow-[#5C4A3E]/20 hover:bg-[#483A30] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0`}
                  >
                    {generating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </button>
              </div>
            </div>
          </div>

          {/* Suggestions Grid */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-[#786E64] uppercase tracking-[0.2em]">Quick Samples</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                    <button
                        key={index}
                        onClick={() => setPrompt(`Create a ${suggestion.title.toLowerCase()} form: ${suggestion.desc}`)}
                        className="flex items-center gap-4 p-4 text-left bg-[#FAF7F2] hover:bg-[#F5EFE6] border border-[#E5DFD5] hover:border-[#5C4A3E]/30 rounded-xl transition-all group group-hover:-translate-y-0.5"
                    >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-xs text-slate-400 group-hover:text-[#5C4A3E] transition-colors border border-[#E5DFD5]">
                            <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-black text-[#2C2520] leading-tight mb-0.5">{suggestion.title}</p>
                            <p className="text-[12px] text-slate-400 font-medium truncate">{suggestion.desc}</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-[#5C4A3E] transition-colors" />
                    </button>
                );
              })}
            </div>
          </div>

          {/* Generating Overlay State (Visual Only if generating is true) */}
          {generating && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                <div className="relative mb-8">
                    <div className="w-20 h-20 bg-[#5C4A3E] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#5C4A3E]/20 animate-bounce">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h3 className="text-2xl font-black text-[#2C2520] mb-2">Architecting Your Form…</h3>
                <p className="text-slate-400 font-medium max-w-xs mb-8">Our AI is analyzing your description and mapping the fields for a perfect user experience.</p>
                <div className="w-full max-w-xs h-2 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E5DFD5]">
                    <div className="h-full bg-[#5C4A3E] w-1/3 rounded-full animate-[loading_2s_infinite_ease-in-out]" />
                </div>
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                `}} />
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-8 py-4 bg-[#FAF7F2] border-t border-[#EDE5D8] flex items-center justify-between">
           <span className="text-[11.5px] font-bold text-[#786E64]">Forms by Gessions AI</span>
           <button 
                onClick={onClose}
                className="text-[12px] font-bold text-slate-500 hover:text-[#2C2520] transition-colors"
           >
             Cancel Process
           </button>
        </div>
      </div>
    </div>
  );
};

export default AIFormBuilder;