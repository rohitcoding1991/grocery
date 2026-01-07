import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { style } from '../../../Global/Global';
import Icon from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const button = props => (
    <View style={styles.container}>
        {props.type == "AntDesign" ?
            <Icon
                style={{ marginRight: 10 }}
                name={props.icon}
                size={props.size}
            />
            :
            props.type == "Entypo" ?
                <Entypo
                    style={{ marginRight: 10 }}
                    name={props.icon}
                    size={props.size}
                />
                :
                props.type == "FontAwesome" ?
                    <FontAwesome
                        style={[{ marginRight: 10 }, props.titleType == "City Name" ? { color: 'white' } : { color: 'black' }]}
                        name={props.icon}
                        size={props.size}
                    />
                    :
                    props.type == "Fontisto" ?
                        <Fontisto
                            style={{ marginRight: 10 }}
                            name={props.icon}
                            size={props.size}
                        />
                        :
                        null
        }
        <Text style={[style.bold, style.h2, props.titleType == "City Name" ? { color: 'white' } : { color: 'black' }]}>{props.title == undefined ? "Provide " + props.titleType : props.title}</Text>
    </View>
)
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    }
})

export default button;