import { combineReducers } from 'redux';

import Usuario from './usuarioReducer';
import Empleado from './empleadoReducer';
import Movimiento from './movimientosReducer';

export default combineReducers({
  Usuario,
  Empleado,
  Movimiento
});
