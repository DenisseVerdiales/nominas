import React, {Component} from 'react';
import { 
    Typography,
    Grid, 
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Button} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import swal from 'sweetalert';
import * as EmpleadoActions from '../store/Acciones/empleadoActions';
import * as UsuarioActions from '../store/Acciones/usuarioActions';
import {soloLetras, NumerosLetras} from '../utilidades/validar';
import { almacenarStorage, consultarObjetoStorage,consultarStorage } from '../utilidades/asyncStorage';
import { CBOTIPOEMPLEADO,CBOJORNADA,CBOROL,COMBOSCONSULTADOS,IDEMPLEADO} from '../constantes/constantes';

const empleadoStyles = theme =>  ({
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
    contenedorFormularioDatos:{
        width: '100%'
    },
})

class EditarEmpleado extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            errores:{},
            tipoEmpleado:[],
            jornada:[],
            rol:[],
            empleadoSeleccionado:{},
            siguienteID:''
        };
    }

    componentDidMount() {
        this.consultarStorageCombos();
        this.consultarEmpleadoIdStorage();
    }

    consultarEmpleadoIdStorage(){
        consultarStorage(IDEMPLEADO)
        .then((valor) => {
          if (valor && Object.getOwnPropertyNames(valor).length !== 0) {
             this.consultarEmpleado(valor);
          }
      });
    }

    consultarEmpleado(idREmpleado){
        const { actions: { empleado } } = this.props;
        empleado.obtenerEmpleadoPorId(Number.parseInt(idREmpleado))
        .then((resp)=>{
            this.setState({empleadoSeleccionado:resp})
        })
    }

    consultarStorageCombos(){
        consultarStorage(COMBOSCONSULTADOS)
          .then((valor) => {
            if (valor == true && Object.getOwnPropertyNames(valor).length !== 0) {
                this.obtenerStorageCboTipo();
            }else{
                this.verificarSesionLocal();
            } 
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

    consultarCombos(){
        const { Empleado} = this.props;
         this.setState({
            tipoEmpleado: Empleado.tipoEmpleado,
            jornada: Empleado.jornadaLaboral,
            rol: Empleado.rol
        },this.obtenerSiguienteID);
    }

    obtenerStorageCboTipo() {
        const { actions: { empleado } } = this.props;
        consultarObjetoStorage(CBOTIPOEMPLEADO)
        .then((tipo) => {
            this.setState({tipoEmpleado:tipo},this.obtenerStorageCboJornada);
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


    obtenerStorageCboJornada(){
        const { actions: { empleado } } = this.props;
        consultarObjetoStorage(CBOJORNADA)
        .then((jornadaL) => {
            this.setState({jornada:jornadaL},this.obtenerStorageCboRol);
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
            this.setState({rol:cboRol},this.verificarSesionLocal);
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

    verificarSesionLocal() {
        const { actions: { usuario } } = this.props;
        usuario.verificarSesionLocal()
        .then(()=>{
            this.obtenerCombos();
        })
    }

    obtenerSiguienteID(){
        const {actions:{empleado}} = this.props;

        empleado.obtenerEmpleadoId()
        .then((dato)=>{
            dato.map((d,index)=>{
                this.setState({siguienteID: Object.values(d)})
            })
            
        })
    }

    valida = (e) => {
        e.preventDefault();
        const { actions: { empleado },Usuario } = this.props;
        const {empleadoSeleccionado}=this.state;
        let vacio = {};
        if(!empleadoSeleccionado.nombre){
        vacio={'nombre':true};
        }
        if(!empleadoSeleccionado.apellidoPaterno){
        vacio={...vacio,'apellidoPaterno':true};
        }
        if(!empleadoSeleccionado.apellidoMaterno){
        vacio = {...vacio,'apellidoMaterno':true};
        }
        if(!empleadoSeleccionado.fechaNacimiento){
        vacio = {...vacio,'fechaNacimiento':true};
        }
        if(!empleadoSeleccionado.tipoEmpleadoId){
            vacio = {...vacio,'tipoEmpleadoId':true};
        }
        if(!empleadoSeleccionado.jornadaLaboralId){
            vacio = {...vacio,'jornadaLaboralId':true};
        }
        if(!empleadoSeleccionado.rolId){
            vacio = {...vacio,'rolId':true};
        }
        this.setState({errores: vacio});
        if(empleadoSeleccionado.nombre && empleadoSeleccionado.apellidoPaterno && empleadoSeleccionado.apellidoMaterno && empleadoSeleccionado.fechaNacimiento && empleadoSeleccionado.tipoEmpleadoId && empleadoSeleccionado.jornadaLaboralId && empleadoSeleccionado.rolId){
         const datosEmpleado = {
            id: empleadoSeleccionado.id,
            nombre: empleadoSeleccionado.nombre,
            apellidoPaterno: empleadoSeleccionado.apellidoPaterno,
            apellidoMaterno: empleadoSeleccionado.apellidoMaterno,
            fechaNacimiento: empleadoSeleccionado.fechaNacimiento,
            domicilio: empleadoSeleccionado.domicilio ? empleadoSeleccionado.domicilio : '',
            tipoEmpleadoId: empleadoSeleccionado.tipoEmpleadoId,
            rolId: empleadoSeleccionado.rolId,
            jornadaLaboralId: empleadoSeleccionado.jornadaLaboralId,
            usuarioModificacionId: Usuario.usuarioLogin.id
         }

         empleado.actualizarEmpleado(datosEmpleado)
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
                        empleadoSeleccionado:{},
                        fechaSeleccionada: moment().format("YYYY-MM-DD")
                    });
                }
             }
         })
         .catch((error)=>{
            if(error.response){
                if (error.response.status === 400) {
                    swal({
                        title: "",
                        text: "El empleado ingresado ya existe.",
                        icon: "warning",
                        button: "Aceptar",
                    });
                } else {
                    swal({
                        title: "",
                        text: "Ocurrió un error al guardar el empleado. Intente más tarde.",
                        icon: "error",
                        button: "Aceptar",
                    });
                }
            }
         })
        }
    }

    render(){
        const {errores,tipoEmpleado,jornada,rol, empleadoSeleccionado, siguienteID} = this.state;
        const { classes} = this.props;

        const handleChange = (e) => {
            const {empleadoSeleccionado}=this.state;
            let datosInput = {...empleadoSeleccionado,[e.target.name]: e.target.value };
            this.setState({empleadoSeleccionado:datosInput});
        }

        const onDateChange = (value) => {
            const {empleadoSeleccionado}=this.state;
            let fecha = {...empleadoSeleccionado,'fechaNacimiento': value.target.value };
            this.setState({
                datos: fecha
            });
        };

        return(
            <Grid container className={classes.contenedor}>
                <Grid item lg={10} md={10} sm={10} xs={10} >
                    <Typography className={classes.txtTitulo}>Edición de empleados</Typography>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <Grid container className={classes.contenedor}>
                        <form noValidate={true} onSubmit={this.valida} className={classes.contenedorFormularioDatos}>
                            <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormGeneral}>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <TextField
                                        id="noEmpleado"
                                        name="noEmpleado"
                                        disabled={true}
                                        className={classes.selectTipoEmp}
                                        value={siguienteID[0] ? siguienteID[0]+1 : 0}
                                        label="Número de Empleado"
                                    />
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormulario}>
                                    <Grid item lg={4} md={4} sm={6} xs={12}>
                                        <TextField
                                            id="nombre"
                                            name="nombre"
                                            inputProps={{ maxLength: 40 }}
                                            required
                                            className={classes.selectTipoEmp}
                                            onChange={handleChange}
                                            value={empleadoSeleccionado.nombre ? empleadoSeleccionado.nombre : ''}
                                            label="Nombre"
                                            error={errores.nombre}
                                            onInput={soloLetras}
                                        />

                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="apellidoPaterno"
                                            name="apellidoPaterno"
                                            inputProps={{ maxLength: 40 }}
                                            onChange={handleChange}
                                            value={empleadoSeleccionado.apellidoPaterno ? empleadoSeleccionado.apellidoPaterno : ''}
                                            required
                                            className={classes.selectTipoEmp}
                                            label="Apellido Paterno"
                                            error={errores.apellidoPaterno}
                                            onInput={soloLetras} />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="apellidoMaterno"
                                            name="apellidoMaterno"
                                            inputProps={{ maxLength: 40 }}
                                            onChange={handleChange}
                                            value={empleadoSeleccionado.apellidoMaterno ? empleadoSeleccionado.apellidoMaterno : ''}
                                            required
                                            className={classes.selectTipoEmp}
                                            label="Apellido Materno"
                                            error={errores.apellidoMaterno}
                                            onInput={soloLetras} />
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.segContenedorForm}>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="fechaNacimiento"
                                            name="fechaNacimiento"
                                            label="Fecha Nacimiento"
                                            type="date"
                                            required
                                            error={errores.fechaNacimiento}
                                            onChange={onDateChange}
                                            defaultValue={empleadoSeleccionado.fechaNacimiento ? moment(empleadoSeleccionado.fechaNacimiento).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")}
                                            className={classes.selectTipoEmp}
                                            InputLabelProps={{
                                            shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                    <FormControl className={classes.selectTipoEmp}>
                                        <InputLabel id="demo-simple-select-label">Tipo Empleado</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="tipoEmpleadoId"
                                        name="tipoEmpleadoId"
                                        required
                                        error={errores.tipoEmpleadoId}
                                        value={Number.parseInt(empleadoSeleccionado.tipoEmpleadoId) ? Number.parseInt(empleadoSeleccionado.tipoEmpleadoId) : 0}
                                        onChange={handleChange}
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
                                    <FormControl className={classes.selectTipoEmp}>
                                        <InputLabel id="demo-simple-select-label">Jornada Laboral hrs</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="tipoEmpleadoId"
                                        name="jornadaLaboralId"
                                        required
                                        error={errores.jornadaLaboral}
                                        value={Number.parseInt(empleadoSeleccionado.jornadaLaboralId) ? Number.parseInt(empleadoSeleccionado.jornadaLaboralId) : 0}
                                        onChange={handleChange}
                                        >
                                        <MenuItem disabled value={0}>
                                            <em>Seleccione</em>
                                        </MenuItem>
                                        {jornada?.map((dato, index) => (
                                            <MenuItem key={index} value={dato.id}>{dato.horasLaborales}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.segContenedorForm}>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="domicilio"
                                            name="domicilio"
                                            inputProps={{ maxLength: 40 }}
                                            onChange={handleChange}
                                            value={empleadoSeleccionado.domicilio}
                                            className={classes.selectTipoEmp}
                                            label="Domicilio"
                                            onInput={NumerosLetras} />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                    <FormControl className={classes.selectTipoEmp}>
                                        <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                        <Select
                                        labelId="demo-simple-select-label"
                                        id="rolId"
                                        name="rolId"
                                        required
                                        error={errores.rol}
                                        value={Number.parseInt(empleadoSeleccionado.rolId) ? Number.parseInt(empleadoSeleccionado.rolId) : 0}
                                        onChange={handleChange}
                                        >
                                        <MenuItem disabled value={0}>
                                            <em>Seleccione</em>
                                        </MenuItem>
                                        {rol?.map((dato, index) => (
                                            <MenuItem key={index} value={dato.id}>{dato.nombreRol}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={classes.segContenedorForm}>
                                    <Grid item lg={6} md={6} sm={12} xs={12} className={classes.contenedorBtnGuardar}>
                                        <Button variant="contained" type="submit" className={classes.btnGuardar}>Guardar</Button>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12} >
                                        <Button variant="contained" className={classes.btnCancelar}>Cancelar</Button>
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
const mapStateToProps = ({ Usuario, Empleado, }) => ({
    Usuario,
    Empleado,
  });
  
  const mapDispatchToProps = (dispatch) => ({
    actions: {
      empleado: bindActionCreators(EmpleadoActions, dispatch),
      usuario: bindActionCreators(UsuarioActions, dispatch),
    },
    
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(empleadoStyles,{ withTheme: true })(EditarEmpleado));
  