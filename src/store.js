import { configureStore } from '@reduxjs/toolkit'
import authReducer from './components/auth/authSlice'

export default configureStore({
    reducer: {
        auth: authReducer,
    },
})