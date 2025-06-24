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

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8 px-4 sm:px-6 lg:px-8 font-[DM Sans]">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* User Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#111827] font-[Poppins]">
              Profile Information
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-[#7F56D9] hover:text-[#9333EA] transition-colors"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[#111827] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#111827] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7F56D9] to-[#9333EA] flex items-center justify-center text-white text-2xl">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#111827]">
                    {user?.name}
                  </h3>
                  <p className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2 text-[#7F56D9]" /> {user?.email}
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
                    {/* Unverified Account Badge */}
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                      <FaTimesCircle className="mr-2 text-orange-500" />
                      <span className="text-sm font-medium">
                        Unverified Account
                      </span>
                    </div>

                    {!showOtpBox ? (
                      /* Verify Email Button */
                      <button
                        onClick={() => {
                          sendOtp();
                          setShowOtpBox(true);
                        }}
                        className="flex items-center text-sm px-4 py-2.5 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white rounded-lg hover:shadow-md transition-all"
                      >
                        <FaEnvelope className="mr-2" />
                        Verify Email
                      </button>
                    ) : (
                      /* OTP Verification Box */
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="Enter 6-digit OTP"
                              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] text-sm"
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
                          className="w-full flex items-center justify-center py-2.5 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-lg hover:shadow-md transition-all text-sm font-medium"
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
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("expenses")}
            className={`px-4 py-2 font-medium ${
              activeTab === "expenses"
                ? "text-[#7F56D9] border-b-2 border-[#7F56D9]"
                : "text-gray-500"
            } font-[Poppins]`}
          >
            <FaReceipt className="inline mr-2" /> My Expenses
          </button>
          <button
            onClick={() => setActiveTab("settlements")}
            className={`px-4 py-2 font-medium ${
              activeTab === "settlements"
                ? "text-[#7F56D9] border-b-2 border-[#7F56D9]"
                : "text-gray-500"
            } font-[Poppins]`}
          >
            <FaExchangeAlt className="inline mr-2" /> Settlements
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`px-4 py-2 font-medium ${
              activeTab === "summary"
                ? "text-[#7F56D9] border-b-2 border-[#7F56D9]"
                : "text-gray-500"
            } font-[Poppins]`}
          >
            <FaChartPie className="inline mr-2" /> Spend Summary
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          {activeTab === "expenses" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#111827] font-[Poppins]">
                  My Expenses
                </h2>
                <button
                  onClick={loadMyExpenses}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {isLoading ? "Loading..." : "Load Expenses"}
                </button>
              </div>
              {expenses.length > 0 ? (
                <div className="space-y-3">
                  {expenses.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-[#111827]">
                            {exp.description}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {exp.groupName}
                          </p>
                        </div>
                        <span className="font-bold text-[#7F56D9]">
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
                  <h2 className="text-xl font-bold text-[#111827] font-[Poppins]">
                    Sent Settlements
                  </h2>
                  <button
                    onClick={loadSettlements}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {isLoading ? "Loading..." : "Load Settlements"}
                  </button>
                </div>
                {settlements.length > 0 ? (
                  <div className="space-y-3">
                    {settlements.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-gray-100 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[#111827]">
                              You paid{" "}
                              <span className="font-semibold">{s.toName}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {s.settledAt}
                            </p>
                          </div>
                          <span className="font-bold text-[#10B981]">
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
                  <h2 className="text-xl font-bold text-[#111827] font-[Poppins]">
                    Received Settlements
                  </h2>
                  <button
                    onClick={loadReceivedSettlements}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {isLoading ? "Loading..." : "Load Received"}
                  </button>
                </div>
                {receivedSettlements.length > 0 ? (
                  <div className="space-y-3">
                    {receivedSettlements.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-gray-100 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[#111827]">
                              Received from{" "}
                              <span className="font-semibold">
                                {s.fromName}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {s.settledAt}
                            </p>
                          </div>
                          <span className="font-bold text-[#10B981]">
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
                <h2 className="text-xl font-bold text-[#111827] font-[Poppins]">
                  Spend Summary
                </h2>
                <button
                  onClick={loadSpendSummary}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                >
                  {isLoading ? "Loading..." : "Load Summary"}
                </button>
              </div>

              {spendSummary ? (
                <div className="space-y-8">
                  {/* Total Spent Card */}
                  <div className="p-6 bg-gradient-to-r from-[#7F56D9]/10 to-[#9333EA]/10 rounded-xl">
                    <h3 className="font-semibold text-[#111827] mb-2">
                      Total Actual Spent
                    </h3>
                    <p className="text-3xl font-bold text-[#7F56D9]">
                      ₹{spendSummary.totalActualSpent.toFixed(2)}
                    </p>
                  </div>

                  {/* Group-wise Summary */}
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-semibold text-[#111827] mb-4 flex items-center">
                      <FaUsers className="mr-2 text-[#7F56D9]" /> Group-wise
                      Summary
                    </h3>

                    <div className="grid gap-8 lg:grid-cols-2">
                      <div className="h-80">
                        <h4 className="text-lg font-medium text-[#111827] mb-3">
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
                        <h4 className="text-lg font-medium text-[#111827] mb-3">
                          Group Details
                        </h4>
                        <div className="space-y-4">
                          {spendSummary.groupWise.map((g, idx) => (
                            <div
                              key={idx}
                              className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <h4 className="font-medium text-[#111827] mb-2">
                                {g.groupName}
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-gray-500">
                                    Total Paid:
                                  </span>
                                  <span className="font-medium">
                                    ₹{g.totalPaid}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-500">
                                    Actual Spent:
                                  </span>
                                  <span className="font-medium text-[#10B981]">
                                    ₹{g.totalOwed}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-500">
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
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-semibold text-[#111827] mb-4 flex items-center">
                      <FaChartPie className="mr-2 text-[#7F56D9]" />{" "}
                      Category-wise Summary
                    </h3>

                    <div className="grid gap-8 lg:grid-cols-2">
                      <div className="h-80">
                        <h4 className="text-lg font-medium text-[#111827] mb-3">
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
                        <h4 className="text-lg font-medium text-[#111827] mb-3">
                          Category Details
                        </h4>
                        <div className="space-y-4">
                          {spendSummary.categoryWise.map((c, idx) => (
                            <div
                              key={idx}
                              className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <h4 className="font-medium text-[#111827] mb-2">
                                {c.category}
                              </h4>
                              <div className="space-y-1 text-sm">
                                <p className="flex justify-between">
                                  <span className="text-gray-500">
                                    Total Paid:
                                  </span>
                                  <span className="font-medium">
                                    ₹{c.totalPaid}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-500">
                                    Actual Spent:
                                  </span>
                                  <span className="font-medium text-[#10B981]">
                                    ₹{c.totalOwed}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="text-gray-500">
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
