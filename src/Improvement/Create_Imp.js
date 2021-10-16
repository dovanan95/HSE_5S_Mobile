import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image, 
    Picker, AsyncStorage, LogBox, ActivityIndicator,
    TouchableOpacity, SafeAreaView, FlatList, Animated } from "react-native";
import { TextInput, Divider, Button } from "react-native-paper";
import getDate from "../js_helper/dateTimeHelper";
import cameraHelper from '../js_helper/cameraHelper';
import config from '../js_helper/configuration';

const Create_Imp = ({route, navigation}) =>{
    const[loading, setLoading]=useState(true);
    const[title, setTitle]=useState('');
    const[content, setContent]=useState('');
    const[picture, setPicture]=useState({});
    const[date, setDate]=useState();
    const[modal, setModal]=useState(false);

    useEffect(()=>{
        function initial()
        {
            try{
                console.log('start improve');
            }catch(error){
                alert(error);
            }finally{
                setLoading(false);
            }
        }
        initial();
    },[])

    const imp_api =config.api_server +'/api/HSE5S/PostImprovement';
    const takePhoto = async()=>{
        await cameraHelper._takePhoto(setPicture);
    }
    const uploadImage = async()=>{
        await cameraHelper._uploadImage(setPicture);
    }

    const IMPROVE=async()=>{
      let result = await cameraHelper._send_to_server(picture.fileName, picture.type, picture.uri);
      var dept = await AsyncStorage.getItem('dept');
      if(result[0]=='OK')
      {
        const settings ={
          method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(
                  {
                    //data
                    'ID_Issue': route.params.ID,
                    'Title': title,
                    'Content': content,
                    'Team_Improve': parseInt(dept),
                    'Picture': result[1],
                    'Time_Improved': getDate(),
                  }
                )
        };
        let res = await fetch(imp_api, settings);
        let res_json = await res.json();
        console.log(res.status);
        if(res.status == 200 || res_json=='OK')
        {
          alert('finished!');
        }
        else if(res.status != 200 || res_json != 'OK')
        {
          alert(res.status + "->" + res.statusText);
        }
      }
      else if(result=='NG')
      {
        alert('upload photo failed!');
      }
    }

    const Image_display=()=>{
      return(
        <Image
                  source={{uri: picture.uri}}
                  style={styles.imageStyle}/>
      )
    }

    return(
        <ScrollView>{loading?<ActivityIndicator size="small" color="#0000ff"/>:
            <View style={styles.container}>
                <Text>ID: {route.params.ID}</Text>
                <TextInput
                  label='Title'
                  style={styles.input}
                  theme={theme}
                  value={title}
                  mode='outlined'
                  onChangeText={text => setTitle(text)}
                />
                <TextInput
                  label='Content'
                  style={styles.input}
                  theme={theme}
                  value={content}
                  mode='outlined'
                  onChangeText={text => setContent(text)}
                />
                <Divider/>
                <Button style={styles.input_content} mode="contained" onPress={()=>{setModal(true)}}>
                  Photo
                </Button>
                <Divider/>
                <Button style={styles.input_content} mode="contained" onPress={()=>{IMPROVE()}}>
                  IMPROVE
                </Button>

                <Modal
                  animationType='slide'
                  transparent={true}
                  visible={modal}
                  onRequestClose= {() => {setModal(false)}}>
                    <View style={styles.modalView}>
                      <Image_display/>
                      <View style={styles.buttonModalView}>
                        <Button style={styles.input_content} mode="contained" onPress={()=>takePhoto()}>
                          CAMERA
                        </Button>
                        <Button style={styles.input_content} mode="contained" onPress={()=>uploadImage()}>
                          UPLOAD
                        </Button>
                      </View>
                      <Button style={styles.input_content} mode="contained" onPress={()=>setModal(false)}>
                        EXIT
                      </Button>
                    </View>
                </Modal>
            </View>
        }</ScrollView>
        
    )

}

const theme = {
  colors: {  
    primary: 'red',
  },
};

const styles = StyleSheet.create({
    container:{
        flex:1,
    
    },
    input:{
        margin:6,
        height:30,
        color:'#FF1493'
    },
    datePickerStyle: {
        width: 200,
        marginTop: 0,
    },
    input_content:{
        margin:5,
        marginTop:8,
        height:40
    },
    buttonModalView:{
        flexDirection:'row',
        padding:10,
        justifyContent:'space-around',
        backgroundColor:'white',
        
    },
    modalView:{
        /*
        position:'absolute',
        bottom:2,
        width:'100%',
        height:120,*/
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    imageStyle: {
        width: 200,
        height: 200,
        margin: 5,
    },
    button_style:{
        width: "96%",
        borderRadius: 25,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        margin:6,
        backgroundColor: "#FF1493",
    }
})

export default Create_Imp;