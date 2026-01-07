import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { style } from '../../../Global/Global';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'
const button = props => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ marginHorizontal: "25%" }}
                onPress={() => navigation.navigate("wishList", { type: props.buttonType })}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {props.type == "AntDesign" ?
                        <Icon
                            style={[style.mr_m]}
                            name={props.icon}
                            size={props.size}
                            color="white"
                        />
                        :
                        <MaterialCommunityIcons
                            style={[style.mr_m]}
                            name={props.icon}
                            size={props.size}
                            color="white"
                        />
                    }
                    <Text style={[style.secondaryColor, style.h2]}>{props.title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "50%",
        backgroundColor: "#CC1111",
        borderColor: '#F15C50',
        borderLeftWidth: 1,
        paddingVertical: 15,
    }
})

export default button;