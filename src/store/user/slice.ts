import { useDispatch, useSelector } from 'react-redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { State, Dispatch } from '../../utils/store';
import { IUser, IUserState, ILoginSuccess } from './types';

const initialState: IUserState = {
  loggedIn: false,
  user: undefined,
  token: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedIn: (state: IUserState, { payload }: PayloadAction<ILoginSuccess>) => {
      state.user = payload.user;
      state.token = payload.token;
      state.loggedIn = true;
    },
    setUser: (state: IUserState, { payload }: PayloadAction<IUser | undefined>) => {
      state.user = payload;
    },
    logout: () => initialState,
    reset: () => initialState,
  },
});

export function useUserSlice() {
  const dispatch = useDispatch<Dispatch>();
  const state: any = useSelector(({ app }: State) => app);
  return { dispatch, ...state, ...slice.actions };
}

export default slice.reducer;
