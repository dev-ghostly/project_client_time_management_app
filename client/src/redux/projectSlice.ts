// create Slice for the projects
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: number;
  name: string;
  color: string;
  tasks: string[];
  client: string;
}

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    initProject (state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    }
  },
});

export const { initProject } = projectSlice.actions;

export default projectSlice.reducer;