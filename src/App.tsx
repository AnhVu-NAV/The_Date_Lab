import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import QuizView from './views/QuizView';
import EventDetailView from './views/EventDetailView';
import DashboardView from './views/DashboardView';
import VaultView from './views/VaultView';
import AuthView from './views/AuthView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  return (
    <Routes>
      <Route path="/" element={
        <Layout
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          userRole={userRole}
          setUserRole={setUserRole}
        />
      }>
        <Route index element={<HomeView />} />
        <Route path="quiz" element={<QuizView />} />
        <Route path="event/:id" element={<EventDetailView />} />
        <Route path="dashboard" element={<DashboardView isAuthenticated={isAuthenticated} userRole={userRole} />} />
        <Route path="vault" element={<VaultView isAuthenticated={isAuthenticated} />} />
        <Route path="login" element={<AuthView setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="register" element={<AuthView setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
      </Route>
    </Routes>
  );
}
