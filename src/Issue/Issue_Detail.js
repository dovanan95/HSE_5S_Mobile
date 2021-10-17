import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image, 
    Picker, AsyncStorage, LogBox, ActivityIndicator,
    TouchableOpacity, SafeAreaView, FlatList, Animated } from "react-native";
import {Divider} from 'react-native-paper';
import config from '../js_helper/configuration';

const Issue_Detail = ({route, navigation}) =>{
    const[loading, setLoading]=useState(true);
    const[issue, setIssue]=useState();
    const[dept, setDept]=useState();

    const ID_Issue = route.params.ID;

    useEffect(()=>{
        async function initial()
        {
            try
            {
                let res = await fetch(config.api_server 
                    + '/api/HSE5S/SearchIssueByID?ID_Issue='
                    + ID_Issue);
                let res_json = await res.json();
                console.log(res_json[0].Name_LocationDetail);
                setIssue(res_json[0]);

                let res_dept = await fetch(config.api_server 
                    + '/api/HSE5S/getDeptImprove?ID_Issue='
                    + ID_Issue);
                let res_dept_json = await res_dept.json();
                setDept(res_dept_json);
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
        initial();
    },[])

    const onViewImp =async(value)=>{
        const permitt = await AsyncStorage.getItem('permission');
        const perm = JSON.parse(permitt);
        var flag_perm =0;
        for(var k in perm)
        {
            if(perm[k]['Name_Function']=='improvement_trace')
            {
                flag_perm=1;
            }
        }
        if(flag_perm==1)
        {
            
            navigation.navigate('improvement_trace_by_issue', {'ID': value});
        }
        else
        {
            alert('no permission!');
        }
    }

    const onImprove = async(value)=>{
        var deptt = await AsyncStorage.getItem('dept');
        const permitt = await AsyncStorage.getItem('permission');
        const perm = JSON.parse(permitt);

        var res_dept_json = dept;
        var flag_dept = 0;
        for(var k in res_dept_json)
        {
            if(deptt==res_dept_json[k]['Team_Improve'])
            {
                flag_dept=1;
            }
        }

        var flag_perm =0;
        for(var kk in perm)
        {
            if(perm[kk]['Name_Function']=='Create_Improvement')
            {
                flag_perm=1;
            }
        }
        if(flag_dept==1 && flag_perm==1 && String(issue.Status).toLowerCase()=='pending')
        {
            //console.log(String(route.params.obj.issue.Status).toLowerCase());
            navigation.navigate('create_imp', {'ID':value})
        }
        else if(flag_dept==0 || flag_perm==0 || String(issue.Status).toLowerCase() !='pending')
        {
            alert('You have no permission to improve this issue');
        }
    }
    const onUpdate = async(value)=>{
        var ID_User = await AsyncStorage.getItem('id_user');
        if(ID_User==value && String(issue.Status).toLowerCase()=='pending')
        {
            let obj={'issue': issue, 'improve_dept': dept}
            navigation.navigate('Create_Issue',{'obj': obj});
        }
        else if(ID_User != value || String(issue.Status).toLowerCase() !='pending')
        {
            alert('You have no permission to update');
        }
    }

    

    const Item_Issue_Dept_View = ({item})=>{
        return(
            <View>
                <Text>{item.Name_Department}</Text>
            </View>
        )
    }

    return(
        <ScrollView>{loading?<ActivityIndicator size="small" color="#0000ff"/>:
            <View>           
                    <Text>ID: {issue?issue.ID_Issue:'loading...'}</Text>   
                    <Divider/>
                    <Text>Name: {issue? issue.Name_Issue:'loading...'}</Text>
                    <Divider/>
                   <Text>Content: {issue?issue.Content:'loading...'}</Text>
                   <Divider/>
                   <Text>Location Detail: {issue?issue.Name_LocationDetail:'loading...'}</Text>
                   <Divider/>
                   <Text>Classification: {issue?issue.Name_Classify:'loading...'}</Text>
                   <Divider/>
                   <Text>Loss: {issue?issue.Name_Level:'loading...'}</Text>
                   <Divider/>
                   <Text>Time Start: {issue?issue.Time_Start:'loading...'}</Text>
                   <Divider/>
                   <Text>Deadline: {issue?issue.Deadline:'loading...'}</Text>
                   <Divider/>
                   <Text>Department for Improvement:</Text>
                   <FlatList
                   data={dept?dept:{'data': 'data'}}
                   renderItem={Item_Issue_Dept_View}
                   keyExtractor={(item, index)=> index.toString()}
                   />
                   <Divider/>

                  {issue?<Image style={styles.image} source={{uri: 'http://' + issue.Picture}}/>:<Text>Picture unavailable</Text>}
                  <Divider/>
                    
                   <View style={{flexDirection:'row',alignItems:'center', justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> onUpdate(issue.PIC)}>
                        <Text style={{color:'white'}}>UPDATE</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={()=> onImprove(issue.ID_Issue)}>
                        <Text style={{color:'white'}}>IMPROVE</Text> 
                    </TouchableOpacity> 
                   </View>
                   <View style={{flexDirection:'row',alignItems:'center',justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> onViewImp(issue.ID_Issue)}>
                        <Text style={{color:'white'}}> VIEW IMPROVEMENT</Text> 
                    </TouchableOpacity>
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

export default Issue_Detail;