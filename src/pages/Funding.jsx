import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaHandHoldingHeart, FaLock } from 'react-icons/fa';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const isStripeConfigured =
  Boolean(publishableKey) && !String(publishableKey).includes('placeholder');

const stripePromise = isStripeConfigured ? loadStripe(publishableKey) : null;

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1F2937',
      fontFamily: 'DM Sans, system-ui, sans-serif',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#DC2626' },
  },
  hidePostalCode: true,
};

const PaymentForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!amount || amount < 1) {
      toast.error('Enter an amount of at least $1');
      return;
    }

    setProcessing(true);
    try {
      const { data } = await api.post('/funding/create-payment-intent', { amount });
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        await api.post('/funding/confirm', {
          stripePaymentId: result.paymentIntent.id,
        });
        toast.success('Thank you for your contribution!');
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800">
        <CardElement options={cardElementOptions} />
      </div>
      <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <FaLock className="text-primary" />
        Secured by Stripe. Your card details never touch our servers.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:text-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 btn-primary py-2.5 inline-flex items-center justify-center gap-2"
        >
          <FaCreditCard />
          {processing ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

const Funding = () => {
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState(10);

  const fetchFundings = () => {
    api
      .get('/funding')
      .then((res) => setFundings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFundings();
  }, []);

  const totalRaised = fundings.reduce((sum, item) => sum + (item.amount || 0), 0);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-800 dark:text-gray-100">
            Funding
          </h1>
          <p className="text-muted mt-1">Support LifeLink with secure Stripe payments</p>
        </div>
        <button
          onClick={() => {
            if (!isStripeConfigured) {
              toast.error('Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY.');
              return;
            }
            setModalOpen(true);
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <FaHandHoldingHeart />
          Give Fund
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Raised</p>
          <p className="text-3xl font-bold text-primary mt-1">${totalRaised.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Contributions</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{fundings.length}</p>
        </div>
      </div>

      {!isStripeConfigured && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          Stripe keys are missing. Add <code className="font-semibold">VITE_STRIPE_PUBLISHABLE_KEY</code> in
          client/.env and <code className="font-semibold">STRIPE_SECRET_KEY</code> in server/.env, then restart both apps.
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Donor Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Funding Date</th>
              </tr>
            </thead>
            <tbody>
              {fundings.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-muted">
                    No funding records yet. Be the first to contribute.
                  </td>
                </tr>
              ) : (
                fundings.map((f) => (
                  <tr key={f._id} className="border-b border-gray-50 dark:border-gray-800">
                    <td className="py-3 px-4 font-medium dark:text-gray-100">{f.userName}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">${f.amount}</td>
                    <td className="py-3 px-4 text-muted">
                      {new Date(f.fundingDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && isStripeConfigured && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-transparent dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FaHandHoldingHeart className="text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold dark:text-gray-100">Give Fund</h3>
                </div>
                <p className="text-sm text-muted mb-5">Pay securely with Stripe (USD)</p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (USD)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_AMOUNTS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                          amount === preset
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-primary'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="input-field"
                  />
                </div>

                <Elements stripe={stripePromise}>
                  <PaymentForm
                    amount={amount}
                    onSuccess={fetchFundings}
                    onClose={() => setModalOpen(false)}
                  />
                </Elements>

                <p className="mt-4 text-center text-xs text-gray-400">
                  Test card: 4242 4242 4242 4242 · any future date · any CVC
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Funding;
