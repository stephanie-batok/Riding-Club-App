import {StyleSheet} from 'react-native';


export default StyleSheet.create({
    body:{
      flex:1,
      justifyContent:"space-between",
    },
    item: {
        paddingTop: 20,
        borderColor: 'transparent'
    },
    labelText:{
        marginBottom:15
    },
    btnSave:{
      width:"30%",
      alignSelf:"center",
      alignItems:"center",
      justifyContent:"center",
      borderRadius:40,
      borderWidth:2,
      borderColor:"green",
      height:40,
      marginTop:30,
      marginBottom:15
    },
    btnText:{
      color:"green",
      fontWeight:"600",
      fontSize:15
    }
});
