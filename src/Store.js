import React, { createContext, useReducer } from 'react';

const initialState = {
  loading: true,
  modalOpen: false,
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case 'GLOBAL_SET_MODAL_OPEN':
      const { modalOpen } = action;
      return { ...state, modalOpen };
    default:
      return { ...state };
  }
}

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
