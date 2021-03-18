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
  COMBOSCONSULTADOS,
  EMPLEADOSCONSULTADOS,
  MOVIMIENTOSCONSULTADOS,
  OPCIONMENU
} from '../../constantes/constantes';
import { almacenarObjetoStorage, consultarObjetoStorage,almacenarStorage } from '../../utilidades/asyncStorage';
import swal from 'sweetalert';


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
          if (data) {
              almacenarObjetoStorage(USUARIO_SESION, data);
              almacenarStorage(COMBOSCONSULTADOS,false);
              almacenarStorage(EMPLEADOSCONSULTADOS,false);
              almacenarStorage(MOVIMIENTOSCONSULTADOS,false);
              almacenarStorage(OPCIONMENU,0);
              axiosConfig.defaults.headers.common.APITOKEN = data.token;
              dispatch({ type: INICIAR_SESION, payload: data });
              resolve();
          } else {
            swal({
              title: "",
              text: "El usuario ingresado no existe.",
              icon: "warning",
              button: "Aceptar",
            });
            reject();
          }
        })
        .catch((error) => {
          if(error.response){
            if (error.response.status === 404) {
                swal({
                    title: "",
                    text: "El usuario y/o contraseña introducidos son incorrectos, favor de verificar.",
                    icon: "warning",
                    button: "Aceptar",
                });
            } else {
                swal({
                    title: "",
                    text: "Ocurrió un error al iniciar sesión. Intente más tarde.",
                    icon: "error",
                    button: "Aceptar",
                });
            }
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
          CambiarRuta();
          delete axiosConfig.defaults.headers.common.APITOKEN;
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
      axiosConfig.defaults.headers.common.APITOKEN = usuarioSesion.token;
      dispatch({ type: VALIDAR_SESION_LOCAL, payload: usuarioSesion });
      resolve(true);
    } else resolve(false);
  }).catch((error) => {
    swal({
      title: "",
      text: "Se ha producido un error al verificar la sesión actual.",
      icon: "error",
      button: "Aceptar",
    });
    reject(error);
  });
});


