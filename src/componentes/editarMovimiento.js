import React, {Component} from 'react';
import { 
    Typography,
    Grid, 
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Button,
    FormControlLabel,
    Checkbox
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import moment from "moment";
import swal from 'sweetalert';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as EmpleadoActions from '../store/Acciones/empleadoActions';
import * as UsuarioActions from '../store/Acciones/usuarioActions';
import * as MovimientoActions from '../store/Acciones/movimientosActions';
import * as TipoBonoActions from '../store/Acciones/tipoBonoActions';
import {SoloNumeros} from '../utilidades/validar';
import { almacenarStorage, consultarObjetoStorage,consultarStorage } from '../utilidades/asyncStorage';
import { CBOTIPOEMPLEADO,OBTENERBONOENTREGAS,CBOROL,COMBOSCONSULTADOS,OPCIONMENU,BONOPORENTREGA,IDMOVIMIENTO,ROL_AUXILIAR} from '../constantes/constantes';

const movimientoStyles = theme =>  ({
    contenedor:{
        justifyContent:'center',
        alignItems:'center',
        display:'flex'
    },
    txtTitulo:{
        textAlign:'center',
        fontSize:'2em',
        fontWeight:'bold',
        color:'#58707D'
    },
    contenedorFormulario:{
        display:'flex'
    },
    selectTipoEmp:{
        width:"90%"
    },
    segContenedorForm:{
        display:'flex',
        paddingTop:20
    },
    btnCancelar:{
        borderRadius: 0,
        boxShadow: 'none !important',
    },
    btnGuardar:{
        background: '#329DD8 !important',
        color: '#fff',
        borderRadius: 0,
        boxShadow: 'none !important',
    },
    contenedorBtnGuardar:{
        justifyContent: 'flex-end',
        paddingRight: 15,
        display: 'flex'
    },
    contenedorFormGeneral:{
        padding:'20px 90px',
        border:'1px solid #DFE2E4'
    },
    contenedorImporte:{
        paddingTop:30
    },
    contenedorFormularioDatos:{
        width: '100%'
    },
    txtCantEntregas:{
        width: '80%'
    },
    txtRolTurno:{
        width: '80%'
    }
})
class EditarMovimiento extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            datos: {fecha:moment().format("YYYY-MM-DD")},
            fechaSeleccionada: moment().format("YYYY-MM-DD"),
            errores:{},
            chks: {
                chkCantidadEntregas:false,
                chkCubrioTurno:false
            },
            importeTotal:'',
            nombreEmpleado:'',
            apellidoPaterno:'',
            apellidoMaterno:'',
            rolEmpleado:[],
            tipoEmpleado:[],
            tipoEmpSelec:0,
            rolCubrio: [],
            rolEmpSelec:0,
            importeTotalRecorrido: 0,
            bono:{},
            movimientoSeleccionado:{}
        };
    }

    componentDidMount() {
        this.consultarStorageCombos();
        //this.consultarMovimienoIdStorage();
    }

    consultarMovimienoIdStorage(){
        const { actions: { usuario } } = this.props;
        usuario.verificarSesionLocal()
        .then(()=>{
            consultarStorage(IDMOVIMIENTO)
            .then((valor) => {
              if (valor && Object.getOwnPropertyNames(valor).length !== 0) {
                    this.consultarMovimiento(valor);
              }
          });
        })
       
    }

    consultarMovimiento(idMovimiento){
        const { actions: { movimiento } } = this.props;
        movimiento.obtenerMovimienoPorId(Number.parseInt(idMovimiento))
        .then((resp)=>{
            if((resp.cantidadEntregasRecorrido > 0) && !resp.tipoRolCubirtoId){
                this.setState({
                    movimientoSeleccionado:resp,
                    chks:{chkCantidadEntregas:true, 
                        chkCubrioTurno: false},
                },this.consultarBono())
            }
            if(resp.tipoRolCubirtoId && resp.cantidadEntregasRecorrido > 0 ){
                this.setState({
                    movimientoSeleccionado:resp,
                    chks:{chkCantidadEntregas:true, chkCubrioTurno: true},
                },this.consultarBono())
            }
            if(resp.tipoRolCubirtoId && (!resp.cantidadEntregasRecorrido || resp.cantidadEntregasRecorrido === 0) ){
                this.setState({
                    movimientoSeleccionado:resp,
                    chks:{chkCantidadEntregas:false, chkCubrioTurno: true},
                },this.consultarBono())
            }
            if(!resp.tipoRolCubirtoId && (!resp.cantidadEntregasRecorrido  || resp.cantidadEntregasRecorrido === 0) ){
                this.setState({
                    movimientoSeleccionado:resp,
                    chks:{chkCantidadEntregas:false, chkCubrioTurno: false},
                },this.consultarBono())
            }
        
        })
        .catch((error)=>{
            if(error.response){
                if (error.response.status === 404) {
                    swal({
                        title: "",
                        text: "No existen los roles",
                        icon: "warning",
                        button: "Aceptar",
                    });
                } else {
                    swal({
                        title: "",
                        text: "Ocurrió un error al consultar los roles. Intente más tarde.",
                        icon: "error",
                        button: "Aceptar",
                    });
                }
            }
        })
    }

    consultarStorageCombos(){
        consultarStorage(COMBOSCONSULTADOS)
          .then((valor) => {
            if (valor === true && Object.getOwnPropertyNames(valor).length !== 0) {
                this.obtenerStorageCboTipo();
            }else{
                this.verificarSesionLocal();
            } 
        });
    }

    obtenerStorageCboTipo() {
        consultarObjetoStorage(CBOTIPOEMPLEADO)
        .then((tipo) => {
            this.setState({tipoEmpleado:tipo},this.obtenerStorageCboRol);
        })
        .catch((error) => {
            swal({
                title: "",
                text: error,
                icon: "error",
                button: "Aceptar",
            });
        });
      }

      obtenerStorageCboRol(){
        consultarObjetoStorage(CBOROL)
        .then((cboRol) => {
            this.setState({rolCubrio:cboRol, rolEmpleado: cboRol},this.verificarSesionLocal);
        })
        .catch((error) => {
            swal({
                title: "",
                text: error,
                icon: "warning",
                button: "Aceptar",
            });
        });
    }

    obtenerCombos(){
        const { actions: { empleado } } = this.props;
        empleado.obtenerTipoEmpleado()
        .then(()=>{
            empleado.obtenerJornadaLaboral()
            .then(()=>{
                empleado.obtenerRol()
                .then(()=>{
                    almacenarStorage(COMBOSCONSULTADOS,true)
                    .then(()=>{
                        this.consultarMovimienoIdStorage();
                        
                    })
                    
                })
                .catch((error)=>{
                    if(error.response){
                        if (error.response.status === 404) {
                            swal({
                                title: "",
                                text: "No existen los roles",
                                icon: "warning",
                                button: "Aceptar",
                            });
                        } else {
                            swal({
                                title: "",
                                text: "Ocurrió un error al consultar los roles. Intente más tarde.",
                                icon: "error",
                                button: "Aceptar",
                            });
                        }
                    }
                })
            }).catch((error)=>{
                if(error.response){
                    if (error.response.status === 404) {
                        swal({
                            title: "",
                            text: "No existen las jornadas laborales",
                            icon: "warning",
                            button: "Aceptar",
                        });
                    } else {
                        swal({
                            title: "",
                            text: "Ocurrió un error al consultar las jornadas laborales. Intente más tarde.",
                            icon: "error",
                            button: "Aceptar",
                        });
                    }
                }
            })
        }).catch((error)=>{
            if(error.response){
                if (error.response.status === 404) {
                    swal({
                        title: "",
                        text: "No existen el tipo empleado",
                        icon: "warning",
                        button: "Aceptar",
                    });
                } else {
                    swal({
                        title: "",
                        text: "Ocurrió un error al consultar el tipo empleado. Intente más tarde.",
                        icon: "error",
                        button: "Aceptar",
                    });
                }
            }
        })
    }

    verificarSesionLocal() {
        const { actions: { usuario } } = this.props;
        usuario.verificarSesionLocal()
        .then(()=>{
            this.obtenerCombos();
        })
    }

    cancelarEditarRegistro(){
        almacenarStorage(OPCIONMENU,4);
        consultarStorage(OPCIONMENU)
    }

    valida = (e) => {
        e.preventDefault();
        const { actions: { movimiento },Usuario } = this.props;
        const {movimientoSeleccionado,chks}=this.state;
        let vacio = {};
       
        if(chks.chkCantidadEntregas){
            if(Number.parseInt(movimientoSeleccionado.cantidadEntregasRecorrido) <= 0){
                vacio = {...vacio,'CantEntregas':true};
            }
        }
        if(chks.chkCubrioTurno){
            if(!movimientoSeleccionado.tipoRolCubirtoId){
                vacio = {...vacio,'rolTurno':true};
            }
        }
        this.setState({errores:vacio})
       
        let rolCubiertoId = 0;
        let cantEntregas=0;
        if((chks.chkCantidadEntregas && Number.parseInt(movimientoSeleccionado.cantidadEntregasRecorrido)  > 0 ) || (chks.chkCubrioTurno && movimientoSeleccionado.tipoRolCubirtoId)){
            rolCubiertoId = movimientoSeleccionado.rolTurno;
            cantEntregas = movimientoSeleccionado.cantidadEntregasRecorrido;
        }
        
        const datosMovimiento={
            id: movimientoSeleccionado.id,
            empleadoId: Number.parseInt(movimientoSeleccionado.empleadoId), 
            cantidadEntregasRecorrido: Number.parseFloat(cantEntregas), 
            tipoRolCubirtoId: Number.parseInt(rolCubiertoId), 
            fechaMovimiento: movimientoSeleccionado.fechaMovimiento, 
            importeTotalRecorrido: Number.parseInt(movimientoSeleccionado.importeTotalRecorrido), 
            usuarioModificacionId: Usuario.usuarioLogin.id
        }
        movimiento.actualizarMovimiento(datosMovimiento)
        .then((resultado)=>{
            if(resultado){
                if(resultado.status === 200){
                    swal({
                        title: "",
                        text: "Movimiento guardado con éxito.",
                        icon: "success",
                        button: "Aceptar",
                    });
                    this.setState({
                        movimientoSeleccionado:{},
                        fechaSeleccionada: moment().format("YYYY-MM-DD"),
                        chks: {
                            chkCantidadEntregas:false,
                            chkCubrioTurno:false
                        }
                    });
                }
                }
        })
        .catch((error)=>{
            if(error.response){
                if (error.response.status === 400) {
                    swal({
                        title: "",
                        text: "El movimiento ingresado ya existe.",
                        icon: "warning",
                        button: "Aceptar",
                    });
                } else {
                    swal({
                        title: "",
                        text: "Ocurrió un error al guardar el movimiento. Intente más tarde.",
                        icon: "error",
                        button: "Aceptar",
                    });
                }
            }
        })
    }
    consultarBono(){
        const { actions: { tipoBono },Empleado } = this.props;
        consultarObjetoStorage(OBTENERBONOENTREGAS)
        .then((valor)=>{
            if (valor === true && Object.getOwnPropertyNames(valor).length !== 0) {
                 this.setState({bono: valor});
            }else{
                tipoBono.obtenerBonoPorTipoBono(BONOPORENTREGA)
                .then((resp)=>{
                this.setState({
                    tipoEmpleado: Empleado.tipoEmpleado,
                    jornada: Empleado.jornadaLaboral,
                    rolEmpleado: Empleado.rol,
                    bono: resp
                });
                })
            } 
        })
    }

 

    render(){
        const {
            errores,
            datos,
            fechaSeleccionada,
            chks, 
            importeTotal,
            nombreEmpleado,
            apellidoPaterno,
            apellidoMaterno,
            rolEmpleado,
            tipoEmpleado,
            rolCubrio,
            rolEmpSelec,
            tipoEmpSelec,
            importeTotalRecorrido,
            movimientoSeleccionado
        } = this.state;
        const { classes} = this.props;
        const datoNoEmpleado = (e) =>{
            const {datos}=this.state;
            const { actions: { empleado } } = this.props;
            let datosInput = {...datos,[e.target.name]: e.target.value };
           if(e.target.value){
                empleado.obtenerEmpleadoPorId(Number.parseInt(e.target.value))
                .then((data)=>{
                    this.setState({
                        datos:datosInput,
                        nombreEmpleado: data.nombre,
                        apellidoPaterno: data.apellidoPaterno,
                        apellidoMaterno: data.apellidoMaterno,
                        rolEmpSelec: data.rolId,
                        tipoEmpSelec: data.tipoEmpleadoId
                    });
                })
                .catch((error)=>{
                    if(error){
                        if(error.response.status === 404){
                            swal({
                                title: "",
                                text: "Empleado no encontrado",
                                icon: "warning",
                                button: "Aceptar",
                            });
                        }else{
                            swal({
                                title: "",
                                text: "Ocurrió un error al consultar el empleado",
                                icon: "error",
                                button: "Aceptar",
                            });
                        }
                    }
                })
            }
        }
    
        const datosModificados = (e) => {
            const {movimientoSeleccionado,bono}=this.state;
            
            if(e.target.name == 'cantidadEntregasRecorrido'){
                const importeEntrega = Number.parseInt(e.target.value) * Number.parseInt(bono.importe);
                let importeNuevo = {
                    ...movimientoSeleccionado,
                    importeTotalRecorrido: Number.parseInt(importeEntrega),
                    cantidadEntregasRecorrido:e.target.value }; 
                this.setState({movimientoSeleccionado: importeNuevo});
            }else{
                let datosInput = {...movimientoSeleccionado,[e.target.name]: e.target.value };
                this.setState({movimientoSeleccionado:datosInput});
            }
        }
        const fechaModificada = (value) => {
            const {movimientoSeleccionado}=this.state;

            let fecha = {...movimientoSeleccionado,'fecha': value.target.value };
            this.setState({
                movimientoSeleccionado: fecha,
                fechaSeleccionada:value
            });
        };
    
        const CheckModificado = (e) => {
            const {chks,movimientoSeleccionado}=this.state;
            let check={};
            
            if(e.target.name == 'chkCubrioTurno'){
                if(movimientoSeleccionado?.Empleado?.rolId !== ROL_AUXILIAR){
                    swal({
                        title: "",
                        text: "Solo se puede cubrir turno con el rol de auxiliar. Favor de verificar",
                        icon: "warning",
                        button: "Aceptar",
                    });
                     check = {...chks,[e.target.name]: false};
                }else{
                     check = {...chks,[e.target.name]: e.target.checked };
                }
            }
            this.setState({chks:check})
        };

        return(
            <Grid container className={classes.contenedor}>
                <Grid item lg={10} md={10} sm={10} xs={10} >
                    <Typography className={classes.txtTitulo}>Editar de Movimientos</Typography>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <Grid container className={classes.contenedor}>
                        <form noValidate={true} onSubmit={this.valida} className={classes.contenedorFormularioDatos}>
                            <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormGeneral}>
                            <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormulario}>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <TextField
                                            id="noEmpleado"
                                            name="noEmpleado"
                                            inputProps={{ maxLength: 40 }}
                                            required
                                            disabled={true}
                                            className={classes.selectTipoEmp}
                                            onChange={datoNoEmpleado}
                                            value={movimientoSeleccionado?.Empleado?.id ? movimientoSeleccionado.Empleado.id  : '' }
                                            label="Número de Empleado"
                                            error={errores.noEmpleado}
                                            onInput={SoloNumeros}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormulario}>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <TextField
                                            id="nombre"
                                            name="nombre"
                                            inputProps={{ maxLength: 40 }}
                                            disabled={true}
                                            className={classes.selectTipoEmp}
                                            value={movimientoSeleccionado?.Empleado?.nombre ? movimientoSeleccionado.Empleado.nombre :''}
                                            label="Nombre"
                                        />

                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="apellidoPaterno"
                                            name="apellidoPaterno"
                                            inputProps={{ maxLength: 40 }}
                                            value={movimientoSeleccionado?.Empleado?.apellidoPaterno ? movimientoSeleccionado.Empleado.apellidoPaterno : ''}
                                            disabled={true}
                                            className={classes.selectTipoEmp}
                                            label="Apellido Paterno"/>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="apellidoMaterno"
                                            name="apellidoMaterno"
                                            inputProps={{ maxLength: 40 }}
                                            value={movimientoSeleccionado?.Empleado?.apellidoMaterno  ? movimientoSeleccionado.Empleado.apellidoMaterno  : ''}
                                            disabled={true}
                                            className={classes.selectTipoEmp}
                                            label="Apellido Materno"/>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.segContenedorForm}>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <FormControl className={classes.selectTipoEmp}>
                                            <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-label"
                                            id="rol"
                                            name="rol"
                                            disabled={true}
                                            value={movimientoSeleccionado?.Empleado?.rolId  ? movimientoSeleccionado.Empleado.rolId  : 0}
                                            >
                                            <MenuItem disabled value={0}>
                                                <em>Seleccione</em>
                                            </MenuItem>
                                            {rolEmpleado?.map((dato, index) => (
                                                <MenuItem key={index} value={dato.id}>{dato.nombreRol}</MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                    <FormControl className={classes.selectTipoEmp}>
                                        <InputLabel id="demo-simple-select-label">Tipo Empleado</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="tipoEmpleados"
                                        name="tipoEmpleados"
                                        disabled={true}
                                        value={movimientoSeleccionado?.Empleado?.tipoEmpleadoId  ? movimientoSeleccionado.Empleado.tipoEmpleadoId : 0}
                                        >
                                        <MenuItem disabled value={0}>
                                            <em>Seleccione</em>
                                        </MenuItem>
                                        {tipoEmpleado?.map((dato, index) => (
                                            <MenuItem key={index} value={dato.id}>{dato.tipoEmpleado}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="fecha"
                                            name="fecha"
                                            label="Fecha"
                                            type="date"
                                            required
                                            disabled={true}
                                            error={errores.fecha}
                                            onChange={fechaModificada}
                                            defaultValue={movimientoSeleccionado?.fechaMovimiento ? movimientoSeleccionado.fechaMovimiento : fechaSeleccionada}
                                            className={classes.selectTipoEmp}
                                            InputLabelProps={{
                                            shrink: true,
                                            }}
                                            />
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.segContenedorForm}>
                                    <Grid item lg={6} md={6} sm={6} xs={12} >
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            id="chkCantidadEntregas"
                                            name="chkCantidadEntregas"
                                            checked={chks.chkCantidadEntregas}
                                            onChange={CheckModificado}
                                            color="primary"
                                        />
                                        }
                                        label="Cantidad de entregas"
                                    />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12} >
                                    <FormControlLabel
                                        control={
                                        <Checkbox
                                            id="chkCubrioTurno"
                                            name="chkCubrioTurno"
                                            checked={chks.chkCubrioTurno}
                                            onChange={CheckModificado}
                                            color="primary"
                                        />
                                        }
                                        label="Cubrió turno?"
                                    />
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.segContenedorForm}>
                                    <Grid item lg={6} md={6} sm={6} xs={12} >
                                        <TextField
                                        id="cantidadEntregasRecorrido"
                                        name="cantidadEntregasRecorrido"
                                        inputProps={{ maxLength: 4 }}
                                        disabled={!chks.chkCantidadEntregas}
                                        className={classes.selectTipoEmp}
                                        value={movimientoSeleccionado?.cantidadEntregasRecorrido ? movimientoSeleccionado.cantidadEntregasRecorrido : ''}
                                        error={errores.cantidadEntregasRecorrido}
                                        onInput={SoloNumeros}
                                        onChange={datosModificados}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12} >
                                        <FormControl className={classes.selectTipoEmp}>
                                            <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-label"
                                            id="tipoRolCubirtoId"
                                            name="tipoRolCubirtoId"
                                            disabled={!chks.chkCubrioTurno}
                                            error={errores.rolTurno}
                                            className={classes.txtRolTurno}
                                            onChange={datosModificados}
                                            value={movimientoSeleccionado?.tipoRolCubirtoId ? movimientoSeleccionado.tipoRolCubirtoId  : 0}
                                            >
                                            <MenuItem disabled value={0}>
                                                <em>Seleccione</em>
                                            </MenuItem>
                                            {rolCubrio?.map((dato, index) => (
                                                <MenuItem key={index} value={dato.id}>{dato.nombreRol}</MenuItem>
                                            ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorImporte}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography>Importe Total Recorrido:</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Typography>$ {movimientoSeleccionado.importeTotalRecorrido ? Number.parseInt(movimientoSeleccionado.importeTotalRecorrido) : 0}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.segContenedorForm}>
                                    <Grid item lg={6} md={6} sm={12} xs={12} className={classes.contenedorBtnGuardar}>
                                        <Button variant="contained" type="submit" className={classes.btnGuardar}>Guardar</Button>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12} >
                                        <Button variant="contained" className={classes.btnCancelar}  onClick={this.cancelarEditarRegistro}>Cancelar</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>  
                        </Grid>
                    </Grid>
                </Grid>
                
            </Grid>
        
        )
    }
}
const mapStateToProps = ({ Usuario, Empleado, Movimiento }) => ({
    Usuario,
    Empleado,
    Movimiento
  });
  
  const mapDispatchToProps = (dispatch) => ({
    actions: {
      empleado: bindActionCreators(EmpleadoActions, dispatch),
      usuario: bindActionCreators(UsuarioActions, dispatch),
      movimiento: bindActionCreators(MovimientoActions, dispatch),
      tipoBono: bindActionCreators(TipoBonoActions, dispatch),
    },
    
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(movimientoStyles,{ withTheme: true })(EditarMovimiento));
  