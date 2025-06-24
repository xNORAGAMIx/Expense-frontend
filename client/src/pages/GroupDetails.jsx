import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../api/axiosInstance";
import {
  FaUserPlus,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaPlus,
  FaCheck,
  FaReceipt,
} from "react-icons/fa";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const GroupDetails = () => {
  const email = useSelector((state) => state.auth.email);
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "food",
    paidByEmail: "",
  });

  const [settleData, setSettleData] = useState({
    toEmail: "",
    amount: "",
  });

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showSettle, setShowSettle] = useState(false);

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      const [membersRes, expensesRes, balancesRes] = await Promise.all([
        axios.get(`/${groupId}/members`),
        axios.get(`/${groupId}/expenses`),
        axios.get(`/${groupId}/balances`),
      ]);
      console.log(membersRes);
      
      setMembers(membersRes.data || []);
      setExpenses(expensesRes.data || []);
      setBalances(balancesRes.data || []);

      if (membersRes.data?.length && !newExpense.paidByEmail) {
        setNewExpense((prev) => ({
          ...prev,
          paidByEmail: membersRes.data[0].email,
        }));
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load group data");
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpense = async () => {
    const { description, amount, category, paidByEmail } = newExpense;
    if (!description || !amount || !category || !paidByEmail) {
      return setError("All expense fields are required.");
    }

    try {
      await axios.post(`/${groupId}/expenses`, {
        description,
        amount: Number(amount),
        category,
        paidByEmail,
      });

      setNewExpense({
        description: "",
        amount: "",
        category: "food",
        paidByEmail: members[0]?.email || "",
      });
      setError("");
      fetchGroupData();
    } catch (err) {
      console.log(err);
      setError("Failed to add expense.");
    }
  };

  const handleSettle = async () => {
    const { toEmail, amount } = settleData;

    if (!toEmail || !amount) {
      return setError("Please select a user and amount to settle.");
    }

    try {
      await axios.post(`/${groupId}/settle`, {
        toEmail,
        amount: Number(amount),
      });

      setSettleData({ toEmail: "", amount: "" });
      setError("");
      fetchGroupData();
    } catch (err) {
      console.error(err);
      setError("Failed to settle balance.");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) {
      return setError("Please enter an email to add.");
    }

    try {
      await axios.post(`/${groupId}/members`, {
        email: newMemberEmail,
      });

      setNewMemberEmail("");
      setError("");
      fetchGroupData();
    } catch (err) {
      console.error(err);
      setError("Failed to add member. Make sure email is valid.");
    }
  };

  let matched = false;

  for (const member of members) {
    for (const balance of balances) {
      if (balance.fromUser === member.name && member.email === email) {
        matched = true;
        break;
      }
    }
    if (matched) break;
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-6 px-4 sm:px-6 lg:px-8 font-[DM Sans]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] rounded-xl p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold font-[Poppins]">Group Expenses</h1>
          <p className="opacity-90">Manage shared expenses with your group</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-[#F97316] p-4 mb-6 rounded">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-[#F97316]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="ml-3 text-sm text-[#111827]">{error}</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#7F56D9]/10 text-[#7F56D9] mr-4">
                <FaUserPlus size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Members</p>
                <p className="text-2xl font-semibold text-[#111827]">
                  {members.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#10B981]/10 text-[#10B981] mr-4">
                <FaMoneyBillWave size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Expenses
                </p>
                <p className="text-2xl font-semibold text-[#111827]">
                  ₹{expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-[#F97316]/10 text-[#F97316] mr-4">
                <FaExchangeAlt size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Balances
                </p>
                <p className="text-2xl font-semibold text-[#111827]">
                  {balances.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Members Card */}
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
              <div className="bg-[#F3F4F6] px-6 py-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-lg text-[#111827] font-[Poppins]">
                  Group Members
                </h2>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="text-[#7F56D9] hover:text-[#9333EA] transition-colors flex items-center text-sm"
                >
                  <FaPlus className="mr-1" /> Add
                </button>
              </div>
              <div className="p-4">
                {showAddMember && (
                  <div className="mb-4 bg-[#F3F4F6] p-4 rounded-lg">
                    <input
                      type="email"
                      placeholder="Enter member email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] mb-2"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                    <button
                      onClick={handleAddMember}
                      className="w-full bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white py-2 px-4 rounded-lg hover:shadow-md transition-all flex items-center justify-center"
                    >
                      <FaCheck className="mr-2" /> Add Member
                    </button>
                  </div>
                )}

                <ul className="divide-y divide-gray-100">
                  {members.map((member, idx) => (
                    <li
                      key={idx}
                      className="py-3 flex items-center hover:bg-[#F3F4F6] transition-colors px-2 rounded"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#7F56D9]/10 to-[#9333EA]/10 flex items-center justify-center text-[#7F56D9] font-medium mr-3">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#111827]">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Balances Card */}
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
              <div className="bg-[#F3F4F6] px-6 py-4 border-b">
                <h2 className="font-semibold text-lg text-[#111827] font-[Poppins]">
                  Balances
                </h2>
              </div>
              <div className="p-4">
                {balances.length > 0 ? (
                  <ul className="space-y-3">
                    {balances.map((bal, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between p-3 bg-[#F3F4F6] rounded-lg"
                      >
                        <div className="flex items-center">
                          <GiPayMoney className="text-[#F97316] mr-2" />
                          <span className="font-medium text-[#111827]">
                            {bal.fromUser}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold text-[#F97316]">
                            ₹{bal.amount}
                          </span>
                          <GiReceiveMoney className="text-[#10B981] mx-2" />
                          <span className="font-medium text-[#111827]">
                            {bal.toUser}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <RiMoneyDollarCircleLine className="mx-auto text-4xl text-gray-300 mb-2" />
                    <p>All settled up!</p>
                  </div>
                )}

                <button
                  onClick={() => setShowSettle(!showSettle)}
                  disabled={!matched}
                  className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center ${
                    showSettle
                      ? "bg-gray-200 text-gray-800"
                      : "bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white hover:shadow-md"
                  } transition-all ${matched ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                >
                  <FaExchangeAlt className="mr-2" />
                  {showSettle ? "Cancel" : "Settle Up"}
                </button>

                {showSettle && (
                  <div className="mt-4 bg-[#F3F4F6] p-4 rounded-lg">
                    <select
                      value={settleData.toEmail}
                      onChange={(e) =>
                        setSettleData((prev) => ({
                          ...prev,
                          toEmail: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] mb-2"
                    >
                      <option value="">Select a user to settle with</option>
                      {members
                        .filter((member) => member.email !== email)
                        .map((member, idx) => (
                          <option key={idx} value={member.email}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                    </select>

                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9] mb-2"
                      value={settleData.amount}
                      onChange={(e) =>
                        setSettleData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />

                    <button
                      className="w-full bg-gradient-to-r from-[#10B981] to-[#34D399] text-white py-2 px-4 rounded-lg hover:shadow-md transition-all flex items-center justify-center"
                      onClick={handleSettle}
                    >
                      <FaCheck className="mr-2" /> Confirm Settlement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("expenses")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "expenses"
                        ? "border-[#7F56D9] text-[#7F56D9]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } font-[Poppins]`}
                  >
                    Expenses
                  </button>
                  <button
                    onClick={() => setActiveTab("add")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === "add"
                        ? "border-[#7F56D9] text-[#7F56D9]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } font-[Poppins]`}
                  >
                    Add Expense
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "expenses" ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-[#111827] font-[Poppins]">
                        Recent Expenses
                      </h3>
                      <button
                        onClick={() => setActiveTab("add")}
                        className="bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white py-2 px-4 rounded-lg hover:shadow-md transition-all flex items-center"
                      >
                        <FaPlus className="mr-2" /> Add Expense
                      </button>
                    </div>

                    {expenses.length > 0 ? (
                      <div className="space-y-4">
                        {expenses.map((expense, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium text-[#111827]">
                                  {expense.description}
                                </h4>
                                <p className="text-sm text-gray-500 capitalize">
                                  {expense.category} • Paid by{" "}
                                  {expense.paidByName}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-[#7F56D9]">
                                  ₹{expense.amount}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    expense.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        <FaReceipt className="mx-auto text-4xl text-gray-300 mb-2" />
                        <p>No expenses added yet</p>
                        <button
                          onClick={() => setActiveTab("add")}
                          className="mt-4 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white py-2 px-4 rounded-lg hover:shadow-md transition-all"
                        >
                          Add Your First Expense
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-[#111827] font-[Poppins]">
                      Add New Expense
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          placeholder="Dinner at Restaurant"
                          value={newExpense.description}
                          onChange={handleExpenseChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Amount (₹)
                        </label>
                        <input
                          type="number"
                          name="amount"
                          placeholder="1200"
                          value={newExpense.amount}
                          onChange={handleExpenseChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Category
                        </label>
                        <select
                          name="category"
                          value={newExpense.category}
                          onChange={handleExpenseChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                        >
                          <option value="food">Food & Dining</option>
                          <option value="transport">Transportation</option>
                          <option value="shopping">Shopping</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="utilities">Utilities</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#111827] mb-2">
                          Paid By
                        </label>
                        <select
                          name="paidByEmail"
                          value={newExpense.paidByEmail}
                          onChange={handleExpenseChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                        >
                          {members.map((member, idx) => (
                            <option key={idx} value={member.email}>
                              {member.name} ({member.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        className="w-full bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white py-3 px-4 rounded-lg hover:shadow-md font-medium transition-all"
                        onClick={handleAddExpense}
                      >
                        Add Expense
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
