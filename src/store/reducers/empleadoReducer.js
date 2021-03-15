import {
    OBTENER_TIPO_EMPLEADO,
    OBTENER_JORNADA_LABORAL,
    OBTENER_ROL,
    ALTA_EMPLEADO,
    OBTENER_EMPLEADOS,
    ELIMINAR_EMPLEADO,
    OBTENER_EMPLEADOPORID,
    ACTUALIZAR_EMPLEADO
  } from '../../constantes/types';
  
  const initialState = {
    empleados: [],
    tipoEmpleado:[],
    jornadaLaboral:[],
    rol:[],
    registroEmpleado:[],
    empleadoEliminado:[],
    empleadoPorId:{},
    empleadoModificado:[]
  };
  const usuarioReducer = (state = initialState, action) => {
    switch (action.type) {
        case OBTENER_TIPO_EMPLEADO:
            return { ...state, tipoEmpleado: action.payload };
        case OBTENER_JORNADA_LABORAL:
          return { ...state, jornadaLaboral: action.payload };
        case OBTENER_ROL:
        return { ...state, rol: action.payload };
        case ALTA_EMPLEADO:
          return { ...state, empleados: action.payload };
        case OBTENER_EMPLEADOS:
        return { ...state, registroEmpleado: action.payload };
        case ELIMINAR_EMPLEADO:
        return { ...state, empleadoEliminado: action.payload };
        case OBTENER_EMPLEADOPORID:
        return { ...state, empleadoPorId: action.payload };
        case ACTUALIZAR_EMPLEADO:
          return { ...state, empleadoModificado: action.payload };
        default:
            return state;
    }
  };
  
  export default usuarioReducer;
  