import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image,
    Picker, AsyncStorage, LogBox, Platform, PermissionsAndroid, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import {TextInput, Button} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ngonngu from '../language/stringLanguage';
import MultiSelect from 'react-native-multiple-select'
import DatePicker from 'react-native-datepicker';
import config from '../js_helper/configuration';

const newIssue =({route, navigation}) =>{

    const[lang, setLang]=useState('');
    const[name, setName]=useState('');
    const[content, setContent]=useState('');

    const[location, setLocation]=useState();
    const[pick_location, setPick_location]=useState(1);

    const[loc_desc, setLoc_desc]=useState();
    const[locd_temp, setLocd_temp]=useState();
    const[pick_locdes, setPick_locdes]=useState(1);
    const[locdes_lock, setLocdes_lock]=useState(true);

    const[classify, setClassify]= useState();
    const[pick_classify, setPick_classify]= useState(1);

    const[loss, setLoss]=useState();
    const[pick_loss, setPick_loss]=useState(1);

    const[dept, setDept]=useState([]);
    const[pick_dept, setPick_dept]= useState('1');

    const[date, setDate]=useState();
    const[today, setToday]=useState();

    const[picture, setPicture]=useState({});
    const[picture_server_url, setPicture_server_url]=useState('');

    const[modal, setModal]=useState(false);

    useEffect(()=>{
        async function getItems()
        {
            var res_loc = await fetch(config.api_server+ '/api/HSE5S/GetLocation');
            var json_res_loc = await res_loc.json();
            setLocation(json_res_loc);

            var res_locd = await fetch(config.api_server + '/api/HSE5S/GetLocationDesc');
            var json_res_locd= await res_locd.json();
            setLocd_temp(json_res_locd);
            var locdescr = json_res_locd.filter(function(item){
              return item.ID_Location == 1;
            }).map(function({ID_LocationD, Name_LocationDetail}){
              return {ID_LocationD, Name_LocationDetail}
            });
            setLoc_desc(locdescr);

            var res_los = await fetch(config.api_server+ '/api/HSE5S/GetLoss');
            var json_res_los = await res_los.json();
            setLoss(json_res_los);

            var res_clas = await fetch(config.api_server+ '/api/HSE5S/GetClassify');
            var json_res_clas = await res_clas.json();
            setClassify(json_res_clas);

            var res_dept = await fetch(config.api_server+ '/api/HSE5S/GetDepartment');
            var json_res_dept = await res_dept.json();
            for(var k in json_res_dept)
            {
                json_res_dept[k].ID_Department =String(json_res_dept[k].ID_Department) 
            }

            setDept(json_res_dept);

            const nn = await AsyncStorage.getItem('lang');
            setLang(nn);

            var homnay = new Date();
            var dd= String(homnay.getDate()).padStart(2, '0');
            var mm = String(homnay.getMonth()+1).padStart(2, '0');
            var yyyy=  homnay.getFullYear();
            homnay = yyyy+'-'+mm+'-'+dd;
            setToday(homnay);
        }
        getItems();
        
    },[])

    LogBox.ignoreAllLogs();

    const NEW_ISSUE = async()=>{
      try
      {
        const result = await _send_to_server();
        if(result == 'OK')
        {
          var department=[];
          for(var k in pick_dept)
          {
            department.push(parseInt(pick_dept[k]));
          }
          const id_user = await AsyncStorage.getItem('id_user');
          const settings ={
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                  'Name_issue': name,
                  'LocationD_ID': pick_locdes,
                  'PIC': id_user,
                  'Time_Start': today,
                  'Deadline': date,
                  'ID_Classify':pick_classify,
                  'Picture': picture_server_url,
                  'ID_Loss': pick_loss,
                  'Content': content,
                  'improvement': department
                }
              )
          };
          var response = await fetch(config.api_server+'/api/HSE5S/PostIssue', settings);
          var json_response = response.status;
          if(json_response==200)
          {
            alert('OK');
          }
          else
          {
            alert('Failed');
            console.log(response);
          }
        }
        else if(result == 'NG')
        {
          alert('Upload Image Failed!!!');
        } 
      }
      catch(error)
      {
        alert(error);
      }
     
    }

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'Camera Permission',
                message: 'App needs camera permission',
              },
            );
            // If CAMERA Permission is granted
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn(err);
            return false;
          }
        } else return true;
      };
    
      const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'External Storage Write Permission',
                message: 'App needs write permission',
              },
            );
            // If WRITE_EXTERNAL_STORAGE Permission is granted
            return granted === PermissionsAndroid.RESULTS.GRANTED;
          } catch (err) {
            console.warn(err);
            alert('Write permission err', err);
          }
          return false;
        } else return true;
      };
    const _takePhoto= async()=>{
        try{
            let options = {
                mediaType: 'photo',
                maxWidth: 300,
                maxHeight: 550,
                quality: 0.99,
                videoQuality: 'low',
                durationLimit: 30, //Video max duration in seconds
                saveToPhotos: true,
              };
              let isCameraPermitted = await requestCameraPermission();
              let isStoragePermitted = await requestExternalWritePermission();
              if (isCameraPermitted && isStoragePermitted) {
                launchCamera(options, (response) => {
                  //console.log('Response = ', response);
                  //console.log('Response =', response.assets?response.assets[0].fileName:'');
          
                  if (response.didCancel) 
                  {
                    alert('User cancelled camera picker');
                    return;
                  } 
                  else if (response.errorCode == 'camera_unavailable') 
                  {
                    alert('Camera not available on device');
                    return;
                  } 
                  else if (response.errorCode == 'permission') 
                  {
                    alert('Permission not satisfied');
                    return;
                  } 
                  else if (response.errorCode == 'others') 
                  {
                    alert(response.errorMessage);
                    return;
                  }
                  var uri = response.assets?response.assets[0].uri:'';
                  var type = response.assets?response.assets[0].type:'';
                  var name = response.assets?response.assets[0].fileName:'';
                  setPicture({'uri': uri,'type': type, 'fileName': name});
                  console.log(uri);
                  
                });
              }
        }
        catch(error)
        {
            alert(error);
            console.log(error);
        }
    }

    const _uploadImage= async()=>{
        try
        {
            let options = {
                mediaType: 'photo',
                maxWidth: 300,
                maxHeight: 550,
                quality: 0.99,
              };
              launchImageLibrary(options, (response) => {
                //console.log('Response = ', response);
                //console.log('Response =', response.assets?response.assets[0].fileName:'');
          
                if (response.didCancel) 
                {
                  alert('User cancelled camera picker');
                  return;
                } 
                else if (response.errorCode == 'camera_unavailable') 
                {
                  alert('Camera not available on device');
                  return;
                } 
                else if (response.errorCode == 'permission') 
                {
                  alert('Permission not satisfied');
                  return;
                } 
                else if (response.errorCode == 'others') 
                {
                  alert(response.errorMessage);
                  return;
                }
                var uri = response.assets?response.assets[0].uri:'';
                var type = response.assets?response.assets[0].type:'';
                var name = response.assets?response.assets[0].fileName:'';
                setPicture({'fileName': name, 'type': type, 'uri': uri});
                
              });
        }
        catch(error)
        {
            alert(error);
        }

    }
    const _send_to_server=async()=>{
        try
        {
          let body = new FormData();
          body.append('files',{'name': picture.fileName, 'type': picture.type,
              'uri': picture.uri});
          body.append('Content-Type', 'image/png');
          const settings={
            method: 'POST',
            headers: {"Content-Type": "multipart/form-data"},
            body: body
          }
          var res = await fetch(config.api_server+ '/api/HSE5S/PostFile', settings);
          var json_res= await res.text();
          if(res.status !== 200)
          {
            return('NG');
          }
          else if(res.status === 200)
          {
            setPicture_server_url(json_res);
            return('OK');
          }
        }
        catch(error)
        {
            alert(error);
            console.log(error)
        }
    }

    const onSelectedItemsChange=(selectedDept)=>{
        setPick_dept(selectedDept);
        //console.log(pick_dept);
    }

    const onChangeLocation=async(input)=>{
      var locdescr = [];
      for (var item in locd_temp)
      {
        if(locd_temp[item].ID_Location ==input)
        {
          locdescr.push(locd_temp[item]);
        }
      }
      setLoc_desc(locdescr);
      /*var locdescr = locd_temp.filter(function(item){
        return item.ID_Location == input;
      }).map(function({ID_LocationD, Name_LocationDetail}){
        return {ID_LocationD, Name_LocationDetail}
      });
      setLoc_desc(locdescr);*/
    }

return(
    <ScrollView>
        <View style={styles.container}>
            <TextInput
                        label={lang?ngonngu.stringLang[lang].new_issue.name_issue:'loading...'}
                        style={styles.input}
                        value={name}
                        theme = {theme}
                        mode="outlined"
                        onChangeText={text => setName( text )}
                    />
            <TextInput
                        label={lang?ngonngu.stringLang[lang].new_issue.content:'loading...'}
                        style={styles.input_content}
                        value={content}
                        theme = {theme}
                        mode="outlined"
                        onChangeText={text => setContent( text )}
                    />
            
            <Text style={styles.input}>{lang?ngonngu.stringLang[lang].new_issue.location:'loading...'}</Text>
            <Picker selectedValue={pick_location}
                style={{ height: 30, width: "98%", alignSelf: 'stretch'}}
                onValueChange={(itemValue, itemIndex)=>{
                  setPick_location(itemValue);
                  onChangeLocation(itemValue);
                  setLocdes_lock(true);
                 }}>
                {location?location.map((item, key)=>{
                    return <Picker.Item label={item.Name_Location} value={item.ID_Location} key={key} />
                }):<Picker.Item label='Location' value='loc_id'/>}
                
            </Picker>
            <Text style={styles.input}>{lang?ngonngu.stringLang[lang].new_issue.loc_desc:'loading...'}</Text>
            <Picker selectedValue={pick_locdes}
                style={{ height: 30, width: "98%", alignSelf: 'stretch'}}
                enabled={locdes_lock}
                onValueChange={(itemValue, itemIndex)=>{
                  setPick_locdes(itemValue)}}>
                {loc_desc?loc_desc.map((item, key)=>{
                    return <Picker.Item label={item.Name_LocationDetail} value={item.ID_LocationD} key={key} />
                }):<Picker.Item label='Location Description' value='locd_id'/>}
                
            </Picker>
            <Text style={styles.input}>{lang?ngonngu.stringLang[lang].new_issue.classification:'loading...'}</Text>
            <Picker selectedValue={pick_classify}
                style={{ height: 30, width: "98%", alignSelf: 'stretch'}}
                onValueChange={(itemValue, itemIndex)=>{setPick_classify(itemValue)}}>
                {classify?classify.map((item, key)=>{
                    return <Picker.Item label={item.Name_Classify} value={item.ID_Classify} key={key} />
                }):<Picker.Item label='Class' value='clas_id'/>}
            </Picker>

            <Text style={styles.input}>{lang?ngonngu.stringLang[lang].new_issue.loss:'loading...'}</Text>
            <Picker selectedValue={pick_loss}
                style={{ height: 30, width: "98%", alignSelf: 'stretch'}}
                onValueChange={(itemValue, itemIndex)=>{setPick_loss(itemValue)}}>
                {loss?loss.map((item, key)=>{
                    return <Picker.Item label={item.Name_Level} value={item.ID_Level} key={key} />
                }):<Picker.Item label='Loss' value='loss_id'/>}
            </Picker>
            
            <Text style={styles.input}>{lang?ngonngu.stringLang[lang].new_issue.dept:'loading...'}</Text>
            <MultiSelect
                hideTags
                items={dept?dept:[{'key':'value'}]}
                uniqueKey="ID_Department"
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={pick_dept}
                selectText={lang?ngonngu.stringLang[lang].new_issue.pick_dept:'loading...'}
                searchInputPlaceholderText="Search Dept..."
                textInputProps={{autoFocus:false}}
                onChangeInput={(text) => console.log(text)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="Name_Department"
                searchInputStyle={{color: '#CCC'}}
                submitButtonColor="#48d22b"
                submitButtonText="Submit"
            />
            <View style={{flexDirection:'row'}}>
            <Text style={styles.input}>{lang?ngonngu.stringLang[lang].new_issue.deadline:'loading...'}</Text>
            <DatePicker
                style={styles.datePickerStyle}
                date={date} // Initial date from state
                mode="date" // The enum of date, datetime and time
                placeholder={today?today:'2020-01-01'}
                format="YYYY-MM-DD"
                minDate={today?today:'2020-01-01'}
                maxDate="2099-12-31"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                    dateIcon: {
                    //display: 'none',
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                    },
                    dateInput: {
                    marginLeft: 36,
                    },
                }}
                onDateChange={(date) => {
                    setDate(date);
                }}
            />
            </View>
            <Button  style={styles.input_content} mode="contained" onPress={() => setModal(true)}>
              {lang?ngonngu.stringLang[lang].new_issue.photo:'loading...'}
            </Button>
            <Button  style={styles.input_content} mode="contained" onPress={NEW_ISSUE}>
              {lang?ngonngu.stringLang[lang].new_issue.submit:'loading...'}
            </Button>
          
            <Modal
             animationType='slide'
             transparent={true}
             visible={modal}
             onRequestClose= {() => {setModal(false)}}
            >
                <View style={styles.modalView}>
                <Image
                    source={{uri: picture.uri}}
                    style={styles.imageStyle}
                    />
                    <View style={styles.buttonModalView}>
                        <Button style={styles.input_content} mode="contained" onPress={() => _takePhoto()}>
                        {lang?ngonngu.stringLang[lang].new_issue.camera:'loading...'}
                        </Button>
                        <Button  style={styles.input_content} mode="contained" onPress={() => _uploadImage()}>
                        {lang?ngonngu.stringLang[lang].new_issue.library:'loading...'}
                        </Button>
                    </View>
                    <Button style={styles.input_content} mode="contained" onPress={() => setModal(false)}>
                      {lang?ngonngu.stringLang[lang].new_issue.cancel:'loading...'}
                    </Button>
                </View>
            </Modal>

        </View>
    </ScrollView>
    
)}
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
        marginTop: 5,
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

export default newIssue;