import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';

const helpAndSupport = props => {
    return (
        <View style={style.base}>
            <Header title="Help And Support" />
            <ScrollView>
                <View>
                    <Image
                        source={require("../../../assets/images/meetus.png")}
                        style={{ width: "100%", height: 400, resizeMode: "cover" }}
                    />
                </View>
                <View style={style.spaceBetween}>
                    <View style={[{ padding: 10, marginVertical: 10, borderBottomColor: 'lightgrey' }]}>
                        <Text style={[style.h2, style.bold]}>Meet Us</Text>
                        <Text>Example Address </Text>
                        <Text>Example Building of the shop </Text>
                        <Text>Example Shop #</Text>
                    </View>
                    <View style={[{ marginVertical: 10, padding: 10 }]}>
                        <Text style={[style.h2, style.bold]}>Contact Us</Text>
                        <View style={[style.mt_m, style.mb_m]}>
                            <Text>+1 45 3452829</Text>
                        </View>

                    </View>
                </View>
                <View style={[{ padding: 10, alignSelf: 'center' }]}>
                    <Text style={[style.h2, style.bold]}>You can send us an Email At</Text>
                    <Text>exampleAddress@example.com</Text>
                </View>
            </ScrollView>
        </View>
    )
}
export default helpAndSupport;