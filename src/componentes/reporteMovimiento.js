import React from 'react';
import { 
    Typography,
    Grid, 
    TextField,
    FormControl,
    InputLabel, 
    Select, 
    MenuItem,
    Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {SoloNumeros} from '../utilidades/validar';

const reporteStyles = makeStyles((theme) => ({
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
        paddingBottom:35,
        paddingTop:20
    },
    selectTipoEmp:{
        width:"90%"
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
    txtTituloReporte:{
        fontWeight:'bold',
        paddingLeft:35
    },
    btnExportar:{
        background: '#7AAD35 !important',
        color: '#fff',
        borderRadius: 0,
        boxShadow: 'none !important',
    },
    contenedorBtnExportar:{
        justifyContent:'flex-end'
    },
    contenedorPrincipalBtnExportar:{
        paddingBottom:20
    }
}))

export default function ReporteMovimiento(){
    const classes = reporteStyles();

    return(
        <Grid container className={classes.contenedor}>
            <Grid item lg={10} md={10} sm={10} xs={10} >
                <Typography className={classes.txtTitulo}>Reporte de Movimientos</Typography>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <Grid container className={classes.contenedorGeneral}>
                    <Grid item lg={11} md={11} sm={11} xs={11} className={classes.contenedorBusqueda}>
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <TextField
                                id="noEmpleado"
                                name="noEmpleado"
                                inputProps={{ maxLength: 40 }}
                                required
                                className={classes.selectTipoEmp}
                                //onChange={handleChange}
                                //value={datos.nombre}
                                label="Número de Empleado"
                                //error={errores.nombre}
                                onInput={SoloNumeros}
                            /> 
                        </Grid> 
                        <Grid item lg={4} md={4} sm={6} xs={12} >
                            <FormControl className={classes.selectTipoEmp}>
                                <InputLabel id="demo-simple-select-label">Seleccione Mes*</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="mes"
                                name="mes"
                                required
                                //error={errores.rol}
                                //value={datos.rol ? datos.rol : 'Seleccione'}
                                //onChange={handleChange}
                                >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>  
                        </Grid> 
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <Button variant="contained" type="submit" className={classes.btnGuardar}>Guardar</Button>
                        </Grid> 
                        <Grid item lg={3} md={3} sm={6} xs={12} >
                            <Button variant="contained" className={classes.btnCancelar}>Cancelar</Button>
                        </Grid>    
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Typography className={classes.txtTituloReporte}>Nombre completo: </Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Typography className={classes.txtTituloReporte}>Tipo de empleado: </Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Typography className={classes.txtTituloReporte}>Rol:</Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Typography className={classes.txtTituloReporte}>Jornada laboral: </Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Typography className={classes.txtTituloReporte}>Sueldo base mensual: </Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Typography className={classes.txtTituloReporte}>Bono por entrega: </Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Typography className={classes.txtTituloReporte}>Bono por cubrir turno: </Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Typography className={classes.txtTituloReporte}>Sueldo bruto mensual: </Typography>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Typography className={classes.txtTituloReporte}>Sueldo neto mensual: </Typography>
                        </Grid>
                    </Grid>
                    <Grid item lg={8} md={8} sm={10} xs={10} className={classes.contenedorPrincipalBtnExportar}>
                        <Grid container className={classes.contenedorBtnExportar}>
                            <Grid item lg={10} md={10} sm={10} xs={10} >
                                <Button variant="contained" type="submit" className={classes.btnExportar}>Exportar</Button>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
             
        </Grid>
    )
}