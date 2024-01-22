import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from 'firebase/database';
import toast from "react-hot-toast";

export const signInAsync = createAsyncThunk(
    'auth/signInAsync',
    async (userData) => {
        try {
            const response = await signInWithEmailAndPassword(auth, userData.email, userData.password);
            // console.log(response.user)
            return response.user;
        } catch (error) {
            if (error.message === 'Firebase: Error (auth/invalid-credential).') {
                toast.error('Invalid credential');
            } else {
                toast.error(`Sign In Failed: ${error.message}`);
            }
            throw error;
        }
    }
);

export const signUpAsync = createAsyncThunk(
    'auth/signUpAsync',
    async (userData) => {
        const response = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        await updateProfile(response.user, { displayName: userData.name });
        const user = response.user
        set(ref(db, 'users/' + user.uid), {
            username: userData.name,
            email: userData.email,
            id: user.uid
        });
        return response.user;
    }
);



export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loggedInUser: null,
        status: 'idle'
    },
    reducers: {
        signOut: (state) => {
            state.loggedInUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signInAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                // Extracting necessary user information
                const { uid, email, displayName } = action.payload;
                console.log(action.payload)
                state.loggedInUser = { uid, email, displayName };
            })
            .addCase(signUpAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signUpAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                // Extracting necessary user information
                const { uid, email, displayName } = action.payload;
                state.loggedInUser = { uid, email, displayName };
            });
    },
});

export const selectLoggedInUser = (state) => state.auth.loggedInUser
export const { signOut } = authSlice.actions;
export default authSlice.reducer;
