import {
    INICIAR_SESION,
    CERRAR_SESION,
    VALIDAR_SESION_LOCAL,
    START_AJAX,
    END_AJAX,
    OBTENER_OPCIONMENU
  } from '../../constantes/types';
  
  const initialState = {
    usuarioLogin: {},
    ajax: 0,
    opcionMenu:0
  };
  const usuarioReducer = (state = initialState, action) => {
    switch (action.type) {
      case INICIAR_SESION:
        return { ...state, usuarioLogin: action.payload };
      case CERRAR_SESION:
        return { ...state, usuarioLogin: {} };
      case VALIDAR_SESION_LOCAL:
        return { ...state, usuarioLogin: action.payload };
      case OBTENER_OPCIONMENU:
        return { ...state, opcionMenu: action.payload };
      case START_AJAX:
        return { ...state, ajax: state.ajax + 1 };
      case END_AJAX:
        return { ...state, ajax: state.ajax > 0 ? state.ajax - 1 : 0 };
      default:
        return state;
    }
  };
  
  export default usuarioReducer;
  