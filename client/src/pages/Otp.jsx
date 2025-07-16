import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axiosInstance";
import { FaLock, FaEnvelope, FaRedo } from 'react-icons/fa';

const Otp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState({ text: '', type: '' });
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setMessage({ text: 'Please enter your email', type: 'error' });
      return;
    }
    try {
      await axios.post(`/send-reset-otp?email=${email}`);
      setTimer(60);
      setMessage({ text: 'OTP sent successfully! Check your email.', type: 'success' });
    } catch (err) {
      console.log(err);
      setMessage({ text: 'Failed to send OTP. Please try again.', type: 'error' });
    }
  };

  const handleVerifyAndReset = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6 || !password || !email) {
      setMessage({ text: 'Please fill all fields correctly', type: 'error' });
      return;
    }

    try {
      await axios.post('/reset-password', {
        email,
        otp: enteredOtp,
        password: password,
      });
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      navigate('/login');
    } catch (err) {
      console.log(err);
      setMessage({ text: 'Failed to reset password. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E] font-[DM Sans] overflow-hidden flex items-center justify-center px-4 relative text-[#1B1C1E] dark:text-white">
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#10b95c] to-[#28b17f] p-6 text-white rounded-t-3xl">
            <h2 className="text-2xl font-bold font-[Poppins]">Reset Password</h2>
            <p className="opacity-90">Secure your account with a new password</p>
          </div>

          {/* Form Body */}
          <div className="p-6">
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                  message.type === 'error'
                    ? 'bg-red-100/50 text-red-800 border-l-4 border-red-500'
                    : 'bg-green-100/50 text-green-800 border-l-4 border-green-500'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#10B981] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={timer > 0}
              className={`w-full mb-6 py-2 px-4 rounded-xl flex items-center justify-center transition-all font-medium ${
                timer > 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#10b95c] to-[#34D399] text-white hover:shadow-md'
              }`}
            >
              <FaRedo className="mr-2" />
              {timer > 0 ? `Resend OTP in ${timer}s` : 'Send OTP'}
            </button>

            {/* OTP Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Enter OTP</label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#10B981] bg-white/70 dark:bg-[#2A2A2E] focus:outline-none"
                  />
                ))}
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#10B981] bg-white/70 dark:bg-[#2A2A2E] text-sm focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleVerifyAndReset}
              className="w-full bg-gradient-to-r from-[#10b95c] to-[#34D399] text-white py-3 px-4 rounded-xl hover:shadow-md transition-all font-semibold"
            >
              Verify & Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
