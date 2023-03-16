import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IUserInterface {
  name?: string;
  phone?: string;
  email?: string;
  status?: string;
}

const initialState: IUserInterface = {
  name: '',
  phone: '',
  email: '',
  status: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserInterface>) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.status = action.payload.status;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
