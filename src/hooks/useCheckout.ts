import { useCheckoutStore } from '@/store';

export function useCheckout() {
  const {
    currentStep,
    completedSteps,
    email,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    paymentMethod,
    setStep,
    nextStep,
    previousStep,
    setEmail,
    setShippingAddress,
    setBillingAddress,
    setSameAsShipping,
    setPaymentMethod,
    resetCheckout,
  } = useCheckoutStore();

  const isStepComplete = (step: string) => completedSteps.includes(step as any);

  const canProceed = () => {
    switch (currentStep) {
      case 'shipping':
        return !!email && !!shippingAddress;
      case 'payment':
        return !!paymentMethod;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return {
    // State
    currentStep,
    completedSteps,
    email,
    shippingAddress,
    billingAddress,
    sameAsShipping,
    paymentMethod,

    // Computed
    isStepComplete,
    canProceed: canProceed(),

    // Actions
    setStep,
    nextStep,
    previousStep,
    setEmail,
    setShippingAddress,
    setBillingAddress,
    setSameAsShipping,
    setPaymentMethod,
    resetCheckout,
  };
}
