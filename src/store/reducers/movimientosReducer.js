import {
    ALTA_MOVIMIENTO
  } from '../../constantes/types';
  

  const initialState = {
    movimiento: [],
  };
  const movimientoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALTA_MOVIMIENTO:
            return { ...state, movimiento: action.payload };
        default:
            return state;
    }
  };
  
  export default movimientoReducer;
  