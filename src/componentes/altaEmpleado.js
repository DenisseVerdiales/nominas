import React,{Component} from 'react';
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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from "moment";
import swal from 'sweetalert';
import * as EmpleadoActions from '../store/Acciones/empleadoActions';
import * as UsuarioActions from '../store/Acciones/usuarioActions';
import {soloLetras, NumerosLetras} from '../utilidades/validar';
import { almacenarStorage, consultarObjetoStorage,consultarStorage } from '../utilidades/asyncStorage';
import { CBOTIPOEMPLEADO,CBOJORNADA,CBOROL,COMBOSCONSULTADOS,OPCIONMENU} from '../constantes/constantes';

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
        border:'1px solid #DFE2E4',
        [theme.breakpoints.down('md')]: {
            padding: '20px 20px'
        },
        
    },
    contenedorFormularioDatos:{
        width: '100%'
    },
});

class AltaEmpleado extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            datos: {},
            fechaSeleccionada: moment().format("YYYY-MM-DD"),
            errores:{},
            tipoEmpleado:[],
            jornada:[],
            rol:[],
            siguienteID:''
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

    cancelarAlta(){
        almacenarStorage(OPCIONMENU,0)
        .then(()=>{
            consultarStorage(OPCIONMENU)
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

    valida = (e) => {
        e.preventDefault();
        const { actions: { empleado },Usuario } = this.props;
        const {datos}=this.state;
        let vacio = {};
        if(!datos.nombre){
        vacio={'nombre':true};
        }
        if(!datos.apellidoPaterno){
        vacio={...vacio,'apellidoPaterno':true};
        }
        if(!datos.apellidoMaterno){
        vacio = {...vacio,'apellidoMaterno':true};
        }
        if(!datos.fechaNac){
        vacio = {...vacio,'fechaNac':true};
        }
        if(!datos.tipoEmpleados){
            vacio = {...vacio,'tipoEmpleados':true};
        }
        if(!datos.jornadaLaboral){
            vacio = {...vacio,'jornadaLaboral':true};
        }
        if(!datos.rol){
            vacio = {...vacio,'rol':true};
        }
        this.setState({errores: vacio});
        if(datos.nombre && datos.apellidoPaterno && datos.apellidoMaterno && datos.fechaNac && datos.tipoEmpleados && datos.jornadaLaboral && datos.rol){
         const datosEmpleado = {
            nombre: datos.nombre,
            apellidoPaterno: datos.apellidoPaterno,
            apellidoMaterno: datos.apellidoMaterno,
            fechaNacimiento: datos.fechaNac,
            domicilio: datos.domicilio ? datos.domicilio : '',
            tipoEmpleadoId: datos.tipoEmpleados,
            rolId: datos.rol,
            jornadaLaboralId: datos.jornadaLaboral,
            usuarioCreacionId: Usuario.usuarioLogin.id
         }

         empleado.guardarEmpleado(datosEmpleado)
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
        const {errores,datos,fechaSeleccionada,tipoEmpleado,jornada,rol,siguienteID} = this.state;
        const { classes} = this.props;

        const handleChange = (e) => {
            const {datos}=this.state;
            let datosInput = {...datos,[e.target.name]: e.target.value };
            this.setState({datos:datosInput});
        }

        const onDateChange = (value) => {
            const {datos}=this.state;
            let fecha = {...datos,'fechaNac': value.target.value };
            this.setState({
                datos: fecha,
                fechaSeleccionada:value
            });
        };

    return(
        <Grid container className={classes.contenedor}>
        <Grid item lg={10} md={10} sm={10} xs={10} >
            <Typography className={classes.txtTitulo}>Alta de empleados</Typography>
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
                                    value={datos.nombre ? datos.nombre : ''}
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
                                    value={datos.apellidoPaterno ? datos.apellidoPaterno : ''}
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
                                    value={datos.apellidoMaterno ? datos.apellidoMaterno : ''}
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
                                    id="fechaNac"
                                    name="fechaNac"
                                    label="Fecha Nacimiento"
                                    type="date"
                                    required
                                    error={errores.fechaNac}
                                    onChange={onDateChange}
                                    defaultValue={fechaSeleccionada}
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
                                displayEmpty
                                labelId="demo-simple-select-label"
                                id="tipoEmpleados"
                                name="tipoEmpleados"
                                required
                                error={errores.tipoEmpleados}
                                value={datos.tipoEmpleados ? datos.tipoEmpleados : 0}
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
                                id="jornadaLaboral"
                                name="jornadaLaboral"
                                required
                                error={errores.jornadaLaboral}
                                value={datos.jornadaLaboral ? datos.jornadaLaboral : 0}
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
                                    value={datos.domicilio ? datos.domicilio : ''}
                                    className={classes.selectTipoEmp}
                                    label="Domicilio"
                                    onInput={NumerosLetras} />
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={12} >
                            <FormControl className={classes.selectTipoEmp}>
                                <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="rol"
                                name="rol"
                                required
                                error={errores.rol}
                                value={datos.rol ? datos.rol : 0}
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
                                <Button variant="contained" className={classes.btnCancelar} onClick={this.cancelarAlta} >Cancelar</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>  
                </Grid>
            </Grid>
        </Grid>
        </Grid>
       
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(empleadoStyles,{ withTheme: true })(AltaEmpleado));
