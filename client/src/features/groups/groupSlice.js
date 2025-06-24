import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  groups: [],
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
    addMemberToGroup: (state, action) => {
      const { groupId, member } = action.payload;
      const group = state.groups.find((g) => g.groupId === groupId);
      if (group) {
        group.members.push(member);
      }
    },
    addExpenseToGroup: (state, action) => {
      const { groupId, expense } = action.payload;
      const group = state.groups.find((g) => g.groupId === groupId);
      if (group) {
        group.expenses.push(expense);
      }
    },
    resetGroups: (state) => {
      state.groups = [];
    }
  },
});

export const {
  setGroups,
  addGroup,
  addMemberToGroup,
  addExpenseToGroup,
  resetGroups
} = groupSlice.actions;

export default groupSlice.reducer;
