import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const server = import.meta.env.VITE_SERVER; // Ensure this is loaded properly
console.log("Server URL:", server); // Log the server URL to verify it loads

// Type definitions
export type userType = {
  id: string;
  email: string;
  uid: string;
  photo: string;
  name: string;
};

export type apiResponse = {
  message: string;
  user: userType | undefined;
  success: boolean;
};

// Register user
export const fetchUser = createAsyncThunk<apiResponse, { name: string; email: string; photo: string; uid: string }>(
  "fetch/user",
  async (data) => {
    const api = `${server}/api-v1/user/new`;  // Ensure 'server' is defined
    console.log("Register User API:", api); // Log API endpoint for debugging
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    // Check for response status
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    const userData = await response.json();
    return userData;
  }
);

// Login user
export const fetchLoginUser = createAsyncThunk<apiResponse, { email: string; uid: string }>(
  "fetch/loginUser",
  async (data) => {
    const api = `${server}/api-v1/user/login`;
    console.log("Login User API:", api); // Log API endpoint for debugging
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check for response status
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    const userData = await response.json();
    return userData;
  }
);

// Get single user
export const fetchSingleUser = createAsyncThunk<apiResponse, { uid: string }>(
  "fetch/Singleuser",
  async ({ uid }) => {
    const api = `${server}/api-v1/user/isuser`;
    console.log("Fetch Single User API:", api); // Log API endpoint for debugging
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid }), // Wrap uid in an object
    });

    // Check for response status
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage}`);
    }

    const userData = await response.json();
    return userData;
  }
);

type initialStateType = {
  loading: boolean;
  user: userType | undefined;
  error: undefined | string;
  oneUser: userType | undefined;
};

const initialState: initialStateType = {
  loading: false,
  user: undefined,
  error: undefined,
  oneUser: undefined,
};

const fetchUserSlice = createSlice({
  name: "fetchUserSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle register user
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.user = undefined;
      state.error = undefined;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.error = undefined;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.user = undefined;
      state.error = action.error.message || "An error occurred";
    });

    // Handle get single user
    builder.addCase(fetchSingleUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.oneUser = undefined;
    });
    builder.addCase(fetchSingleUser.fulfilled, (state, action) => {
      state.loading = false;
      state.oneUser = action.payload.user;
      state.error = undefined;
    });
    builder.addCase(fetchSingleUser.rejected, (state, action) => {
      state.loading = false;
      state.oneUser = undefined;
      state.error = action.error.message || "An error occurred";
    });

    // Handle login user
    builder.addCase(fetchLoginUser.pending, (state) => {
      state.loading = true;
      state.user = undefined;
      state.error = undefined;
    });
    builder.addCase(fetchLoginUser.fulfilled, (state, action: PayloadAction<apiResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.error = undefined;
    });
    builder.addCase(fetchLoginUser.rejected, (state, action) => {
      state.loading = false;
      state.user = undefined;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export default fetchUserSlice.reducer; // Export the reducer to use in the store















// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// const server=import.meta.env.VITE_SERVER;
// export type userType = {
//   id: string;
//   email: string;
//   uid: string;
//   photo: string;
//   name: string;
// };
// export type apiResponse = {
//   message: string;
//   user: userType|undefined;
//   success: boolean;
//   };

// // Register user
// export const fetchUser = createAsyncThunk<
//   apiResponse,
//   { name: string; email: string; photo: string; uid: string }
// >("fetch/user", async (data) => {
//   const api = `${server}/api-v1/user/new`;
//   const response = await fetch(api, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   const userData = await response.json();
//   return userData;
// });

// // Login user
// export const fetchLoginUser = createAsyncThunk<
//   apiResponse,
//   {  email: string;uid: string }
// >("fetch/loginUser", async (data) => {
//   const api = `${server}/api-v1/user/login`;
//   const response = await fetch(api, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
//   const userData = await response.json();
//   return userData;
// });

// // get user
// export const fetchSingleUser = createAsyncThunk<apiResponse, { uid: string }>(
//   "fetch/Singleuser",
//   async (uid) => {
//     const api = `${server}/api-v1/user/isuser`;
//     const response = await fetch(api, {
//       method: "POST",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(uid),
//     });
//     const userData = await response.json();
//     return userData;
//   }
// );

// type initialStateType = {
//   loading: boolean;
//   user: userType | undefined;
//   error: undefined | string;
//   oneUer:userType|undefined;
// };

// const initialState: initialStateType = {
//   loading: false,
//   user: undefined,
//   error: undefined,
//   oneUer:undefined
// };

// const fetchUserSlice = createSlice({
//   name: "fetchUserSlice",
//   reducers: {},
//   initialState,

//   extraReducers: (builder) => {
//     // get data from the gemini api
//     builder.addCase(fetchUser.pending, (state) => {
//       state.loading = true;
//       state.user = undefined;
//       state.error = undefined;
//     }),
//       builder.addCase(fetchUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.error = undefined;
//       });
//     builder.addCase(fetchUser.rejected, (state, action) => {
//       state.loading = false;
//       state.user = undefined;
//       state.error = action.error.message || "any error occured";
//     });

//     // get single user
//     // get data from the gemini api
//     builder.addCase(fetchSingleUser.pending, (state) => {
//       state.loading = true;
//       state.error = undefined;
//       state.oneUer =undefined;
//     }),
//       builder.addCase(fetchSingleUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.oneUer = action.payload.user;
//         state.error = undefined;
//       });
//     builder.addCase(fetchSingleUser.rejected, (state, action) => {
//       state.loading = false;
//       state.oneUer =undefined;
//       state.error = action.error.message || "any error occured";
//     });

//     // Login user

//     builder.addCase(fetchLoginUser.pending, (state) => {
//       state.loading = true;
//       state.user = undefined;
//       state.error = undefined;
//     }),
//       builder.addCase(fetchLoginUser.fulfilled, (state, action:PayloadAction<apiResponse>) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.error = undefined;
//       });
//     builder.addCase(fetchLoginUser.rejected, (state, action) => {
//       state.loading = false;
//       state.user = undefined;
//       state.error = action.error.message || "any error occured";
//     });
//   },
// });

// export default fetchUserSlice.reducer;