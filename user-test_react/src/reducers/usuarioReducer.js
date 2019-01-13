import {
  SIGNIN, SIGNUP
} from "../acoes/tipos";

const estadoInicial = {
  usuarios: [],
  usuario: {}
};

export default function(state = estadoInicial, acao) {
  switch (acao.type) {
    case SIGNIN:
    case SIGNUP:
      return {
        ...state,
        usuario: acao.retorno
      };

    default:
      return state;
  }
}
