import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { makeStyles,withStyles } from '@material-ui/core/styles';

const reporteStyles = makeStyles((theme) => ({
    pagina: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
      }
}));

// Create Document Component
export default function ReportePDF(){
const classes = reporteStyles();

    return(
  <Document>
    <Page size="A4" className={classes.pagina}>
      <View className={classes.section}>
        <Text>Section #1</Text>
      </View>
      <View className={classes.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
    );
}