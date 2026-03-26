import { useCheckout } from '@/hooks';

const STEPS = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export function CheckoutStepper() {
  const { currentStep, isStepComplete, setStep } = useCheckout();

  return (
    <div className="checkout-stepper">
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isComplete = isStepComplete(step.id);
        const isClickable = isComplete || isActive;

        return (
          <div
            key={step.id}
            className={`step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
            onClick={() => isClickable && setStep(step.id as any)}
          >
            <div className="step-number">{isComplete ? '✓' : index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        );
      })}
    </div>
  );
}
