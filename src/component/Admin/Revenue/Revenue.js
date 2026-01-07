import React from "react";
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';

const revenue = props => {
    return (
        <View style={style.base}>
            <Header title="Revenue Of Your Business" />
        </View>
    )
}

export default revenue;