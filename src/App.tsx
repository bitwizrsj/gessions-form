import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';


import FormRenderer from './components/forms/FormRenderer';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import EnhancedGESSIONSFormsApp from './components/forms/EnhancedOorbFormsApp';
import AIChatInterface from './components/chat/AIChatInterface';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import AcceptInvitation from './components/forms/AcceptInvitation';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import LandingPage from './components/landing/LandingPage';
import DocumentationPage from './components/landing/DocumentationPage';

/* ── Route-Specific Skeletons ── */
const SidebarSkeleton: React.FC = () => (
  <aside className="w-[240px] h-screen border-r border-[#ECE8E1] bg-[#FAF7F2] p-3.5 flex flex-col shrink-0 hidden md:flex select-none">
    <div className="h-[52px] flex items-center gap-2.5 px-2.5 border-b border-[#ECE8E1] mb-3">
      <div className="w-6 h-6 rounded-md bg-[#ECE8E1]" />
      <div className="h-4 w-32 bg-[#ECE8E1] rounded" />
    </div>
    <div className="h-12 bg-[#F5F1EA] border border-[#E5DFD5] rounded-xl mb-4 p-2.5 flex items-center gap-2.5">
      <div className="w-7 h-7 bg-white border border-[#E2DBD0] rounded-lg shrink-0" />
      <div className="space-y-1 flex-1">
        <div className="h-3 bg-[#ECE8E1] rounded w-20" />
        <div className="h-2 bg-[#ECE8E1] rounded w-14" />
      </div>
    </div>
    <div className="space-y-1 flex-1">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div className="w-4 h-4 bg-[#ECE8E1] rounded" />
          <div className="h-3.5 bg-[#ECE8E1] rounded w-24" />
        </div>
      ))}
    </div>
    <div className="h-28 rounded-2xl bg-[#ECE8E1]/70 p-4 space-y-2">
      <div className="h-3.5 w-24 bg-[#E5DFD5] rounded" />
      <div className="h-2.5 w-36 bg-[#E5DFD5] rounded" />
      <div className="h-7 w-full bg-white/70 rounded-lg mt-2" />
    </div>
  </aside>
);

const AIChatSkeleton: React.FC = () => (
  <div className="h-screen flex bg-[#FAF7F2] overflow-hidden select-none animate-pulse">
    <SidebarSkeleton />
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <header className="h-[68px] px-8 flex items-center justify-end gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE4DC]" />
        <div className="w-8 h-8 rounded-full bg-[#EAE4DC]" />
      </header>
      <main className="flex-1 overflow-y-auto px-6 py-10 max-w-4xl mx-auto w-full flex flex-col items-center">
        <div className="h-8 w-44 rounded-full bg-white border border-[#EAE4DC] mb-5" />
        <div className="h-12 w-80 bg-[#E5DFD5] rounded-xl mb-3" />
        <div className="h-4 w-96 bg-[#EAE4DC] rounded mb-8" />
        <div className="w-full max-w-2xl h-14 bg-white rounded-2xl border border-[#DDD5C7] p-2 flex items-center justify-between shadow-xs mb-10">
          <div className="flex items-center gap-3 pl-3 flex-1">
            <div className="w-5 h-5 rounded bg-[#EAE4DC]" />
            <div className="h-4 w-60 bg-[#EAE4DC] rounded" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#DDD5C7]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl p-6 bg-white border border-[#EAE4DC] min-h-[160px] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[#F5EFE6]" />
                <div className="h-4 w-28 bg-[#EAE4DC] rounded" />
                <div className="h-3 w-36 bg-[#EAE4DC] rounded" />
              </div>
              <div className="h-3 w-16 bg-[#EAE4DC] rounded" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-32 rounded-full bg-white border border-[#EAE4DC]" />
          ))}
        </div>
      </main>
    </div>
  </div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="min-h-screen flex bg-[#FAF7F2] overflow-hidden select-none animate-pulse">
    <SidebarSkeleton />
    <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
      <header className="h-[68px] px-8 border-b border-[#ECE8E1] flex items-center justify-between shrink-0">
        <div className="h-9 w-72 bg-white border border-[#E5DFD5] rounded-xl" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DFD5]" />
          <div className="w-8 h-8 rounded-full bg-[#ECE8E1]" />
        </div>
      </header>
      <main className="flex-1 px-8 pb-10 space-y-6 overflow-y-auto">
        <div className="flex items-start justify-between gap-4 pt-2">
          <div className="space-y-2">
            <div className="h-9 w-32 bg-[#ECE8E1] rounded-lg" />
            <div className="h-4 w-96 bg-[#ECE8E1] rounded" />
          </div>
          <div className="h-10 w-36 bg-[#ECE8E1] rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#ECE8E1] rounded-2xl p-5 flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-16 bg-[#ECE8E1] rounded-md" />
                  <div className="h-4 w-12 bg-[#ECE8E1] rounded-full" />
                </div>
                <div className="h-3.5 w-24 bg-[#ECE8E1] rounded" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#ECE8E1]" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-6 border-b border-[#ECE8E1] pt-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-5 w-20 bg-[#ECE8E1] rounded mb-3" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5 items-start">
          <div className="bg-white border border-[#ECE8E1] rounded-2xl p-4 space-y-3">
            <div className="h-4 w-20 bg-[#ECE8E1] rounded" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-[#FAF7F2] rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-white border border-[#ECE8E1] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[#ECE8E1] flex items-center justify-between">
              <div className="h-8 w-60 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl" />
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-white border border-[#E5DFD5] rounded-xl" />
                <div className="h-8 w-20 bg-white border border-[#E5DFD5] rounded-xl" />
              </div>
            </div>
            <div className="divide-y divide-[#ECE8E1]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-[#ECE8E1] rounded" />
                    <div className="w-8 h-8 rounded-lg bg-[#ECE8E1]" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-40 bg-[#ECE8E1] rounded" />
                      <div className="h-2.5 w-24 bg-[#ECE8E1] rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-20 bg-[#ECE8E1] rounded" />
                  <div className="h-5 w-16 bg-[#ECE8E1] rounded-full" />
                  <div className="h-4 w-12 bg-[#ECE8E1] rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);

const BuilderSkeleton: React.FC = () => (
  <div className="flex h-screen bg-[#FAF7F2] overflow-hidden select-none animate-pulse">
    <SidebarSkeleton />
    <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-hidden">
      <header className="h-[60px] px-6 bg-white border-b border-[#ECE8E1] flex items-center justify-between shrink-0">
        <div className="h-5 w-28 bg-[#ECE8E1] rounded" />
        <div className="flex items-center gap-4">
          <div className="h-7 w-60 bg-[#FAF7F2] border border-[#E5DFD5] rounded-xl" />
          <div className="w-7 h-7 rounded-xl bg-[#FAF7F2]" />
          <div className="w-7 h-7 rounded-full bg-[#ECE8E1]" />
        </div>
      </header>
      <div className="px-6 py-3.5 bg-[#FAF7F2] border-b border-[#ECE8E1] flex items-center justify-between shrink-0">
        <div className="space-y-1.5">
          <div className="h-6 w-52 bg-[#ECE8E1] rounded-lg" />
          <div className="h-3 w-72 bg-[#ECE8E1] rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-20 bg-white border border-[#E5DFD5] rounded-xl" />
          <div className="h-8 w-24 bg-white border border-[#E5DFD5] rounded-xl" />
          <div className="h-8 w-28 bg-[#ECE8E1] rounded-xl" />
        </div>
      </div>
      <div className="px-6 h-10 bg-[#FAF7F2] border-b border-[#ECE8E1] flex items-center gap-6 shrink-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-16 bg-[#ECE8E1] rounded" />
        ))}
      </div>
      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="w-[280px] bg-white border-r border-[#ECE8E1] p-4 space-y-4 shrink-0 hidden md:block">
          <div className="h-4 w-24 bg-[#ECE8E1] rounded" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-[#FAF8F5] border border-[#ECE8E1] rounded-xl" />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[#FAF8F5] p-8 overflow-y-auto">
          <div className="max-w-[620px] mx-auto bg-white border border-[#ECE8E1] rounded-2xl p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-[#ECE8E1] rounded-lg" />
              <div className="h-4 w-72 bg-[#ECE8E1] rounded" />
            </div>
            <div className="space-y-4 pt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-[#ECE8E1] rounded-xl space-y-2 bg-[#FAF8F5]/60">
                  <div className="h-4 w-32 bg-[#ECE8E1] rounded" />
                  <div className="h-9 w-full bg-white border border-[#E5DFD5] rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-[300px] bg-white border-l border-[#ECE8E1] p-4 space-y-4 shrink-0 hidden lg:block">
          <div className="h-5 w-28 bg-[#ECE8E1] rounded" />
          <div className="space-y-3 pt-2">
            <div className="h-3.5 w-16 bg-[#ECE8E1] rounded" />
            <div className="h-8 w-full bg-[#FAF8F5] border border-[#ECE8E1] rounded-xl" />
            <div className="h-3.5 w-20 bg-[#ECE8E1] rounded mt-4" />
            <div className="h-8 w-full bg-[#FAF8F5] border border-[#ECE8E1] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AuthPageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 animate-pulse">
    <div className="w-full max-w-md bg-white border border-[#ECE8E1] rounded-2xl p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#ECE8E1]" />
        <div className="h-5 w-36 bg-[#ECE8E1] rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-7 w-48 bg-[#ECE8E1] rounded-lg" />
        <div className="h-4 w-64 bg-[#ECE8E1] rounded" />
      </div>
      <div className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <div className="h-3.5 w-16 bg-[#ECE8E1] rounded" />
          <div className="h-10 w-full bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3.5 w-16 bg-[#ECE8E1] rounded" />
          <div className="h-10 w-full bg-[#FAF8F5] border border-[#E5DFD5] rounded-xl" />
        </div>
        <div className="h-11 w-full bg-[#ECE8E1] rounded-xl" />
      </div>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    if (location.pathname.startsWith('/ai-chat')) {
      return <AIChatSkeleton />;
    }
    if (location.pathname.startsWith('/forms/') || location.pathname === '/forms/new') {
      return <BuilderSkeleton />;
    }
    return <DashboardSkeleton />;
  }

  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthPageSkeleton />;
  }

  if (user) {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      console.log('User authenticated, redirecting to returnUrl:', returnUrl);
      localStorage.removeItem('returnUrl');
      return <Navigate to={returnUrl} replace />;
    }
    console.log('User already authenticated, redirecting to AI Chat');
    return <Navigate to="/ai-chat" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />
        <Route path="/form/:shareUrl" element={<FormRenderer />} />
        <Route path="/collab/accept/:token" element={
          <ProtectedRoute>
            <AcceptInvitation />
          </ProtectedRoute>
        } />

        <Route path="/forms-by-gessions" element={
          <ProtectedRoute>
            <EnhancedGESSIONSFormsApp />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <EnhancedGESSIONSFormsApp />
          </ProtectedRoute>
        } />
        <Route path="/forms" element={
          <ProtectedRoute>
            <EnhancedGESSIONSFormsApp />
          </ProtectedRoute>
        } />
        <Route path="/forms/:formId/edit" element={
          <ProtectedRoute>
            <EnhancedGESSIONSFormsApp />
          </ProtectedRoute>
        } />
        <Route path="/forms/new" element={
          <ProtectedRoute>
            <EnhancedGESSIONSFormsApp />
          </ProtectedRoute>
        } />
        <Route path="/oorb-forms" element={<Navigate to="/dashboard" replace />} />

        <Route path="/ai-chat" element={
          <ProtectedRoute>
            <AIChatInterface />
          </ProtectedRoute>
        } />

        <Route path="/superadmin" element={
          <ProtectedRoute>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />

        {/* Default route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;