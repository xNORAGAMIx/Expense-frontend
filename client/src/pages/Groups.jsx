import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setGroups } from "../features/groups/groupSlice";
import { getUserGroups, createGroup, deleteGroup } from "../api/authAPI";
import { FaUsers, FaPlus, FaCalendarAlt, FaTrash } from "react-icons/fa";
import { RiGroupFill } from "react-icons/ri";

const Groups = () => {
  const groups = useSelector((state) => state.groups.groups);
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 9;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const res = await getUserGroups();
        dispatch(setGroups(res.data || []));
      } catch (err) {
        console.error(err);
        setError(
          "Could not load your udhaari groups. Internet chala gaya kya?"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [dispatch]);

  const sortedGroups = [...groups].sort(
    (b, a) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = sortedGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(groups.length / groupsPerPage);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim())
      return setError("Group name is required. Naam toh do!");
    setIsLoading(true);
    try {
      await createGroup({ name: newGroupName });
      const res = await getUserGroups();
      dispatch(setGroups(res.data || []));
      setNewGroupName("");
      setError("");
      setCreating(false);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Could not create group. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    setIsLoading(true);
    try {
      await deleteGroup(groupId);
      const res = await getUserGroups();
      dispatch(setGroups(res.data || []));
      if (currentGroups.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Could not delete group. Try again."
      );
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
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#121212] dark:to-[#1B1C1E] text-[#1B1C1E] dark:text-white font-[DM Sans] relative z-10 overflow-x-hidden">
      {/* Animated Gradient Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-20 left-[10%] animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold font-[Poppins] mb-2">
              My Udhaari Groups
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage shared expenses with dosti & dignity.
            </p>
          </div>
          <button
            onClick={() => setCreating(!creating)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-[#097d32] to-[#3fb832] text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all flex items-center gap-2"
          >
            <FaPlus />
            {creating ? "Cancel" : "Create Group"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100/70 border-l-4 border-red-400 text-red-900 p-4 rounded mb-6 backdrop-blur">
            {error}
          </div>
        )}

        {/* Create Group Form */}
        {creating && (
          <div className="bg-white/40 dark:bg-white/10 border border-white/30 rounded-2xl shadow-xl backdrop-blur-lg p-6 mb-10">
            <h2 className="text-2xl font-bold font-[Poppins] mb-4">
              New Group
            </h2>
            <input
              type="text"
              placeholder="Goa Trip, Flatmates, College Fest..."
              className="w-full p-3 mb-4 rounded-xl bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#3EB489]"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setCreating(false);
                  setNewGroupName("");
                  setError("");
                }}
                className="px-4 py-2 rounded-xl bg-white/30 dark:bg-white/10 border border-white/20 text-gray-800 dark:text-white hover:bg-white/40 dark:hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-[#3EB489] to-[#A5F3A1] text-white rounded-xl hover:scale-105 transition-all"
              >
                {isLoading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && !groups.length && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3EB489]" />
          </div>
        )}

        {/* Group List */}
        {groups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentGroups.map((group) => (
              <div
                key={group.id}
                className="relative group bg-white/40 dark:bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle hover gradient glow ring */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-[#6C63FF]/40 transition-all duration-300"></div>

                {/* Delete Button moved outside flow */}
                <button
                  onClick={() => handleDeleteGroup(group.groupId)}
                  disabled={isLoading}
                  className="absolute top-3 right-3 z-10 p-2 bg-red-100/30 hover:bg-red-200 text-red-600 rounded-full shadow-sm backdrop-blur-md transition-all"
                  title="Delete group"
                >
                  <FaTrash size={12} />
                </button>

                <Link to={`/groups/${group.id}`} className="block space-y-1">
                  <h3 className="text-xl font-semibold font-[Poppins] mb-1 pr-8 break-words max-w-full">
                    <span className="block truncate" title={group.name}>
                      {group.name}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaCalendarAlt className="text-[#3EB489]" />
                    Created: {formatDate(group.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Total: ₹{calculateTotalExpenses(group.expenses).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Last Activity:{" "}
                    {group.expenses.length
                      ? formatDate(group.expenses[0]?.createdAt)
                      : "No activity"}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="text-center py-12 bg-white/30 dark:bg-white/10 border border-white/20 rounded-2xl shadow-md backdrop-blur-lg">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#3EB489]/20 to-[#A5F3A1]/20 flex items-center justify-center mb-4">
                <RiGroupFill className="text-[#3EB489] text-3xl" />
              </div>
              <h3 className="text-xl font-semibold font-[Poppins]">
                No Groups Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create your first Udhaari group!
              </p>
              <button
                onClick={() => setCreating(true)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-[#3EB489] to-[#A5F3A1] text-white rounded-xl hover:scale-105 transition-all"
              >
                Create Group
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Groups;
