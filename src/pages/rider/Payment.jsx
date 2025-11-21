import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rideDetails = location.state?.rideDetails;
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handlePayment = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
    setToast({
      show: true,
      message: 'Payment successful! Booking confirmed.',
      type: 'success',
    });
    
    setTimeout(() => {
      navigate('/rider/track-ride');
    }, 2000);
  };

  return (
    <div className="page-container flex flex-col">
      <Navbar userRole="rider" />
      
      <div className="flex flex-1">
        <Sidebar userRole="rider" />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Payment 💳
            </h1>
            <p className="text-muted-foreground mb-8">
              Complete your payment to confirm the booking
            </p>

            <div className="max-w-2xl">
              {/* Amount Summary */}
              <div className="dashboard-card mb-6">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ride Fare</span>
                    <span className="font-semibold text-foreground">
                      ₹{rideDetails?.fare || 25}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-semibold text-foreground">₹2</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="text-xl font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{(rideDetails?.fare || 25) + 2}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="dashboard-card mb-6">
                <h3 className="text-xl font-bold text-foreground mb-6">
                  Payment Method
                </h3>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ₹{
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">💳</div>
                        <p className="font-semibold text-foreground">Card</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ₹{
                        paymentMethod === 'upi'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">📱</div>
                        <p className="font-semibold text-foreground">UPI</p>
                      </div>
                    </button>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="123"
                            maxLength="3"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          placeholder="John Doe"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* UPI Payment Form */}
                  {paymentMethod === 'upi' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          required
                          className="input-field"
                          placeholder="yourname@upi"
                        />
                      </div>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Pay ₹{(rideDetails?.fare || 25) + 2}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Payment Successful! ✅"
      >
        <div className="text-center py-6">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-foreground font-semibold mb-2">
            Your booking has been confirmed!
          </p>
          <p className="text-muted-foreground text-sm">
            You can track your ride from the My Bookings page.
          </p>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Payment;
