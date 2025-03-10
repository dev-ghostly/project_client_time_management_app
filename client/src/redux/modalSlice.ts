import { createSlice } from '@reduxjs/toolkit'

export interface ModalState {
    modalStartSession: boolean
    modalCreateClient: boolean
    modalCreateProject: boolean
    modalModifyEvent: boolean
    modalCreateSession: boolean
    actualEvent: any
    modifiedActualEvent: any
}

const initialState: ModalState = {
    modalStartSession: false,
    modalCreateClient: false,
    modalCreateProject: false,
    modalModifyEvent: false,
    modalCreateSession: false,
    actualEvent: null,
    modifiedActualEvent: null
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModalStartSession: (state) => {
        state.modalStartSession = true
    },
    closeModalStartSession: (state) => {
        state.modalStartSession = false
    },
    openModalCreateClient: (state) => {
        state.modalCreateClient = true
    },
    closeModalCreateClient: (state) => {
        state.modalCreateClient = false
    },
    openModalCreateProject: (state) => {
        state.modalCreateProject = true
    },
    closeModalCreateProject: (state) => {
        state.modalCreateProject = false
    },
    openModalModifyEvent: (state) => {
        state.modalModifyEvent = true
    },
    closeModalModifyEvent: (state) => {
        state.modalModifyEvent = false
    },
    setActualEvent: (state, action) => {
        state.actualEvent = action.payload
    },
    setModifiedActualEvent: (state, action) => {
        state.modifiedActualEvent = action.payload
    },
    updateActualEvent: (state, action) => {
        state.modifiedActualEvent = { ...state.modifiedActualEvent, ...action.payload };
    },
    openModalCreateSession: (state) => {
        state.modalCreateSession = true
    },
    closeModalCreateSession: (state) => {
        state.modalCreateSession = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { 
    openModalStartSession, 
    closeModalStartSession, 
    openModalCreateClient, 
    closeModalCreateClient, 
    openModalCreateProject, 
    closeModalCreateProject, 
    openModalModifyEvent, 
    closeModalModifyEvent, 
    setActualEvent, 
    updateActualEvent, 
    setModifiedActualEvent,
    openModalCreateSession,
    closeModalCreateSession
} = modalSlice.actions

export default modalSlice.reducer