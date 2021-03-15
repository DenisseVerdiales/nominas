import React, {Component} from 'react';
import { 
    Typography,
    Grid, 
    TextField,
    FormControl,
    InputLabel, 
    Select, 
    MenuItem,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Table 
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {MdModeEdit,AiTwotoneDelete} from 'react-icons/all';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import swal from 'sweetalert';
import * as EmpleadoActions from '../store/Acciones/empleadoActions';
import * as UsuarioActions from '../store/Acciones/usuarioActions';
import {soloLetras, SoloNumeros} from '../utilidades/validar';
import { almacenarStorage,consultarStorage,consultarObjetoStorage } from '../utilidades/asyncStorage';
import {EMPLEADOSCONSULTADOS,OBTENEREMPLEADOS,COMBOSCONSULTADOS,CBOTIPOEMPLEADO,CBOROL,OPCIONMENU,IDEMPLEADO} from '../constantes/constantes';

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
        color:'#58707D',
        paddingBottom:20
    },
    contenedorGeneral:{
        border: '1px solid #DFE2E4',
        justifyContent:'center'
    },
    txtTituloBusq:{
        fontWeight:'bold',
        color:'#58707D'
    },
    contenedorBusqueda:{
        display:'flex',
        paddingBottom:35
    },
    selectTipoEmp:{
        width:"90%"
    },
    contenedorBusq:{
        paddingTop:20
    },
    contenedorGrid:{
        paddingBottom:35
    },
    btnEditar:{
        fontSize:22
    },
    btnEliminar:{
        fontSize:22
    }
})

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
root: {
    '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    },
},
}))(TableRow);
  
function createData(NumeroEmpleado, Nombre, Rol, TipoEmpleado) {
return { NumeroEmpleado, Nombre, Rol, TipoEmpleado};
}


class BuscarEmpleado extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            pagina: 0,
            regPorPagina: 5,
            empleados:[],
            tipoEmpleado:[],
            rol:[],
            IdSeleccionado:'',
            rolSeleccionado: 0,
            tipoSeleccionado: 0,
            empleadosLista:[]
        };
    }

    componentDidMount(){
        this.consultarStorageEmpleados();
    }

    eliminarRegistro (dato){
        const { actions: { empleado } ,Usuario} = this.props;
        swal({
            title: "",
            text: "Estas seguro que deseas eliminar el empleado?",
            icon: "warning",
            buttons: {
                cancel: "Cancelar",
                confirm: {
                  text: "Eliminar",
                  value: dato,
                }
            },
            dangerMode: true,
          })
          .then((value) => {
            if (value) {
                const empleadoDatos = {
                    id: value.NumeroEmpleado,
                    usuarioModificacionId: Usuario.usuarioLogin.id
                }
                empleado.eliminarEmpleados(empleadoDatos)
                .then(()=>{
                    swal("Empleado eliminado con éxito", {
                        icon: "success",
                    });
                })
                .catch((error)=>{
                    if(error.response){
                        if (error.response.status === 404) {
                            swal({
                                title: "",
                                text: "No se encontró el empleado.",
                                icon: "warning",
                                button: "Aceptar",
                            });
                        } else {
                            swal({
                                title: "",
                                text: "Ocurrió un error al eliminar el empleado. Intente más tarde.",
                                icon: "error",
                                button: "Aceptar",
                            });
                        }
                    }
                })
            } 
          });
    }

    editarRegistro(dato){
        almacenarStorage(IDEMPLEADO,dato.NumeroEmpleado);
        almacenarStorage(OPCIONMENU,6);
        
    }

    consultarStorageEmpleados(){
        consultarStorage(EMPLEADOSCONSULTADOS)
          .then((valor) => {
            if (valor === true && Object.getOwnPropertyNames(valor).length !== 0) {
                this.obtenerStorageEmpleados();
            }else{
                this.verificarSesionLocal();
            } 
        });
    }

    verificarSesionLocal() {
        const { actions: { usuario } } = this.props;
        usuario.verificarSesionLocal()
        .then(()=>{
            this.consultarEmpleados();
        })
    }

    consultarEmpleados(){
        const { actions: { empleado } } = this.props;

        empleado.obtenerEmpleados()
        .then(()=>{
            almacenarStorage(EMPLEADOSCONSULTADOS,true)
            .then(()=>{
                this.obtenerCombos();
            })
        })
        .catch((error)=>{
            console.log("ERROR CONSULTAR EMPLEADO",error);
        })
    }

    obtenerCombos(){
        const { actions: { empleado } } = this.props;
        empleado.obtenerTipoEmpleado()
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
    }

    consultarCombos(){
        const { Empleado} = this.props;
         this.setState({
            tipoEmpleado: Empleado.tipoEmpleado,
            rol: Empleado.rol
        },this.obtenerEmpleado);
    }

    obtenerStorageEmpleados() {
        consultarObjetoStorage(OBTENEREMPLEADOS)
        .then((empleados) => {
            let datos = [];
            empleados.map((d,index)=>(
                datos.push(createData(d.id, d.nombreEmpleado, d.Rol.nombreRol, d.TipoEmpleado.tipoEmpleado))
            ))
            this.setState({empleados: datos,empleadosLista: datos},this.obtenerStorageCboTipo);
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

    obtenerEmpleado(){
        const { Empleado}  = this.props;
        let datos = [];
        Empleado.registroEmpleado.map((d,index)=>(
            datos.push(createData(d.id, d.nombreEmpleado, d.Rol.nombreRol, d.TipoEmpleado.tipoEmpleado))
        ))
        console.log("datos",datos);
        this.setState({
            empleados: datos,
            empleadosLista: datos
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
            this.setState({rol:cboRol});
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

    filtroNoEmpleado(noEmpleado) {
        const { empleados } = this.state;
        const nuevoEmpleado = empleados.filter((item) =>
          `${item.NumeroEmpleado}`.includes(noEmpleado)
        )
    
        this.setState({
            empleados: nuevoEmpleado
        });
        if (noEmpleado === '') {
          this.obtenerEmpleado();
        }
    }

    filtroNombreEmpleado(nombre) {
        const { empleados } = this.state;
        const nuevoEmpleado = empleados.filter((item) =>
          `${item.Nombre}`.includes(nombre)
        )
    
        this.setState({
            empleados: nuevoEmpleado
        });
        if (nombre === '') {
          this.obtenerEmpleado();
        }
    }

    filtroRol(rol) {
        const { empleadosLista } = this.state;
        const nuevoEmpleado = empleadosLista.filter((item) =>
          `${item.Rol}`.includes(rol)
        )
    
        this.setState({
            empleados: nuevoEmpleado
        });
        if (rol === 'Seleccione') {
          this.obtenerEmpleado();
        }
    }

    filtroTipoEmpleado(tipo) {
        const {empleadosLista } = this.state;

        const nuevoEmpleado = empleadosLista.filter((item) =>
          `${item.TipoEmpleado}`.includes(tipo)
        )
    
        this.setState({
            empleados: nuevoEmpleado
        });
        if (tipo === 'Seleccione') {
          this.obtenerEmpleado();
        }
    }

    RolSeleccionado(id,e){
        this.setState({ 
            IdSeleccionado: '',
            nombreSeleccionado: '',
            rolSeleccionado: id.target.value,
            tipoSeleccionado: 0
        }); 
        this.filtroRol(e.props.children); 
    }

    TipoSeleccionado(id,e){
        this.setState({ 
            IdSeleccionado: '',
            nombreSeleccionado: '',
            rolSeleccionado: 0,
            tipoSeleccionado: id.target.value
        }); 
        this.filtroTipoEmpleado(e.props.children); 
    }


    render(){
        const { classes} = this.props;
        const {
            pagina,
            regPorPagina,
            empleados,
            tipoEmpleado,
            rol,
            IdSeleccionado,
            nombreSeleccionado,
            rolSeleccionado,
            tipoSeleccionado
        } = this.state;

        const cambioPagina = (event, nuevaPagina) => {
            this.setState({pagina:nuevaPagina});
        };
        
        const cambioRegistroPorPagina = (event) => {
            this.setState({
                pagina:0,
                regPorPagina: event.target.value
            });
        };
       const NoEmpleadoSeleccionado= (e) => {
            this.setState({ 
                IdSeleccionado: e.target.value,
                nombreSeleccionado: '',
                rolSeleccionado: 0,
                tipoSeleccionado: 0
            }); 
            this.filtroNoEmpleado(e.target.value); 
        }
        const NombreEmpleadoSeleccionado= (e) => {
            this.setState({ 
                IdSeleccionado: '',
                nombreSeleccionado: e.target.value,
                rolSeleccionado: 0,
                tipoSeleccionado: 0
            }); 
            this.filtroNombreEmpleado(e.target.value); 
        }


        return(
            <Grid container className={classes.contenedor}>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <Typography className={classes.txtTitulo}>Busqueda de Empleados</Typography>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <Grid container className={classes.contenedorGeneral}>
                            <Grid item lg={10} md={10} sm={12} xs={12} className={classes.contenedorBusq}>
                                <Typography className={classes.txtTituloBusq}>Buscar Por:</Typography>
                                <Grid container >
                                    <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorBusqueda}>
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <TextField
                                                id="noEmpleado"
                                                name="noEmpleado"
                                                inputProps={{ maxLength: 40 }}
                                                required
                                                className={classes.selectTipoEmp}
                                                onChange={NoEmpleadoSeleccionado}
                                                value={IdSeleccionado}
                                                label="Número de Empleado"
                                                onInput={SoloNumeros}
                                            /> 
                                        </Grid> 
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <TextField
                                                id="nombre"
                                                name="nombre"
                                                inputProps={{ maxLength: 40 }}
                                                required
                                                className={classes.selectTipoEmp}
                                                onChange={NombreEmpleadoSeleccionado}
                                                value={nombreSeleccionado}
                                                label="Nombre"
                                                onInput={soloLetras}
                                            />
                                        </Grid> 
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <FormControl className={classes.selectTipoEmp}>
                                                <InputLabel id="demo-simple-select-label">*Rol</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                id="rol"
                                                name="rol"
                                                required
                                                value={rolSeleccionado}
                                                onChange={(id,d) => this.RolSeleccionado(id,d)}
                                                >
                                                 <MenuItem value={0}>Seleccione</MenuItem>
                                                {rol?.map((dato, index) => (
                                                    <MenuItem key={index} value={dato.id} >{dato.nombreRol}</MenuItem>
                                                ))}
                                                </Select>
                                            </FormControl> 
                                        </Grid> 
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <FormControl className={classes.selectTipoEmp}>
                                                <InputLabel id="demo-simple-select-label">*Tipo Empleado</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                id="tipoEmpleados"
                                                name="tipoEmpleados"
                                                required
                                                value={tipoSeleccionado}
                                                onChange={(id,d) => this.TipoSeleccionado(id,d)}
                                                >
                                                <MenuItem value={0}>Seleccione</MenuItem>
                                                {tipoEmpleado?.map((dato, index) => (
                                                    <MenuItem key={index} value={dato.id}>{dato.tipoEmpleado}</MenuItem>
                                                ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>    
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.contenedorGrid}>
                                    <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table} aria-label="customized table">
                                            <TableHead>
                                            <TableRow>
                                                <StyledTableCell>Número Empleado</StyledTableCell>
                                                <StyledTableCell align="left">Nombre</StyledTableCell>
                                                <StyledTableCell align="left">Rol</StyledTableCell>
                                                <StyledTableCell align="center">Tipo Empleado</StyledTableCell>
                                                <StyledTableCell align="center"></StyledTableCell>
                                                <StyledTableCell align="center"></StyledTableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {empleados.slice(pagina * regPorPagina, pagina * regPorPagina + regPorPagina).map((row) => {
                                                return (
                                                    <StyledTableRow key={row.NumeroEmpleado}>
                                                    <StyledTableCell component="th" scope="row">
                                                    {row.NumeroEmpleado}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{row.Nombre}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.Rol}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.TipoEmpleado}</StyledTableCell>
                                                    <StyledTableCell align="center"><a href="#" onClick={() => this.editarRegistro(row)}><MdModeEdit className={classes.btnEditar}/></a></StyledTableCell>
                                                    <StyledTableCell align="center"><a href="#" onClick={() => this.eliminarRegistro(row)}><AiTwotoneDelete className={classes.btnEliminar}/></a></StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                                })}
                                                
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15]}
                                        component="div"
                                        count={empleados.length}
                                        rowsPerPage={regPorPagina}
                                        page={pagina}
                                        onChangePage={cambioPagina}
                                        onChangeRowsPerPage={cambioRegistroPorPagina}
                                    />
                                    </Grid>
                                </Grid>
                            </Grid>
                            
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
  
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(empleadoStyles,{ withTheme: true })(BuscarEmpleado));
  