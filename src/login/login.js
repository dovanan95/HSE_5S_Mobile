import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  AsyncStorage,
  Picker,
  LogBox
} from "react-native";

import config from '../js_helper/configuration';

import test_vcl from "../language/stringLanguage";
 
const login=({route, navigation})=> {
  const [user_id, setUser_Id] = useState("");
  const [password, setPassword] = useState("");
  const [test, setTest]=useState("");
  const [language, setLanguage]=useState("vn");
  
  useEffect(()=>{
    async function ClearStorage()
    {
      await AsyncStorage.clear();
    }
    ClearStorage();
  
  },[])

  const lang = [
    {'lkey': 'vn', 'display':'Tiếng Việt'},
    {'lkey': 'en', 'display':'English'}, 
    {'lkey':'kr', 'display':'한국어'}
  ];
  LogBox.ignoreAllLogs();
  
  const settings = {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {
        "ID_User": user_id,
        "Password": password
      }
    )
  };
  const login_to_system = async() =>
  {
    try
    {
      let res = await fetch(config.api_server+'/api/HSE5S/Login', settings);
      let json_res = await res.json();
      //console.log(JSON.parse(json_res)[0]['ID_Department']);
      if(json_res === "NG" || res.status !== 200)
      {
        alert("access denied!!");
      }
      else if(json_res !== "NG" )
      {
        
        await AsyncStorage.setItem('permission', json_res);
        await AsyncStorage.setItem('id_user', user_id);
        await AsyncStorage.setItem('lang', language);
        await AsyncStorage.setItem('dept', String(JSON.parse(json_res)[0]['ID_Department']));

        navigation.navigate("general_menu");
      }
    }
    catch(error)
    {
      alert(error);
    }
    
  }
 
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("./logo/HEESUNG.png")} />
 
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="User ID"
          placeholderTextColor="#003f5c"
          onChangeText={(uid) => setUser_Id(uid)}
        />
      </View>
 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(pwd) => setPassword(pwd)}
        />
      </View>
      
      <Picker
        selectedValue={language} 
        style={{ height: 30, width: 150 }}
        onValueChange={(itemValue, itemIndex)=>{setLanguage(itemValue)}}>
        {lang.map((item,key)=>{
          return <Picker.Item label={item.display} value={item.lkey} key={key}/>
        })
       }
      </Picker>

 
      <TouchableOpacity onPress={login_to_system} style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
 
  image: {
    marginBottom: 40,
    width: 150,
    height: 150
  },
 
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
 
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
 
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
 
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
});

export default login;