import React,{Component} from 'react';
import { Page, Text, View, Document, StyleSheet,PDFDownloadLink } from '@react-pdf/renderer';
import {consultarObjetoStorage } from '../utilidades/asyncStorage';
import {DATOS_REPORTE} from '../constantes/constantes';


const reporteStyles = StyleSheet.create({
    pagina: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
      }
});

// Create Document Component
class ReportePDF extends Component  {
  constructor(props) {
    super(props);

    this.state = {
      isReady:false,
      cargar:true,
    };
}

componentDidMount(){
  const {cargar}= this.state;
  if(cargar){
    this.setState({isReady:true,cargar:false});
    
  }
   
}


 render(){
   const {isReady}= this.state;
   

    return(
    <>
    {isReady &&(
      <Document>
        <Page size="A4" style={reporteStyles.pagina}>
          <View style={reporteStyles.section}>
            
          <View style={reporteStyles.section}>
            
            <Text>Hola</Text>
         
         
        </View>
           
           
          </View>
          <View style={reporteStyles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
         
  )}
  
  </>
    );
 }
}

export default ReportePDF;

