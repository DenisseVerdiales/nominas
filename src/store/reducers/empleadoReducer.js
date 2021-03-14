import {
    OBTENER_TIPO_EMPLEADO,
    OBTENER_JORNADA_LABORAL,
    OBTENER_ROL
  } from '../../constantes/types';
  
  const initialState = {
    empleados: [],
    tipoEmpleado:[],
    jornadaLaboral:[],
    rol:[]
  };
  const usuarioReducer = (state = initialState, action) => {
    switch (action.type) {
        case OBTENER_TIPO_EMPLEADO:
            return { ...state, tipoEmpleado: action.payload };
        case OBTENER_JORNADA_LABORAL:
          return { ...state, jornadaLaboral: action.payload };
        case OBTENER_ROL:
        return { ...state, rol: action.payload }
        default:
            return state;
    }
  };
  
  export default usuarioReducer;
  