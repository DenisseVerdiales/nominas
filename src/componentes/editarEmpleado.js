import React from 'react';
import { 
    Typography,
    Grid, 
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment";
import {soloLetras, NumerosLetras} from '../utilidades/validar';


const empleadoStyles = makeStyles((theme) => ({
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
    }
}))

export default function EditarEmpleado(){
    const classes = empleadoStyles();
    const [datos,setDatos] = React.useState({});
    const [fechaSeleccionada, setFechaSeleccionada] = React.useState(moment().format("YYYY-MM-DD"));
    const [errores, setErrores] = React.useState({});
    let vacio = {};
    const valida = (e) => {
        e.preventDefault();

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
        setErrores(vacio);
        if(datos.nombre && datos.apellidoPaterno && datos.apellidoMaterno && datos.fechaNac && datos.tipoEmpleados && datos.jornadaLaboral && datos.rol){
            alert("correcto")
        }
    }

    const handleChange = (e) => {
        setDatos({...datos,[e.target.name]: e.target.value })
        console.log(datos);
    }
    const onDateChange = (value) => {
  
        setDatos({...datos, 'fechaNac': value})
        setFechaSeleccionada(value);
      };

    return(
        <Grid container className={classes.contenedor}>
            <Grid item lg={10} md={10} sm={10} xs={10} >
                <Typography className={classes.txtTitulo}>Edición de empleados</Typography>
                <Grid item lg={12} md={12} sm={12} xs={12} >
                    <Grid container className={classes.contenedor}>
                    <form noValidate={true} onSubmit={valida}>
                        <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormGeneral}>
                     
                            <Grid item lg={12} md={12} sm={12} xs={12} className={classes.contenedorFormulario}>
                                <Grid item lg={4} md={4} sm={6} xs={12}>
                                    <TextField
                                        id="nombre"
                                        name="nombre"
                                        inputProps={{ maxLength: 40 }}
                                        required
                                        className={classes.selectTipoEmp}
                                        onChange={handleChange}
                                        value={datos.nombre}
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
                                        value={datos.apellidoPaterno}
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
                                        value={datos.apellidoMaterno}
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
                                    labelId="demo-simple-select-label"
                                    id="tipoEmpleados"
                                    name="tipoEmpleados"
                                    required
                                    error={errores.tipoEmpleados}
                                    value={datos.tipoEmpleados ? datos.tipoEmpleados : 'Seleccione'}
                                    onChange={handleChange}
                                    >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
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
                                    value={datos.jornadaLaboral ? datos.jornadaLaboral : 'Seleccione'}
                                    onChange={handleChange}
                                    >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
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
                                        value={datos.domicilio}
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
                                    value={datos.rol ? datos.rol : 'Seleccione'}
                                    onChange={handleChange}
                                    >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
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