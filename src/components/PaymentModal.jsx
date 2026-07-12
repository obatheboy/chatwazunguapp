'use client';

import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { toast } from 'react-hot-toast';
import Modal from './Modal';

export default function PaymentModal({ isOpen, onClose, profile, onSuccess }) {
  const [step, setStep] = useState('options');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [transactionRequestId, setTransactionRequestId] = useState(null);

  const reset = () => {
    setStep('options');
    setPhoneNumber('');
    setConfirmationCode('');
    setLoading(false);
    setPaymentStatus('idle');
    setTransactionRequestId(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleMegaPay = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }
    setLoading(true);
    setPaymentStatus('initiating');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/megapay/initiate`,
        { profileId: profile._id, phoneNumber, amount: 99 }
      );
      if (response.data.success) {
        setTransactionRequestId(response.data.transactionRequestId);
        setPaymentStatus('pending');
        toast.success('STK Push sent! Check your phone and enter PIN.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
      setPaymentStatus('failed');
      setLoading(false);
    }
  };

  const handleMpesa = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/mpesa/initiate`,
        { profileId: profile._id, phoneNumber, amount: 99 }
      );
      if (response.data.success) {
        toast.success('M-Pesa STK Push sent! Check your phone.');
        if (onSuccess) onSuccess();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManual = async () => {
    if (!confirmationCode) {
      toast.error('Please enter your M-Pesa confirmation code');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/manual`,
        { profileId: profile._id, confirmationCode, phoneNumber }
      );
      if (response.data.success) {
        toast.success('Payment confirmed! Profile unlocked.');
        if (onSuccess) onSuccess();
        handleClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (transactionRequestId && paymentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/megapay/status`,
            { transactionRequestId }
          );

          if (response.data.status === 'Completed') {
            clearInterval(interval);
            setPaymentStatus('completed');
            setLoading(false);
            toast.success('🎉 Payment successful! Profile unlocked!');
            if (onSuccess) onSuccess();
            setTimeout(() => {
              handleClose();
              window.location.href = `/chats?profileId=${profile._id}`;
            }, 1500);
          } else if (response.data.status === 'Failed') {
            clearInterval(interval);
            setPaymentStatus('failed');
            setLoading(false);
            toast.error('❌ Payment failed. Please try again.');
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [transactionRequestId, paymentStatus, onSuccess, profile]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {step === 'options' && (
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#22C55E]/15 text-3xl mb-3">
              🔓
            </div>
            <h3 className="text-white font-bold text-xl">
              Unlock with KES 99 to start chatting
            </h3>
            {profile?.fullName && (
              <p className="text-[#E8D5A3] mt-1">Chat with {profile.fullName}</p>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setStep('megapay')}
              className="w-full flex items-center justify-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-3.5 rounded-xl transition-all duration-300"
            >
              📱 Pay via M-Pesa (MegaPay)
            </button>
            <button
              onClick={() => setStep('mpesa')}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-3.5 rounded-xl transition-all duration-300"
            >
              💳 Pay via M-Pesa (Daraja)
            </button>
            <button
              onClick={() => setStep('manual')}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-3.5 rounded-xl transition-all duration-300"
            >
              📝 Manual Payment
            </button>
            <button
              onClick={handleClose}
              className="w-full text-[#E8D5A3]/60 hover:text-white py-2 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {step === 'megapay' && (
        <div className="p-6">
          <button
            onClick={() => { setStep('options'); setPaymentStatus('idle'); setTransactionRequestId(null); }}
            className="text-[#E8D5A3] hover:text-white text-sm mb-3 transition-colors"
          >
            ← Back
          </button>
          <h3 className="text-white font-bold text-lg mb-4">Pay via M-Pesa (MegaPay)</h3>
          <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field mb-5"
            placeholder="0712345678"
            disabled={loading}
          />
          <button
            onClick={handleMegaPay}
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-xl"
          >
            {loading ? '⏳ Processing...' : 'Send STK Push - KES 99'}
          </button>

          {paymentStatus === 'pending' && (
            <div className="text-center mt-4">
              <p className="text-[#E8D5A3] text-sm">
                ⏳ Waiting for payment confirmation...
              </p>
              <p className="text-[#E8D5A3]/60 text-xs mt-1">
                Please check your phone and enter M-Pesa PIN
              </p>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <div className="text-center text-green-500 mt-4">
              ✅ Payment successful! Opening chat...
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center text-red-400 mt-4">
              ❌ Payment failed. Please try again.
            </div>
          )}
        </div>
      )}

      {step === 'mpesa' && (
        <div className="p-6">
          <button
            onClick={() => setStep('options')}
            className="text-[#E8D5A3] hover:text-white text-sm mb-3 transition-colors"
          >
            ← Back
          </button>
          <h3 className="text-white font-bold text-lg mb-4">Pay via M-Pesa</h3>
          <label className="block text-[#E8D5A3] text-sm font-medium mb-2">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field mb-5"
            placeholder="0712345678"
          />
          <button
            onClick={handleMpesa}
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-xl"
          >
            {loading ? 'Processing...' : 'Send STK Push - KES 99'}
          </button>
        </div>
      )}

      {step === 'manual' && (
        <div className="p-6">
          <button
            onClick={() => setStep('options')}
            className="text-[#E8D5A3] hover:text-white text-sm mb-3 transition-colors"
          >
            ← Back
          </button>
          <h3 className="text-white font-bold text-lg mb-4">Manual Payment</h3>

          <div className="bg-[#2A2522] rounded-xl p-4 border border-[#C9A84C]/20 mb-4">
            <p className="text-[#E8D5A3] mb-2">📱 Send KES 99 to:</p>
            <p className="text-white">
              Paybill: <span className="font-bold">0140834185</span>
            </p>
            <p className="text-white">
              Name: <span className="font-bold">OBADIAH OTOKI</span>
            </p>
          </div>

          <p className="text-[#E8D5A3] text-sm mb-2">
            After payment, enter your M-Pesa confirmation code below:
          </p>
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            className="input-field mb-5 uppercase"
            placeholder="e.g. QJ7X9K2Z1A"
          />
          <button
            onClick={handleManual}
            disabled={loading}
            className="w-full btn-primary py-3.5 rounded-xl"
          >
            {loading ? 'Verifying...' : 'Submit Payment'}
          </button>
        </div>
      )}
    </Modal>
  );
}
