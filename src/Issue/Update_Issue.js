import React, { useEffect, useState } from "react";
import { View, Text, Alert, Modal, StyleSheet, ScrollView, Image, 
    Picker, AsyncStorage, LogBox, ActivityIndicator,
    TouchableOpacity, SafeAreaView, FlatList, Animated } from "react-native";

const Update_Issue = ({route, navigation}) =>{

    return(
        <Text>{route.params.obj.Content}</Text>
    )

}

export default Update_Issue;