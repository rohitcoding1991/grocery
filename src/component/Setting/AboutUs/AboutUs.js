import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import { getVersion, getBuildNumber } from 'react-native-device-info';

const aboutUs = props => {
    return (
        <View style={style.base}>
            <Header title="About" />
            <ScrollView>
                <View style={[{ padding: 10, marginTop: 50, alignSelf: 'center' }]}>
                    <Text style={[style.h2, style.center, style.mb_m, style.bold, style.primaryColor, style.h1]}>Mr Chicken</Text>
                    <Text style={[style.h2, style.center]}>Version {getVersion()} <Text>(Build {getBuildNumber()})</Text></Text>
                </View>
                <Image
                    source={require("../../../assets/images/profile.jpg")}
                    style={{
                        width: 200,
                        height: 200,
                        marginTop: 50,
                        resizeMode: 'contain',
                        justifyContent: 'center',
                        alignSelf: 'center'
                    }}
                />
                <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 50 }}>
                    <Text style={[style.center, style.bold, style.h3, { color: 'blue', textDecorationLine: 'underline' }]}>Licence</Text>
                </View>
            </ScrollView>
        </View>
    )
}

export default aboutUs;