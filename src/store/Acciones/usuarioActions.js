import md5 from 'md5';
import axiosConfig from '../../constantes/axiosConfig';
import {
  INICIAR_SESION,
  CERRAR_SESION,
  VALIDAR_SESION_LOCAL,
  START_AJAX,
  END_AJAX,
} from '../../constantes/types';
import {
  BASE_SESION,
  URL_INICIAR_SESION,
  URL_CERRAR_SESION,
  USUARIO_SESION,
} from '../../constantes/constantes';
import { almacenarObjetoStorage, consultarObjetoStorage } from '../../utilidades/asyncStorage';


export const loginUsuario = (usuario) => (dispatch) => {
  dispatch({ type: START_AJAX });
  return new Promise(
    (resolve, reject) => {
      axiosConfig
        .post(`${BASE_SESION}${URL_INICIAR_SESION}`, {
          nombreUsuario: usuario.nombreUsuario,
          contrasena: md5(usuario.contrasena)
        })
        .then(({ data }) => {
          alert(data);
          if (data) {
           // if (data.EmpleadoID) {
              almacenarObjetoStorage(USUARIO_SESION, data);
              axiosConfig.defaults.headers.common.APITOKEN = data.Token;
              dispatch({ type: INICIAR_SESION, payload: data });
              resolve();
           // } else {
              //AlertaAceptar('', 'El usuario introducido no tiene un empleado asignado, favor de verificar.');
             // reject();
           // }
          } else {
            //AlertaAceptar('', 'El usuario introducido no existe');
            reject();
          }
        })
        .catch((error) => {
          console.log('ERROR', error);
          if (error.response.status === 404) {
            //AlertaAceptar('', 'El usuario y/o contraseña introducidos son incorrectos, favor de verificar.');
          } else if (error.response.status === 403) {
            //AlertaAceptar('', 'Este dispositivo esta vinculado a otro usuario.');
          } else {
            //AlertaAceptar('', 'Se ha producido un error al iniciar sesión.');
          }
          reject();
        })
        .finally(() => dispatch({ type: END_AJAX }));
    },
  );
};
export const logoutUsuario = (usuario, CambiarRuta) => (dispatch) => {
  dispatch({ type: START_AJAX });
  return new Promise(
    (resolve, reject) => {
      axiosConfig
        .post(`${BASE_SESION}${URL_CERRAR_SESION}`, usuario)
        .then(() => {
          almacenarObjetoStorage(USUARIO_SESION, {});
          delete axiosConfig.defaults.headers.common.APITOKEN;
          CambiarRuta();
          dispatch({ type: CERRAR_SESION, payload: null });
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => dispatch({ type: END_AJAX }));
    },
  );
};

export const verificarSesionLocal = () => (dispatch) => new Promise((resolve, reject) => {
  consultarObjetoStorage(USUARIO_SESION).then((usuarioSesion) => {
    if (usuarioSesion && Object.getOwnPropertyNames(usuarioSesion).length !== 0) {
      axiosConfig.defaults.headers.common.APITOKEN = usuarioSesion.Token;
      dispatch({ type: VALIDAR_SESION_LOCAL, payload: usuarioSesion });
      resolve(true);
    } else resolve(false);
  }).catch((error) => {
   // AlertaAceptar('', 'Se ha producido un error al verificar la sesión actual.');
    reject(error);
  });
});
