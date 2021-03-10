import React from 'react';
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
import swal from 'sweetalert';
import {soloLetras} from '../utilidades/validar';
import EditarEmpleado from '../componentes/editarEmpleado';

const movimientoStyles = makeStyles((theme) => ({
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
}))

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
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('aaa', 356, 16.0, 49, 3.9),
    createData('vvv', 356, 16.0, 49, 3.9),
    createData('bb', 356, 16.0, 49, 3.9),
    createData('dd', 356, 16.0, 49, 3.9),
    createData('rrrr', 356, 16.0, 49, 3.9),
    createData('ttt', 356, 16.0, 49, 3.9),
    createData('ggg', 356, 16.0, 49, 3.9),
    createData('hhh', 356, 16.0, 49, 3.9),
    createData('eeee', 356, 16.0, 49, 3.9),
    createData('jjj', 356, 16.0, 49, 3.9),
  ];
export default function BuscarMovimiento(){
    const classes = movimientoStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [fechaSeleccionada, setFechaSeleccionada] = React.useState(moment().format("YYYY-MM-DD"));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    const elimiarRegistro = (dato)=>{
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

    const editarRegistro = (dato)=>{
      
    }

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
                                            <StyledTableCell align="right">Rol</StyledTableCell>
                                            <StyledTableCell align="right">Tipo Empleado</StyledTableCell>
                                            <StyledTableCell align="right"></StyledTableCell>
                                            <StyledTableCell align="right"></StyledTableCell>
                                        </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            return (
                                                <StyledTableRow key={row.NumeroEmpleado}>
                                                <StyledTableCell component="th" scope="row">
                                                {row.NumeroEmpleado}
                                                </StyledTableCell>
                                                <StyledTableCell align="right">{row.Nombre}</StyledTableCell>
                                                <StyledTableCell align="right">{row.Rol}</StyledTableCell>
                                                <StyledTableCell align="right">{row.TipoEmpleado}</StyledTableCell>
                                                <StyledTableCell align="right"><a href="#" onClick={() => editarRegistro(row)}><MdModeEdit className={classes.btnEditar}/></a></StyledTableCell>
                                                <StyledTableCell align="right"><a href="#" onClick={() => elimiarRegistro(row)}><AiTwotoneDelete className={classes.btnEliminar}/></a></StyledTableCell>
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
                                    rowsPerPage={rowsPerPage}
                                    page={page}
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