import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

import { ThemeProvider } from "@/context/ThemeContext";

import AppRoutes from "@/routes/AppRoutes";
import { AssistantProvider } from "@/components/assistant/AssistantProvider";
import AssistantButton from "@/components/assistant/AssistantButton";
import IsoAssistantPage from "@/pages/IsoAssistantPage";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AssistantProvider>
              <div className="min-h-screen bg-background text-foreground">
                <AppRoutes />
                <AssistantButton />
                <Toaster />
                <SonnerToaster position="top-right" richColors closeButton />
              </div>
            </AssistantProvider>
        </ThemeProvider>
      </BrowserRouter>
  );
}

export default App;
