import { combineReducers } from 'redux';

import Usuario from './usuarioReducer';
import Empleado from './empleadoReducer';

export default combineReducers({
  Usuario,
  Empleado
});
