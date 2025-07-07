import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
