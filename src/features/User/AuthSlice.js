import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";


import AuthService from "../../Services/auth.services";
import {fetchProjectsByUserId} from "../Projects/ProjectSlice";
import {useDispatch} from "react-redux";
import {reserialize} from "../../helpers/transformations";

const user = JSON.parse(localStorage.getItem("user"));

export const register = createAsyncThunk("auth/register", async ({
                                                                     firstname, lastname, username, password
                                                                 }, thunkAPI) => {
    try {
        const response = await AuthService.register(firstname, lastname, username, password);

        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue();
    }
});

export const login = createAsyncThunk("auth/login", async ({username, password}, thunkAPI) => {

    try {
        const data = await AuthService.login(username, password);

        thunkAPI.dispatch(fetchProjectsByUserId(data.id))
        return {user: data};
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        // thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue();
    }
});


export const modifyUser = createAsyncThunk("auth/modifyUser", async (user, thunkAPI) => {
    try {
        const data = await AuthService.modifyUser(user);
        return data

    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        console.log(error)
        return thunkAPI.rejectWithValue();
    }
});
export const logout = createAsyncThunk("auth/logout", async () => {
    await AuthService.logout();

});

const initialState = {isLoggedIn: false, user: null};

export const authSlice = createSlice({
    name: "auth", initialState, reducers: {
        clearState: (state) => {
            state.isLoggedIn = false
            state.user = null
        },
        modifyPrice: (state, action) => {

            state.user.attributes.price = action.payload
        },
        modifyPasword: (state, action) => {
            state.user.attributes.password = action.payload
        },
        modifyUserInfo(state, action) {
            state.user.attributes = action.payload
        }
    }, extraReducers: {
        [register.fulfilled]: (state, action) => {
            state.isLoggedIn = false;
        }, [register.rejected]: (state, action) => {
            state.isLoggedIn = false;
        }, [login.fulfilled]: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user;

        }, [login.pending]: (state, action) => {
            state.isLoggedIn = false;
            state.user = null;
        }, [login.rejected]: (state, action) => {
            state.isLoggedIn = false;
            state.user = null;
        }, [logout.fulfilled]: (state, action) => {
            state.isLoggedIn = false;
            state.user = null;

        }

    },
});

export const {clearState, modifyPrice, modifyPasword,modifyUserInfo} = authSlice.actions
export const authSelector = state => state.auth
