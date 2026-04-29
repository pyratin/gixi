import { createContext } from 'react';

const Context = createContext(undefined);

const ContextProvider = ({ children }) => (
  <Context.Provider value={{}}>{children}</Context.Provider>
);

export { Context, ContextProvider };
