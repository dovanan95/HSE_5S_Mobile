import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image, 
    Picker, AsyncStorage, LogBox, ActivityIndicator,
    TouchableOpacity, SafeAreaView, FlatList, Animated } from "react-native";
import { Card } from "react-native-elements";
import config from '../js_helper/configuration';

 //Trace improvement by Issue ID
const Improvement_Trace = ({route, navigation}) =>{
    const[loading, setLoading] = useState(true);
    const[impList, setImpList] = useState();
    const[pendingDept, setPending]=useState();

    const ID_Issue = route.params.ID;
    useEffect(()=>{
        async function initial()
        {
            try
            {
                var res = await fetch(config.api_server 
                    + '/api/HSE5S/traceImpByIssue?ID_Issue='
                    + ID_Issue);
                var json_res = await res.json();
                var filtered_list=[];
                var dept_pending=[];
                for(var imp in json_res)
                {
                    if(json_res[imp].Time_Improve!=null)
                    {
                        filtered_list.push(json_res[imp]);
                    }
                    else
                    {
                        dept_pending.push(json_res[imp]);
                    }
                }
                setImpList(json_res);
                setPending(dept_pending);
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

    const onDetail =async(item)=>{
        console.log(item);
        navigation.navigate('improvement_detail',{'ID_Imp': item.ID_Improve, 'ID_Issue':item.ID_Issue});
    }

    const ItemView = ({item})=>{
        if(item.Time_Improve==null)
        {
            return(
                <View>
                    <Card>
                        <Card.Title>{'#'+item.ID_Improve}</Card.Title>
                        <Card.Divider/>
                        <Text>This Issue was not solved by Team {item.Name_Department}</Text>
                    </Card>
                </View>
            )
        }
        else if(item.Time_Improve!=null)
        {
            return(
                <View>
                    <Card>
                    <Card.Title>{item.Title}</Card.Title>
                    <Card.Divider/>
                    <Card.Image source={{uri: 'http://'+item.Picture}}/>
                    <View style={styles.buttonModalView}>
                        <TouchableOpacity style={styles.input_content} 
                        onPress={()=> onDetail({'ID_Improve': item.ID_Improve, 'ID_Issue': item.ID_Issue})}>
                            <Text>VIEW DETAIL</Text> 
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.input_content} onPress={()=> console.log('update')}>
                            <Text>UPDATE</Text> 
                        </TouchableOpacity>
                    </View>
                    <Text>{item.Status}</Text>
                    </Card>
                    
                </View>
            )
        }
    }
       
   
    return(
        <SafeAreaView>
        <ScrollView>{loading?<ActivityIndicator size="small" color="#0000ff"/>:
            <View>
                <Text>{ID_Issue}</Text>
                <FlatList                    
                    data={impList}
                    renderItem={ItemView}
                    keyExtractor={(item, index)=> index.toString()}/> 
            </View>}
        </ScrollView>
       
        </SafeAreaView>
    )

}
const styles = StyleSheet.create(
    {
        buttonModalView:{
            flexDirection:'row',
            padding:10,
            justifyContent:'space-around',
            backgroundColor:'white',
        },
        input_content:{
            margin:5,
            marginTop:8,
            height:40
        },
    }
)

export default Improvement_Trace;