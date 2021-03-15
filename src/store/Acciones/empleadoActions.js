import axiosConfig from '../../constantes/axiosConfig';
import {
  START_AJAX,
  END_AJAX,
  OBTENER_TIPO_EMPLEADO,
  OBTENER_JORNADA_LABORAL,
  OBTENER_ROL,
  ALTA_EMPLEADO,
  OBTENER_EMPLEADOS,
  ELIMINAR_EMPLEADO,
  OBTENER_EMPLEADOPORID,
  ACTUALIZAR_EMPLEADO
} from '../../constantes/types';
import {
    BASE_EMPLEADO,
    BASE_TIPO_EMPLEADO,
    BASE_JORNADA_LABORAL,
    BASE_ROL,
    CBOTIPOEMPLEADO,
    CBOJORNADA,
    CBOROL,
    OBTENEREMPLEADOS,
    URL_EMPLEADOID
} from '../../constantes/constantes';
import { almacenarObjetoStorage } from '../../utilidades/asyncStorage';

  export const guardarEmpleado = (empleado) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .post(BASE_EMPLEADO, 
            {
              nombre: empleado.nombre,
              apellidoPaterno: empleado.apellidoPaterno,
              apellidoMaterno: empleado.apellidoMaterno,
              fechaNacimiento: empleado.fechaNacimiento,
              domicilio: empleado.domicilio,
              tipoEmpleadoId: empleado.tipoEmpleadoId,
              rolId: empleado.rolId,
              jornadaLaboralId: empleado.jornadaLaboralId,
              usuarioCreacionId: empleado.usuarioCreacionId
            })
          .then(({ data }) => {
            dispatch({ type: ALTA_EMPLEADO, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const actualizarEmpleado = (empleado) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .put(BASE_EMPLEADO, 
            {
              id: empleado.id,
              nombre: empleado.nombre,
              apellidoPaterno: empleado.apellidoPaterno,
              apellidoMaterno: empleado.apellidoMaterno,
              fechaNacimiento: empleado.fechaNacimiento,
              domicilio: empleado.domicilio,
              tipoEmpleadoId: empleado.tipoEmpleadoId,
              rolId: empleado.rolId,
              jornadaLaboralId: empleado.jornadaLaboralId,
              usuarioModificacionId: empleado.usuarioModificacionId
            })
          .then(({ data }) => {
            dispatch({ type: ACTUALIZAR_EMPLEADO, payload: data });
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
          .get(BASE_TIPO_EMPLEADO, {})
          .then(({ data }) => {
            almacenarObjetoStorage(CBOTIPOEMPLEADO, data);
            dispatch({ type: OBTENER_TIPO_EMPLEADO, payload: data });
            resolve();
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
            almacenarObjetoStorage(CBOJORNADA, data);
            dispatch({ type: OBTENER_JORNADA_LABORAL, payload: data });
            resolve();
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
            almacenarObjetoStorage(CBOROL, data);
            dispatch({ type: OBTENER_ROL, payload: data });
            resolve();
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const obtenerEmpleados= () => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(BASE_EMPLEADO, {})
          .then(({ data }) => {
            almacenarObjetoStorage(OBTENEREMPLEADOS, data);
            dispatch({ type: OBTENER_EMPLEADOS, payload: data });
            resolve();
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const eliminarEmpleados= (empleado) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .delete(BASE_EMPLEADO + empleado.id +'/'+empleado.usuarioModificacionId)
          .then(({ data }) => {
            dispatch({ type: ELIMINAR_EMPLEADO, payload: data });
            resolve();
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const obtenerEmpleadoPorId= (empleadoId) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(`${BASE_EMPLEADO}${URL_EMPLEADOID}`, {params:{id: JSON.stringify(empleadoId)}})
          .then(({ data }) => {
            dispatch({ type: OBTENER_EMPLEADOPORID, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };
  