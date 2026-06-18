import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import QuizView from './views/QuizView';
import EventDetailView from './views/EventDetailView';
import DashboardView from './views/DashboardView';
import VaultView from './views/VaultView';
import AuthView from './views/AuthView';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-[#e8539e] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeView />} />
          <Route path="quiz" element={<QuizView />} />
          <Route path="event/:id" element={<EventDetailView />} />
          <Route path="events/:id" element={<EventDetailView />} />
          <Route path="dashboard" element={
            <ProtectedRoute><DashboardView /></ProtectedRoute>
          } />
          <Route path="vault" element={
            <ProtectedRoute><VaultView /></ProtectedRoute>
          } />
          <Route path="login" element={<AuthView />} />
          <Route path="register" element={<AuthView />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}
