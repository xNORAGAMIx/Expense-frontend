import { useState, useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
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
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
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
    <div className="min-h-screen bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] flex items-center justify-center p-4 font-[DM Sans]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] p-6 text-white">
          <h2 className="text-2xl font-bold font-[Poppins]">Reset Password</h2>
          <p className="opacity-90">Secure your account with a new password</p>
        </div>

        <div className="p-6">
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700 border-l-4 border-red-500' : 'bg-green-50 text-green-700 border-l-4 border-green-500'}`}>
              {message.text}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleSendOtp}
            disabled={timer > 0}
            className={`w-full mb-6 py-2 px-4 rounded-lg flex items-center justify-center ${
              timer > 0 
                ? 'bg-gray-300 text-gray-500' 
                : 'bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white hover:shadow-md'
            } transition-all`}
          >
            <FaRedo className="mr-2" />
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Send OTP'}
          </button>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
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
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7F56D9]"
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleVerifyAndReset}
            className="w-full bg-gradient-to-r from-[#10B981] to-[#34D399] text-white py-3 px-4 rounded-lg hover:shadow-md transition-all font-medium"
          >
            Verify & Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;