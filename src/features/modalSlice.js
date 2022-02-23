import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: 'modal',
    initialState:{
        modalIsOpen: false,
    },
    reducers:{
        openModal: (state) =>{
            state.modalIsOpen = true;
        },
        closeModal: (state) =>{
            state.modalIsOpen = false;
        },
    },
});

// open, close modal
export const { openModal, closeModal } = modalSlice.actions;

// selectors
export const selectModalIsOpen = (state) => state.modal.modalIsOpen;

export default modalSlice.reducer;
