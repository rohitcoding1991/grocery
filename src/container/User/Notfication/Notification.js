import React, { Component } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import Header from '../../../component/Header/Header';
import { style } from '../../../component/Global/Global';
import SingleNotification from '../../../component/SingleNotification/SingleNotification';

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notification: []
        };
    }

    rightAction = (progress, dragX) => {
        let scale = dragX.interpolate({
            inputRange: [-50, 0],
            outputRange: [0.7, 0]
        });
        let viewButtons = (
            <View style={{ backgroundColor: "#CC1100", justifyContent: 'center', marginTop: 10 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => alert("Hello Right")}>
                    <Animated.Text
                        style={{
                            color: 'white',
                            paddingHorizontal: 15,
                            fontSize: 15,
                            fontWeight: '600',
                            transform: [{ scale }]
                        }}>
                        Delete
                    </Animated.Text>
                </TouchableOpacity>
            </View>
        )
        return viewButtons
    }
    render() {
        return (
            <View style={style.base}>
                <Header
                    title="Notification Panel"
                    type="notification"
                />
                {this.state.notification.length < 1 ?
                    <ScrollView
                        removeClippedSubviews={true}
                    >
                        <SingleNotification title="This is a test notification" time="1d ago" rightAction={this.rightAction} />
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', }}>
                        <Text style={{ textAlign: 'center' }}>No Current Notification</Text>
                    </View>
                }
            </View>
        );
    }
}
