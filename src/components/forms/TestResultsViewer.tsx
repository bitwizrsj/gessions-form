import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Award, Clock, User, BarChart3 } from 'lucide-react';

interface TestResult {
  questionId: string;
  questionText: string;
  userAnswers: string[];
  correctAnswers: string[];
  isCorrect: boolean;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
}

interface TestResultsViewerProps {
  formId: string;
  responses: any[];
  form: any;
  onClose: () => void;
}

const TestResultsViewer: React.FC<TestResultsViewerProps> = ({
  formId,
  responses,
  form,
  onClose
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    calculateTestResults();
  }, [responses, form]);

  const calculateTestResults = () => {
    if (!form || !responses.length) return;

    const questionFields = form.fields.filter((field: any) => field.type === 'question');
    const results: TestResult[] = [];
    let correctCount = 0;

    questionFields.forEach((field: any) => {
      const response = responses.find(r => r.fieldId === field.id);
      const userAnswers = response?.value || [];
      const correctAnswers = (field.questionOptions || [])
        .filter((option: any) => option.isCorrect)
        .map((option: any) => option.id);

      const isCorrect = 
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((answer: string) => correctAnswers.includes(answer));

      if (isCorrect) correctCount++;

      results.push({
        questionId: field.id,
        questionText: field.questionText || field.label,
        userAnswers,
        correctAnswers,
        isCorrect,
        options: field.questionOptions || []
      });
    });

    setTestResults(results);
    setOverallScore(questionFields.length > 0 ? (correctCount / questionFields.length) * 100 : 0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-[#DDD5C7] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-[#EDE5D8] bg-[#FAF7F2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#F5EFE6] rounded-xl flex items-center justify-center text-[#5C4A3E]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#2C2520]">Test Results</h2>
                <p className="text-xs text-[#786E64] font-medium mt-0.5">{form?.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5EFE6] rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {/* Overall Score */}
          <div className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-black mb-2 ${getScoreColor(overallScore)}`}>
                {Math.round(overallScore)}%
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor(overallScore)}`}>
                {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
              <div className="mt-3 text-xs font-semibold text-slate-500">
                {testResults.filter(r => r.isCorrect).length} out of {testResults.length} questions correct
              </div>
            </div>
          </div>

          {/* Question Results */}
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={result.questionId} className="border border-[#E5DFD5] rounded-xl p-5 bg-[#FAF7F2]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2C2520] text-sm mb-1">
                      Question {index + 1}: {result.questionText}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.isCorrect ? (
                      <div className="flex items-center space-x-1 text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-rose-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-bold">Incorrect</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {result.options.map((option) => {
                    const isUserSelected = result.userAnswers.includes(option.id);
                    const isCorrectAnswer = option.isCorrect;
                    
                    let optionClass = 'p-3 border rounded-xl text-xs font-medium ';
                    
                    if (isCorrectAnswer && isUserSelected) {
                      optionClass += 'bg-emerald-50 border-emerald-300 text-emerald-900';
                    } else if (isCorrectAnswer) {
                      optionClass += 'bg-emerald-50 border-emerald-300 text-emerald-900';
                    } else if (isUserSelected) {
                      optionClass += 'bg-rose-50 border-rose-300 text-rose-900';
                    } else {
                      optionClass += 'bg-white border-[#E5DFD5] text-slate-700';
                    }

                    return (
                      <div key={option.id} className={optionClass}>
                        <div className="flex items-center justify-between">
                          <span>{option.text}</span>
                          <div className="flex items-center space-x-2">
                            {isUserSelected && (
                              <span className="text-[10px] bg-[#F5EFE6] text-[#5C4A3E] px-2 py-0.5 rounded-full font-bold">
                                Your Answer
                              </span>
                            )}
                            {isCorrectAnswer && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                Correct
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-emerald-600">
                {testResults.filter(r => r.isCorrect).length}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1">Correct Answers</div>
            </div>
            
            <div className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-rose-600">
                {testResults.filter(r => !r.isCorrect).length}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1">Incorrect Answers</div>
            </div>
            
            <div className="bg-[#FAF7F2] border border-[#E5DFD5] rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-[#2C2520]">
                {testResults.length}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-1">Total Questions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultsViewer;