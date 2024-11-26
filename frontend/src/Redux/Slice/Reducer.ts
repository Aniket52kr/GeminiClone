import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import runChat from "../../config/gemini";

const server = import.meta.env.VITE_SERVER;

// Define the user type
export interface UserType {
  uid: string;
  photo: string;
}

// Fetch user data with fallback for development
export const fetchUser = createAsyncThunk<UserType, void>(
  "fetch/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${server}/api-v1/user`);
      if (!response.ok) {
        console.warn("User endpoint not found, using fallback data");
        return { uid: 'fallback-uid', photo: 'fallback-photo-url' };
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

// Define the arguments for fetching Gemini results
export interface FetchGeminiResultArgs {
  prompt: string;
}

// Define the response type for fetching Gemini results
interface FetchGeminiResultResponse {
  result: string;
}

// Fetch data from Gemini AI
export const fetchGeminiResult = createAsyncThunk<
  FetchGeminiResultResponse,
  FetchGeminiResultArgs
>("fetch/geminiResult", async ({ prompt }, { rejectWithValue }) => {
  try {
    const result = await runChat(prompt);
    return { result };
  } catch (error) {
    return rejectWithValue("Failed to fetch Gemini result");
  }
});

// Define types for storing results
type StoreResultArg = {
  heading: string;
  data: string;
  user: string;
};

type StoreResultRes = {
  success: boolean;
  message: string;
};

// Store result function
export const storeResult = createAsyncThunk<StoreResultRes, StoreResultArg>(
  "store/result",
  async (data, { rejectWithValue }) => {
    try {
      const api = `${server}/api-v1/result/new`;
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseData = await response.json();
        console.error("Error while storing result:", responseData);
        throw new Error(responseData.message || "Failed to store result");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue("Failed to store result");
    }
  }
);

// Define types for getting all data
type GetAllDataType = {
  _id: string;
  heading: string;
  data: string;
  user: string;
};

type GetAllDataRes = {
  success: boolean;
  message: string;
  results: GetAllDataType[] | undefined;
};

// Get all stored data
export const getAllData = createAsyncThunk<GetAllDataRes, { user: string }>(
  "get/all",
  async (user, { rejectWithValue }) => {
    try {
      const api = `${server}/api-v1/result/all/${user.user}`;
      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch all data");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue("Failed to fetch all data");
    }
  }
);

// Fetch single data
export const getSingleData = createAsyncThunk<
  { success: boolean; message: string; result: GetAllDataType | undefined },
  string
>("get/singleData", async (id, { rejectWithValue }) => {
  try {
    const api = `${server}/api-v1/result/${id}`;
    const response = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch single data");
    }
    return await response.json();
  } catch (error) {
    return rejectWithValue("Failed to fetch single data");
  }
});

// Define initial state type
type InitialStateType = {
  loading: boolean;
  result: string | undefined;
  showResult: boolean;
  error: string | undefined;
  data: StoreResultRes | undefined;
  allData: GetAllDataRes | undefined;
  oneUser: UserType | undefined; // User state added
  oneData:
    | {
        success: boolean;
        message: string;
        result: GetAllDataType | undefined;
      }
    | undefined;
};

// Define initial state
const initialState: InitialStateType = {
  loading: false,
  result: undefined,
  data: undefined,
  showResult: false,
  error: undefined,
  allData: undefined,
  oneUser: undefined, // Initialize user state
  oneData: undefined,
};

// Create the slice
const geminiSlice = createSlice({
  name: "geminiSlice",
  initialState,
  reducers: {
    getResult: (state) => {
      state.loading = true;
      const responseString = state.result
        ?.replace(/\*\*(.*?)\*\*/g, '<br><span class="heading">$1</span><br>')
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/\*/g, "<br>");
      state.result = responseString;
      state.showResult = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch user
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.oneUser = action.payload;
      state.error = undefined;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.oneUser = undefined;
      state.error = action.payload as string;
    });

    // Fetch Gemini result
    builder.addCase(fetchGeminiResult.pending, (state) => {
      state.loading = true;
      state.result = undefined;
      state.error = undefined;
    });
    builder.addCase(fetchGeminiResult.fulfilled, (state, action) => {
      state.loading = false;
      state.result = action.payload.result;
      state.error = undefined;
    });
    builder.addCase(fetchGeminiResult.rejected, (state, action) => {
      state.loading = false;
      state.result = undefined;
      state.error = action.payload as string;
    });

    // Store result
    builder.addCase(storeResult.pending, (state) => {
      state.loading = true;
      state.data = undefined;
      state.error = undefined;
    });
    builder.addCase(storeResult.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = undefined;
    });
    builder.addCase(storeResult.rejected, (state, action) => {
      state.loading = false;
      state.data = undefined;
      state.error = action.payload as string;
    });

    // Get all data
    builder.addCase(getAllData.pending, (state) => {
      state.loading = true;
      state.allData = undefined;
      state.error = undefined;
    });
    builder.addCase(getAllData.fulfilled, (state, action) => {
      state.loading = false;
      state.allData = action.payload;
      state.error = undefined;
    });
    builder.addCase(getAllData.rejected, (state, action) => {
      state.loading = false;
      state.allData = undefined;
      state.error = action.payload as string;
    });

    // Get single data
    builder.addCase(getSingleData.pending, (state) => {
      state.loading = true;
      state.oneData = undefined;
      state.error = undefined;
    });
    builder.addCase(getSingleData.fulfilled, (state, action) => {
      state.loading = false;
      state.oneData = action.payload;
      state.error = undefined;
    });
    builder.addCase(getSingleData.rejected, (state, action) => {
      state.loading = false;
      state.oneData = undefined;
      state.error = action.payload as string;
    });
  },
});

// Export reducer and actions
export default geminiSlice.reducer;
export const { getResult } = geminiSlice.actions;
