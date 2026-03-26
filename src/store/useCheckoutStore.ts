import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';
import type { ShippingAddress } from '@/schemas';

type CheckoutStep = 'shipping' | 'payment' | 'review';

interface CheckoutState {
  // Current step
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];

  // Form data
  email: string;
  shippingAddress: ShippingAddress | null;
  billingAddress: ShippingAddress | null;
  sameAsShipping: boolean;
  paymentMethod: 'card' | 'paypal' | null;

  // Actions
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  markStepComplete: (step: CheckoutStep) => void;

  // Form updates
  setEmail: (email: string) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setBillingAddress: (address: ShippingAddress) => void;
  setSameAsShipping: (same: boolean) => void;
  setPaymentMethod: (method: 'card' | 'paypal') => void;

  // Reset
  resetCheckout: () => void;
}

const STEPS: CheckoutStep[] = ['shipping', 'payment', 'review'];

const initialState = {
  currentStep: 'shipping' as CheckoutStep,
  completedSteps: [] as CheckoutStep[],
  email: '',
  shippingAddress: null,
  billingAddress: null,
  sameAsShipping: true,
  paymentMethod: null,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const currentIndex = STEPS.indexOf(get().currentStep);
        if (currentIndex < STEPS.length - 1) {
          const nextStep = STEPS[currentIndex + 1];
          set({ currentStep: nextStep });
        }
      },

      previousStep: () => {
        const currentIndex = STEPS.indexOf(get().currentStep);
        if (currentIndex > 0) {
          const prevStep = STEPS[currentIndex - 1];
          set({ currentStep: prevStep });
        }
      },

      markStepComplete: (step) => {
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        }));
      },

      setEmail: (email) => set({ email }),

      setShippingAddress: (address) => {
        set({ shippingAddress: address });
        get().markStepComplete('shipping');
      },

      setBillingAddress: (address) => set({ billingAddress: address }),

      setSameAsShipping: (same) => {
        set({ sameAsShipping: same });
        if (same) {
          set({ billingAddress: get().shippingAddress });
        }
      },

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
        get().markStepComplete('payment');
      },

      resetCheckout: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.CHECKOUT,
    }
  )
);
