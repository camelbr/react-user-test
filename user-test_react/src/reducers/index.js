import { combineReducers } from "redux";
import errosReducer from "./errosReducer";
import usuarioReducer from "./usuarioReducer";

export default combineReducers({
  //
  erros: errosReducer,
  usuario: usuarioReducer
});
