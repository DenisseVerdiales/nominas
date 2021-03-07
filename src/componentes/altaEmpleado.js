import React from 'react';
import { Typography,Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const empleadoStyles = makeStyles((theme) => ({
    contenedor:{
        justifyContent:'center',
        alignItems:'center',
        border:'1px solid red'
    },
    txtTitulo:{
        textAlign:'center',
        fontSize:'2em',
        fontWeight:'bold',
        color:'#58707D'
    }
}))

export default function AltaEmpleado(){
    const classes = empleadoStyles();
    return(
        <Grid container className={classes.contenedor}>
            <Grid item lg={10} md={10} sm={10} xs={10} >
                <Typography className={classes.txtTitulo}>Alta de empleados</Typography>
                <Grid item lg={10} md={10} sm={10} xs={10} >
                    <Grid container className={classes.contenedor}>
                        <Grid item lg={12} md={12} sm={12} xs={12} >

                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
             
        </Grid>
       
    )
}