import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Button,
  TouchableOpacity,
  AsyncStorage,
  Picker,
  FlatList, ActivityIndicator
} from "react-native";
import { concat } from "react-native-reanimated";
import ngonngu from '../language/stringLanguage';

const menu = ({route, navigation})=>
{
    const[lang, setLang] = useState();
    const[permit, setPermit]=useState();

    const[loading, setLoading]=useState(true);
    const [listItems, setListItems] = useState(Func_Data);
  
    useEffect(()=>{
      async function getLang()
      {
        try
        {
          const lon = await AsyncStorage.getItem('lang');
          const permitt = await AsyncStorage.getItem('permission');
          const perm = JSON.parse(permitt);
          setPermit(perm);
          setLang(lon);

          for(var k in free_Func_Data)
          {
            Func_Data.push(free_Func_Data[k]);
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
      getLang();
    },[])

    var Func_Data=[
        {'id': 'Create_Issue', 'value': lang?ngonngu.stringLang[lang].menu.create_issue:'hi'},
        {'id': 'issue_trace', 'value': lang?ngonngu.stringLang[lang].menu.issue_trace:'hi'},
        {'id': 'improvement_trace', 'value': lang?ngonngu.stringLang[lang].menu.improve_trace:'hi'},
    ]

    var free_Func_Data =[
        {'id': 'my_issue', 'value':'My Issue'},
        {'id': 'my_improvement', 'value':'My Improvement'}
    ]

    const ItemView = ({ item }) => {
      return (
        // Single Comes here which will be repeatative for the FlatListItems
        <View style={styles.listItem}>
            <TouchableOpacity  onPress={() => getItem(item)}>
                <Text style={styles.item}>
                    {item.value}      
                </Text>
            </TouchableOpacity>
        </View>
      );
    };
  
    const ItemSeparatorView = () => {
      return (
        //Item Separator
        <View
          style={{ height: 0.5, width: '100%', backgroundColor: '#C8C8C8' }}
        />
      );
    };
  
    const getItem = (item) => {
      //Function for click on an item
      try
      {
        var flag = 0;
        for(var key in permit)
        {
            if(permit[key]["Name_Function"]===item.id)
            {
                flag=1
            }
        }
        if(flag===1)
        {
            navigation.navigate(item.id);
            flag=0;
        }
        else if(flag===0)
        {
          var flag_free = 0;
          for(var i in free_Func_Data)
          {
            if(item.id == free_Func_Data[i].id)
            {
              flag_free=1;
            }
            if(flag_free==1)
            {
              navigation.navigate(item.id);
              flag_free=0;
            }
            else
            {
              alert('no permission');
            }
          }
        }
      }
      catch(error)
      {
        console.log(error);
      }
      
    };
  

    return(
        <View>
            {loading?<ActivityIndicator size="small" color="#0000ff"/>:<SafeAreaView>
            <FlatList
                data={Func_Data}
                //data defined in constructor
                //ItemSeparatorComponent={ItemSeparatorView}
                //Item Separator View
                renderItem={ItemView}
                keyExtractor={(item, index) => index.toString()}
                />
            </SafeAreaView>}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      flex: 1,
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10,
      marginTop: 30,
    },
    item: {
      color: "#FFF",
      padding: 10,
      fontSize: 18,
      height: 48,
    },
    listItem:{
        margin:5,
        padding:5,
        backgroundColor:"#FF1493",
        width:"98%",
        flex:1,
        alignSelf:"center",
        flexDirection:"row",
        borderRadius:5
      }
  });
export default menu;