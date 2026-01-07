import React from 'react';
import { View, Text, Image } from 'react-native';
import { style } from '../Global/Global';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const singleNotification = props => {
    return (
        <Swipeable renderRightActions={props.rightAction}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, marginTop: 10, borderBottomColor: '#F0F0F0', borderBottomWidth: 1 }}>
                <View style={{ flexDirection: 'row', width: "80%" }}>
                    <Image
                        source={require("../../assets/images/profile.jpg")}
                        style={{ alignSelf: 'center', marginLeft: 10, width: 40, height: 40, borderRadius: 100, resizeMode: 'cover' }}
                    />
                    <View style={{ marginLeft: 10, width: "80%" }}>
                        <Text style={{ fontSize: 13, marginTop: 10 }}>{props.title} </Text>
                        <Text style={{ fontSize: 11, }}>{props.time}</Text>
                    </View>
                </View>
            </View>
        </Swipeable>
    )
}

export default singleNotification;

