import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import sagas from "./sagas";
import { createRootReducer } from "./reducers";

const sagaMiddleware = createSagaMiddleware();

// type initialState as any first, need to type Store properly
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const configureStore = (initialState?: any): ReturnType<typeof createStore> => {
  const store = createStore(createRootReducer, initialState, composeWithDevTools(applyMiddleware(sagaMiddleware)));
  sagaMiddleware.run(sagas);
  return store;
};
