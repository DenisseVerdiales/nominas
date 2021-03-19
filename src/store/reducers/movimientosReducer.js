import {
    ALTA_MOVIMIENTO,
    OBTENER_MOVIMIENTOS,
    ELIMINAR_MOVIMIENTO,
    OBTENER_MOVIMIENTOPORID,
    ACTUALIZAR_MOVIMIENTO,
    OBTENER_MOVIMIENTOFECHA
  } from '../../constantes/types';
  

  const initialState = {
    movimiento: [],
    obtenerMovimientos:[],
    movimientoEliminado:[],
    movimientoPorId:{},
    movimientoActualizado:{},
    movimientoFecha:[]
  };
  const movimientoReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALTA_MOVIMIENTO:
            return { ...state, movimiento: action.payload };
        case OBTENER_MOVIMIENTOS:
          return { ...state, obtenerMovimientos: action.payload };
        case ELIMINAR_MOVIMIENTO:
        return { ...state, movimientoEliminado: action.payload };
        case OBTENER_MOVIMIENTOPORID:
          return { ...state, movimientoPorId: action.payload };
        case ACTUALIZAR_MOVIMIENTO:
          return { ...state, movimientoActualizado: action.payload };
        case OBTENER_MOVIMIENTOFECHA:
          return { ...state, movimientoFecha: action.payload };
        default:
            return state;
    }
  };
  
  export default movimientoReducer;
  