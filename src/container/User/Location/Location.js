import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Header from '../../../component/Header/Header';

export default class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View>
                <Header title="Let Us Find You" type="location" />
            </View>
        );
    }
}
