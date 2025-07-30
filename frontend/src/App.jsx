import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import WebRoutes from './routes/WebRoutes';
import useAuthStore from './store/authStore';
import { QueryProvider } from './hooks/useQueryClient.jsx';
import './index.css';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
                         <div className="App">
               <Routes>
                 {/* Rutas de la Web Pública */}
                 <Route path="/web/*" element={<WebRoutes />} />
                 
                 {/* Rutas de la Aplicación */}
                 <Route path="/app/*" element={<AppRoutes />} />
                 
                 {/* Redirección por defecto */}
                 <Route 
                   path="/" 
                   element={
                     isAuthenticated 
                       ? <Navigate to="/app/departamentos" replace /> 
                       : <Navigate to="/web" replace />
                   } 
                 />
                 
                 {/* Redirección de rutas antiguas */}
                 <Route path="/login" element={<Navigate to="/app/login" replace />} />
                 <Route path="/register" element={<Navigate to="/app/register" replace />} />
                 
                 {/* Catch all - redirigir a web si no está autenticado, a app si está autenticado */}
                 <Route 
                   path="*" 
                   element={
                     isAuthenticated 
                       ? <Navigate to="/app/departamentos" replace /> 
                       : <Navigate to="/web" replace />
                   } 
                 />
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
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
