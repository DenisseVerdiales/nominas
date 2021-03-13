import {
    OBTENER_TIPO_EMPLEADO
  } from '../../constantes/types';
  
  const initialState = {
    empleados: [],
    tipoEmpleado:[]
  };
  const usuarioReducer = (state = initialState, action) => {
    switch (action.type) {
        case OBTENER_TIPO_EMPLEADO:
            return { ...state, tipoEmpleado: action.payload };
        default:
            return state;
    }
  };
  
  export default usuarioReducer;
  