import { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCreditCard, FaHandHoldingHeart, FaTimes } from 'react-icons/fa';

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

const Funding = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState(10);
  const [processing, setProcessing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const confirmedSessionRef = useRef(false);

  const fetchFundings = () => {
    api
      .get('/funding')
      .then((res) => setFundings(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFundings();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const canceled = params.get('canceled');

    if (canceled === 'true') {
      toast.error('Payment canceled');
      window.history.replaceState({}, '', '/funding');
      return;
    }

    if (!sessionId || confirmedSessionRef.current) return;

    confirmedSessionRef.current = true;
    setConfirming(true);

    api
      .post('/funding/confirm', { sessionId })
      .then(() => {
        toast.success('Thank you for your contribution!');
        fetchFundings();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Could not confirm payment');
      })
      .finally(() => {
        window.history.replaceState({}, '', '/funding');
        setConfirming(false);
      });
  }, []);

  const handlePay = async () => {
    if (!amount || amount < 1) {
      toast.error('Enter an amount of at least $1');
      return;
    }

    setProcessing(true);
    try {
      const { data } = await api.post('/funding/create-checkout-session', { amount });
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not start checkout');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start checkout');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewPayment = async (fundingId) => {
    if (!isAdmin) return;

    setDetailOpen(true);
    setDetailLoading(true);
    setPaymentDetail(null);

    try {
      const { data } = await api.get(`/funding/${fundingId}`);
      setPaymentDetail(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load payment details');
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const totalRaised = fundings.reduce((sum, item) => sum + (item.amount || 0), 0);

  if (loading || confirming) return <LoadingSpinner fullScreen />;

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
          onClick={() => setModalOpen(true)}
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

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Donor Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Funding Date</th>
                {isAdmin && (
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Details</th>
                )}
              </tr>
            </thead>
            <tbody>
              {fundings.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="text-center py-12 text-muted">
                    No funding records yet. Be the first to contribute.
                  </td>
                </tr>
              ) : (
                fundings.map((f) => (
                  <tr
                    key={f._id}
                    className={`border-b border-gray-50 dark:border-gray-800 ${
                      isAdmin ? 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50 cursor-pointer' : ''
                    }`}
                    onClick={() => isAdmin && handleViewPayment(f._id)}
                  >
                    <td className="py-3 px-4 font-medium dark:text-gray-100">{f.userName}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">${f.amount}</td>
                    <td className="py-3 px-4 text-muted">
                      {new Date(f.fundingDate).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPayment(f._id);
                          }}
                          className="text-primary font-semibold hover:underline"
                        >
                          View
                        </button>
                      </td>
                    )}
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
                <p className="text-sm text-muted mb-5">Choose an amount, then continue to Stripe checkout</p>

                <div className="mb-6">
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
                    onChange={(e) => setAmount(Number(e.target.value) || '')}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={processing || !amount || amount < 1}
                    className="flex-1 btn-primary py-2.5 inline-flex items-center justify-center gap-2"
                  >
                    <FaCreditCard />
                    {processing ? 'Redirecting...' : `Pay $${amount}`}
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-gray-400">
                  You will complete payment on Stripe&apos;s secure checkout page
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailOpen && isAdmin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setDetailOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-lg w-full shadow-xl border border-transparent dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading text-xl font-bold dark:text-gray-100">
                    Payment Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setDetailOpen(false)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FaTimes />
                  </button>
                </div>

                {detailLoading ? (
                  <LoadingSpinner />
                ) : paymentDetail ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                      <img
                        src={paymentDetail.donor?.avatar}
                        alt={paymentDetail.donor?.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {paymentDetail.donor?.name || paymentDetail.userName}
                        </p>
                        <p className="text-sm text-muted">{paymentDetail.donor?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                        <p className="text-gray-500 dark:text-gray-400">Amount</p>
                        <p className="font-bold text-green-600 text-lg">${paymentDetail.amount}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                        <p className="text-gray-500 dark:text-gray-400">Payment Status</p>
                        <p className="font-semibold capitalize dark:text-gray-100">
                          {paymentDetail.paymentStatus}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                        <p className="text-gray-500 dark:text-gray-400">Blood Group</p>
                        <p className="font-semibold dark:text-gray-100">
                          {paymentDetail.donor?.bloodGroup || '—'}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                        <p className="text-gray-500 dark:text-gray-400">Funding Date</p>
                        <p className="font-semibold dark:text-gray-100">
                          {new Date(paymentDetail.fundingDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 sm:col-span-2">
                        <p className="text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-semibold dark:text-gray-100">
                          {paymentDetail.donor?.district}, {paymentDetail.donor?.upazila}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 sm:col-span-2">
                        <p className="text-gray-500 dark:text-gray-400">Stripe Payment ID</p>
                        <p className="font-mono text-xs break-all dark:text-gray-200">
                          {paymentDetail.stripePaymentId || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Funding;
