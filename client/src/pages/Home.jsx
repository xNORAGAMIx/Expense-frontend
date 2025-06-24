import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaReceipt,
  FaChartPie,
  FaMobileAlt,
  FaSyncAlt,
} from "react-icons/fa";
import HomeImage from  "../assets/home.png";

const Home = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6 font-[Poppins]">
              Udhaari.com – <span className="text-[#7F56D9]">Bhaichara</span> meets Budget
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 mb-8 font-[DM Sans]">
              "Dosti mein udhaar allowed hai, par bhoolna nahi — that’s where we come in."
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to={isAuthenticated ? "/groups" : "/register"}
                className="px-8 py-3 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:brightness-110"
              >
                Start Collecting Udhaar
              </Link>
              <Link
                to="/features"
                className="px-8 py-3 bg-white text-[#7F56D9] border border-[#7F56D9] font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="lg:w-1/2 relative mt-12 lg:mt-0">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#7F56D9]/20 to-[#9333EA]/20 rounded-3xl blur-lg opacity-70"></div>
            <div className="relative bg-white p-2 rounded-2xl shadow-xl overflow-hidden neo-shadow">
              <img
                src={HomeImage}
                alt="Udhaari preview"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-4 font-[Poppins]">
              Udhaari.com Features You’ll Actually Use
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-[DM Sans]">
              Because remembering who owes you chai, Maggi, or Maldives trip — matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUsers className="text-[#7F56D9] text-4xl" />,
                title: "Group Yaari",
                description:
                  "Banayein doston ke saath group – shaadi ho ya Goa plan, sabka hisaab barabar.",
              },
              {
                icon: <FaReceipt className="text-[#10B981] text-4xl" />,
                title: "No More 'Tere Se Baad Mein Lunga'",
                description:
                  "Custom ya equal split — with funny descriptions, kyunki memes zaroori hain.",
              },
              {
                icon: <FaChartPie className="text-[#F97316] text-4xl" />,
                title: "Jeb Ka Chart",
                description:
                  "Pie charts batayenge kisne sabse zyada udhaar diya (aur sabse zyada jhela).",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#FFFFFF] p-6 rounded-xl border border-gray-100 hover:border-[#7F56D9]/30 transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]"
              >
                <div className="flex justify-center mb-5">
                  <div className="p-3 bg-gradient-to-br from-[#7F56D9]/10 to-[#9333EA]/10 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-[#111827] font-[Poppins]">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center font-[DM Sans]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-4 font-[Poppins]">
              How Udhaari.com Works
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-[DM Sans]">
              Teen kadam – aur dosti kharaab nahi hogi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: <FaUsers className="text-white text-2xl" />,
                title: "Create Group",
                description:
                  "Banayein apne dost, flatmates ya office ke liye group.",
              },
              {
                step: "2",
                icon: <FaReceipt className="text-white text-2xl" />,
                title: "Add Udhaari",
                description:
                  "Jo bhi pay karein, likh lo. Emoji aur category ke saath.",
              },
              {
                step: "3",
                icon: <FaSyncAlt className="text-white text-2xl" />,
                title: "Settle Karlo Bhai",
                description: "Hum batayenge kisne kisko kitna dena hai.",
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] rounded-full flex items-center justify-center shadow-lg group-hover:rotate-[15deg] transition-transform">
                  <span className="text-white font-bold text-xl">
                    {item.step}
                  </span>
                </div>
                <div className="bg-white p-8 pt-14 rounded-xl border border-gray-100 group-hover:border-[#7F56D9]/50 transition-all duration-300 h-full">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] rounded-full flex items-center justify-center shadow-md">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3 text-[#111827] font-[Poppins]">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-center font-[DM Sans]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#7F56D9] to-[#9333EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-[Poppins]">
            Stop asking "Bhai tu transfer kar diya kya?"
          </h2>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10 font-[DM Sans]">
            Join Udhaari.com – kyunki paisa toh zaroori hai.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-[#7F56D9] font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FaMobileAlt className="mr-2" />
            Get Started Now
          </Link>
          <p className="mt-4 text-indigo-100 text-sm">
            Free forever • Zero judgement • Emotional damage optional
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
