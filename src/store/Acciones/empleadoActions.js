import axiosConfig from '../../constantes/axiosConfig';
import {
  START_AJAX,
  END_AJAX,
  OBTENER_TIPO_EMPLEADO,
  OBTENER_JORNADA_LABORAL,
  OBTENER_ROL
} from '../../constantes/types';
import {
    BASE_EMPLEADO,
    BASE_TIPO_EMPLEADO,
    BASE_JORNADA_LABORAL,
    BASE_ROL
} from '../../constantes/constantes';


export const guardarEmpleado = (empleado) => (dispatch) => {
    dispatch({ type: START_AJAX });
    console.log("LLEGO",empleado);
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .post(BASE_EMPLEADO, 
            {
              nombre: empleado.nombre,
              apellidoPaterno: empleado.apellidoPaterno,
              apellidoMaterno: empleado.apellidoMaterno,
              fechaNacimiento: empleado.fechaNac,
              domicilio: empleado.domicilio,
              tipoEmpleadoId: empleado.tipoEmpleados,
              rolId: empleado.rol,
              jornadaLaboralId: empleado.jornadaLaboral,
              usuarioCreacionId: empleado.usuarioLogin.id
            })
          .then(({ data }) => {
            console.log("ALTAEM",data);
            dispatch();
            resolve(data);
          })
          .catch((error) => {
            console.log("error",error);
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };


export const obtenerTipoEmpleado = () => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(BASE_TIPO_EMPLEADO, {})
          .then(({ data }) => {
            dispatch({ type: OBTENER_TIPO_EMPLEADO, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const obtenerJornadaLaboral = () => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(BASE_JORNADA_LABORAL, {})
          .then(({ data }) => {
            dispatch({ type: OBTENER_JORNADA_LABORAL, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };


  export const obtenerRol= () => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(BASE_ROL, {})
          .then(({ data }) => {
            dispatch({ type: OBTENER_ROL, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };
  