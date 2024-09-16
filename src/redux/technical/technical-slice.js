import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalWindowStatus: false,
  error: null,
  message: null,
  textArray: [],
  textTranslatedArray: [],
  notification: false,
  confirmation: false,
  recBtn: false,
  line: "speaker",
  display: "portrait",
  activeBtn: "stop",
  deepgramStatus: false,
  targetLanguage: "Ukrainian",
  inputLanguage: "en",
};

const technical = createSlice({
  name: "technical",
  initialState,
  reducers: {
    setModalWindowStatus: (store, action) => {
      store.modalWindowStatus = action.payload;
    },
    clearTechnicalError: (store) => {
      store.error = null;
    },
    clearTechnicalMessage: (store) => {
      store.message = null;
    },
    addSentenceTranscript: (store, action) => {
      store.textArray.push(action.payload);
    },
    addSentenceTranslated: (store, action) => {
      store.textTranslatedArray.push(action.payload);
    },
    setNotifacation: (store, action) => {
      store.notification = action.payload;
    },
    setConfirmation: (store, action) => {
      store.confirmation = action.payload;
    },
    setRecBtn: (store, action) => {
      store.recBtn = action.payload;
    },
    clearTextArray: (store) => {
      store.textArray = [];
    },
    changeLine: (store, action) => {
      store.line = action.payload;
    },
    changeDisplay: (store, action) => {
      store.display = action.payload;
    },
    setActiveBtn: (store, action) => {
      store.activeBtn = action.payload;
    },
    setDeepgramStatus: (store, action) => {
      store.deepgramStatus = action.payload;
    },
    setTargetLanguage: (store, action) => {
      store.targetLanguage = action.payload;
    },
    setInputLanguage: (store, action) => {
      store.inputLanguage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

export default technical.reducer;
export const {
  setModalWindowStatus,
  clearTechnicalError,
  clearTechnicalMessage,
  addSentenceTranscript,
  addSentenceTranslated,
  setNotifacation,
  setConfirmation,
  setRecBtn,
  clearTextArray,
  changeLine,
  changeDisplay,
  setActiveBtn,
  setDeepgramStatus,
  setTargetLanguage,
  setInputLanguage,
} = technical.actions;
