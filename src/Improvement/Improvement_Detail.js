import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image, 
    Picker, AsyncStorage, LogBox, ActivityIndicator,
    TouchableOpacity, SafeAreaView, FlatList, Animated } from "react-native";
import { Divider } from "react-native-elements/dist/divider/Divider";
import config from '../js_helper/configuration';

const Improvement_Detail=({route, navigation})=>{
    const[loading, setLoading]=useState(true);
    //const[improvement,setImprovement]=useState();
    const[title,setTitle]=useState();
    const[picture,setPicture]=useState();
    const[Time_Improve, setTime_Improve]=useState();
    const[content, setContent]=useState();
    const[team, setTeam]=useState();
    const[team_id, setTeamID]=useState();
    const[status, setStatus]=useState();

    const id_issue = route.params.ID_Issue;
    const id_improve = route.params.ID_Imp;

    useEffect(()=>{
        async function initial()
        {
            try
            {
                var res = await fetch(config.api_server
                    +'/api/HSE5S/getImpDetail?ID_Improve='
                    + id_improve);
                var json_res = await res.json();
                setContent(json_res[0].Content);
                setPicture(json_res[0].Picture);
                setTeam(json_res[0].Name_Department);
                setTime_Improve(json_res[0].Time_Improve);
                setTitle(json_res[0].Title);
                setStatus(json_res[0].Status);
                setTeamID(json_res[0].Team_Improve);
            }
            catch(error)
            {
                alert(error);
            }
            finally
            {
                setLoading(false);
            }
        };
        initial();

    },[])

    const decision = async(value) =>{
        try
        {
            setLoading(true);
            const id_user = await AsyncStorage.getItem('id_user');
            var res_issue = await fetch(config.api_server 
            + '/api/HSE5S/SearchIssueByID?ID_Issue=' + String(id_issue));
            var res_issue_json = await res_issue.json();
            var id_user_server = res_issue_json[0].PIC;
            const settings={
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                      //data
                      'ID_Improve': parseInt(id_improve),
                      'ID_Issue': parseInt(id_issue),
                      'Team_Improve': parseInt(team_id),
                      'Status': value,
                    }
                  )
            }
            if(id_user==id_user_server)
            {
                var response = await fetch(config.api_server+'/api/HSE5S/ImproveDecision', settings);
                var json_response = await response.status;
                if(json_response==200)
                {
                    alert('OKE');
                    setLoading(true);
                    var res = await fetch(config.api_server
                        +'/api/HSE5S/getImpDetail?ID_Improve='
                        + id_improve);
                    var json_res = await res.json();
                    setStatus(json_res[0].Status)
                }
                else
                {
                    alert('failed');
                }
            }
            else if(id_user != id_user_server)
            {
                alert('no permission');
            }
        }
        catch(error)
        {
            alert(error);
        }
        finally
        {
            setLoading(false);
        }
        

    }

    return(
        <ScrollView>{loading?<ActivityIndicator size="small" color="#0000ff"/>:
            <View>
                 <Text>ID Improve: {route.params.ID_Imp}</Text>
                 <Divider/>
                 <Text>ID Issue: {route.params.ID_Issue}</Text>
                 <Divider/>
                 <Text>Title: {title?title:'loading...'}</Text>
                 <Divider/>
                 <Text>Picture</Text>
                 {picture?<Image style={styles.image} source={{uri: 'http://' + picture}}/>:<Text>Loading...</Text>}
                 <Divider/>
                 <Text>Content: {content?content:'loading'}</Text>
                <Divider/>
                <Text> Time Improve: {Time_Improve?Time_Improve:'loading...'} </Text>
                <Divider/>
                <Text>Status: {status?status:'loading...'}</Text>
                <Divider/>
                <Text>Team: {team?team:'loading...'}</Text>
                <View style={{flexDirection:'row',alignItems:'center', justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> decision('approve')}>
                        <Text style={{color:'white'}}>APPROVE</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={()=> decision('reject')}>
                        <Text style={{color:'white'}}>REJECT</Text> 
                    </TouchableOpacity> 
                   </View>
                   <View style={{flexDirection:'row',alignItems:'center',justifyContent: "center",}}>
                    <TouchableOpacity style={styles.input} onPress={()=> {navigation.goBack()}}>
                        <Text style={{color:'white'}}> EXIT</Text> 
                    </TouchableOpacity>  
                   </View>
            </View>}
        </ScrollView>
    )
}
const styles = StyleSheet.create(
    {
        modalView:{
            flex: 1, 
            //alignItems: 'center', 
            //justifyContent: 'center',
            backgroundColor: 'white',
        },
        input:{
            margin:4,
            height:30,
            color:'#FF1493',
            backgroundColor: "blue",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
            width: "40%",

        },
        image: {
            marginBottom: 40,
            width: 300,
            height: 300,
            marginLeft:30
        },
    }
)
export default Improvement_Detail;