import React,{Component} from 'react';
import { 
    Typography,
    Grid, 
    TextField,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Table 
} from '@material-ui/core';
import {withStyles } from '@material-ui/core/styles';
import {MdModeEdit,AiTwotoneDelete} from 'react-icons/all';
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import swal from 'sweetalert';
import * as MovimientoActtions from '../store/Acciones/movimientosActions';
import * as UsuarioActions from '../store/Acciones/usuarioActions';
import {soloLetras,SoloNumeros} from '../utilidades/validar';
import {MOVIMIENTOSCONSULTADOS,
        OBTNERMOVIMIENTOS,
        OPCIONMENU,
        IDMOVIMIENTO,
    } from '../constantes/constantes';
import { almacenarStorage,consultarStorage,consultarObjetoStorage } from '../utilidades/asyncStorage';

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
    select:{
        width:"90%",
        [theme.breakpoints.down('sm')]: {
            fontSize:14
        }
    },
    contenedorBusq:{
        paddingTop:20
    },
    contenedorGrid:{
        paddingBottom:35
    },
    btnEditar:{
        fontSize:22,
        fill: '#09b5e2'
    },
    btnEliminar:{
        fontSize:22,
        fill: '#bd2525'
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
  
function createData(NumeroMovimiento,NumeroEmpleado, Nombre, NoEntregas, FechaMovimiento) {
return { NumeroMovimiento, NumeroEmpleado, Nombre, NoEntregas, FechaMovimiento};
}

class BuscarMovimiento extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            pagina: 0,
            regPorPagina: 5,
            fechaSeleccionada: '',
            movimientos:[],
            movimientosLista:[],
            IdSeleccionado:'',
            nombreSeleccionado:'',
            entregasSeleccinadas:0,
            fecha: moment().format('YYYY-MM-DD'),
            FiltroFecha:[]
        };
    }

    componentDidMount(){
        this.consultarStorageMovimientos();
    }
    
    consultarStorageMovimientos(){
        consultarStorage(MOVIMIENTOSCONSULTADOS)
          .then((valor) => {
            if (valor == true && Object.getOwnPropertyNames(valor).length !== 0) {
                this.obtenerStorageMovimiento();
            }else{
                this.verificarSesionLocal();
            } 
        });
    }

    verificarSesionLocal() {
        const { actions: { usuario } } = this.props;
        usuario.verificarSesionLocal()
        .then(()=>{
            this.consultarMovimiento();
        })
    }

    obtenerStorageMovimiento() {
        consultarObjetoStorage(OBTNERMOVIMIENTOS)
        .then((movimientos) => {
            let datos = [];
            movimientos.map((d,index)=>(
                datos.push(createData(d.id, d.empleadoId, d.Empleado.Nombre, d.cantidadEntregasRecorrido, moment(d.fechaMovimiento).format("YYYY-MM-DD")))
            ))
            this.setState({movimientos: datos,movimientosLista: datos},this.obtenerStorageCboTipo);
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

    consultarMovimiento(){
        const { actions: { movimiento } } = this.props;

        movimiento.obtenerMovimientos()
        .then((respuesta)=>{
            almacenarStorage(MOVIMIENTOSCONSULTADOS,true);
            let datos = [];
            respuesta.map((d,index)=>(
                datos.push(createData(d.id, d.empleadoId, d.Empleado.Nombre, d.cantidadEntregasRecorrido, moment(d.fechaMovimiento).format("YYYY-MM-DD")))
            ))
            this.setState({movimientos: datos,movimientosLista: datos},this.obtenerStorageCboTipo);
        })
        .catch((error)=>{
            if(error.response){
                if (error.response.status === 404) {
                    swal({
                        title: "",
                        text: "No existen movimientos.",
                        icon: "warning",
                        button: "Aceptar",
                    });
                } else {
                    swal({
                        title: "",
                        text: "Ocurrió un error al consultar los movimientos. Intente más tarde.",
                        icon: "error",
                        button: "Aceptar",
                    });
                }
            }
        })
    }

  
    eliminarRegistro(dato){
        const { actions: { movimiento } ,Usuario} = this.props;
        swal({
            title: "",
            text: "Estas seguro que deseas eliminar el movimiento?",
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
                const movimientoDato = {
                    id: value.NumeroEmpleado,
                    usuarioModificacionId: Usuario.usuarioLogin.id
                }
                movimiento.eliminarMovimiento(movimientoDato)
                .then(()=>{
                    swal("Movimiento eliminado con éxito", {
                        icon: "success",
                    });
                    this.consultarMovimiento();
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

    filtroNoEmpleado(noEmpleado) {
        const { movimientosLista } = this.state;
        const nuevoMovimiento = movimientosLista.filter((item) =>
          `${item.NumeroEmpleado}`.includes(noEmpleado)
        )
    
        this.setState({
            movimientos: nuevoMovimiento
        });
        if (noEmpleado === '') {
          this.obtenerStorageMovimiento();
        }
    }

    filtroNombreEmpleado(nombreEmpleado) {
        const { movimientosLista } = this.state;
        const nuevoMovimiento = movimientosLista.filter((item) =>
          `${item.Nombre}`.includes(nombreEmpleado)
        )
    
        this.setState({
            movimientos: nuevoMovimiento
        });
        if (nombreEmpleado === '') {
          this.obtenerStorageMovimiento();
        }
    }

    filtroEntregas(entregas) {
        const { movimientosLista } = this.state;
        const nuevoMovimiento = movimientosLista.filter((item) =>
          `${item.NoEntregas}`.includes(entregas)
        )
    
        this.setState({
            movimientos: nuevoMovimiento
        });
        if (entregas === 0) {
          this.obtenerStorageMovimiento();
        }
    }

    filtroFecha(fecha) {
        
        this.setState({
            movimientos: fecha
        });
        if (!fecha) {
          this.obtenerStorageMovimiento();
        }
    }

    editarRegistro(dato){
        almacenarStorage(IDMOVIMIENTO,dato.NumeroMovimiento);
        almacenarStorage(OPCIONMENU,7);
    }

   

    render(){
        const { classes} = this.props;
        const {fechaSeleccionada,
                pagina,
                regPorPagina,
                movimientos,
                IdSeleccionado,
                nombreSeleccionado,
                entregasSeleccinadas,
                fecha
                } = this.state;

        const handleChangePage = (event, newPage) => {
            this.setState({pagina: newPage})
        };
        
        const handleChangeRowsPerPage = (event) => {
        this.setState({regPorPagina: event.target.value, pagina: 0})
        };

        const NoEmpleadoSeleccionado= (e) => {
            this.setState({ 
                IdSeleccionado: e.target.value,
                nombreSeleccionado: '',
                entregasSeleccinadas: 0,
                fechaSeleccionada: ''
            }); 
            this.filtroNoEmpleado(e.target.value); 
        }

        const NombreEmpleadoSeleccionado= (e) => {
            this.setState({ 
                IdSeleccionado: '',
                nombreSeleccionado: e.target.value,
                entregasSeleccinadas: 0,
                fechaSeleccionada: ''
            }); 
            this.filtroNombreEmpleado(e.target.value); 
        }

        const EntregasSeleccionadas= (e) => {
            this.setState({ 
                IdSeleccionado: '',
                nombreSeleccionado: '',
                entregasSeleccinadas: Number.parseInt(e.target.value),
                fechaSeleccionada: ''
            }); 
            this.filtroEntregas(e.target.value); 
        }

        const FechaSeleccionadas= (e) => {
            const {actions:{movimiento}}=this.props;
            movimiento.obtenerMovimienoPorFecha(moment(e.target.value).format('YYYY-MM-DD'))
            .then((resp)=>{
                let datos = [];
                resp.map((d,index)=>(
                    datos.push(createData(d.id, d.empleadoId, d.Empleado.Nombre, d.cantidadEntregasRecorrido, d.fechaMovimiento.substring(0,10) ))
                ))
                this.setState({ 
                    IdSeleccionado: '',
                    nombreSeleccionado: '',
                    entregasSeleccinadas: 0,
                    fechaSeleccionada: moment(e.target.value).format('YYYY-MM-DD'),
                    movimientos:datos
                });
                
            })  
        }

       

        return(
            <Grid container className={classes.contenedor}>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <Typography className={classes.txtTitulo}>Busqueda de Movimientos</Typography>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <Grid container className={classes.contenedorGeneral}>
                            <Grid item lg={10} md={10} sm={10} xs={10} className={classes.contenedorBusq}>
                                <Typography className={classes.txtTituloBusq}>Buscar Por:</Typography>
                                <Grid container >
                                    <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorBusqueda}>
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <TextField
                                                id="noEmpleado"
                                                name="noEmpleado"
                                                inputProps={{ maxLength: 40 }}
                                                className={classes.select}
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
                                                className={classes.select}
                                                onChange={NombreEmpleadoSeleccionado}
                                                value={nombreSeleccionado}
                                                label="Nombre"
                                                onInput={soloLetras}
                                            />
                                        </Grid> 
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <TextField
                                                id="entregas"
                                                name="entregas"
                                                inputProps={{ maxLength: 40 }}
                                                className={classes.select}
                                                onChange={EntregasSeleccionadas}
                                                value={entregasSeleccinadas}
                                                label="Entregas"
                                                onInput={SoloNumeros}
                                            /> 
                                        </Grid> 
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <TextField
                                                id="fechaMovimiento"
                                                name="fechaMovimiento"
                                                label="Fecha Movimiento"
                                                type="date"
                                                onChange={FechaSeleccionadas}
                                                defaultValue={fechaSeleccionada}
                                                className={classes.select}
                                                InputLabelProps={{
                                                shrink: true,
                                                }}
                                            />
                                        </Grid>    
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.contenedorGrid}>
                                    <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <TableContainer component={Paper}>
                                        <Table className={classes.table} aria-label="customized table">
                                            <TableHead>
                                            <TableRow>
                                                <StyledTableCell>Número Movimiento</StyledTableCell>
                                                <StyledTableCell>Número Empleado</StyledTableCell>
                                                <StyledTableCell align="left">Nombre</StyledTableCell>
                                                <StyledTableCell align="left">No. Entregas</StyledTableCell>
                                                <StyledTableCell align="center">Fecha Movimiento</StyledTableCell>
                                                <StyledTableCell align="center"></StyledTableCell>
                                                <StyledTableCell align="center"></StyledTableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {movimientos.slice(pagina * regPorPagina, pagina * regPorPagina + regPorPagina).map((row) => {
                                                return (
                                                    
                                                    <StyledTableRow key={row.NumeroMovimiento}>
                                                    <StyledTableCell component="th" scope="row">
                                                    {row.NumeroMovimiento}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">{row.NumeroEmpleado}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.Nombre}</StyledTableCell>
                                                    <StyledTableCell align="left">{row.NoEntregas}</StyledTableCell>
                                                    <StyledTableCell align="center">{row.FechaMovimiento}</StyledTableCell>
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
                                        count={movimientos.length}
                                        rowsPerPage={regPorPagina}
                                        page={pagina}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}
const mapStateToProps = ({ Usuario, Movimiento, }) => ({
    Usuario,
    Movimiento,
});
  
const mapDispatchToProps = (dispatch) => ({
actions: {
    movimiento: bindActionCreators(MovimientoActtions, dispatch),
    usuario: bindActionCreators(UsuarioActions, dispatch),
},
});
  
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(movimientoStyles,{ withTheme: true })(BuscarMovimiento));
  