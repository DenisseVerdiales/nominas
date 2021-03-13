import axiosConfig from '../../constantes/axiosConfig';
import {
  START_AJAX,
  END_AJAX,
  OBTENER_TIPO_EMPLEADO
} from '../../constantes/types';
import {
    BASE_EMPLEADO,
    BASE_TIPO_EMPLEADO
} from '../../constantes/constantes';


export const guardarEmpleado = (empleado) => (dispatch) => {
    dispatch({ type: START_AJAX });
    console.log(empleado);
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .post(BASE_EMPLEADO, {
            nombre: empleado.nombre,
            apellidoPaterno: empleado.apellidoPaterno,
            apellidoMaterno: empleado.apellidoMaterno,
            fechaNacimiento: empleado.fechaNacimiento,
            domicilio: empleado.domicilio,
            tipoEmpleadoId: empleado.tipoEmpleadoId,
            rolId: empleado.rolId,
            jornadaLaboralId: empleado.jornadaLaboralId,
            activo: true,
            fechaCreacion: Date()
          })
          .then(({ data }) => {
            dispatch();
            resolve(data);
          })
          .catch((error) => {
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
          .get(BASE_TIPO_EMPLEADO)
          .then(({ data }) => {
            dispatch({ type: OBTENER_TIPO_EMPLEADO, payload: data });
            resolve();
          })
          .catch((error) => {
              console.log(error);
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };
  