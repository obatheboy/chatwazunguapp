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
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);

  const reset = () => {
    setStep('options');
    setPhoneNumber('');
    setConfirmationCode('');
    setLoading(false);
    setPaymentStatus('idle');
    setCheckoutRequestId(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handlePay = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your M-Pesa phone number');
      return;
    }
    setLoading(true);
    setPaymentStatus('initiating');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/smartpay/initiate`,
        { profileId: profile._id, phoneNumber, amount: 99 }
      );
      if (response.data.success) {
        setCheckoutRequestId(response.data.checkoutRequestId);
        setPaymentStatus('pending');
        setLoading(false);
        toast.success('STK Push sent! Check your phone and enter PIN.');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
      setPaymentStatus('failed');
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
    if (checkoutRequestId && paymentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/payments/smartpay/status`,
            { checkoutRequestId }
          );

          const status = (response.data.status || '').toString().toLowerCase();
          const resultCode = response.data.resultCode;

          if (status === 'completed' || resultCode == 0) {
            clearInterval(interval);
            setPaymentStatus('completed');
            setLoading(false);
            toast.success('Payment successful! Profile unlocked!');
            if (onSuccess) onSuccess();
            setTimeout(() => {
              handleClose();
              window.location.href = `/chats?profileId=${profile._id}`;
            }, 1500);
          } else if (status === 'failed' || resultCode == 400 || resultCode == '400') {
            clearInterval(interval);
            setPaymentStatus('failed');
            setLoading(false);
            toast.error('Payment failed. Please try again.');
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [checkoutRequestId, paymentStatus, onSuccess, profile]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {step === 'options' && (
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/10 text-5xl mb-5 shadow-lg shadow-green-500/20">
              🔓
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Unlock {profile?.fullName || 'Profile'}
            </h3>
            <p className="text-[#E8D5A3] text-base sm:text-lg">
              Get full access and start chatting
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2A2522] to-[#1A1715] rounded-2xl p-5 sm:p-6 border border-[#C9A84C]/20 mb-6">
            <h4 className="text-[#C9A84C] font-semibold text-base sm:text-lg mb-4 text-center">What you get:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {[
                { icon: '💬', title: 'Instant Chat', desc: 'Start messaging now' },
                { icon: '👤', title: 'Full Profile', desc: 'Complete bio & details' },
                { icon: '💰', title: 'Earn KES 500', desc: 'Per unlock' },
              ].map((benefit, index) => (
                <div key={index} className="p-3">
                  <div className="text-3xl sm:text-4xl mb-2">{benefit.icon}</div>
                  <p className="text-white font-medium text-sm sm:text-base mb-1">{benefit.title}</p>
                  <p className="text-[#E8D5A3] text-xs sm:text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setStep('pay')}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#22C55E] text-white font-bold py-5 sm:py-6 rounded-xl transition-all duration-300 text-xl sm:text-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40"
            >
              <span className="text-3xl">💳</span>
              <span>Tap Here to Pay</span>
            </button>
            <button
              onClick={() => setStep('manual')}
              className="w-full text-[#E8D5A3] hover:text-white py-3 text-sm transition-colors"
            >
              Or use Manual Payment
            </button>
          </div>
        </div>
      )}

      {step === 'pay' && (
        <div className="p-6 sm:p-8">
          <button
            onClick={() => { setStep('options'); setPaymentStatus('idle'); setCheckoutRequestId(null); }}
            className="text-[#E8D5A3] hover:text-white text-sm mb-4 transition-colors"
          >
            ← Back
          </button>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#22C55E]/15 text-3xl mb-3">
              💳
            </div>
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">Pay KES 99 via M-Pesa</h3>
            <p className="text-[#E8D5A3] text-sm">Complete payment to unlock {profile?.fullName}</p>
          </div>
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
            onClick={handlePay}
            disabled={loading || paymentStatus === 'pending'}
            className="w-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#22C55E] text-white font-bold py-5 rounded-xl transition-all duration-300 text-xl shadow-lg shadow-green-500/30 disabled:opacity-50"
          >
            {loading ? '⏳ Processing...' : paymentStatus === 'pending' ? '⏳ Waiting for payment...' : 'Tap to Pay - KES 99'}
          </button>

          {paymentStatus === 'pending' && (
            <div className="text-center mt-5">
              <p className="text-[#E8D5A3] text-sm">
                ⏳ Waiting for payment confirmation...
              </p>
              <p className="text-[#E8D5A3]/60 text-xs mt-1">
                Please check your phone and enter M-Pesa PIN
              </p>
              <button
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      `${process.env.NEXT_PUBLIC_API_URL}/payments/smartpay/status`,
                      { checkoutRequestId }
                    );
                    const status = (response.data.status || '').toString().toLowerCase();
                    if (status === 'completed') {
                      setPaymentStatus('completed');
                      setLoading(false);
                      toast.success('Payment successful! Profile unlocked!');
                      if (onSuccess) onSuccess();
                      setTimeout(() => {
                        handleClose();
                        window.location.href = `/chats?profileId=${profile._id}`;
                      }, 1500);
                    } else if (status === 'failed') {
                      setPaymentStatus('failed');
                      setLoading(false);
                      toast.error('Payment failed. Please try again.');
                    } else {
                      toast.success('Payment still pending. Please complete on your phone.');
                    }
                  } catch (error) {
                    toast.error('Could not check status. Please wait...');
                  }
                }}
                className="mt-3 text-[#C9A84C] text-sm hover:text-white transition-colors"
              >
                Check Status
              </button>
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

      {step === 'manual' && (
        <div className="p-6 sm:p-8">
          <button
            onClick={() => setStep('options')}
            className="text-[#E8D5A3] hover:text-white text-sm mb-4 transition-colors"
          >
            ← Back
          </button>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9A84C]/15 text-3xl mb-3">
              📝
            </div>
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">Manual Payment</h3>
            <p className="text-[#E8D5A3] text-sm">Send KES 99 via M-Pesa</p>
          </div>

          <div className="bg-[#2A2522] rounded-2xl p-5 sm:p-6 border border-[#C9A84C]/20 mb-6">
            <p className="text-[#E8D5A3] mb-3 text-center">📱 Send KES 99 to:</p>
            <div className="space-y-2 text-center">
              <p className="text-white text-base sm:text-lg">
                Paybill: <span className="font-bold text-[#C9A84C]">0140834185</span>
              </p>
              <p className="text-white text-base sm:text-lg">
                Name: <span className="font-bold text-[#C9A84C]">OBADIAH OTOKI</span>
              </p>
            </div>
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
            className="w-full btn-primary py-4 rounded-xl text-base"
          >
            {loading ? 'Verifying...' : 'Submit Payment'}
          </button>
        </div>
      )}
    </Modal>
  );
}
