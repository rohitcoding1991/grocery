import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { style } from '../../Global/Global';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
const section = props => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => props.view == 'pendingOrder' ? navigation.navigate("order") : null}>
            <View style={styles.container}>
                <View style={style.spaceBetween}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', }}>
                        {props.type == "MaterialIcons" ?
                            <MaterialIcons
                                name={props.name}
                                size={25}
                                color="#CC1100"
                            />
                            : props.type == "MaterialCommunityIcons" ?
                                <MaterialCommunityIcons
                                    name={props.name}
                                    size={25}
                                    color="#CC1100"
                                />
                                :
                                props.type == "Entypo" ?
                                    <Entypo
                                        name={props.name}
                                        size={25}
                                        color="#CC1100"
                                    />
                                    :
                                    <AntDesign
                                        name={props.name}
                                        size={25}
                                        color="#CC1100"
                                    />
                        }
                        <Text style={[style.h2, style.ml]}>{props.title}</Text>
                    </View>
                    {props.loading ?
                        <ActivityIndicator size='small' color="#CC0011" />
                        :
                        <Text style={[style.h1, style.bold, style.center]}>{props.value}</Text>
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default section;
const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderWidth: 1,
        marginVertical: 20,
        borderColor: 'lightgrey',
        shadowColor: 'black',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 1
    }
})