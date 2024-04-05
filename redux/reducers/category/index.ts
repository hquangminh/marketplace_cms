import { createSlice } from '@reduxjs/toolkit';
import { categoryReducer } from 'models/category.model';
import { RootState } from 'redux/store';

const initialState: categoryReducer = {
  data: [],

  loading: false,
  loadingCreate: false,
  loadingDelete: false,
  loadingUpdate: false,

  msg: '',
};

export const usersSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Get All Category
    getAllCategoryPending(state) {
      state.loading = true;
    },
    getAllCategorySuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    getAllCategoryFailed(state, action) {
      state.loading = false;
      state.data = [];
      state.msg = action.payload;
    },

    // Create Category
    createCategoryPending(state) {
      state.loadingCreate = true;
    },
    createCategorySuccess(state, action) {
      state.loadingCreate = false;
      state.data.push(action.payload);
    },
    createCategoryFailed(state, action) {
      state.loadingCreate = false;
      state.msg = action.payload;
    },

    // Delete Category
    deleteCategoryPending(state) {
      state.loadingDelete = true;
    },
    deleteCategorySuccess(state, action) {
      const newData = state.data.filter((item) => item.id !== action.payload);
      state.data = newData;
      state.loadingDelete = false;
    },
    deleteCategoryFailed(state) {
      state.loadingDelete = false;
    },

    // Update Category
    updateCategoryPending(state) {
      state.loadingUpdate = true;
    },
    updateCategorySuccess(state, action) {
      const { id, data } = action.payload;

      const newData = state.data.map((item) => (item.id === id ? data : item));

      state.loadingUpdate = false;
      state.data = newData;
    },
    updateCategoryFailed(state) {
      state.loadingUpdate = false;
    },
  },
});

export const {
  // Get All Category
  getAllCategoryPending,
  getAllCategorySuccess,
  getAllCategoryFailed,

  // Create Category
  createCategoryPending,
  createCategorySuccess,
  createCategoryFailed,

  // Delete Category
  deleteCategoryPending,
  deleteCategorySuccess,
  deleteCategoryFailed,

  // Update Category
  updateCategoryPending,
  updateCategorySuccess,
  updateCategoryFailed,
} = usersSlice.actions;

export const selectCategoryState = (state: RootState) => state.category;

export default usersSlice.reducer;
