import {StyleSheet} from 'react-native';


export default StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white"
    },
    item: {
        paddingTop: 20,
        borderColor: 'transparent'
    },
    itemLabel:{
        fontWeight:"600",
        paddingRight:10
    },
    btn:{
      width:"20%",
      alignItems:"center",
      alignSelf:"flex-end",
      justifyContent:"center",
      backgroundColor:"white",
      borderWidth:1,
      height:30,
      marginTop:10,
      marginBottom:10,
    },
    feedbackNav:{
        paddingRight:10,
        backgroundColor:"#f3f3f4"
    }
});