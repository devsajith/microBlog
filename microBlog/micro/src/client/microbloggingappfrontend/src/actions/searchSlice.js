import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const searchSlice = createSlice({
  name: "searchValue",
  initialState,
  reducers: {
    searchInput: (state, action) => {
      return action.payload;
    },
    clearSearchValue: (state, action) => {
      return initialState;
    },
  },
});

export const getSearchValue = (state) => state.searchValue;

export const { searchInput, clearSearchValue } = searchSlice.actions;

export default searchSlice.reducer;
