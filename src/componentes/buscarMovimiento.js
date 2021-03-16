import React,{Component} from 'react';
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
import { makeStyles,withStyles } from '@material-ui/core/styles';
import {MdModeEdit,AiTwotoneDelete} from 'react-icons/all';
import moment from "moment";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import swal from 'sweetalert';
import * as MovimientoActtions from '../store/Acciones/movimientosActions';
import * as UsuarioActions from '../store/Acciones/usuarioActions';
import {soloLetras} from '../utilidades/validar';
import {MOVIMIENTOSCONSULTADOS,
        OBTNERMOVIMIENTOS,
        COMBOSCONSULTADOS,
        CBOTIPOEMPLEADO,
        CBOROL,
        OPCIONMENU,
        IDEMPLEADO,
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
  
  function createData(NumeroEmpleado, Nombre, NoEntregas, FechaMovimiento) {
    return { NumeroEmpleado, Nombre, NoEntregas, FechaMovimiento};
  }
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24),
    createData('Ice cream sandwich', 237, 9.0, 37),
    createData('Eclair', 262, 16.0, 24),
    createData('Cupcake', 305, 3.7, 67),
    createData('Gingerbread', 356, 16.0, 49),
    createData('aaa', 356, 16.0, 49),
    createData('vvv', 356, 16.0, 49),
    createData('bb', 356, 16.0, 49),
    createData('dd', 356, 16.0, 49),
    createData('rrrr', 356, 16.0, 49),
    createData('ttt', 356, 16.0, 49),
    createData('ggg', 356, 16.0, 49),
    createData('hhh', 356, 16.0, 49),
    createData('eeee', 356, 16.0, 49),
    createData('jjj', 356, 16.0, 49),
  ];

class BuscarMovimiento extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            pagina: 0,
            regPorPagina: 5,
            fechaSeleccionada: moment().format("YYYY-MM-DD"),
            movimientos:[],
            movimientosLista:[]
        };
    }

    componentDidMount(){
        this.consultarStorageMovimientos();
    }
    
    consultarStorageMovimientos(){
        consultarStorage(MOVIMIENTOSCONSULTADOS)
          .then((valor) => {
            if (valor === true && Object.getOwnPropertyNames(valor).length !== 0) {
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
            console.log("MOVIMIENTOS",movimientos)
            let datos = [];
            movimientos.map((d,index)=>(
                datos.push(createData(d.id, d.nombreEmpleado, d.Rol.nombreRol, d.TipoEmpleado.tipoEmpleado))
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
        .then(()=>{
            almacenarStorage(MOVIMIENTOSCONSULTADOS,true)
            .then((movimientos)=>{
                console.log("MOVIMIENTOS",movimientos)
                //this.obtenerCombos();
            })
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

  
    elimiarRegistro(dato){
        swal({
            title: "",
            text: "Estas seguro que deseas eliminar el movimiento?",
            icon: "warning",
            buttons: {
                cancel: "Cancelar",
                confirm: {
                  text: "Eliminar",
                  value: "catch",
                }
            },
            dangerMode: true,
          })
          .then((value) => {
            if (value) {
              swal("Poof! Your imaginary file has been deleted!", {
                icon: "success",
              });
            } 
          });
    }

    editarRegistro(dato){
      
    }

    render(){
        const { classes} = this.props;
        const {fechaSeleccionada,pagina,regPorPagina} = this.state;

        const handleChangePage = (event, newPage) => {
            this.setState({pagina: newPage})
          };
        
          const handleChangeRowsPerPage = (event) => {
            this.setState({regPorPagina: event.target.value, pagina: 0})
          };
    

        return(
            <Grid container className={classes.contenedor}>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <Typography className={classes.txtTitulo}>Busqueda de Movimientos</Typography>
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
                                                className={classes.select}
                                                //onChange={handleChange}
                                                //value={datos.nombre}
                                                label="Número de Empleado"
                                                //error={errores.nombre}
                                                onInput={soloLetras}
                                            /> 
                                        </Grid> 
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <TextField
                                                id="nombre"
                                                name="nombre"
                                                inputProps={{ maxLength: 40 }}
                                                required
                                                className={classes.select}
                                                //onChange={handleChange}
                                                //value={datos.nombre}
                                                label="Nombre"
                                                //error={errores.nombre}
                                                onInput={soloLetras}
                                            />
                                        </Grid> 
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <TextField
                                                id="entregas"
                                                name="entregas"
                                                inputProps={{ maxLength: 40 }}
                                                required
                                                className={classes.select}
                                                //onChange={handleChange}
                                                //value={datos.nombre}
                                                label="Entregas"
                                                //error={errores.nombre}
                                                onInput={soloLetras}
                                            /> 
                                        </Grid> 
                                        <Grid item lg={4} md={4} sm={6} xs={12} >
                                            <TextField
                                                id="fechaMovimiento"
                                                name="fechaMovimiento"
                                                label="Fecha Movimiento"
                                                type="date"
                                                required
                                                //error={errores.fechaMovimiento}
                                                //onChange={onDateChange}
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
                                                <StyledTableCell>Número Empleado</StyledTableCell>
                                                <StyledTableCell align="right">Nombre</StyledTableCell>
                                                <StyledTableCell align="right">No. Entregas</StyledTableCell>
                                                <StyledTableCell align="right">Fecha Movimiento</StyledTableCell>
                                                <StyledTableCell align="right"></StyledTableCell>
                                                <StyledTableCell align="right"></StyledTableCell>
                                            </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.slice(pagina * regPorPagina, pagina * regPorPagina + regPorPagina).map((row) => {
                                                return (
                                                    <StyledTableRow key={row.NumeroEmpleado}>
                                                    <StyledTableCell component="th" scope="row">
                                                    {row.NumeroEmpleado}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="right">{row.Nombre}</StyledTableCell>
                                                    <StyledTableCell align="right">{row.NoEntregas}</StyledTableCell>
                                                    <StyledTableCell align="right">{row.FechaMovimiento}</StyledTableCell>
                                                    <StyledTableCell align="right"><a href="#" onClick={() => this.editarRegistro(row)}><MdModeEdit className={classes.btnEditar}/></a></StyledTableCell>
                                                    <StyledTableCell align="right"><a href="#" onClick={() => this.stateelimiarRegistro(row)}><AiTwotoneDelete className={classes.btnEliminar}/></a></StyledTableCell>
                                                    </StyledTableRow>
                                                )
                                                })}
                                                
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15]}
                                        component="div"
                                        count={rows.length}
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
  