import {StyleSheet} from 'react-native';


export default StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:"white"
    },
    header:{
      backgroundColor: "#c6c6cc",
      height:130,
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: "white",
      alignSelf:'center',
      position: 'absolute',
      marginTop:60
    },
    body:{
      flex:1,
      justifyContent:"space-between",

    },
    bodyContent: {
      padding:30,
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
    },
    btnUplodePic:{
      width:"20%",
      alignSelf:"center",
      alignItems:"center",
      justifyContent:"center",
      borderWidth:2,
      height:30,
      marginTop:75,
      marginBottom:20
    },
});