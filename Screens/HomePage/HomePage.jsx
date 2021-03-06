import React, { useState,useRef, useEffect } from 'react';
import { Text,TouchableOpacity,View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {Card, CardItem, Body} from 'native-base';
import {Agenda} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import registerForPushNotificationsAsync from '../../registerForPushNotificationsAsync';
import * as Notifications from 'expo-notifications';
import {auth} from '../../fireB';
import apiUrl, { uplodedPicPath } from '../../global';
import styles from './style';


export default function HomePage({route,navigation}) {
    const [notification,setNotification] = useState("");
    const [lastMessage,setLastMessage] = useState(false);
    const [lastNotification,setLastNotification] = useState(false);
    const notificationListener = useRef();
    const [token, setToken] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [lessons,setLessons] = useState([]);
    const [items,setItems] = useState("");
    const [user,setUser] = useState("");
    

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(async(tok) => {
                AsyncStorage.setItem(`@token`,JSON.stringify(tok));
                setToken(tok);

                await AsyncStorage.getItem("@user",(err,result)=>{
                    return result !== null ? setUser(JSON.parse(result)) : null;
                });
                await AsyncStorage.getItem("@id",(err,result)=>{
                    return result !== null ? setId(JSON.parse(result)) : null;
                });
                await AsyncStorage.getItem("@email",(err,result)=>{
                    return result !== null ? setEmail(JSON.parse(result)) : null;
                });
            });
        
        notificationListener.current=Notifications.addNotificationReceivedListener(notification => {
            console.log(JSON.stringify(notification.request.content.data));
            setNotification(notification.request.content.data);
        });
    },[]);


    useEffect(() => {
        if(id!==""){
            fetch(apiUrl+"AppUser/Lessons/"+id,
                {
                    method: 'GET',
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    if(!res.ok){
                        alert("?????????? ???????????? ??????????????")
                    }
                    return res.json();
                })
                .then((result) => {
                    if(result.length!==0){
                        setLessons(result);
                    }
                    },
                    (error) => {
                    alert(error);
                }
            );
            
            let newMessage="";
            fetch(apiUrl+"Profile/Message/"+id,
                {
                    method: 'GET',
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    if(res.status===200){
                        newMessage=true;
                    }
                    return res.json();
                })
                .then((result) => {
                    if(newMessage&&result!==null){
                        setLastMessage(result);
                    }
                    },
                    (error) => {
                    console.log(error);
                }
            );

            let newNotification="";
            fetch(apiUrl+"Profile/Notifications/"+id,
                {
                    method: 'GET',
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    if(res.status===200){
                        newNotification=true;
                    }
                    return res.json();
                })
                .then((result) => {
                    if(newNotification&&result!==null){
                        setLastNotification(result);
                    }
                    },
                    (error) => {
                    console.log(error);
                }
            );
        }
    },[id]);

    useEffect(() => {
        if(token!=""){
            console.log(token);
            fetch(apiUrl+"AppUser/Token/"+id,
                {
                    method: 'PUT',
                    body: JSON.stringify(token),
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    return res.json();
                })
                .then((result) => {
                    console.log(result);
                    },
                    (error) => {
                    console.log(error);
                }
            );  
        }
    },[email]);

    useEffect(()=>{     
        let dates = {};
        if(user.user_type==="rider"){
            lessons.map((lesson)=>{                
                dates[lesson.date]=[{
                    "name":lesson.instructor_fullName,
                    "time":lesson.start_time+" - "+lesson.end_time,
                    "horse":lesson.horse_name,
                    "field":lesson.field,
                    "id":lesson.lesson_id,
                    "lesson_type":lesson.lesson_type
                }];
            });
        }
        else {
            lessons.map((lesson)=>{
                if(dates[lesson.date]===undefined){
                    dates[lesson.date] = [{
                        "name":lesson.rider_fullName,
                        "time":lesson.start_time+" - "+lesson.end_time,
                        "horse":lesson.horse_name,
                        "field":lesson.field,
                        "id":lesson.lesson_id,
                        "lesson_type":lesson.lesson_type
                    }];
                }
                else{
                    dates[lesson.date].push({
                        "name":lesson.rider_fullName,
                        "time":lesson.start_time+" - "+lesson.end_time,
                        "horse":lesson.horse_name,
                        "field":lesson.field,
                        "id":lesson.lesson_id,
                        "lesson_type":lesson.lesson_type
                    });
                }
            });
        }

        let today = new Date().toISOString().split('T')[0];

        if(dates[today]===undefined)
            dates[today]=[];
    
        setItems(dates);

    },[lessons]);

    useEffect(() => {
        if(user!==""){
            auth.createUserWithEmailAndPassword(user.email,user.id)
            .then(() => {
                console.log('User account created & signed in!');
                auth.currentUser.updateProfile(
                    {
                        displayName: user.first_name +" "+user.last_name,
                        photoURL: uplodedPicPath + user.profileImg
                    }
                )
                console.log(auth.currentUser);
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use'){
                    auth.signInWithEmailAndPassword(user.email,user.id)
                    .then(()=>{
                        auth.currentUser.updateProfile(
                            {
                                displayName: user.first_name +" "+user.last_name,
                                photoURL: uplodedPicPath + user.profileImg
                            }
                        )
                    }).then(()=>{
                        console.log(auth.currentUser);
                    });
                }
            });
        }
    }, [user]);

    useEffect(() => {
        if(notification!==""){
            console.log(notification);

            if(notification.action==="chat"){
                navigation.navigate('Chat',{
                    SendToId:notification.from_id,
                    my_id:id,
                    chat_num:notification.chat_num
                });
            }

            if(notification.action==="notification"){
                navigation.navigate('Notifications');
            }
        }
    }, [notification]);

    const renderItem = (item)=> {
        return (
              <Card style={styles.item}>
                  <CardItem>
                          {user.user_type==="rider"?
                          <Body>
                            <Text>??????????: {item.name}</Text>
                            <Text>??????: {item.time}</Text>
                            <Text>??????: {item.horse}</Text>
                            <Text>????????: {item.field}</Text>
                            <Text>?????? ??????????: {item.lesson_type}</Text>
                          </Body>
                          :
                          <Body>
                            <Text>??????????: {item.name}</Text>
                            <Text>??????: {item.time}</Text>
                            <Text>??????: {item.horse}</Text>
                            <Text>????????: {item.field}</Text>
                            <Text>?????? ??????????: {item.lesson_type}</Text>
                          </Body>}
                  </CardItem>
              </Card>
        );
    }

    const renderEmptyDate = () => {
        return (
              <Card style={styles.item}>
                  <CardItem>
                          <Body>
                              <Text>???? ?????????? ?????????????? ?????????? :)</Text>
                          </Body>
                  </CardItem>
              </Card>
        );
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.topView}>
                <TouchableOpacity onPress={()=> navigation.navigate('UserChats')}>
                    <Card style={styles.cards}>
                        <CardItem style={styles.msgCardIcon}>
                            <Entypo name="mail-with-circle" size={40} color="#00adf5"/>
                        </CardItem>
                        <CardItem style={styles.msgCardBody}>
                            <Text style={styles.titleText}>????????????</Text>
                            <Text style={styles.cardText}>{lastMessage!==false?((lastMessage.user_id1===id?lastMessage.user_name2:lastMessage.user_name1)+":  "):"?????? ???????????? ??????????"}</Text>
                            <Text numberOfLines={1} style={styles.cardText}>{lastMessage&&(lastMessage.last_message.length>=18?lastMessage.last_message.substring(0,18)+"...":lastMessage.last_message)}</Text>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> navigation.navigate('Notifications')}>
                    <Card style={styles.cards}>
                        <CardItem style={styles.notCardIcon}> 
                            <Ionicons name="notifications-circle" size={45} color="#00adf5" />
                        </CardItem>
                        <CardItem style={styles.notCardBody}>
                            <Text style={styles.titleText}>????????????</Text>
                            <Text style={styles.cardText}>{lastNotification!==false?lastNotification.text:"?????? ???????????? ??????????"}</Text>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomView}>
                <View style={styles.nestedBottomView}>
                    <Ionicons name="calendar-sharp" size={22} />
                    <Text style={styles.titleText}>
                        ???????? ?????????? 
                    </Text>
                </View>
                {items!==""?
                <Agenda
                    items={items}
                    selected={Date.now}
                    renderItem={(item) => renderItem(item)}
                    renderEmptyDate={() => renderEmptyDate()}
                    hideKnob={true}
                />:null}
            </View>
        </View>
    )
}

