import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  KeyRound, Eye, EyeOff, Sparkles, 
  CheckCircle2, ArrowRight, AlertCircle, 
  ArrowLeft, Lock
} from 'lucide-react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) return;
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await authAPI.resetPassword(token, password);
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to reset password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FAF7F2' }}>
      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#5C4A3E] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 12px rgba(92,74,62,0.25)' }}>
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#2C2520]">Forms by Gessions</span>
        </div>

        <div className="bg-white border border-[#DDD5C7] p-8 rounded-2xl shadow-xl" style={{ boxShadow: '0 10px 30px rgba(92,74,62,0.07)' }}>
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#F5EFE6] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#DDD5C7]">
                <CheckCircle2 size={32} className="text-[#5C4A3E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2C2520] mb-2">Password Updated!</h2>
              <p className="text-[#786E64] text-sm mb-8">
                Your password has been reset successfully. You will be redirected to the login page in a few seconds.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-[#5C4A3E] text-white font-bold rounded-xl hover:bg-[#483A30] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                Go to Login <ArrowRight size={18} />
              </button>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-200">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#2C2520] mb-2">Reset Link Expired</h2>
              <p className="text-[#786E64] text-sm mb-8">
                {error}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-[#F5EFE6] text-[#2C2520] font-bold rounded-xl hover:bg-[#EDE5D8] transition-all flex items-center justify-center gap-2 border border-[#DDD5C7]"
              >
                <ArrowLeft size={18} /> Back to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2C2520] mb-1.5">New Password</h2>
                <p className="text-[#786E64] text-xs">
                  Create a strong password to secure your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#786E64] mb-1.5 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-[#fafafa] border border-gray-200 rounded-xl outline-none text-[#2C2520] focus:border-[#5C4A3E] focus:bg-white focus:ring-1 focus:ring-[#5C4A3E] transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#786E64] mb-1.5 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-[#fafafa] border border-gray-200 rounded-xl outline-none text-[#2C2520] focus:border-[#5C4A3E] focus:bg-white focus:ring-1 focus:ring-[#5C4A3E] transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#5C4A3E] text-white font-bold rounded-xl hover:bg-[#483A30] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-[#5C4A3E]/20"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>Update Password <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
