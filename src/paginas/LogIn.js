import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Box, Grid, Hidden, TextField  } from '@material-ui/core';
import { FaUserAlt,RiLockPasswordFill} from 'react-icons/all';
import logo from '../assets/imagenes/logo.png'



const loginStyles = makeStyles((theme) => ({
    contenedor:{
        alignSelf:'center'
    },
    contenedorFormulario:{
        alignSelf:'center',
        justifyContent:'center',
        height: '100vh',
        alignItems: 'center'
    },
    contenedorLogo:{
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        background:'linear-gradient(to bottom,#fff,#e0dacd,#a88f76)'
    },
    imgLogo:{
        alignSelf: 'center',
        height: '30vh',
        maxHeight: '30vh',
        width: 250
    },
    txtEmpresa:{
        fontSize: '2em',
        textAlign: 'center',
        fontWeight:'bold'
    },
    inputUsuario:{
        paddingBottom:30
    },
    iconoUsuario:{
        color:'#e0dacd'
    },
    txtinput:{
        '& .MuiInputLabel-formControl':{
            color:'#e0dacd'
        },
        '& .MuiInput-underline:before':{
            borderBottom:'2px solid #e0dacd !important'
        },
        '& .MuiInput-underline:after':{
            borderBottom:'2px solid #c0b6a1 !important'
        }
    },
    btnEntrar:{
        borderRadius: 0,
        backgroundColor: '#a88f76 !important',
        color: '#e0dacd !important',
        height:'8vh',
        maxHeight:'8vh',
        width:'100%'
    },
    contenedorForm:{
        background:'#000'
    }
}));

export default function LogIn(){
    const classes = loginStyles();
    return(
        <Grid container className={classes.contenedor}>
            <Grid item lg={8} md={8} sm={8} xs={12} className={classes.contenedorLogo}>
                <Grid container className={classes.contenedorFormulario}>
                    <Grid item lg={12} md={8} sm={8} xs={12} className={classes.contenedorLogo}>
                        <Typography className={classes.txtEmpresa}>Rinku</Typography>
                        <img className={classes.imgLogo} src={logo} alt="logo" />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={4} md={4} sm={4} xs={12} className={classes.contenedorForm}>
                <Grid container className={classes.contenedorFormulario}>
                    <Grid item lg={10} md={10} sm={10} xs={12} justify="center">
                        <Grid container className={classes.contenedorFormulario}>
                            <Grid item lg={7} md={10} sm={10} xs={12}  justify="center">
                                <Grid container spacing={1} alignItems="flex-end" className={classes.inputUsuario}>
                                    <Grid item>
                                        <FaUserAlt className={classes.iconoUsuario}/>
                                    </Grid>
                                    <Grid item>
                                        <TextField id="input-with-icon-grid" label="Usuario" className={classes.txtinput} />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} alignItems="flex-end" className={classes.inputUsuario}>
                                    <Grid item>
                                        <RiLockPasswordFill className={classes.iconoUsuario}/>
                                    </Grid>
                                    <Grid item>
                                        <TextField id="input-with-icon-grid" label="Contraseña" className={classes.txtinput}/>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} justify="center" >
                                    <Grid item lg={10} md={10} sm={10} xs={12}  justify="center">
                                        <Button variant="contained" className={classes.btnEntrar}>Entrar</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}