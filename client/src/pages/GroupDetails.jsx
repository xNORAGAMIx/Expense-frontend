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
  const group = useSelector((state) => state.groups.groups);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");
  const [expenseLoader, setExpenseLoader] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showSettle, setShowSettle] = useState(false);
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

  let name = group.find((g) => g.id == groupId)?.name || "Group";

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
      console.error(err);
      setError("Failed to load group data");
    }
  };

  const handleAddExpense = async () => {
    setExpenseLoader(true);
    const { description, amount, category, paidByEmail } = newExpense;
    if (!description || !amount || !category || !paidByEmail) {
      return setError("All fields are required.");
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
      fetchGroupData();
      setError("");
    } catch {
      setError("Failed to add expense.");
    } finally {
      setExpenseLoader(false);
    }
  };

  const handleSettle = async () => {
    const { toEmail, amount } = settleData;
    if (!toEmail || !amount) {
      return setError("Select user and amount.");
    }
    try {
      await axios.post(`/${groupId}/settle`, {
        toEmail,
        amount: Number(amount),
      });
      setSettleData({ toEmail: "", amount: "" });
      fetchGroupData();
      setError("");
    } catch {
      setError("Failed to settle.");
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return setError("Enter email.");
    try {
      await axios.post(`/${groupId}/members`, { email: newMemberEmail });
      setNewMemberEmail("");
      fetchGroupData();
      setError("");
    } catch {
      setError("Failed to add member.");
    }
  };

  const matched = balances.some(
    (b) => b.fromUser && members.some((m) => m.name === b.fromUser && m.email === email)
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E] text-[#1B1C1E] dark:text-white font-[DM Sans] overflow-hidden">
      {/* Background Blurred Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse" />
      </div>

      {/* Main Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/30 dark:bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] p-6 mb-8 shadow-lg">
          <h1 className="text-3xl font-bold font-[Poppins] text-[#1B1C1E] dark:text-white">
            {name}
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Track, split & settle group expenses like a pro.
          </p>
        </div>

        {error && (
          <div className="bg-red-100/30 dark:bg-red-500/10 text-red-800 dark:text-red-300 p-4 mb-4 rounded-xl border border-red-200 dark:border-red-500/20">
            {error}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Left */}
          <div className="space-y-6">
            {/* Members */}
            <div className="bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-[20px] p-5 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold font-[Poppins]">Members</h2>
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="text-[#67d956] hover:text-[#64884d] text-sm flex items-center gap-1"
                >
                  <FaPlus /> Add
                </button>
              </div>

              {showAddMember && (
                <div className="mb-4 space-y-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full p-2 rounded-xl border border-white/20 bg-white/20 dark:bg-white/10 backdrop-blur-md outline-none"
                  />
                  <button
                    onClick={handleAddMember}
                    className="w-full py-2 bg-gradient-to-tr from-[#097d32] to-[#3fb832] text-white rounded-xl "
                  >
                    <FaCheck className="inline mr-2" />
                    Add Member
                  </button>
                </div>
              )}

              <ul className="space-y-2">
                {members.map((m, i) => (
                  <li key={i} className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl transition">
                    <div className="bg-gradient-to-tr from-[#4CAF50] to-[#81C784] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">{m.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Balances */}
            <div className="bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-[20px] p-5 shadow-md">
              <h2 className="font-semibold font-[Poppins] mb-4">Balances</h2>

              {balances.length > 0 ? (
                <ul className="space-y-3">
                  {balances.map((b, i) => (
                    <li
                      key={i}
                      className="bg-white/10 p-3 rounded-xl flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <GiPayMoney className="text-[#F97316]" />
                        <span>{b.fromUser}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F97316]">₹{b.amount}</span>
                        <GiReceiveMoney className="text-[#10B981]" />
                        <span>{b.toUser}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  <RiMoneyDollarCircleLine className="mx-auto text-3xl mb-1" />
                  All settled up!
                </div>
              )}

              <button
                onClick={() => setShowSettle(!showSettle)}
                disabled={!matched}
                className={`w-full mt-4 py-2 rounded-xl transition-all ${
                  matched
                    ? "bg-gradient-to-tr from-[#097d32] to-[#3fb832] text-white hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {showSettle ? "Cancel" : "Settle Up"}
              </button>

              {showSettle && (
                <div className="mt-4 space-y-3">
                  <select
                    value={settleData.toEmail}
                    onChange={(e) =>
                      setSettleData((prev) => ({ ...prev, toEmail: e.target.value }))
                    }
                    className="w-full p-2 border border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md"
                  >
                    <option value="">Select member</option>
                    {members
                      .filter((m) => m.email !== email)
                      .map((m, i) => (
                        <option key={i} value={m.email}>
                          {m.name} ({m.email})
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={settleData.amount}
                    onChange={(e) =>
                      setSettleData((prev) => ({ ...prev, amount: e.target.value }))
                    }
                    className="w-full p-2 border border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md"
                  />
                  <button
                    onClick={handleSettle}
                    className="w-full py-2 bg-gradient-to-r from-[#097d32] to-[#3fb832] text-white rounded-xl"
                  >
                    <FaCheck className="inline mr-2" />
                    Confirm Settlement
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Expense Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-white/10 mb-4">
              <button
                onClick={() => setActiveTab("expenses")}
                className={`py-2 px-4 font-[Poppins] transition ${
                  activeTab === "expenses"
                    ? "text-[#4CAF50] border-b-2 border-[#81C784]"
                    : "text-gray-500"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setActiveTab("add")}
                className={`py-2 px-4 font-[Poppins] transition ${
                  activeTab === "add"
                    ? "text-[#4CAF50] border-b-2 border-[#81C784]"
                    : "text-gray-500"
                }`}
              >
                Add Expense
              </button>
            </div>

            {activeTab === "expenses" ? (
              expenses.length > 0 ? (
                <div className="space-y-4">
                  {expenses.map((e, i) => (
                    <div
                      key={i}
                      className="bg-white/30 dark:bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{e.description}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {e.category} • Paid by {e.paidByName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg text-red-600 dark:text-amber-500 font-bold">₹{e.amount}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(e.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <FaReceipt className="mx-auto text-4xl text-gray-300 mb-2" />
                  <p>No expenses yet.</p>
                </div>
              )
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full p-3 border border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md outline-none"
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="w-full p-3 border border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md outline-none"
                />
                <select
                  name="category"
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className=" w-full p-3 border border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md"
                >
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
                <select
                  name="paidByEmail"
                  value={newExpense.paidByEmail}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, paidByEmail: e.target.value }))
                  }
                  className="w-full p-3 border border-white/20 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-md"
                >
                  {members.map((m, i) => (
                    <option key={i} value={m.email}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddExpense}
                  className="w-full py-3 bg-gradient-to-r from-[#097d32] to-[#3fb832] text-white rounded-xl font-extrabold"
                >
                  {expenseLoader ? "Please Wait..." : "Add Expense"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
