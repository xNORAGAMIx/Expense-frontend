import { FaUserFriends, FaRupeeSign, FaHandshake, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const steps = [
  {
    icon: <FaUserFriends className="text-[#7F56D9] text-2xl" />,
    title: "Create Groups & Add Members",
    description: "Easily create groups for trips, roommates, or any shared expenses. Invite friends and manage everything in one place.",
  },
  {
    icon: <FaRupeeSign className="text-[#9333EA] text-2xl" />,
    title: "Add & Track Expenses",
    description: "Add expenses as they happen and split them among group members. Keep track of who paid what, effortlessly.",
  },
  {
    icon: <FaHandshake className="text-[#10B981] text-2xl" />,
    title: "Settle Up with One Click",
    description: "View clear summaries of what you owe or are owed. Settle balances securely through simple, direct payments.",
  },
  {
    icon: <FaChartLine className="text-[#F59E0B] text-2xl" />,
    title: "View Your Spending Insights",
    description: "Analyze your spending patterns with group-wise and category-wise breakdowns, powered by insightful charts.",
  },
  {
    icon: <FaShieldAlt className="text-[#EF4444] text-2xl" />,
    title: "Secure & Verified Accounts",
    description: "We ensure your data is safe with OTP-based verification and encrypted access, keeping your finances private.",
  }
];

const Features = () => {
  return (
    <div className="bg-[#F9FAFB] py-16 px-4 sm:px-8 lg:px-16 font-[Poppins]">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How <span className="text-[#7F56D9]">Udhaari.com</span> Works
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Udhaari.com helps you manage group expenses effortlessly. Here's how you can get started in just a few simple steps:
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-[#7F56D9]/20"
            >
              <div className="flex items-start mb-4">
                <div className="p-3 rounded-lg bg-[#7F56D9]/10 mr-4 flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">Start managing your expenses smarter</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Log in, create your first group, and experience seamless expense sharing today.
          </p>
          <a
            href="/profile"
            className="inline-block bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white px-7 py-3 rounded-lg shadow-sm hover:shadow-md transition-all hover:brightness-110 font-medium text-sm"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features;