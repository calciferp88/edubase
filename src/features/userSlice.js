import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: "user",
    initialState:{
      user:null,
    },
    reducers: {
      login: (state, action) =>{
          state.user = action.payload;
      },
      logout: (state) => {
        state.user = null;
      }
    },
});

// actions export
export const { login, logout } = userSlice.actions;

// selector export
export const selectUser = state => state.user.user;

// slice export
export default userSlice.reducer;




