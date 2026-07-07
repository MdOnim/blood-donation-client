import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

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
          amount,
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
      <div className="p-4 border border-gray-200 rounded-xl">
        <CardElement
          options={{
            style: {
              base: { fontSize: '16px', color: '#1F2937', '::placeholder': { color: '#9CA3AF' } },
            },
          }}
        />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:text-gray-200">
          Cancel
        </button>
        <button type="submit" disabled={!stripe || processing} className="flex-1 btn-primary py-2">
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

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-800">Funding</h1>
          <p className="text-muted mt-1">Support our blood donation organization</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          Give Fund
        </button>
      </div>

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
                  <td colSpan={3} className="text-center py-12 text-muted">No funding records yet.</td>
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
        {modalOpen && (
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
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-transparent dark:border-gray-700">
                <h3 className="font-heading text-xl font-bold mb-4 dark:text-gray-100">Give Fund</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (USD)</label>
                  <input
                    type="number"
                    min="1"
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Funding;
