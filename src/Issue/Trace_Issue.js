import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image, 
    Picker, AsyncStorage, LogBox, Platform, PermissionsAndroid, 
    TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import {Card, ListItem, Button, Icon} from 'react-native-elements';
import config from '../js_helper/configuration';
import ngonngu from '../language/stringLanguage';

const TraceIssue = ({route, navigation})=>{

    const[numRec, setNumRec]=useState([]);
    const[selectedRecord, setSelectedRec]=useState(5);
   
    const[lang, setLang]=useState('');

    const[issueList, setIssueList]=useState();
    const[issuecom, setIssuecom]=useState();
    const[modal, setModal]=useState(false);

    useEffect(()=>{
        async function initial()
        {
            var res = await fetch(config.api_server 
                +'/api/HSE5S/TraceGeneralIssue?numberRecord='
                +selectedRecord.toString());
            var json_res = await res.json();
            setIssueList(json_res);

            var recQty =[];
            for(var i=1;i<=20;i++)
            {
                var obj = {'keyNum': i};
                await recQty.push(obj);
            }
            await setNumRec(recQty);
    
            const nn = await AsyncStorage.getItem('lang');
            setLang(nn);
        }
        initial();
    },[])

    const onDetail =({item})=>{
        console.log(item.Picture);
        setModal(true);
        setIssuecom(item);
    }
    const onImprove = async()=>{
        var dept = await AsyncStorage.getItem('dept');
        console.log(dept);
    }
    const onUpdate = async(value)=>{
        var ID_User = await AsyncStorage.getItem('id_user');
        if(ID_User==value)
        {
            console.log('OK');
        }
        else
        {
            alert('You have no permission to update');
        }
    }

    const onSelectNumRec = async(value)=>{
        try
        {
            var res = await fetch(config.api_server 
                +'/api/HSE5S/TraceGeneralIssue?numberRecord='
                +value.toString());
            var json_response = await res.json();
            setIssueList(json_response);
        }
        catch(error)
        {
            alert(error);
        }
        
    }

    const ItemView =({item}) =>{
        return(
            <View>
                <Card>
                    <Card.Title>{item.Name_Issue}</Card.Title>
                    <Card.Divider/>
                    <Card.Image source={{uri: 'http://'+item.Picture}}/>
                    <View style={styles.buttonModalView}>
                        <TouchableOpacity style={styles.input_content} onPress={()=> onDetail({item})}>
                            <Text>VIEW DETAIL</Text> 
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.input_content} onPress={()=> onUpdate(item.PIC)}>
                            <Text>UPDATE</Text> 
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.input_content} onPress={()=> onImprove()}>
                            <Text>IMPROVEMENT</Text> 
                        </TouchableOpacity>
                    </View>
                    
                </Card>
            </View>
        )
    }

    return(
        <ScrollView stickyHeaderIndices={[0]}> 
            <View>
                <Text>Most Recent</Text>
                    <Picker
                    selectedValue={selectedRecord}
                    onValueChange={(itemValue, itemIndex)=>{
                        onSelectNumRec(itemValue);
                    }}>
                    {numRec?numRec.map((item,key)=>{
                        return(<Picker.Item label={item.keyNum.toString()} value={item.keyNum} key={key}/>)
                    }):<Picker.Item label='Loading...' value='id'/>}</Picker>
                </View>
            <SafeAreaView>
                <FlatList                    
                    data={issueList}
                    renderItem={ItemView}
                    keyExtractor={(item, index)=> index.toString()}/>
            </SafeAreaView>       
            <Modal
                animated='slide'
                transparent={true}
                visible={modal}
                onRequestClose={()=>setModal(false)}>
                <View style={styles.modalView}>
                    <Text>{issuecom?issuecom.Name_LocationDetail:'loading...'}</Text>
                </View>

            </Modal>
        </ScrollView>
    )
}
const styles = StyleSheet.create(
    {
        modalView:{
            flex: 1, 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'white',
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
        }
    }
)

export default TraceIssue;