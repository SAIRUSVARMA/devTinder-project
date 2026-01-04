import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  emailId: "",
  photoURL: "", // expects a Cloudinary image or default
  _id: "", // optional but useful for fetching/updating
};

const userSlice = createSlice({
  name: "user",
  initialState: null, // start as null until user logs in or signs up
  reducers: {
    addUser: (state, action) => {
      return { ...action.payload }; // replaces state with new user data
    },
    updateUser: (state, action) => {
      if (state) {
        return { ...state, ...action.payload }; // merge updates like photoURL
      }
      return state;
    },
    removeUser: () => null, // logs out
  },
});

export const { addUser, updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
