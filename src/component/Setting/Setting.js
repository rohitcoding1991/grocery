import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../Header/Header';
import { style } from "../Global/Global";
import MaterialCommunityEntypes from 'react-native-vector-icons/MaterialCommunityIcons';
import Entype from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation } from '@react-navigation/native';
const setting = props => {
    const navigation = useNavigation();
    return (
        <View style={[style.base]}>
            <Header title="Settings" />
            <View>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("changePassword")}
                        style={styles.listStyle}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialCommunityEntypes
                                    name="key-change"
                                    size={20}
                                    color='black'
                                />
                                <Text style={styles.mainBtn}>Change Password</Text>
                            </View>
                            <Entype
                                name="chevron-thin-right"
                                size={20}
                                color='black'
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("changeEmailAddress")}
                        style={styles.listStyle}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Entype
                                    name="email"
                                    size={20}
                                    color='black'
                                />
                                <Text style={styles.mainBtn}>Change Email Address</Text>
                            </View>
                            <Entype
                                name="chevron-thin-right"
                                size={20}
                                color='black'
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("changePhoneNumber")}
                        style={styles.listStyle}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row' }}>
                                <AntDesign
                                    name="phone"
                                    size={20}
                                    color='black'
                                />
                                <Text style={styles.mainBtn}>Change Phone Number</Text>
                            </View>
                            <Entype
                                name="chevron-thin-right"
                                size={20}
                                color='black'
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("notificationSetting")}
                        style={styles.listStyle}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row' }}>
                                <AntDesign
                                    name="notification"
                                    size={20}
                                    color='black'
                                />
                                <Text style={styles.mainBtn}>Notification</Text>
                            </View>
                            <Entype
                                name="chevron-thin-right"
                                size={20}
                                color='black'
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("aboutUs")}
                        style={styles.listStyle}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row' }}>
                                <AntDesign
                                    name="smileo"
                                    size={20}
                                    color='black'
                                />
                                <Text style={styles.mainBtn}>About</Text>
                            </View>
                            <Entype
                                name="chevron-thin-right"
                                size={20}
                                color='black'
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        padding: 20
    },
    listStyle: {
        marginTop: 10,
        marginVertical: 20,
        fontWeight: "300",
        lineHeight: 20,
        letterSpacing: 0.2,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        paddingBottom: 5,
    },
    title: {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        fontWeight: '300'
    },
    mainBtn: {
        fontSize: 14,
        marginTop: 1,
        letterSpacing: 0.3,
        marginLeft: 10
    }
})

export default setting;