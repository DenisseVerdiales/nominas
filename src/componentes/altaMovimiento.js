import React from 'react';
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
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";
import {soloLetras, NumerosLetras,SoloNumeros} from '../utilidades/validar';


const altaMovimientoStyles = makeStyles((theme) => ({
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
}))

export default function AltaMovimiento(){
    const classes = altaMovimientoStyles();
    const [datos,setDatos] = React.useState({fecha:moment().format("YYYY-MM-DD")});
    const [fechaSeleccionada, setFechaSeleccionada] = React.useState(moment().format("YYYY-MM-DD"));
    const [errores, setErrores] = React.useState({});
    const [chks, setChks] = React.useState({
        chkCantidadEntregas:false,
        chkCubrioTurno:false
    });
    const [importeTotal, setImporteTotal] = React.useState();
    let vacio = {};
    const valida = (e) => {
        e.preventDefault();

        if(!datos.noEmpleado){
        vacio={'noEmpleado':true};
        }
        if(!datos.fecha){
        vacio = {...vacio,'fecha':true};
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
        setErrores(vacio);
        if(datos.noEmpleado && datos.fecha){
            if((chks.chkCantidadEntregas && Number.parseInt(datos.CantEntregas)  > 0 ) || (chks.chkCubrioTurno && datos.rolTurno)){
                alert("correcto con check")
            }
            else{
                alert("correcto sin check")
            }
        }
    }

    const datosModificados = (e) => {
        setDatos({...datos,[e.target.name]: e.target.value });
    }
    const fechaModificada = (value) => {
        setDatos({...datos, 'fecha': value});
        setFechaSeleccionada(value);
    };

    const CheckModificado = (e) => {
        setChks({...chks,[e.target.name]: e.target.checked })
    };

    return(
        <Grid container className={classes.contenedor}>
            <Grid item lg={10} md={10} sm={10} xs={10} >
                <Typography className={classes.txtTitulo}>Alta de Movimientos</Typography>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <Grid container className={classes.contenedor}>
                    <form noValidate={true} onSubmit={valida} className={classes.contenedorFormularioDatos}>
                        <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormGeneral}>
                        <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormulario}>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <TextField
                                        id="noEmpleado"
                                        name="noEmpleado"
                                        inputProps={{ maxLength: 40 }}
                                        required
                                        className={classes.selectTipoEmp}
                                        onChange={datosModificados}
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
                                        value={datos.nombre}
                                        label="Nombre"
                                    />

                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={12} >
                                    <TextField
                                        id="apellidoPaterno"
                                        name="apellidoPaterno"
                                        inputProps={{ maxLength: 40 }}
                                        value={datos.apellidoPaterno}
                                        disabled={true}
                                        className={classes.selectTipoEmp}
                                        label="Apellido Paterno"/>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={12} >
                                    <TextField
                                        id="apellidoMaterno"
                                        name="apellidoMaterno"
                                        inputProps={{ maxLength: 40 }}
                                        value={datos.apellidoMaterno}
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
                                        value={datos.rol ? datos.rol : 'Seleccione'}
                                        >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
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
                                    value={datos.tipoEmpleados ? datos.tipoEmpleados : 'Seleccione'}
                                    >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
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
                                        value={datos.rolTurno ? datos.rolTurno : 'Seleccione'}
                                        onChange={datosModificados}
                                        >
                                        <MenuItem value={10}>Ten</MenuItem>
                                        <MenuItem value={20}>Twenty</MenuItem>
                                        <MenuItem value={30}>Thirty</MenuItem>
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
                                <Typography>$ {importeTotal}</Typography>
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