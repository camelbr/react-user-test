import { GET_ERROS } from "../acoes/tipos";

const estadoInicial = {};

export default function(state = estadoInicial, acao) {
  switch (acao.type) {
    case GET_ERROS:
      return acao.retorno;
    default:
      return state;
  }
}
