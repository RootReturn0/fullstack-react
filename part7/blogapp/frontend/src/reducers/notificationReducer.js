import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {type: 'success', content: ''},
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
    console.log(payload, seconds)
    return async dispatch => {
        dispatch(notificationSlice.actions.setNotification(payload))
        setTimeout(() => {
            dispatch(notificationSlice.actions.clearNotification())
        }, seconds * 1000)
    }
}

export default notificationSlice.reducer