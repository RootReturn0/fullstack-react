import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return ''
        }
    }
})

export const setNotification = (payload, seconds) => {
    return async dispatch => {
        dispatch(notificationSlice.actions.setNotification(payload))
        setTimeout(() => {
            dispatch(notificationSlice.actions.clearNotification())
        }, seconds * 1000)
    }
}

export default notificationSlice.reducer