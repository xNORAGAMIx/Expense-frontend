import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGroups } from "../features/groups/groupSlice";
import { getUserGroups, createGroup } from "../api/authAPI";
import { FaUsers, FaPlus, FaCalendarAlt } from "react-icons/fa";
import { RiGroupFill } from "react-icons/ri";

const Groups = () => {
  const groups = useSelector((state) => state.groups.groups);
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const res = await getUserGroups();
        dispatch(setGroups(res.data || []));
      } catch (err) {
        console.error(err);
        setError("Could not load your udhaari groups. Internet chala gaya kya?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [dispatch]);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      return setError("Group name is required. Naam toh do!");
    }

    setIsLoading(true);
    try {
      await createGroup({ name: newGroupName });
      const res = await getUserGroups();
      dispatch(setGroups(res.data || []));
      setNewGroupName("");
      setError("");
      setCreating(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not create group. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalExpenses = (expenses) =>
    expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8 px-4 sm:px-6 lg:px-8 font-[DM Sans]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#111827] font-[Poppins]">My Udhaari Groups</h1>
            <p className="text-gray-600 mt-2">Manage your shared expenses like a pro </p>
          </div>
          <button
            onClick={() => setCreating(!creating)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center hover:brightness-110"
          >
            <FaPlus className="mr-2" />
            {creating ? "Cancel" : "Create Udhaari Group"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-[#F97316] p-4 mb-6 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-[#F97316]" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Create Group Form */}
        {creating && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[#111827] mb-4 font-[Poppins]">New Udhaari Group</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="group-name" className="block text-sm font-medium text-[#111827] mb-2">
                  Group Name
                </label>
                <input
                  id="group-name"
                  type="text"
                  placeholder="e.g. Flatmates, Goa Trip, Office Lunch"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7F56D9] focus:border-[#7F56D9]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => {
                    setCreating(false);
                    setNewGroupName("");
                    setError("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-[#7F56D9] to-[#9333EA] text-white rounded-lg hover:shadow-md flex items-center justify-center transition-all"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Group"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && !groups.length && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7F56D9]" />
          </div>
        )}

        {/* Group List */}
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group"
              >
                <Link to={`/groups/${group.id}`} className="block p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-[#111827] mb-1 group-hover:text-[#7F56D9] transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaCalendarAlt className="mr-1 text-[#7F56D9]/70" />
                        Created {formatDate(group.createdAt)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#7F56D9]/10 text-[#7F56D9]">
                      {group.members.length} members
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Total Expenses</span>
                      <span className="font-bold text-[#7F56D9]">
                        ₹{calculateTotalExpenses(group.expenses).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Last Activity</span>
                      <span className="text-sm text-gray-600">
                        {group.expenses.length
                          ? formatDate(group.expenses[0]?.createdAt)
                          : "No activity"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <FaUsers className="mr-1 text-[#7F56D9]/70" /> Members
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.members.slice(0, 3).map((member, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#7F56D9]/10 text-[#7F56D9]"
                        >
                          {member.name.split(" ")[0]}
                        </span>
                      ))}
                      {group.members.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{group.members.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-[#7F56D9]/10 to-[#9333EA]/10 flex items-center justify-center mb-4">
                <RiGroupFill className="h-10 w-10 text-[#7F56D9]" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-[#111827] font-[Poppins]">No Udhaari Groups</h3>
              <p className="mt-1 text-gray-500">Create your first group. Chhoti chhoti baatein... chhoti chhoti udhaariyan!</p>
              <div className="mt-6">
                <button
                  onClick={() => setCreating(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#7F56D9] to-[#9333EA] hover:shadow-md"
                >
                  <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                  Create Udhaari Group
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Groups;
