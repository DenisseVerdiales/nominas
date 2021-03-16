import axiosConfig from '../../constantes/axiosConfig';
import {
  START_AJAX,
  END_AJAX,
  ALTA_MOVIMIENTO,
  OBTENER_MOVIMIENTOS
} from '../../constantes/types';
import {
    BASE_MOVIMIENTOS,
    OBTNERMOVIMIENTOS
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