import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image, 
    Picker, AsyncStorage, LogBox, ActivityIndicator,
    TouchableOpacity, SafeAreaView, FlatList, Animated } from "react-native";
import {Divider} from 'react-native-paper';

const Issue_Detail = ({route, navigation}) =>{

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
        var dept = await AsyncStorage.getItem('dept');
        const permitt = await AsyncStorage.getItem('permission');
        const perm = JSON.parse(permitt);

        var res_dept_json = route.params.obj.improve_dept;
        var flag_dept = 0;
        for(var k in res_dept_json)
        {
            if(dept==res_dept_json[k]['Team_Improve'])
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
        if(flag_dept==1 && flag_perm==1 && String(route.params.obj.issue.Status).toLowerCase()=='pending')
        {
            //console.log(String(route.params.obj.issue.Status).toLowerCase());
            navigation.navigate('create_imp', {'ID':value})
        }
        else if(flag_dept==0 || flag_perm==0 || String(route.params.obj.issue.Status).toLowerCase() !='pending')
        {
            alert('You have no permission to improve this issue');
        }
    }
    const onUpdate = async(value)=>{
        var ID_User = await AsyncStorage.getItem('id_user');
        if(ID_User==value && String(route.params.obj.issue.Status).toLowerCase()=='pending')
        {
            navigation.navigate('Create_Issue',{'obj': route.params.obj});
        }
        else if(ID_User != value || String(route.params.obj.issue.Status).toLowerCase() !='pending')
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

    const Detail_Issue = (props)=> {
        return(
            <ScrollView style={styles.modalView}>
                    <Text>ID: {props.ID_Issue}</Text>   
                    <Text>Name: {props.Name}</Text>
                   <Text>Content: {props.Content}</Text>
                   <Text>Location Detail: {props.locationD}</Text>
                   <Text>Classification: {props.Classify}</Text>
                   <Text>Loss: {props.Level}</Text>
                   <Text>Time Start: {props.time_start}</Text>
                   <Text>Deadline: {props.deadline}</Text>
                   <Text>Department for Improvement:</Text>
                   <FlatList
                   data={props.improve_dept}
                   renderItem={Item_Issue_Dept_View}
                   keyExtractor={(item, index)=> index.toString()}
                   />

                  <Image style={styles.image} source={{uri: 'http://' + props.Picture}}/>
                    
                   <View style={{flexDirection:'row',alignItems:'center', justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> onUpdate(props.PIC)}>
                        <Text style={{color:'white'}}>UPDATE</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={()=> onImprove(props.ID_Issue)}>
                        <Text style={{color:'white'}}>IMPROVE</Text> 
                    </TouchableOpacity> 
                   </View>
                   <View style={{flexDirection:'row',alignItems:'center',justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> onViewImp(props.ID_Issue)}>
                        <Text style={{color:'white'}}> VIEW IMPROVEMENT</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={()=> {navigation.goBack()}}>
                        <Text style={{color:'white'}}> EXIT</Text> 
                    </TouchableOpacity>  
                   </View>
            </ScrollView>
        )
    }


    return(
        <ScrollView>
            <View>           
                    <Text>ID: {route.params.obj.issue.ID_Issue}</Text>   
                    <Divider/>
                    <Text>Name: {route.params.obj.issue.Name_Issue}</Text>
                    <Divider/>
                   <Text>Content: {route.params.obj.issue.Content}</Text>
                   <Divider/>
                   <Text>Location Detail: {route.params.obj.issue.Name_LocationDetail}</Text>
                   <Divider/>
                   <Text>Classification: {route.params.obj.issue.Name_Classify}</Text>
                   <Divider/>
                   <Text>Loss: {route.params.obj.issue.Name_Level}</Text>
                   <Divider/>
                   <Text>Time Start: {route.params.obj.issue.Time_Start}</Text>
                   <Divider/>
                   <Text>Deadline: {route.params.obj.issue.Deadline}</Text>
                   <Divider/>
                   <Text>Department for Improvement:</Text>
                   <FlatList
                   data={route.params.obj.improve_dept}
                   renderItem={Item_Issue_Dept_View}
                   keyExtractor={(item, index)=> index.toString()}
                   />
                   <Divider/>

                  <Image style={styles.image} source={{uri: 'http://' + route.params.obj.issue.Picture}}/>
                  <Divider/>
                    
                   <View style={{flexDirection:'row',alignItems:'center', justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> onUpdate(route.params.obj.issue.PIC)}>
                        <Text style={{color:'white'}}>UPDATE</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={()=> onImprove(route.params.obj.issue.ID_Issue)}>
                        <Text style={{color:'white'}}>IMPROVE</Text> 
                    </TouchableOpacity> 
                   </View>
                   <View style={{flexDirection:'row',alignItems:'center',justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> onViewImp(route.params.obj.issue.ID_Issue)}>
                        <Text style={{color:'white'}}> VIEW IMPROVEMENT</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={()=> {navigation.goBack()}}>
                        <Text style={{color:'white'}}> EXIT</Text> 
                    </TouchableOpacity>  
                   </View>

            </View>
        
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