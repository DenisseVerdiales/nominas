import axiosConfig from '../../constantes/axiosConfig';
import {
  START_AJAX,
  END_AJAX,
  OBTENER_TIPOBONO
} from '../../constantes/types';
import {
    BASE_TIPOBONO,
    URL_TIPOBONO,
    OBTENERBONOENTREGAS
} from '../../constantes/constantes';
import { almacenarObjetoStorage } from '../../utilidades/asyncStorage';

  export const obtenerBonoPorTipoBono= (tipoBono) => (dispatch) => {
    dispatch({ type: START_AJAX });
    return new Promise(
      (resolve, reject) => {
        axiosConfig
          .get(`${BASE_TIPOBONO}${URL_TIPOBONO}`, {params:{tipoBono: tipoBono}})
          .then(({ data }) => {
            almacenarObjetoStorage(OBTENERBONOENTREGAS,data)
            dispatch({ type: OBTENER_TIPOBONO, payload: data });
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => dispatch({ type: END_AJAX }));
      },
    );
  };
  