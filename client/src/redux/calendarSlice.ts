import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a proper interface for event objects
export interface Event {
  _id: string;
  title: string;
  start: {
    hour: number;
    minute: number;
  },
  end: {
      hour: number;
      minute: number;
  },
  startTime : Date;
  endTime : Date;
  type : string;
}

// Define the state interface
interface CalendarState {
  events: Event[];
  day: Date;
  calendar: any;
  client_timer: any;
  project_timer: any;
}

// Initialize the state properly
const initialState: CalendarState = {
  events: [],
  day: new Date(),
  calendar: [],
  client_timer: [],
  project_timer: [],
};

// Create the slice with a strongly-typed reducer
export const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addSingleEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateDay: (state, action: PayloadAction<Date>) => {
      state.day = action.payload;
    },
    addCalendar: (state, action: PayloadAction<any>) => {
      state.calendar = action.payload;
    },
    addClientTimer: (state, action: PayloadAction<any>) => {
      state.client_timer = action.payload;
    },
    addProjectTimer: (state, action: PayloadAction<any>) => {
      state.project_timer = action.payload;
    },
  },
});

// Export actions and reducer
export const { addEvent, addSingleEvent, updateDay, addCalendar, addClientTimer, addProjectTimer } = calendarSlice.actions;
export default calendarSlice.reducer;