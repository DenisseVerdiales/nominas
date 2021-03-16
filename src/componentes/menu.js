import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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
import {FaUserCircle,FaClipboardList} from 'react-icons/all';
import logo from '../assets/imagenes/logo.png'
import AltaEmpleado from './altaEmpleado';
import BuscarEmpleado from './buscarEmpleado';
import AltaMovimiento from './altaMovimiento';
import BuscarMovimiento from './buscarMovimiento';
import ReporteMovimiento from './reporteMovimiento';
import EditarEmpleado from './editarEmpleado';
import {consultarStorage,almacenarStorage } from '../utilidades/asyncStorage';
import {OPCIONMENU} from '../constantes/constantes';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
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
    maxHeight: 135,
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
}));

const Menu = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openOption, setOpenOption] = React.useState(false);
    const [openOptionM, setOpenOptionM] = React.useState(false);
    const [btnOpciones, setBtnOpciones] = React.useState(0);

    React.useEffect(() => {
          obtenerOpcionMenu();
    })

    const handleDrawer = () => {
      setOpen(!open);
    };
    
    const handleClickEmpleado = () => {
        setOpenOption(!openOption);
    };

    const handleClickMovimiento = () => {
        setOpenOptionM(!openOptionM);
    };

    const obtenerOpcionMenu = () => {
        consultarStorage(OPCIONMENU)
          .then((valor) => {
            if (valor !== null) {
              console.log("MENU OPCION",valor)
              setBtnOpciones(Number.parseInt(valor));
            } 
          });
    }

  return (
    <div className={classes.root}>
    <CssBaseline />
    <div className={clsx(classes.toolbar,{[classes.toolbarOpen]: open,
        [classes.toolbarClose]: !open,})}>
        <IconButton onClick={handleDrawer} className={classes.IconoFlecha}>
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
        <ListItem button key={"Empleados"} onClick={handleClickEmpleado}>
            <ListItemIcon><FaUserCircle className={classes.iconoMenu}/></ListItemIcon>
            <ListItemText primary={"Empleados"} className={classes.txtMenu}/>
            {openOption ? <ExpandLess className={classes.txtMenu}/> : <ExpandMore className={classes.txtMenu}/>}
        </ListItem>
        <Collapse in={openOption} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            <ListItem button className={classes.contenedorSubMenu} onClick={() => {setBtnOpciones(1); almacenarStorage(OPCIONMENU,1);}}>
                <ListItemText primary="Nuevo" className={classes.txtMenu}/>
            </ListItem>
            <ListItem button className={classes.contenedorSubMenu} onClick={() => {setBtnOpciones(2);almacenarStorage(OPCIONMENU,2);}}>
            <ListItemText primary="Buscar" className={classes.txtMenu}/>
            </ListItem>
        </List>
      </Collapse>
        <ListItem button key={"Movimientos"} onClick={handleClickMovimiento}>
            <ListItemIcon><FaClipboardList className={classes.iconoMenu}/></ListItemIcon>
            <ListItemText primary={"Movimientos"} className={classes.txtMenu}/>
            {openOptionM ? <ExpandLess className={classes.txtMenu}/> : <ExpandMore className={classes.txtMenu}/>}
        </ListItem>
        <Collapse in={openOptionM} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.contenedorSubMenu} onClick={() => {setBtnOpciones(3);almacenarStorage(OPCIONMENU,3);}}>
            <ListItemText primary="Nuevo" className={classes.txtMenu}/>
          </ListItem>
          <ListItem button className={classes.contenedorSubMenu} onClick={() => {setBtnOpciones(4); almacenarStorage(OPCIONMENU,4);}}>
            <ListItemText primary="Buscar" className={classes.txtMenu}/>
          </ListItem>
          <ListItem button className={classes.contenedorSubMenu} onClick={() => {setBtnOpciones(5); almacenarStorage(OPCIONMENU,5);}}>
            <ListItemText primary="Reporte" className={classes.txtMenu}/>
          </ListItem>
        </List>
      </Collapse>
      </List>
    </Drawer>
    <main className={classes.content}>
      <div className={classes.toolbar} />
      {btnOpciones === 1 &&(
        <AltaEmpleado/>
      )}
      {btnOpciones === 2 &&(
          <BuscarEmpleado/>
      )}
      {btnOpciones === 3 &&(
          <AltaMovimiento/>
      )}
      {btnOpciones === 4 &&(
          <BuscarMovimiento/>
      )}
      {btnOpciones === 5 &&(
          <ReporteMovimiento/>
      )}
      {btnOpciones === 6 && (
        <EditarEmpleado/>
      )}
    </main>
  </div>
  );
};

export default Menu;