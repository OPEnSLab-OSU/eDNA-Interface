import {
	createContext,
	h 
} from "preact";

const AppContext = createContext();
const AppContextProvider = AppContext.Provider;
export { AppContext, AppContextProvider };