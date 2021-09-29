import { Platform, PermissionsAndroid } from "react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import configuration from "./configuration";

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

  const _takePhoto= async(setPicture)=>{
    try{
        var uri, type, name;
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
              uri = response.assets?response.assets[0].uri:'';
              type = response.assets?response.assets[0].type:'';
              name = response.assets?response.assets[0].fileName:'';
              setPicture({'uri': uri,'type': type, 'fileName': name});
              
            });
          }
      
    }
    catch(error)
    {
        alert(error);
        console.log(error);
    }
}

const _uploadImage= async(setPicture)=>{
    try
    {
      var uri, type, name;
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
            uri = response.assets?response.assets[0].uri:'';
            type = response.assets?response.assets[0].type:'';
            name = response.assets?response.assets[0].fileName:'';
            setPicture({'fileName': name, 'type': type, 'uri': uri});
     
          });
    }
    catch(error)
    {
        alert(error);
    }

}

const _send_to_server=async(fileName, fileType, Uri)=>{
    try
    {
      let body = new FormData();
      body.append('files',{'name': fileName, 'type': fileType,
          'uri': Uri});
      body.append('Content-Type', 'image/png');
      const settings={
        method: 'POST',
        headers: {"Content-Type": "multipart/form-data"},
        body: body
      }
      var res = await fetch(configuration.api_server + '/api/HSE5S/PostFile', settings);
      var json_res= await res.text();
      if(res.status !== 200)
      {
        return('NG');
      }
      else if(res.status === 200)
      {
        //setPicture_server_url(json_res);
        return(['OK', json_res]);
      }
    }
    catch(error)
    {
        alert(error);
        console.log(error)
    }
}
export default({_takePhoto,_uploadImage,_send_to_server});