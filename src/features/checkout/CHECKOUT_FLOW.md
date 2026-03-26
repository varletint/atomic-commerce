# Checkout Flow Guide

## Multi-Step Checkout with Zustand

The checkout process is managed by `useCheckoutStore` with persistent state across page refreshes.

## Steps

1. **Shipping** - Email & shipping address
2. **Payment** - Payment method selection
3. **Review** - Order review & confirmation

## Store Structure

```tsx
{
  currentStep: 'shipping' | 'payment' | 'review',
  completedSteps: ['shipping'], // Tracks completed steps
  email: 'user@example.com',
  shippingAddress: { /* ... */ },
  billingAddress: { /* ... */ },
  sameAsShipping: true,
  paymentMethod: 'card' | 'paypal' | null,
}
```

## Usage Example

### Shipping Step

```tsx
import { useCheckout } from '@/hooks';
import { shippingAddressSchema } from '@/schemas';

function ShippingStep() {
  const { email, shippingAddress, setEmail, setShippingAddress, nextStep, canProceed } =
    useCheckout();

  const handleSubmit = (data: ShippingAddress) => {
    setEmail(data.email);
    setShippingAddress(data);
    nextStep(); // Automatically marks step complete
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={!canProceed}>
        Continue to Payment
      </button>
    </form>
  );
}
```

### Payment Step

```tsx
function PaymentStep() {
  const { paymentMethod, setPaymentMethod, nextStep, previousStep } = useCheckout();

  return (
    <div>
      <button onClick={() => setPaymentMethod('card')}>Credit Card</button>
      <button onClick={() => setPaymentMethod('paypal')}>PayPal</button>

      <button onClick={previousStep}>Back</button>
      <button onClick={nextStep} disabled={!paymentMethod}>
        Review Order
      </button>
    </div>
  );
}
```

### Review Step

```tsx
function ReviewStep() {
  const { email, shippingAddress, paymentMethod, previousStep, resetCheckout } = useCheckout();

  const { items, total } = useCart();
  const createOrder = useCreateOrder();

  const handlePlaceOrder = async () => {
    await createOrder.mutateAsync({
      email,
      shippingAddress,
      paymentMethod,
      items,
      total,
    });

    resetCheckout(); // Clear checkout state
    clearCart(); // Clear cart
  };

  return (
    <div>
      <h2>Review Your Order</h2>
      {/* Display order summary */}

      <button onClick={previousStep}>Back</button>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}
```

### Stepper Component

```tsx
import { CheckoutStepper } from '@/features/checkout';

function CheckoutPage() {
  const { currentStep } = useCheckout();

  return (
    <div>
      <CheckoutStepper />

      {currentStep === 'shipping' && <ShippingStep />}
      {currentStep === 'payment' && <PaymentStep />}
      {currentStep === 'review' && <ReviewStep />}
    </div>
  );
}
```

## Features

### ✅ Persistent State

Checkout data survives page refresh - users won't lose their progress.

### ✅ Step Validation

`canProceed()` checks if current step is complete before allowing navigation.

### ✅ Completed Steps Tracking

Users can navigate back to completed steps to edit information.

### ✅ Billing Address Toggle

`sameAsShipping` automatically copies shipping to billing address.

### ✅ Step Navigation

- `nextStep()` - Move forward
- `previousStep()` - Move backward
- `setStep(step)` - Jump to specific step (if completed)

## Integration with Cart

```tsx
import { useCart, useCheckout } from '@/hooks';

function CheckoutPage() {
  const { items, total } = useCart();
  const { resetCheckout } = useCheckout();

  // Redirect if cart is empty
  if (items.length === 0) {
    return <Navigate to="/cart" />;
  }

  return <CheckoutFlow />;
}
```

## Order Submission

```tsx
import { useMutation } from '@tanstack/react-query';
import { useCart, useCheckout } from '@/hooks';

function useCreateOrder() {
  const { clearCart } = useCart();
  const { resetCheckout } = useCheckout();

  return useMutation({
    mutationFn: (orderData) => api.post('/orders', orderData),
    onSuccess: () => {
      clearCart();
      resetCheckout();
      // Navigate to success page
    },
  });
}
```

## Best Practices

1. **Validate each step** before allowing progression
2. **Persist sensitive data carefully** - don't store payment details
3. **Clear checkout state** after successful order
4. **Handle errors gracefully** - show validation messages
5. **Allow editing** - users should be able to go back and change info
