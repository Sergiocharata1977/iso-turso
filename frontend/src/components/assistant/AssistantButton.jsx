import React from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useAssistant } from './AssistantProvider';

const AssistantButton = () => {
  const { toggleAssistant } = useAssistant();

  return (
    <Button
      onClick={toggleAssistant}
      variant="outline"
      size="icon"
      className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      title="Asistente ISO"
    >
      <HelpCircle size={20} />
    </Button>
  );
};

export default AssistantButton;
