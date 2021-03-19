import axiosConfig from '../../constantes/axiosConfig';
import {
  START_AJAX,
  END_AJAX,
  ALTA_MOVIMIENTO,
  OBTENER_MOVIMIENTOS,
  ELIMINAR_MOVIMIENTO,
  OBTENER_MOVIMIENTOPORID,
  ACTUALIZAR_MOVIMIENTO,
  OBTENER_MOVIMIENTOFECHA
} from '../../constantes/types';
import {
    BASE_MOVIMIENTOS,
    OBTNERMOVIMIENTOS,
    URL_MOVIMIENTOID,
    URL_FECHAMOVIMIENTO
} from '../../constantes/constantes';
import { almacenarObjetoStorage } from '../../utilidades/asyncStorage';


export const guardarMovimiento = (movimiento) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .post(BASE_MOVIMIENTOS, 
            {
                empleadoId: movimiento.empleadoId, 
                cantidadEntregasRecorrido: movimiento.cantidadEntregasRecorrido, 
                tipoRolCubirtoId: movimiento.tipoRolCubirtoId, 
                fechaMovimiento: movimiento.fechaMovimiento, 
                importeTotalRecorrido: movimiento.importeTotalRecorrido, 
                usuarioCreacionId: movimiento.usuarioCreacionId
            })
          .then(({ data }) => {
            dispatch({ type: ALTA_MOVIMIENTO, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const obtenerMovimientos = () => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(BASE_MOVIMIENTOS, {})
          .then(({ data }) => {
            almacenarObjetoStorage(OBTNERMOVIMIENTOS, data);
            dispatch({ type: OBTENER_MOVIMIENTOS, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const eliminarMovimiento= (movimiento) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .delete(BASE_MOVIMIENTOS + movimiento.id +'/'+movimiento.usuarioModificacionId)
          .then(({ data }) => {
            dispatch({ type: ELIMINAR_MOVIMIENTO, payload: data });
            resolve();
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const obtenerMovimienoPorId= (movimientoId) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(`${BASE_MOVIMIENTOS}${URL_MOVIMIENTOID}`, {params:{id: JSON.stringify(movimientoId)}})
          .then(({ data }) => {
            dispatch({ type: OBTENER_MOVIMIENTOPORID, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };
  export const obtenerMovimienoPorFecha= (FechaMovimiento) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(`${BASE_MOVIMIENTOS}${URL_FECHAMOVIMIENTO}`, {params:{fechaMovimiento: JSON.stringify(FechaMovimiento)}})
          .then(({ data }) => {
            dispatch({ type: OBTENER_MOVIMIENTOFECHA, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };

  export const actualizarMovimiento = (movimiento) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .put(BASE_MOVIMIENTOS, 
            {
                id: movimiento.id,
                empleadoId: movimiento.empleadoId, 
                cantidadEntregasRecorrido: movimiento.cantidadEntregasRecorrido, 
                tipoRolCubirtoId: movimiento.tipoRolCubirtoId, 
                fechaMovimiento: movimiento.fechaMovimiento, 
                importeTotalRecorrido: movimiento.importeTotalRecorrido, 
                usuarioModificacionId: movimiento.usuarioModificacionId
            })
          .then(({ data }) => {
            dispatch({ type: ACTUALIZAR_MOVIMIENTO, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };