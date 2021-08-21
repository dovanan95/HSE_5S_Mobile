// Navigate Between Screens using React Navigation in React Native //
// https://aboutreact.com/react-native-stack-navigation //
import 'react-native-gesture-handler';

import * as React from 'react';
import { Button, View, Text } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createDrawerNavigator } from '@react-navigation/drawer';


import login from './src/login/login';
import menu from './src/login/general_menu';

import create_issue from './src/Issue/Create_Issue';
import Trace_Issue from './src/Issue/Trace_Issue';
import Update_Issue from './src/Issue/Update_Issue';
import My_Issue from './src/Issue/My_Issue';

import Imp_Hist from './src/Improvement/Imp_Hist';
import Trace_Imp from './src/Improvement/Trace_Imp';
import Create_Imp from './src/Improvement/Create_Imp';
import My_Improvement from './src/Improvement/My_Imp';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={login}/>
        <Stack.Screen
          name="general_menu"
          component={menu}
          options={{
            title:'Menu',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          <Stack.Screen
          name="Create_Issue"
          component={create_issue}
          options={{
            title:'New Issue',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          <Stack.Screen
          name="issue_trace"
          component={Trace_Issue}
          options={{
            title:'Issue History',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          <Stack.Screen
          name="issue_update"
          component={Update_Issue}
          options={{
            title:'Update Issue',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          <Stack.Screen
          name="improvement_trace"
          component={Imp_Hist}
          options={{
            title:'Improvement History',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          <Stack.Screen
          name="improvement_trace_by_issue"
          component={Trace_Imp}
          options={{
            title:'Improvement',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          <Stack.Screen
          name="create_imp"
          component={Create_Imp}
          options={{
            title:'Improvement Creation',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          <Stack.Screen
          name="my_improvement"
          component={My_Improvement}
          options={{
            title:'My Improvement',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          <Stack.Screen
          name="my_issue"
          component={My_Issue}
          options={{
            title:'My Issue',
            headerStyle: {
              backgroundColor: '#FF1493', //Set Header color
            },
            headerTintColor: '#fff', //Set Header text color
            headerTitleStyle: {
              fontWeight: 'bold', //Set Header text style
            },
          }}/>
          
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;