import { AsyncStorage } from 'AsyncStorage';
import swal from 'sweetalert';

export const almacenarObjetoStorage = async (llave, obj) => {
  try {
    const jsonObj = JSON.stringify(obj);
    await AsyncStorage.setItem(llave, jsonObj);
  } catch (error) {
    swal({
      title: "",
      text: error.message,
      icon: "error",
      button: "Aceptar",
    });
  }
};

export const consultarObjetoStorage = async (llave) => {
  try {
    const jsonObj = await AsyncStorage.getItem(llave);
    return jsonObj != null ? JSON.parse(jsonObj) : null;
  } catch (error) {
    return error;
  }
};

export const almacenarStorage = async (llave, valor) => {
  try {
    await AsyncStorage.setItem(llave, valor);
    return true;
  } catch (error) {
    return error.message;
  }
};

export const consultarStorage = async (llave) => {
  try {
    const value = await AsyncStorage.getItem(llave);
    return value;
  } catch (e) {
    return e.message;
  }
};

export const limpiarStorage = async (llave) => {
  try {
    await AsyncStorage.removeItem(llave);
  } catch (error) {
    swal({
      title: "",
      text: error.message,
      icon: "error",
      button: "Aceptar",
    });
  }
};
