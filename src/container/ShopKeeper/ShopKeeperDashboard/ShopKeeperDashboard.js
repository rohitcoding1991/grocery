import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Header from '../../../component/Header/Header';

export default class ShopKeeperDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Header title="Shop" />
            </View>
        );
    }
}
