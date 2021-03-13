import React,{Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { 
    Typography, 
    Button, 
    Grid, 
    Hidden, 
    TextField, 
    FormControl,
    InputLabel,
    Input, 
    InputAdornment,
    IconButton  
} from '@material-ui/core';
import { FaUserAlt,RiLockPasswordFill} from 'react-icons/all';
import {Visibility,VisibilityOff} from '@material-ui/icons';
import swal from 'sweetalert';
import clsx from 'clsx';
import PropTypes from "prop-types";
import * as UsuarioActions from '../store/Acciones/usuarioActions';
import logo from '../assets/imagenes/logo.png'


const loginStyles = theme =>  ({
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
        paddingBottom:30,
        flexDirection: 'row',
        justifyContent: 'center'
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
        },
        '& .MuiInput-input':{
            color:'#fff',
        }
    },
    btnEntrar:{
        borderRadius: 0,
        backgroundColor: '#a88f76 !important',
        color: '#e0dacd !important',
        height:'8vh',
        maxHeight:'8vh',
        width:'100%',
        alignSelf:'center'
    },
    contenedorForm:{
        background:'#000'
    },
    contenedorMovil:{
        '& .input':{
            [theme.breakpoints.down('sm')]: {
                width:330
              },
        }
    },
    input:{
        width: '80%'
    }
});

class Login extends Component {
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props) {
        super(props);
    
        this.state = {
            nombreUsuario: '',
            contrasena: '',
            mostrarContrasena:false
        };
        this.validarLogIn = this.validarLogIn.bind(this);
    }

    validarLogIn(){
        const { actions: { usuario } } = this.props;
        const {nombreUsuario,contrasena} = this.state;
        if(!nombreUsuario || !contrasena){
            swal({
                title: "Campos vacíos",
                text: "Debes capturar el usuario y/o contraseña.",
                icon: "warning",
                button: "Aceptar",
            });
        }else{
            const datosLogin = {
                nombreUsuario,
                contrasena,
            };
            usuario.loginUsuario(datosLogin)
            .then((respuesta) => {
                console.log(respuesta);
                if(respuesta){
                    this.context.router.history.replace("/principal");
                   
                }else{
                    swal({
                        title: "",
                        text: "El usuario ingresado no existe.",
                        icon: "warning",
                        button: "Aceptar",
                    });
                }
                
            })
            .catch((error) => {
                if(error.response){
                    if (error.response.status === 404) {
                        swal({
                            title: "",
                            text: "El usuario y/o contraseña introducidos son incorrectos, favor de verificar.",
                            icon: "warning",
                            button: "Aceptar",
                        });
                    } else {
                        swal({
                            title: "",
                            text: "Ocurrió un error al iniciar sesión. Intente más tarde.",
                            icon: "error",
                            button: "Aceptar",
                        });
                    }
                  }
            })
        }
    
    }
  

  
    render(){
        const {
            nombreUsuario,
            contrasena,
            mostrarContrasena
          } = this.state;
          const { classes} = this.props;
       
        const ManejadorMostrarContrasena = () => {
            this.setState({mostrarContrasena: !mostrarContrasena});
        };
        
        const MouseDownContrasena = (event) => {
            event.preventDefault();
        };

        return(
            <Grid container className={clsx(classes.contenedor,classes.contenedorMovil)}>
                <Hidden smDown>
                    <Grid item lg={8} md={8} sm={8} xs={12} className={classes.contenedorLogo}>
                        <Grid container className={classes.contenedorFormulario}>
                            <Grid item lg={12} md={8} sm={8} xs={12} className={classes.contenedorLogo}>
                                <Typography className={classes.txtEmpresa}>Rinku</Typography>
                                <img className={classes.imgLogo} src={logo} alt="logo" />
                            </Grid>
                        </Grid>
                    </Grid>
                </Hidden>
                <Grid item lg={4} md={4} sm={12} xs={12} className={classes.contenedorForm}>
                    <Grid container className={classes.contenedorFormulario}>
                        <Grid item lg={10} md={10} sm={10} xs={12} justify="center">
                            <Grid container className={classes.contenedorFormulario}>
                                <Grid item lg={7} md={10} sm={10} xs={12}  justify="center">
                                    <Grid container spacing={1} alignItems="flex-end" className={classes.inputUsuario}>
                                        <Grid item>
                                            <FaUserAlt className={classes.iconoUsuario}/>
                                        </Grid>
                                        <Grid item className={clsx(classes.input,'input')}>
                                            <TextField id="input-with-icon-grid" label="Usuario" onChange={(e)=>this.setState({nombreUsuario: e.target.value})} value={nombreUsuario} className={clsx(classes.txtinput,'input')} />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} alignItems="flex-end" className={classes.inputUsuario}>
                                        <Grid item>
                                        <RiLockPasswordFill className={classes.iconoUsuario}/>
                                        </Grid>
                                        <Grid item className={clsx(classes.input,'input')}>
                                            <FormControl className={clsx(classes.txtinput,'input')}>
                                                
                                            <InputLabel htmlFor="standard-adornment-password">Contraseña</InputLabel>
                                            <Input
                                                id="standard-adornment-password"
                                                type={mostrarContrasena ? 'text' : 'password'}
                                                value={contrasena} 
                                                onChange={(e)=>this.setState({contrasena: e.target.value})}
                                                endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={ManejadorMostrarContrasena}
                                                    onMouseDown={MouseDownContrasena}
                                                    className={classes.iconoUsuario}
                                                    >
                                                    {mostrarContrasena? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                                }
                                            />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} justify="center" >
                                        <Grid item lg={10} md={10} sm={10} xs={10}  justify="center">
                                            <Button variant="contained" className={classes.btnEntrar} onClick={this.validarLogIn}>Entrar</Button>
                                        </Grid>
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
const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    usuario: bindActionCreators(UsuarioActions, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(loginStyles,{ withTheme: true })(Login));
