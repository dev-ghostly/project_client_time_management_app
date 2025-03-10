// Create a slice with clients in it
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Client {
    id: number;
    name: string;
    color: string;
}

interface ClientState {
    clients: Client[];
}

const initialState: ClientState = {
    clients: [

    ]
}

export const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        initClients(state, action: PayloadAction<Client[]>) {
            state.clients = action.payload;
        },
    }
});

export const { initClients } = clientSlice.actions;

export default clientSlice.reducer;