import {
  FaUserFriends,
  FaRupeeSign,
  FaHandshake,
  FaChartLine,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const steps = [
  {
    icon: <FaUserFriends className="text-white text-xl" />,
    title: "Create Groups & Add Members",
    description:
      "Easily create groups for trips, roommates, or any shared expenses. Invite friends and manage everything in one place.",
  },
  {
    icon: <FaRupeeSign className="text-white text-xl" />,
    title: "Add & Track Expenses",
    description:
      "Add expenses as they happen and split them among group members. Keep track of who paid what, effortlessly.",
  },
  {
    icon: <FaHandshake className="text-white text-xl" />,
    title: "Settle Up with One Click",
    description:
      "View clear summaries of what you owe or are owed. Settle balances securely through simple, direct payments.",
  },
  {
    icon: <FaChartLine className="text-white text-xl" />,
    title: "View Your Spending Insights",
    description:
      "Analyze your spending patterns with group-wise and category-wise breakdowns, powered by insightful charts.",
  },
  {
    icon: <FaShieldAlt className="text-white text-xl" />,
    title: "Secure & Verified Accounts",
    description:
      "We ensure your data is safe with OTP-based verification and encrypted access, keeping your finances private.",
  },
];

const FeatureCard = ({ step, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1, duration: 0.6 },
      });
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      className="bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-lg border border-white/20 rounded-[30px] shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2 group"
    >
      <div className="flex items-start gap-4">
        <div className="p-4 bg-gradient-to-br from-[#3FB984] to-[#81E6D9] rounded-full shadow-md">
          {step.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#1B1C1E] dark:text-white font-[Poppins]">
            {step.title}
          </h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Features = () => {
  return (
    <div className="min-h-screen relative overflow-hidden font-[Poppins] text-[#1B1C1E] dark:text-white bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E]">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-[Poppins] mb-4">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3FB984] to-[#81E6D9]">
              Udhaari.com
            </span>{" "}
            Works
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Udhaari.com helps you manage group expenses effortlessly. Here's how you can get started:
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <FeatureCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-gradient-to-br from-white/30 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-lg p-10 rounded-[30px] border border-white/20 shadow-lg"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Start managing your expenses smarter
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Log in, create your first group, and experience seamless expense sharing today.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center px-7 py-3 bg-gradient-to-r from-[#3FB984] to-[#81E6D9] text-white rounded-xl font-medium hover:scale-105 transition-all duration-300 shadow-md"
          >
            Go to Dashboard
            <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
