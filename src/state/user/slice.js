import { createSlice } from "@reduxjs/toolkit";
import { getProfileAPI, loginAPI, signupAPI } from "./api";

const initialState = {
	token: null,
	profile: null,
	loading: false,
	error: null,
};

const slice = createSlice({
	name: "user",
	initialState,
	reducers: {
		showLoading(state) {
			state.loading = true;
			state.profile = null;
			state.error = null;
		},
		hideLoading(state) {
			state.loading = false;
			state.profile = null;
			state.error = null;
		},
		logout(state) {
			state.token = null;
			state.profile = null;
			state.loading = false;
			state.error = null;
			localStorage.removeItem("auth-token");
			localStorage.removeItem("user-id");
		},
		loginSuccess(state, action) {
			state.token = action.payload.data.token;
			state.profile = action.payload.data.user;
			localStorage.setItem("user-id", state.profile._id);
			state.loading = false;
			state.error = null;
		},
		loginFailed(state, action) {
			state.profile = null;
			state.error = action.payload ?? "login error";
			state.loading = false;
		},
		loadProfileSuccess(state, action) {
			state.profile = action.payload;
			state.loading = false;
			state.error = null;
		},
		loadProfileFailed(state, action) {
			state.profile = null;
			state.error = action.payload ?? "profile error";
			state.loading = false;
		},
		signupSuccess(state, action) {
			state.signupSuccessMessage = action.payload;
			state.loading = false;
			state.error = null;
		},
		signupFailed(state, action) {
			state.profile = null;
			state.error = action.payload
				? action.payload.data ?? "signup error"
				: "signup error";
			state.loading = false;
		},
	},
});

export const {
	showLoading,
	hideLoading,
	logout,
	loginSuccess,
	loginFailed,
	signupSuccess,
	signupFailed,
	loadProfileSuccess,
	loadProfileFailed,
} = slice.actions;

export default slice.reducer;

export const signup = (payload, callback) => async (dispatch) => {
	dispatch(showLoading());
	try {
		const res = await signupAPI(payload);
		dispatch(signupSuccess(res.data));
		if (callback !== undefined) callback();
	} catch (error) {
		dispatch(signupFailed(error));
	}
};

export const loadprofile = (payload) => async (dispatch) => {
	dispatch(showLoading());
	try {
		const res = await getProfileAPI(payload);
		dispatch(loadProfileSuccess(res.data));
	} catch (err) {
		dispatch(loadProfileFailed(err));
	}
};

export const login = (payload) => async (dispatch) => {
	dispatch(showLoading());
	try {
		const res = await loginAPI(payload);
		dispatch(loginSuccess(res.data));
		//loadprofile()(dispatch);
	} catch (err) {
		dispatch(loginFailed(err));
	}
};
