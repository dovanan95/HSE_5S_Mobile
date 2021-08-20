import color from "color";
import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image, 
    Picker, AsyncStorage, LogBox, Platform, PermissionsAndroid, ActivityIndicator,
    TouchableOpacity, SafeAreaView, FlatList, Animated } from "react-native";
import {Card, ListItem, Button, Icon, Input} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import config from '../js_helper/configuration';
import ngonngu from '../language/stringLanguage';
import { TextInput } from "react-native-paper";

const TraceIssue = ({route, navigation})=>{

    const[numRec, setNumRec]=useState([]);
    const[selectedRecord, setSelectedRec]=useState(5);
   
    const[lang, setLang]=useState('');
    const[loading, setLoading] = useState(true);

    //seletion search
    const[classify, setClassify]=useState();
    const[pick_classify, setPick_classify]= useState(0);
    const[loss, setLoss]=useState();
    const[pick_loss, setPick_loss]=useState(0);
    //const[status, setStatus]= useState();
    const[pick_status, setPick_Stt]=useState('none');

    const[location, setLocation]=useState();
    const[pick_location, setPick_location]=useState(1);

    const[loc_desc, setLoc_desc]=useState();
    const[locd_temp, setLocd_temp]=useState();
    const[pick_locdes, setPick_locdes]=useState(0);

    const[start_date, setStartDate]=useState();
    const[until_date, setUntilDate]=useState();
    //end selection search

    const[issueList, setIssueList]=useState();
    const[issuecom, setIssuecom]=useState();
    const[modal, setModal]=useState(false);
    const[modalcontrol, setModalControl]=useState(false);

    const[text_search, setTextSearch]=useState();
    const[isLocal, setIsLocal]=useState(false);
    const[issueList_local, setIssue_filter]=useState();

    const[searchGloble, setSearchGlobal]= useState();

    useEffect(()=>{
        async function initial()
        {
            try
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

                var homnay = new Date();
                var dd= String(homnay.getDate()).padStart(2, '0');
                var mm = String(homnay.getMonth()+1).padStart(2, '0');
                var yyyy=  homnay.getFullYear();
                homnay = yyyy+'-'+mm+'-'+dd;
                setUntilDate(homnay);
                setStartDate(homnay);

                var res_all = await fetch(config.api_server 
                    + '/api/HSE5S/GetAllElementIssue');
                var json_res_all = await res_all.json();

                setLoss(json_res_all['Table5']);
                setClassify(json_res_all['Table1']);
                setLocation(json_res_all['Table2']);
                setLocd_temp(json_res_all['Table3']);

                var locdescr = [];
                for(var k in json_res_all['Table3'])
                {
                if(json_res_all['Table3'][k]['ID_Location']==1)
                    {
                        locdescr.push(json_res_all['Table3'][k])
                    }
                }
                setLoc_desc(locdescr);

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
    }

    const onDetail =({item})=>{
        setModal(true);
        setIssuecom(item);
    }

    const Issue_status = [{'status_key': 'Reject'},{'status_key': 'Pending'}, {'status_key': 'Approved'}];

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
            setModal(false);
            navigation.navigate('improvement_trace_by_issue', {'ID': value})
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

        var res_dept = await fetch(config.api_server 
            + '/api/HSE5S/getDeptImprove?ID_Issue='
            + value.toString());
        var res_dept_json = await res_dept.json();

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
        if(flag_dept==1 && flag_perm==1)
        {
            setModal(false);
            navigation.navigate('create_imp', {'ID':value})
        }
        else if(flag_dept==0 || flag_perm==0)
        {
            alert('You have no permission to improve this issue');
        }
    }
    const onUpdate = async(value)=>{
        var ID_User = await AsyncStorage.getItem('id_user');
        if(ID_User==value)
        {
            setModal(false);
            navigation.navigate('issue_update',{'obj': issuecom});
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

    const Search_Local=(value)=>{
        //console.log(value);
        var localsearch=[];
        for(var a in issueList)
        {
            if(String(issueList[a].Name_Issue).includes(value))
            {
                localsearch.push(issueList[a]);
            }
        }
        setIssue_filter(localsearch);

        if(value=='')
        {
            setIsLocal(false);
        }
    }

    const Search_Name_Api=async()=>{
        try
        {
            setLoading(true);
            console.log(searchGloble);
            var response = await fetch(config.api_server 
                + '/api/HSE5S/SearchIssueName?name='
                + searchGloble);
            var json_res = await response.json();
            setIssueList(json_res);
            setModalControl(false);
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

    const Search = async()=>{
        try
        {
            setLoading(true);
            const settings ={
               method:'POST',
               headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
               },
               body:JSON.stringify(
                   {
                    "ID_Classify":pick_classify,
                    "ID_Loss":pick_loss,
                    "Time_Start":start_date,
                    "Time_Until":until_date,
                    "Status":pick_status,
                    "LocationD_ID":pick_locdes
                   }
               )
           };
           var response = await fetch(config.api_server +'/api/HSE5S/SearchIssue', settings);
           var json_response = await response.json();
           setIssueList(JSON.parse(json_response));
            
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
                        <TouchableOpacity style={styles.input_content} onPress={()=> console.log('delete issue')}>
                            <Text> REJECT ISSUE</Text> 
                        </TouchableOpacity>
                    </View>
                    
                    
                </Card>
            </View>
        )
    }

    let AnimatedHeaderValue = new Animated.Value(0);
    const Header_Max_Height = 50;
    const Header_Min_Height = 50;

    const animatedHeaderBackgroundColor = AnimatedHeaderValue.interpolate(
        {
            inputRange:[0, Header_Max_Height-Header_Min_Height],
            outputRange: ['white', 'pink'],
            extrapolate: 'clamp'
        }
    );
    const animatedHeaderHeight = AnimatedHeaderValue.interpolate(
        {
            inputRange:[0, Header_Max_Height-Header_Min_Height],
            outputRange: [Header_Max_Height, Header_Min_Height],
            extrapolate:'clamp'
        }
    )

    return(
        <SafeAreaView>
            <Animated.View
                style={[
                    //styles.header,
                    {
                        height:animatedHeaderHeight,
                        backgroundColor: animatedHeaderBackgroundColor
                    }
                ]}>
                <TouchableOpacity style={styles.input_content} onPress={()=> setModalControl(true)}>
                        <Text>Search Engine</Text> 
                </TouchableOpacity>
                                
           </Animated.View>
           <Input placeholder='Search...' 
           onChangeText={(text)=>{setTextSearch(text);
            setIsLocal(true);
            Search_Local(text);}}
           value={text_search}></Input>

           {loading?<ActivityIndicator size="small" color="#0000ff"/>:(<ScrollView
                contentContainerStyle={{paddingBottom: 150}}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{nativeEvent:{contentOffset:{y:AnimatedHeaderValue}}}],
                    {useNativeDriver:false},
                )}> 
                <View>
                    <FlatList                    
                    data={isLocal?issueList_local:issueList}
                    renderItem={ItemView}
                    keyExtractor={(item, index)=> index.toString()}/>  
                </View>
         
               
         
           <Modal
               animated='slide'
               transparent={true}
               visible={modal}
               onRequestClose={()=>setModal(false)}>
               <ScrollView style={styles.modalView}>
                    <Text>{issuecom?issuecom.ID_Issue:'loading...'}</Text>
                   <Text>{issuecom?'Location: '+ issuecom.Name_LocationDetail:'loading...'}</Text>
                   <Text>{issuecom?issuecom.Name_Classify:'loading...'}</Text>
                   <Text>{issuecom?issuecom.Picture:'loading...'}</Text>
                   {issuecom?<Image style={styles.image} source={{uri: 'http://' + issuecom.Picture}}/>:<Text>Loading...</Text>} 
                    
                   <View style={{flexDirection:'row',alignItems:'center', justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> onUpdate(issuecom.PIC)}>
                        <Text style={{color:'white'}}>UPDATE</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={()=> onImprove(issuecom.ID_Issue)}>
                        <Text style={{color:'white'}}>IMPROVE</Text> 
                    </TouchableOpacity> 
                   </View>
                   <View style={{flexDirection:'row',alignItems:'center',justifyContent: "center",}}>
                   <TouchableOpacity style={styles.input} onPress={()=> onViewImp(issuecom.ID_Issue)}>
                        <Text style={{color:'white'}}> VIEW IMPROVEMENT</Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.input} onPress={()=> setModal(false)}>
                        <Text style={{color:'white'}}> EXIT</Text> 
                    </TouchableOpacity>  
                   </View>
                                       
               </ScrollView>

           </Modal>
           <Modal
               animated='slide'
               transparent={true}
               visible={modalcontrol}
               onRequestClose={()=>setModalControl(false)}>
               <ScrollView style={styles.modalControlView}>
                    <Text>Most Recent</Text>
                   <Picker
                   selectedValue={selectedRecord}
                   onValueChange={(itemValue, itemIndex)=>{
                       onSelectNumRec(itemValue);
                       setModalControl(false);
                   }}>
                   {numRec?numRec.map((item,key)=>{
                       return(<Picker.Item label={item.keyNum.toString()} value={item.keyNum} key={key}/>)
                   }):<Picker.Item label='Loading...' value='id'/>}</Picker>
                   <View style={{flexDirection:'row'}}>
                       <View>
                            <TextInput style={styles.text_input} placeholder='Search' 
                            value={searchGloble} 
                            onChangeText={setSearchGlobal}></TextInput>
                       </View>
                       <View>
                            <TouchableOpacity 
                            style={{padding:12,
                            justifyContent:'center',    
                            backgroundColor: "blue",
                            }}  
                            onPress={()=>Search_Name_Api()}>
                                    <Text style={{ color:'white',}}>Search Name</Text>
                            </TouchableOpacity>
                       </View>
                   </View>
                    <Text>Location</Text>
                        <Picker selectedValue={pick_location}
                            style={{ height: 30, width: "98%", alignSelf: 'stretch'}}
                            onValueChange={(itemValue, itemIndex)=>{
                            setPick_location(itemValue);
                            onChangeLocation(itemValue);
                            }}>
                            {location?location.map((item, key)=>{
                                return <Picker.Item label={item.Name_Location} value={item.ID_Location} key={key} />
                            }):<Picker.Item label='Location' value='loc_id'/>}
                            
                        </Picker>
                    <Text>Location Description</Text>
                        <Picker selectedValue={pick_locdes}
                            style={{ height: 30, width: "98%", alignSelf: 'stretch'}}
                            onValueChange={(itemValue, itemIndex)=>{
                            setPick_locdes(itemValue)}}>
                            {loc_desc?loc_desc.map((item, key)=>{
                                return <Picker.Item label={item.Name_LocationDetail} value={item.ID_LocationD} key={key} />
                            }):<Picker.Item label='Location Description' value='locd_id'/>}
                            
                        </Picker>
                    <Text>Classification</Text>
                        <Picker selectedValue={pick_classify}
                            style={{ height: 30, width: "98%", alignSelf: 'stretch'}}
                            onValueChange={(itemValue, itemIndex)=>{setPick_classify(itemValue)}}>
                            {classify?classify.map((item, key)=>{
                                return <Picker.Item label={item.Name_Classify} value={item.ID_Classify} key={key} />
                            }):<Picker.Item label='Class' value='clas_id'/>}
                        </Picker>
                    <Text>Level</Text>
                        <Picker selectedValue={pick_loss}
                            style={{ height: 30, width: "98%", alignSelf: 'stretch'}}
                            onValueChange={(itemValue, itemIndex)=>{setPick_loss(itemValue)}}>
                            {loss?loss.map((item, key)=>{
                                return <Picker.Item label={item.Name_Level} value={item.ID_Level} key={key} />
                            }):<Picker.Item label='Loss' value='loss_id'/>}
                        </Picker>
                    <Text>Status</Text>
                            <Picker selectedValue={pick_status}
                            style={{height: 30, width: "98%", alignSelf: 'stretch'}}
                            onValueChange={(itemValue, itemIndex)=>{setPick_Stt(itemValue)}}>
                                {Issue_status.map((item, key)=>{
                                    return<Picker.Item label={item.status_key} value={item.status_key} key={key}/>
                                })}
                            </Picker>
                    <View style={{flexDirection:'row'}}>
                        <Text>Start Date</Text>
                        <DatePicker
                            style={styles.datePickerStyle}
                            date={start_date} // Initial date from state
                            mode="date" // The enum of date, datetime and time
                            placeholder={start_date?start_date:'2020-01-01'}
                            format="YYYY-MM-DD"
                            minDate='2020-01-01'
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
                                let timestamp_start = Date.parse(date);
                                let timestamp_end = Date.parse(until_date);
                                if(timestamp_start>timestamp_end)
                                {
                                    date=until_date;
                                } 
                                setStartDate(date);
                            }}
                        />
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>Until Date</Text>
                        <DatePicker
                            style={styles.datePickerStyle}
                            date={until_date} // Initial date from state
                            mode="date" // The enum of date, datetime and time
                            placeholder={until_date?until_date:'2020-01-01'}
                            format="YYYY-MM-DD"
                            minDate='2020-01-01'
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
                                setUntilDate(date);
                            }}
                        />
                    </View>
                    <View style={styles.buttonModalView}>
                        <TouchableOpacity style={styles.input}  
                            onPress={()=>{
                                Search();
                                setModalControl(false);}}>
                            <Text style={{color:'white'}}>SEARCH</Text> 
                        </TouchableOpacity>
                    </View>
                   
               </ScrollView>

           </Modal>
       </ScrollView>)} 
    </SafeAreaView>
        
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
        modalControlView:{
            flex: 1, 
            //alignItems: 'center', 
            //justifyContent: 'center',
            backgroundColor: 'white',
        },
        input_content:{
            margin:5,
            marginTop:8,
            height:40
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
        datePickerStyle: {
            width: 200,
            marginTop: 0,
        },
        buttonModalView:{
            flexDirection:'row',
            padding:10,
            justifyContent:'space-around',
            backgroundColor:'white',
        },
        header:{
            justifyContent:'center',
            //alignItems: 'center',
            //left:0,
            //right:0
        },
        text_input: {
            height: 30,
            width:250,
            margin: 2,
            borderWidth: 0.5,
            padding: 5,
        },
        image: {
            marginBottom: 40,
            width: 300,
            height: 300,
            marginLeft:30
        },
    }
)

export default TraceIssue;