import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const estadoInicial = {};
const middleware = [thunk];

// necessário para usar plugin de desenvolvimento 'Redux' do Chrome
const DevToolsReactRedux =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
let store;

if (window.navigator.userAgent.includes("Chrome") && DevToolsReactRedux) {
  store = createStore(
    rootReducer,
    estadoInicial,
    compose(
      applyMiddleware(...middleware),
      DevToolsReactRedux
    )
  );
} else {
  store = createStore(
    rootReducer,
    estadoInicial,
    compose(applyMiddleware(...middleware))
  );
}


export default store;