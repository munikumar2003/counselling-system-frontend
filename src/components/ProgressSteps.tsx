import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Step {
  title: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
}

export default function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
              step.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : step.current
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'border-gray-300 text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </div>
            <span className={`text-xs mt-2 text-center max-w-20 ${
              step.completed || step.current ? 'text-gray-900 font-medium' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 ${
              steps[index + 1].completed ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}