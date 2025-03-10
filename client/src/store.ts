import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from './redux/counterSlice'
import { modalSlice } from './redux/modalSlice'
import { calendarSlice } from './redux/calendarSlice'
import { clientSlice } from './redux/clientSlice'
import { projectSlice } from './redux/projectSlice'

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    modal: modalSlice.reducer,
    calendar: calendarSlice.reducer,
    client: clientSlice.reducer,
    project: projectSlice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch