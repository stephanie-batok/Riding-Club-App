import {StyleSheet} from 'react-native';


export default StyleSheet.create({
    container:{
        flex:1,
        display:"flex",
        backgroundColor:"white"   
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    topView:{
        display:"flex",
        width: '100%',
        flexDirection:"row",
        justifyContent:"center",
        marginTop:40
    },
    cards:{
        width:160,
        height:160,
        marginRight:15,
        marginLeft:15,
        padding:10,
        alignItems:"center",
        borderRadius:10,        
        borderStyle:'dotted'
    },
    cardText:{
        fontSize:12,
        textAlign:"center"
    },
    bottomView:{
        flex:1,
        marginTop:40,
    },
    nestedBottomView:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop:10,
        alignSelf:"center",
    },
    titleText:{
        fontWeight:"bold",
        fontSize:14,
        paddingBottom:2
    },
    msgCardIcon:{
        paddingTop:6
    },
    msgCardBody:{
        flexDirection: "column",
        paddingTop:11
    },
    notCardIcon:{
        paddingTop:0
    },
    notCardBody:{
        flexDirection: "column"
    }
})