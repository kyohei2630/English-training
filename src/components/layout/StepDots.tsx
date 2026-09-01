interface Step {
  key: string;
  label: string;
  done: boolean;
  active: boolean;
}

export default function StepDots({ steps }: { steps: Step[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm">
      {steps.map((step) => (
        <li key={step.key} className={`flex items-center gap-1.5 ${step.active ? 'font-bold' : ''}`}>
          <span aria-hidden="true">{step.done ? '●' : step.active ? '◐' : '○'}</span>
          <span className={step.done ? 'text-green-600 dark:text-green-400' : step.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>
            {step.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
