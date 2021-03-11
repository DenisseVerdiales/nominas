import { AsyncStorage } from 'AsyncStorage';
//import { AlertaAceptar } from '../components/Alerta';

export const almacenarObjetoStorage = async (llave, obj) => {
  try {
    const jsonObj = JSON.stringify(obj);
    await AsyncStorage.setItem(llave, jsonObj);
  } catch (error) {
    //AlertaAceptar('', error.message);
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
   // AlertaAceptar('Error: ', error.message);
  }
};
