import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { SEO } from '@/components/SEO';
// import { RegisterForm } from '../components/RegisterForm';
import { RegisterFormMultiStep } from '../components/RegisterFormMultiStep';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SEO title="Register" description="Create your Atomic Order account." />
      <div className="w-full max-w-4xl bg-white  md:p-12 ">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Join Atomic Order</h1>
          <p className="text-gray-500">Create your account to start shopping our collection.</p>
        </div>

        <RegisterFormMultiStep />

        <div className="mt-8 text-center text-sm text-gray-500 border-t pt-6">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="text-black font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
