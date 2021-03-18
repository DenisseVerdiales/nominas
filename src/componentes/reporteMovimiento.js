import React,{Component,Fragment} from 'react';
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
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { jsPDF } from "jspdf";
import * as EmpleadoActions from '../store/Acciones/empleadoActions';
import * as UsuarioActions from '../store/Acciones/usuarioActions';
import {SoloNumeros} from '../utilidades/validar';
import CineLogo from '../assets/imagenes/cineLogo.png';

const reporteStyles = theme =>  ({
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
        width:"90%",
        [theme.breakpoints.down('sm')]: {
            fontSize:13,
            '& #noEmpleado-label':{
                fontSize:13
            }
            
        },
        
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
        paddingLeft:35,
        paddingRight: 15
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
    },
    txtTituloReporte2:{
        color: '#5d5b5b'
    },
    contenedorFormularioDatos:{
        width: '100%'
    },
    contenedorFiltro:{
        display: 'flex',
        justifyContent: 'flex-end'
    },
    ContenedorReporte:{
        paddingTop: 30
    },
    pagina: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
})




class ReporteMovimiento extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            datos:{},
            datosBusqueda:{}
        };
    }

    componentDidMount(){
        this.verificarSesionLocal();
    }

    verificarSesionLocal() {
        const { actions: { usuario } } = this.props;
        usuario.verificarSesionLocal()
    }

    valida = (e) => {
        e.preventDefault();
        const { actions: { empleado }} = this.props;
        const {datosBusqueda}=this.state;
        let vacio = {};
        if(!datosBusqueda.noEmpleado){
        vacio={'noEmpleado':true};
        }
        if(!datosBusqueda.mes){
        vacio={...vacio,'mes':true};
        }
        this.setState({errores: vacio});
        if(datosBusqueda.noEmpleado && datosBusqueda.mes){

        const datos={
            id: Number.parseInt(datosBusqueda.noEmpleado),
            mes:datosBusqueda.mes
        }
        empleado.generarReporte(datos)
        .then((resp)=>{
            let reporte = {};
            resp.map((d,index)=>(
                reporte = {
                    Nombre: d.Nombre, 
                    BonoCubrirTurno: d.BonoCubrirTurno,
                    BonoEntrega: d.BonoEntrega,
                    BonoPuesto: d.BonoPuesto,
                    SueldoBaseMensual:d.SueldoBaseMensual,
                    SueldoMensualBruto: d.SueldoMensualBruto,
                    SueldoNeto: d.SueldoNeto,
                    SueldoNetoFinal: d.SueldoNetoFinal,
                    horasLaborales: d.horasLaborales,
                    nombreRol: d.nombreRol,
                    tipoEmpleado:d.tipoEmpleado
                }
            ))
            this.setState({datos: reporte});
            

        })
        }
    }

    generarPDF = () =>{
        const {datos}= this.state;
        let doc = new jsPDF('p','pt');
        doc.addImage(CineLogo,'png',5, 20, 80, 60)
        doc.text(120,50,'Cinematográfica Rinku');
        doc.text(20,110,`Nombre Completo: ${datos.Nombre}`);
        doc.text(20,130,`Tipo de empleado: ${datos.tipoEmpleado}`);
        doc.text(20,150,`Rol: ${datos.nombreRol}`);
        doc.text(20,170,`Jornada laboral: ${datos.horasLaborales}`);
        doc.text(20,190,`Sueldo base mensual: $${datos.SueldoBaseMensual}`);
        doc.text(20,210,`Bono por Entrega: $${datos.BonoEntrega}`);
        doc.text(20,230,`Bono por Cubrir Turno: $${datos.BonoCubrirTurno}`);
        doc.text(20,250,`Sueldo Bruto Mensual: $${datos.SueldoMensualBruto}`);
        doc.text(20,270,`Sueldo Neto Mensual $${Number.parseInt(datos.SueldoNetoFinal)>0 ? datos.SueldoNetoFinal : datos.SueldoNeto}`);
        doc.save("reporte.pdf")
    }
  
    render(){
        const { classes} = this.props;
        const {datos,datosBusqueda,errores} = this.state;
        
        const handleChange = (e) => {
            const {datosBusqueda}=this.state;
            let datosInput = {...datosBusqueda,[e.target.name]: e.target.value };
            this.setState({datosBusqueda:datosInput});
        }
        return(
            <Grid container className={classes.contenedor}>
                <Grid item lg={10} md={10} sm={10} xs={10} >
                    <Typography className={classes.txtTitulo}>Reporte de Movimientos</Typography>
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        <Grid container className={classes.contenedorGeneral}>
                        <form noValidate={true} onSubmit={this.valida} className={classes.contenedorFormularioDatos}>
                            <Grid container className={classes.contenedorGeneral}>
                                <Grid item lg={11} md={11} sm={11} xs={11} className={classes.contenedorBusqueda}>
                                    <Grid item lg={4} md={4} sm={6} xs={12} >
                                        <TextField
                                            id="noEmpleado"
                                            name="noEmpleado"
                                            inputProps={{ maxLength: 40 }}
                                            required
                                            className={classes.selectTipoEmp}
                                            onChange={handleChange}
                                            value={datosBusqueda.noEmpleado ? datosBusqueda.noEmpleado : ''}
                                            label="Número de Empleado"
                                            error={errores?.noEmpleado}
                                            onInput={SoloNumeros}
                                        /> 
                                    </Grid> 
                                    <Grid item lg={4} md={4} sm={6} xs={12} className={classes.contenedorFiltro} >
                                        <FormControl className={classes.selectTipoEmp}>
                                            <InputLabel id="demo-simple-select-label">Seleccione Mes*</InputLabel>
                                            <Select
                                            labelId="demo-simple-select-label"
                                            id="mes"
                                            name="mes"
                                            required
                                            error={errores?.mes}
                                            value={datosBusqueda.mes ? datosBusqueda.mes : 0}
                                            onChange={handleChange}
                                            >
                                            <MenuItem disabled value={0}>
                                                <em>Seleccione</em>
                                            </MenuItem>
                                            <MenuItem value={1}>Enero</MenuItem>
                                            <MenuItem value={2}>Febrero</MenuItem>
                                            <MenuItem value={3}>Marzo</MenuItem>
                                            <MenuItem value={4}>Abril</MenuItem>
                                            <MenuItem value={5}>Mayo</MenuItem>
                                            <MenuItem value={6}>Junio</MenuItem>
                                            <MenuItem value={7}>Julio</MenuItem>
                                            <MenuItem value={8}>Agosto</MenuItem>
                                            <MenuItem value={9}>Septiembre</MenuItem>
                                            <MenuItem value={10}>Octubre</MenuItem>
                                            <MenuItem value={11}>Noviembre</MenuItem>
                                            <MenuItem value={12}>Diciembre</MenuItem>
                                            </Select>
                                        </FormControl>  
                                    </Grid> 
                                    <Grid item lg={3} md={3} sm={6} xs={12} className={classes.contenedorFiltro} >
                                        <Button variant="contained" type="submit" className={classes.btnGuardar}>Buscar</Button>
                                    </Grid>    
                                </Grid>
                            </Grid>
                        </form> 
                       
                            <Grid item lg={12} md={12} sm={12} xs={12} className={classes.ContenedorReporte}>
                                
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Nombre completo: </Typography>
                                        <Typography className={classes.txtTituloReporte2}>{datos.Nombre} </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Tipo de empleado: </Typography>
                                        <Typography className={classes.txtTituloReporte2}>{datos.tipoEmpleado}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Rol: </Typography>
                                        <Typography className={classes.txtTituloReporte2}>{datos.nombreRol}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Jornada laboral: </Typography>
                                        <Typography className={classes.txtTituloReporte2}>{datos.horasLaborales} hrs</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Sueldo base mensual: </Typography>
                                        <Typography className={classes.txtTituloReporte2}>${datos.SueldoBaseMensual}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Bono por entrega: </Typography>
                                        <Typography className={classes.txtTituloReporte2}> ${datos.BonoEntrega}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Bono por cubrir turno: </Typography>
                                        <Typography className={classes.txtTituloReporte2}>${datos.BonoCubrirTurno}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Sueldo bruto mensual: </Typography>
                                        <Typography className={classes.txtTituloReporte2}>${datos.SueldoMensualBruto}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                    <Grid container >
                                        <Typography className={classes.txtTituloReporte}>Sueldo neto mensual: </Typography> 
                                        <Typography className={classes.txtTituloReporte2}>${ Number.parseInt(datos.SueldoNetoFinal)>0 ? datos.SueldoNetoFinal : datos.SueldoNeto}</Typography>  
                                    </Grid>
                                </Grid>
                            </Grid> 
                            <Grid item lg={8} md={8} sm={10} xs={10} className={classes.contenedorPrincipalBtnExportar}>
                                <Grid container className={classes.contenedorBtnExportar}>
                                    <Grid item lg={10} md={10} sm={10} xs={10} >
                                    <Button variant="contained" disabled={datos.Nombre ? false : true} className={classes.btnExportar} onClick={this.generarPDF}>Exportar</Button>
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
const mapStateToProps = ({ Usuario, Empleado, }) => ({
    Usuario,
    Empleado,
});
  
const mapDispatchToProps = (dispatch) => ({
actions: {
    empleado: bindActionCreators(EmpleadoActions, dispatch),
    usuario: bindActionCreators(UsuarioActions, dispatch),
},
});
  
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(reporteStyles,{ withTheme: true })(ReporteMovimiento));
  