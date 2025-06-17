import React, { createContext, useContext, useState } from 'react';
import IsoAssistant from './IsoAssistant';

// Context para gestionar el estado global del asistente
const AssistantContext = createContext();

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant debe usarse dentro de un AssistantProvider');
  }
  return context;
};

export const AssistantProvider = ({ children }) => {
  const [isAssistantVisible, setIsAssistantVisible] = useState(false);

  const showAssistant = () => setIsAssistantVisible(true);
  const hideAssistant = () => setIsAssistantVisible(false);
  const toggleAssistant = () => setIsAssistantVisible(prev => !prev);

  return (
    <AssistantContext.Provider value={{ showAssistant, hideAssistant, toggleAssistant }}>
      {children}
      {isAssistantVisible && <IsoAssistant onClose={hideAssistant} />}
    </AssistantContext.Provider>
  );
};

export default AssistantProvider;
