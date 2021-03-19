import React,{Component} from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {ExpandLess,ExpandMore} from '@material-ui/icons';
import {Grid}from '@material-ui/core';
import {FaUserCircle,FaClipboardList,FaSignOutAlt} from 'react-icons/all';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import logo from '../assets/imagenes/logo.png'
import AltaEmpleado from './altaEmpleado';
import BuscarEmpleado from './buscarEmpleado';
import AltaMovimiento from './altaMovimiento';
import BuscarMovimiento from './buscarMovimiento';
import ReporteMovimiento from './reporteMovimiento';
import EditarEmpleado from './editarEmpleado';
import EditarMovimiento from './editarMovimiento';
import * as UsuarioActions from '../store/Acciones/usuarioActions';

const drawerWidth = 240;

const useStyles = theme =>  ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background:'linear-gradient(to bottom,#fff,#e0dacd,#a88f76)'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    background:'linear-gradient(to bottom,#fff,#e0dacd,#a88f76)'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex:1201,
    '& :hover':{
        background: '#e0dacd', 
    },
    maxHeight: '40vh',
    padding: '10px 0px'
  },
  toolbarOpen:{
    width: drawerWidth + 30,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      position: 'fixed'
  },
  toolbarClose:{
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width:'105px !important',
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
      position: 'fixed'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  IconoFlecha:{
    border: '1px solid #e0dacd',
    background: '#e0dacd',
    '& :hover':{
        background: '#e0dacd', 
    }
  },
  iconoMenu:{
    height: '2em',
    width: '2em',
    color:'#a4746c',
  },
  imgLogo:{
    alignSelf: 'center',
    height: '5vh',
    maxHeight: '5vh',
    width: 50
    },
    txtEmpresa:{
        fontSize: '2em',
        fontWeight:'bold',
        '& span':{
            fontSize: 25,
            fontWeight: 'bold'
        }
    },
    listaLogo:{
        paddingTop:40,
        paddingBottom:40
    },
    listaContenido:{
        paddingTop:60
    },
    txtMenu:{
        color:'#a4746c',
        fontWeight:'bold'
    },
    contenedorSubMenu:{
        textAlign:'center'
    },
    link: {
        textDecoration: 'none'
    },
    contenedorOpciones:{
      justifyContent: 'center',
      maxWidth: '100%',
      marginLeft: 42
    },
    contenedorOpcionesMenuAbierto:{
      maxWidth: '90%',
      justifyContent: 'flex-end'
    }
   
});
class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
        open: false,
        openOption: false,
        openOptionM:false,
    };
    this.cerrarSesion = this.cerrarSesion.bind(this);
  }

    componentDidMount(){
    this.obtenerOpcionMenu();
    }

    handleDrawer = () => {
      const {open} = this.state;
      this.setState({open: !open});
    };
    
    handleClickEmpleado = () => {
      const {openOption} = this.state;
      this.setState({openOption: !openOption});
    };

    handleClickMovimiento = () => {
      const {openOptionM} = this.state;
      this.setState({openOptionM: !openOptionM});
    };

    obtenerOpcionMenu = () => {
      const{actions:{usuario}}=this.props;
      usuario.obtenerOpcionMenu();
      
    }

    cerrarSesion(){
      const {actions: { usuario },history,Usuario} = this.props;
      usuario.logoutUsuario(Usuario, () => {history.replace('/')})
    }

    render(){
      const {openOptionM,open,openOption} = this.state;
      const { classes, Usuario, actions:{usuario}} = this.props;
    
      return (
        <div className={classes.root}>
        <CssBaseline />
        <div className={clsx(classes.toolbar,{[classes.toolbarOpen]: open,
            [classes.toolbarClose]: !open,})}>
            <IconButton onClick={this.handleDrawer} className={classes.IconoFlecha}>
              {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
        
          <Divider />
            <List className={classes.listaLogo}>
                <ListItem button key={"Rinku"}>
                    <ListItemIcon><img className={classes.imgLogo} src={logo} alt="logo" /></ListItemIcon>
                    <ListItemText primary={"Rinku"} className={classes.txtEmpresa}/>
                </ListItem>
          </List>
          <Divider />
          <List className={classes.listaContenido}>
            <ListItem button key={"Empleados"} onClick={this.handleClickEmpleado}>
                <ListItemIcon><FaUserCircle className={classes.iconoMenu}/></ListItemIcon>
                <ListItemText primary={"Empleados"} className={classes.txtMenu}/>
                {openOption ? <ExpandLess className={classes.txtMenu}/> : <ExpandMore className={classes.txtMenu}/>}
            </ListItem>
            <Collapse in={openOption} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItem button className={classes.contenedorSubMenu} onClick={() =>  usuario.guardarOpcionMenu(1)}>
                    <ListItemText primary="Nuevo" className={classes.txtMenu}/>
                </ListItem>
                <ListItem button className={classes.contenedorSubMenu} onClick={() => usuario.guardarOpcionMenu(2)}>
                <ListItemText primary="Buscar" className={classes.txtMenu}/>
                </ListItem>
            </List>
          </Collapse>
            <ListItem button key={"Movimientos"} onClick={this.handleClickMovimiento}>
                <ListItemIcon><FaClipboardList className={classes.iconoMenu}/></ListItemIcon>
                <ListItemText primary={"Movimientos"} className={classes.txtMenu}/>
                {openOptionM ? <ExpandLess className={classes.txtMenu}/> : <ExpandMore className={classes.txtMenu}/>}
            </ListItem>
            <Collapse in={openOptionM} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.contenedorSubMenu} onClick={() =>  usuario.guardarOpcionMenu(3)}>
                <ListItemText primary="Nuevo" className={classes.txtMenu}/>
              </ListItem>
              <ListItem button className={classes.contenedorSubMenu} onClick={() =>  usuario.guardarOpcionMenu(4)}>
                <ListItemText primary="Buscar" className={classes.txtMenu}/>
              </ListItem>
              <ListItem button className={classes.contenedorSubMenu} onClick={() =>  usuario.guardarOpcionMenu(5)}>
                <ListItemText primary="Reporte" className={classes.txtMenu}/>
              </ListItem>
            </List>
          </Collapse>
          </List>
          <Divider />
          <ListItem button key={"CerrarSesion"} onClick={this.cerrarSesion}>
            <ListItemIcon><FaSignOutAlt className={classes.iconoMenu}/></ListItemIcon>
            <ListItemText primary={"Cerrar Sesión"} className={classes.txtMenu}/>
          </ListItem>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Grid container className={clsx(classes.contenedorOpciones,{[classes.contenedorOpcionesMenuAbierto]: open})}>
            {Number.parseInt(Usuario.Usuario.opcionMenu) === 1 &&(
              <AltaEmpleado/>
            )}
            {Number.parseInt(Usuario.Usuario.opcionMenu) === 2 &&(
                <BuscarEmpleado/>
            )}
            {Number.parseInt(Usuario.Usuario.opcionMenu) === 3 &&(
                <AltaMovimiento/>
            )}
            {Number.parseInt(Usuario.Usuario.opcionMenu) === 4 &&(
                <BuscarMovimiento/>
            )}
            {Number.parseInt(Usuario.Usuario.opcionMenu) === 5 &&(
                <ReporteMovimiento/>
            )}
            {Number.parseInt(Usuario.Usuario.opcionMenu) === 6 && (
              <EditarEmpleado/>
            )}
            {Number.parseInt(Usuario.Usuario.opcionMenu) === 7 &&(
              <EditarMovimiento/>
            )}
          </Grid>
        </main>
      </div>
      );
    }
};
const mapStateToProps = (Usuario) => ({Usuario});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    usuario: bindActionCreators(UsuarioActions, dispatch),
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles,{ withTheme: true })(Menu)));
