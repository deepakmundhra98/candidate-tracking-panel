import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import BaseAPI from "@/lib/BaseAPI";

/**
 * Async action to fetch candidates
 */

const token = Cookies.get("tokenCandidate")
export const fetchCandidates = createAsyncThunk(
  "candidate/fetchCandidates",
  async () => {
    // console.log(
    //   "Fetching candidates with token:",
    //   token,
    // );
    const response = await axios.post(
      `${BaseAPI}/admin/candidates/getDetails`,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.response;
  }
);

const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default candidateSlice.reducer;
