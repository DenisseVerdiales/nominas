import {
    OBTENER_TIPOBONO
  } from '../../constantes/types';
  

  const initialState = {
    tipoBonoEntrega: {},
  };
  const movimientoReducer = (state = initialState, action) => {
    switch (action.type) {
        case OBTENER_TIPOBONO:
            return { ...state, tipoBonoEntrega: action.payload };
        default:
            return state;
    }
  };
  
  export default movimientoReducer;
  