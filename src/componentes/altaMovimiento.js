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
import { CBOTIPOEMPLEADO,OBTENERBONOENTREGAS,CBOROL,COMBOSCONSULTADOS,OPCIONMENU,BONOPORENTREGA} from '../constantes/constantes';

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
class AltaMovimiento extends Component {
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
            bono:{}
        };
    }

    componentDidMount() {
        this.consultarStorageCombos();
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
                        this.consultarCombos();
                    })
                    
                })
                .catch((error)=>{
                    swal({
                        title: "",
                        text: error,
                        icon: "error",
                        button: "Aceptar",
                    });
                })
            }).catch((error)=>{
                swal({
                    title: "",
                    text: error,
                    icon: "error",
                    button: "Aceptar",
                });
            })
        }).catch((error)=>{
            swal({
                title: "",
                text: error,
                icon: "error",
                button: "Aceptar",
            });
        })
    }

    verificarSesionLocal() {
        const { actions: { usuario } } = this.props;
        usuario.verificarSesionLocal()
        .then(()=>{
            this.obtenerCombos();
        })
    }

    cancelarAlta(){
        console.log("LLEGO CANCELAR ALTA");
        almacenarStorage(OPCIONMENU,0);
    }

    consultarCombos(){
        const { Empleado} = this.props;
         this.setState({
            tipoEmpleado: Empleado.tipoEmpleado,
            rolEmpleado: Empleado.rol,
            rolCubrio: Empleado.rol
        });
    }
   
     valida = (e) => {
        e.preventDefault();
        const { actions: { movimiento },Usuario } = this.props;
        const {datos,chks, importeTotalRecorrido,fechaSeleccionada}=this.state;
        let vacio = {};
        if(!datos.noEmpleado){
        vacio={'noEmpleado':true};
        }
        if(chks.chkCantidadEntregas){
            if(Number.parseInt(datos.CantEntregas) <= 0){
                vacio = {...vacio,'CantEntregas':true};
            }
        }
        if(chks.chkCubrioTurno){
            if(!datos.rolTurno){
                vacio = {...vacio,'rolTurno':true};
            }
        }
        this.setState({errores:vacio})
        if(datos.noEmpleado && datos.fecha){
            let rolCubiertoId = 0;
            let cantEntregas=0;
            if((chks.chkCantidadEntregas && Number.parseInt(datos.CantEntregas)  > 0 ) || (chks.chkCubrioTurno && datos.rolTurno)){
                rolCubiertoId = datos.rolTurno;
                cantEntregas = datos.CantEntregas;
            }
            
            const datosMovimiento={
                empleadoId: Number.parseInt(datos.noEmpleado), 
                cantidadEntregasRecorrido: Number.parseFloat(cantEntregas), 
                tipoRolCubirtoId: Number.parseInt(rolCubiertoId), 
                fechaMovimiento: datos.fecha ? datos.fecha : fechaSeleccionada, 
                importeTotalRecorrido: importeTotalRecorrido, 
                usuarioCreacionId: Usuario.usuarioLogin.id
            }

            movimiento.guardarMovimiento(datosMovimiento)
            .then((resultado)=>{
                if(resultado){
                    if(resultado.status === 200){
                        swal({
                            title: "",
                            text: "Empleado guardado con éxito.",
                            icon: "success",
                            button: "Aceptar",
                        });
                        this.setState({
                            datos:{},
                            fechaSeleccionada: moment().format("YYYY-MM-DD"),
                            chks: {
                                chkCantidadEntregas:false,
                                chkCubrioTurno:false
                            },
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
            importeTotalRecorrido
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
            const {datos,bono}=this.state;
            let datosInput = {...datos,[e.target.name]: e.target.value };
            this.setState({datos:datosInput});
            if(e.target.name == 'CantEntregas'){
                const importeEntrega = Number.parseInt(e.target.value ) * Number.parseInt(bono.importe);
                this.setState({importeTotalRecorrido: importeEntrega});
            }
        }
        const fechaModificada = (value) => {
            const {datos}=this.state;

            let fecha = {...datos,'fecha': value.target.value };
            this.setState({
                datos: fecha,
                fechaSeleccionada:value
            });
        };
    
        const CheckModificado = (e) => {
            const { actions: { tipoBono } } = this.props;
            const {chks}=this.state;

            let check = {...chks,[e.target.name]: e.target.checked };
            this.setState({chks:check})
            if(e.target.name == 'chkCantidadEntregas' ){
                consultarObjetoStorage(OBTENERBONOENTREGAS)
                .then((valor)=>{
                    if (valor === true && Object.getOwnPropertyNames(valor).length !== 0) {
                         this.setState({bono: valor});
                    }else{
                        tipoBono.obtenerBonoPorTipoBono(BONOPORENTREGA)
                        .then((resp)=>{
                            this.setState({bono: resp});
                        })
                    } 
                })
                
            }
        };

        return(
            <Grid container className={classes.contenedor}>
                <Grid item lg={10} md={10} sm={10} xs={10} >
                    <Typography className={classes.txtTitulo}>Alta de Movimientos</Typography>
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
                                            className={classes.selectTipoEmp}
                                            onChange={datoNoEmpleado}
                                            value={datos.noEmpleado}
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
                                            value={nombreEmpleado}
                                            label="Nombre"
                                        />

                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="apellidoPaterno"
                                            name="apellidoPaterno"
                                            inputProps={{ maxLength: 40 }}
                                            value={apellidoPaterno}
                                            disabled={true}
                                            className={classes.selectTipoEmp}
                                            label="Apellido Paterno"/>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="apellidoMaterno"
                                            name="apellidoMaterno"
                                            inputProps={{ maxLength: 40 }}
                                            value={apellidoMaterno}
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
                                            value={rolEmpSelec ? rolEmpSelec : 0}
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
                                        value={tipoEmpSelec ? tipoEmpSelec : 0}
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
                                            error={errores.fecha}
                                            onChange={fechaModificada}
                                            defaultValue={fechaSeleccionada}
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
                                        id="CantEntregas"
                                        name="CantEntregas"
                                        label="Cantidad de Entregas"
                                        type="number"
                                        disabled={!chks.chkCantidadEntregas}
                                        value={datos.CantEntregas}
                                        error={errores.CantEntregas}
                                        onChange={datosModificados}
                                        defaultValue={0}
                                        className={classes.txtCantEntregas}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={12} >
                                        <FormControl className={classes.selectTipoEmp}>
                                            <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-label"
                                            id="rolTurno"
                                            name="rolTurno"
                                            disabled={!chks.chkCubrioTurno}
                                            error={errores.rolTurno}
                                            className={classes.txtRolTurno}
                                            onChange={datosModificados}
                                            value={datos.rolTurno ? datos.rolTurno  : 0}
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
                                    <Typography>$ {importeTotalRecorrido}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.segContenedorForm}>
                                    <Grid item lg={6} md={6} sm={12} xs={12} className={classes.contenedorBtnGuardar}>
                                        <Button variant="contained" type="submit" className={classes.btnGuardar}>Guardar</Button>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12} >
                                        <Button variant="contained" className={classes.btnCancelar} onClick={this.cancelarAlta}>Cancelar</Button>
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
  });
  
  const mapDispatchToProps = (dispatch) => ({
    actions: {
      empleado: bindActionCreators(EmpleadoActions, dispatch),
      usuario: bindActionCreators(UsuarioActions, dispatch),
      movimiento: bindActionCreators(MovimientoActions, dispatch),
      tipoBono: bindActionCreators(TipoBonoActions, dispatch),
    },
    
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(movimientoStyles,{ withTheme: true })(AltaMovimiento));
  