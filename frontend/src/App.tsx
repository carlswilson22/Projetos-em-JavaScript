
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';
import { AppLayout } from './components/AppLayout';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <TransactionProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Auth />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="relatorios" element={<Reports />} />
                <Route path="historico" element={<History />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TransactionProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
