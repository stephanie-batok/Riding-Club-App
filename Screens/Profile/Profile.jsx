import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet,Image,KeyboardAvoidingView,ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListItem ,Input} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import apiUrl,{uplodedPicPath} from '../../global';
import styles from './style';


export default function Profile({navigation}) {
    const [photoUri, setPhotoUri] = useState(uplodedPicPath+"profile.jpg");
    const [photoPath, setPhotoPath] = useState("");
    const [user, setUser] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    
    useEffect(() => {
      AsyncStorage.getItem("@profileImg",(err,result)=>{
        return result !== null ? setPhotoPath(JSON.parse(result)) : null;
      });
        
      AsyncStorage.getItem("@user",(err,result)=>{
      return result !== null ? setUser(JSON.parse(result)) : null;
      });
    }, []);

    useEffect(() => {
      if(user!==""){
        setId(user.id);
        setEmail(user.email);
        setPhone_number(user.phone_number);
        setPassword(user.password);
        setPhotoUri(uplodedPicPath+photoPath);
      }
    }, [user]);

    btnUploadPhoto = async() => {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
  
      let pickerResult = await ImagePicker.launchImageLibraryAsync(
        {
          allowsEditing: true,
          aspect: [4, 3],
        }
      );

      let imgName = id+'_profile.jpg';
      console.log(pickerResult.uri);

      if(pickerResult.uri!==undefined){
        setPhotoUri(pickerResult.uri);
        imageUpload(pickerResult.uri, imgName);
      }
    }

    const btnSave = () => {
      if(newPassword!==repeatPassword){
        setNewPassword("");
        setRepeatPassword("");
        alert("יש לחזור על הסיסמה החדשה פעם נוספת.")
      }
      else 
      {
        let profilePassword;
        if(newPassword.trim()===""){
          profilePassword = password;
        }
        else {
          profilePassword = newPassword;
        }
  
        let new_profile = {
          "phone_number":phone_number,
          "email": email,
          "password":profilePassword,
          "profileImg": photoPath
        };
  
        fetch(apiUrl+"Profile/"+id,
          {
              method: 'PUT',
              body: JSON.stringify(new_profile),
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
              storeData('user', result);
              storeData('email',email);
            },
            (error) => {
            console.log(error);
            alert(error);
          }
        );
      }
    }

    const imageUpload = async(imgUri, picName) => {
      let urlAPI = apiUrl+"Profile/PostPic";
      let dataI = new FormData();
      dataI.append('picture', {
        uri: imgUri,
        name: picName,
        type: 'image/jpg'
      });

      const config = {
        method: 'POST',
        body: dataI,
        headers: {
            'Accept': "application/json",
            'Content-Type': 'multipart/form-data',
        }
      };
  
      await fetch(urlAPI, config)
        .then((res) => {
          console.log('res.status=', res.status);
          if (res.status == 201) {
            return res.json();
          }
          else {
            console.log('error uploding ...');
            return "err";
          }
        })
        .then((responseData) => {
          console.log(responseData);
          if (responseData != "err") {
            let picNameWOExt = picName.substring(0, picName.indexOf("."));
            let imageNameWithGUID = responseData.substring(responseData.indexOf(picNameWOExt), responseData.indexOf(".jpg") + 4);
            console.log(imageNameWithGUID);
            setPhotoPath(imageNameWithGUID);
            setPhotoUri(uplodedPicPath+imageNameWithGUID);
            storeData('profileImg', imageNameWithGUID);
            savePic(imageNameWithGUID);
            console.log("img uploaded successfully!");
          }
          else {
            console.log('error uploding ...');
          }
        })
        .catch(err => {
          console.log('err upload= ' + err);
        });
    }

    const savePic = (newPicPath) => {
      console.log(newPicPath);
      fetch(apiUrl+"Profile/Pic/"+id,
        {
            method: 'PUT',
            body: JSON.stringify(newPicPath),
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

    const storeData = async(storage_Key,value) => {
      try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.setItem(`@${storage_Key}`,jsonValue);
      } catch (e) {
          console.log(e);
      }
    }

    return (
        <View style={styles.container}>
          <View style={styles.header}/>
          <Image style={styles.avatar} source={{uri:photoUri}}/>
          <TouchableOpacity onPress={btnUploadPhoto} style={styles.btnUplodePic}>
              <Text>בחר תמונה</Text> 
          </TouchableOpacity>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            style={{ flex: 1 }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.body}>
                  <ListItem itemDivider>
                    <Text>מידע אישי</Text>
                  </ListItem>
                  <ListItem icon>
                        <Ionicons name='mail-outline' size={20}/>
                        <Input placeholder={email} onChangeText={text => setEmail(text)} />
                  </ListItem>
                  <ListItem icon>
                        <Ionicons name='ios-call-outline' size={20}/>
                        <Input placeholder={phone_number} onChangeText={text => setPhone_number(text)} />
                  </ListItem>
                  <ListItem itemDivider>
                      <Text>שינוי סיסמה</Text>
                  </ListItem>
                  <ListItem icon>
                      <Ionicons name='lock-closed-outline' size={20}/>
                      <Input placeholder="הקלד סיסמה חדשה" secureTextEntry onChangeText={text => setNewPassword(text)} />
                  </ListItem>
                  <ListItem icon>
                      <Ionicons name='lock-closed-outline' size={20}/>
                      <Input placeholder="חזור על הסיסמה" secureTextEntry onChangeText={text => setRepeatPassword(text)} />
                  </ListItem>
                  <TouchableOpacity onPress={btnSave} style={styles.btnSave}>
                      <Text style={styles.btnText}>שמור</Text> 
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
      </View>
    )
}
