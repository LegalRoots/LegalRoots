import { createContext } from "react";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();
export const HistoryContext = createContext(history);
