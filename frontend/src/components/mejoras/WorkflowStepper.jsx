import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

const steps = [
  { id: 'd1_iniciado', name: 'Iniciado' },
  { id: 'd2_accion_inmediata_programada', name: 'Acción Inmediata Planificada' },
  { id: 'd3_accion_inmediata_finalizada', name: 'Acción Inmediata Finalizada' },
  { id: 't1_pendiente_ac', name: 'Pendiente Acción Correctiva' },
  { id: 't2_cerrado', name: 'Cerrado' },
];

const statusOrder = {
  'd1_iniciado': 1,
  'd2_accion_inmediata_programada': 2,
  'd3_accion_inmediata_finalizada': 3,
  't1_pendiente_ac': 4,
  't2_cerrado': 5,
};

const WorkflowStepper = ({ currentStatus }) => {
  const currentStepIndex = statusOrder[currentStatus] || 0;

  // Handle both final states as 'completed'
  const isFinalState = currentStatus === 't1_pendiente_ac' || currentStatus === 't2_cerrado';

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => {
            // Determine step status
            const isCompleted = currentStepIndex > stepIdx + 1 || (isFinalState && (step.id === 't1_pendiente_ac' || step.id === 't2_cerrado'));
            const isCurrent = currentStepIndex === stepIdx + 1;

            return (
                <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className={`h-0.5 w-full ${isCompleted ? 'bg-teal-600' : 'bg-gray-200'}`} />
                    </div>
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-full">
                        {isCompleted ? (
                            <CheckCircle className="h-8 w-8 text-teal-600" />
                        ) : isCurrent ? (
                            <>
                                <span className="absolute h-9 w-9 rounded-full bg-teal-200 animate-ping" aria-hidden="true"></span>
                                <AlertCircle className="h-8 w-8 text-teal-600" />
                            </>
                        ) : (
                            <Circle className="h-8 w-8 text-gray-300" />
                        )}
                    </div>
                    <p className="text-center mt-2 text-sm font-medium ">
                        {step.name}
                    </p>
                </li>
            );
        })}
      </ol>
    </nav>
  );
};

export default WorkflowStepper;
