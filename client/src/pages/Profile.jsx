import { useEffect, useState } from "react";
import { getUserProfile } from "../api/authAPI";
import axios from "../api/axiosInstance";
import {
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaRedo,
  FaShieldAlt,
  FaUsers,
  FaReceipt,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaChartPie,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [receivedSettlements, setReceivedSettlements] = useState([]);
  const [spendSummary, setSpendSummary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getUserProfile();
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add update logic
    setIsEditing(false);
  };

  const sendOtp = async () => {
    try {
      await axios.post("/send-otp");
      console.log("OTP sent to your email.");
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("/verify-otp", { otp });
      console.log("Email verified successfully!");
      setShowOtpBox(false);
      setUser((prev) => ({ ...prev, isAccountVerified: true }));
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const loadMyExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/my-expenses");
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettlements = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/my-settlements");
      setSettlements(res.data || []);
    } catch (err) {
      console.error("Failed to fetch settlements", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReceivedSettlements = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/received-settlements");
      setReceivedSettlements(res.data || []);
    } catch (err) {
      console.error("Failed to fetch received settlements", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSpendSummary = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/spent-summary");
      setSpendSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch spend summary", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for charts
  const getGroupWiseChartData = () => {
    if (!spendSummary?.groupWise) return null;

    return {
      labels: spendSummary.groupWise.map((g) => g.groupName),
      datasets: [
        {
          label: "Total Paid",
          data: spendSummary.groupWise.map((g) => g.totalPaid),
          backgroundColor: "#7F56D9",
          borderRadius: 4,
        },
        {
          label: "Total Owed",
          data: spendSummary.groupWise.map((g) => g.totalOwed),
          backgroundColor: "#F97316",
          borderRadius: 4,
        },
        {
          label: "Actual Spent",
          data: spendSummary.groupWise.map((g) => g.actualSpent),
          backgroundColor: "#10B981",
          borderRadius: 4,
        },
      ],
    };
  };

  const getCategoryWiseChartData = () => {
    if (!spendSummary?.categoryWise) return null;

    return {
      labels: spendSummary.categoryWise.map((c) => c.category),
      datasets: [
        {
          label: "Amount Spent",
          data: spendSummary.categoryWise.map((c) => c.actualSpent),
          backgroundColor: [
            "#7F56D9",
            "#9333EA",
            "#10B981",
            "#F97316",
            "#F59E0B",
            "#6366F1",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "DM Sans, sans-serif",
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        bodyFont: {
          family: "DM Sans, sans-serif",
        },
        titleFont: {
          family: "DM Sans, sans-serif",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "DM Sans, sans-serif",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "DM Sans, sans-serif",
          },
        },
      },
    },
  };

  const totalOwedSum = spendSummary?.groupWise?.reduce(
    (sum, item) => sum + (item.totalOwed || 0),
    0
  );

  // console.log(totalOwedSum);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E] font-[DM Sans] py-8 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        {/* User Info Card */}
        <div className="bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-lg p-6 rounded-[30px] shadow-xl border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#1B1C1E] dark:text-white font-[Poppins]">
              Profile Information
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-[#67d956] hover:text-[#64884d] transition-colors"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#111827] dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 dark:text-white py-2 border border-gray-600 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#111827] dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border dark:text-white border-gray-600 rounded-lg outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-tr from-[#4CAF50] to-[#81C784] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#4CAF50] to-[#81C784] flex items-center justify-center text-white text-2xl">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#111827] dark:text-white">
                    {user?.name}
                  </h3>
                  <p className="flex items-center text-gray-400">
                    <FaEnvelope className="mr-2" /> {user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                {user?.isAccountVerified ? (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981]">
                    <FaCheckCircle className="mr-2" /> Verified Account
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                      <FaTimesCircle className="mr-2 text-orange-500" />
                      <span className="text-sm font-medium">
                        Unverified Account
                      </span>
                    </div>
                    {!showOtpBox ? (
                      <button
                        onClick={() => {
                          sendOtp();
                          setShowOtpBox(true);
                        }}
                        className="flex items-center text-sm px-4 py-2.5 bg-gradient-to-tr from-[#097d32] to-[#3fb832] text-white rounded-lg hover:shadow-md transition-all"
                      >
                        <FaEnvelope className="mr-2" />
                        Verify Email
                      </button>
                    ) : (
                      <div className="space-y-3 bg-transparent p-4 rounded-2xl border border-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              className="w-full px-4 py-2 pl-10 border border-gray-600 rounded-lg outline-none text-sm dark:text-white"
                              maxLength="6"
                            />
                            <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                          </div>
                          <button
                            onClick={sendOtp}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white rounded-lg hover:shadow-md transition-all text-sm"
                          >
                            <FaRedo className="mr-2" />
                            Resend
                          </button>
                        </div>
                        <button
                          onClick={verifyOtp}
                          className="w-full flex items-center justify-center py-2.5 bg-gradient-to-r from-[#29b025] to-[#1f9035] text-white rounded-lg hover:shadow-md transition-all text-sm font-medium"
                        >
                          <FaCheckCircle className="mr-2" />
                          Verify Email
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/20 backdrop-blur-md">
          {["expenses", "settlements", "summary"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium font-[Poppins] transition-all ${
                activeTab === tab
                  ? "text-[#4CAF50] border-b-2 border-[#81C784]"
                  : "text-gray-500"
              }`}
            >
              {tab === "expenses" && <FaReceipt className="inline mr-2" />}
              {tab === "settlements" && (
                <FaExchangeAlt className="inline mr-2" />
              )}
              {tab === "summary" && <FaChartPie className="inline mr-2" />}
              {tab.charAt(0).toUpperCase() +
                tab.slice(1).replace(/([A-Z])/g, " $1")}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-xl p-6 rounded-[30px] shadow-xl border border-white/20">
          {activeTab === "expenses" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold dark:text-white text-[#111827] font-[Poppins]">
                  My Expenses
                </h2>
                <button
                  onClick={loadMyExpenses}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#29b025] to-[#1f9035] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {isLoading ? "Loading..." : "Load Expenses"}
                </button>
              </div>
              {expenses.length > 0 ? (
                <div className="space-y-3">
                  {expenses.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 border dark:hover:bg-zinc-800 border-zinc-600 rounded-2xl hover:bg-[#F3F4F6] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium dark:text-gray-300 text-[#111827]">
                            {exp.description}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {exp.groupName}
                          </p>
                        </div>
                        <span className="font-bold text-amber-600">
                          ₹{exp.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaReceipt className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p>No expenses found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settlements" && (
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#111827] dark:text-white font-[Poppins]">
                    Sent Settlements
                  </h2>
                  <button
                    onClick={loadSettlements}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#29b025] to-[#1f9035] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {isLoading ? "Loading..." : "Load Settlements"}
                  </button>
                </div>
                {settlements.length > 0 ? (
                  <div className="space-y-3">
                    {settlements.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-zinc-600 rounded-2xl hover:bg-[#F3F4F6] dark:hover:bg-zinc-800 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[#111827] dark:text-white">
                              You paid{" "}
                              <span className="font-semibold">{s.toName}</span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {s.settledAt}
                            </p>
                          </div>
                          <span className="font-bold text-[#10B981] dark:text-amber-600">
                            ₹{s.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaMoneyBillWave className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p>No settlements made</p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#111827] dark:text-white font-[Poppins]">
                    Received Settlements
                  </h2>
                  <button
                    onClick={loadReceivedSettlements}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#29b025] to-[#1f9035] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {isLoading ? "Loading..." : "Load Received"}
                  </button>
                </div>
                {receivedSettlements.length > 0 ? (
                  <div className="space-y-3">
                    {receivedSettlements.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-zinc-600 rounded-2xl dark:hover:bg-zinc-800 hover:bg-[#F3F4F6] transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[#111827] dark:text-white">
                              Received from{" "}
                              <span className="font-semibold">
                                {s.fromName}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {s.settledAt}
                            </p>
                          </div>
                          <span className="font-bold text-amber-600">
                            ₹{s.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaMoneyBillWave className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p>No received settlements</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "summary" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#111827] font-[Poppins] dark:text-white">
                  Spend Summary
                </h2>
                <button
                  onClick={loadSpendSummary}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#29b025] to-[#1f9035] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {isLoading ? "Loading..." : "Load Summary"}
                </button>
              </div>

              {spendSummary ? (
                <div className="space-y-8">
                  {/* Total Spent Card */}
                  <div className="p-6 bg-gradient-to-r from-[#7F56D9]/10 to-[#9333EA]/10 rounded-xl">
                    <h3 className="font-semibold text-[#111827] mb-2 dark:text-white">
                      Total Actual Spent
                    </h3>
                    <p className="text-3xl font-bold text-red-600">
                      ₹{spendSummary.totalActualSpent.toFixed(2)}
                    </p>
                  </div>

                  {/* Group-wise Summary */}
                  <div className="bg-transparent p-6 rounded-2xl shadow-md border border-zinc-600">
                    <h3 className="font-semibold text-[#111827] dark:text-white mb-4 flex items-center">
                      <FaUsers className="mr-2 text-[#7F56D9]" /> Group-wise
                      Summary
                    </h3>

                    <div className="grid gap-8 lg:grid-cols-2">
                      <div className="h-80">
                        <h4 className="text-lg font-medium text-[#111827] dark:text-white mb-3">
                          Spending Breakdown
                        </h4>
                        {getGroupWiseChartData() && (
                          <Bar
                            data={getGroupWiseChartData()}
                            options={chartOptions}
                          />
                        )}
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-[#111827] dark:text-white mb-3">
                          Group Details
                        </h4>
                        <div className="space-y-4">
                          {spendSummary.groupWise.map((g, idx) => (
                            <div
                              key={idx}
                              className="p-4 border border-zinc-600 rounded-2xl hover:shadow-md transition-shadow"
                            >
                              <h4 className="font-medium text-[#111827] dark:text-white mb-2">
                                {g.groupName}
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-300">
                                    Total Paid:
                                  </span>
                                  <span className="font-medium dark:text-white">
                                    ₹{g.totalPaid}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-300">
                                    Actual Spent:
                                  </span>
                                  <span className="font-medium text-[#10B981]">
                                    ₹{g.totalOwed}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-300">
                                    Total Owed:
                                  </span>
                                  <span className="font-medium text-red-600">
                                    ₹{g.actualSpent}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category-wise Summary */}
                  <div className="bg-transparent p-6 rounded-2xl shadow-md border border-zinc-600">
                    <h3 className="font-semibold text-[#111827] dark:text-white mb-4 flex items-center">
                      <FaChartPie className="mr-2 text-[#7F56D9]" />{" "}
                      Category-wise Summary
                    </h3>

                    <div className="grid gap-8 lg:grid-cols-2 mb-4">
                      <div className="h-80">
                        <h4 className="text-lg font-medium text-[#111827] dark:text-white mb-3">
                          Spending Distribution
                        </h4>
                        {getCategoryWiseChartData() && (
                          <Pie
                            data={getCategoryWiseChartData()}
                            options={chartOptions}
                          />
                        )}
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-[#111827] dark:text-white mb-3">
                          Category Details
                        </h4>
                        <div className="space-y-4">
                          {spendSummary.categoryWise.map((c, idx) => (
                            <div
                              key={idx}
                              className="p-4 border border-zinc-600 rounded-2xl hover:shadow-md transition-shadow"
                            >
                              <h4 className="font-medium dark:text-white text-[#111827] mb-2">
                                {c.category}
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-300">
                                    Total Paid:
                                  </span>
                                  <span className="font-medium dark:text-white">
                                    ₹{c.totalPaid}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-300">
                                    Actual Spent:
                                  </span>
                                  <span className="font-medium text-[#10B981] ">
                                    ₹{c.totalOwed}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-300" >
                                    Total Owed:
                                  </span>
                                  <span className="font-medium text-red-600">
                                    ₹{c.actualSpent}
                                  </span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaChartPie className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p>Click above to load spend summary</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
