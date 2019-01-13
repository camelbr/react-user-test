import axios from "axios";
import {
  GET_ERROS,
  SIGNIN,
  SIGNUP
} from "./tipos";

export const addUser = (user, history) => async dispatch => {
  try {
    const r = await axios.post("http://localhost:8080/user", user);
    history.push("/signup");
    dispatch({
      type: SIGNUP,
      retorno: r.data
    });
  } catch (erro) {
    dispatch({
      type: GET_ERROS,
      retorno: erro.response.data
    });
  }
};

export const login = (user, history) => async dispatch => {
  try {
    var uri = JSON.stringify(user);
    const r = await axios.get(`http://localhost:8080/user/signin/${encodeURI(uri)}}`);
    history.push("/me");
    dispatch({
      type: SIGNIN,
      retorno: r.data
    });
  } catch (erro) {
    dispatch({
      type: GET_ERROS,
      retorno: erro.response.data
    });
  }
};
