import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { style } from "../Global/Global";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
const header = props => {
    let navigation = useNavigation();
    const payload = {
        title: props.type == "alterProduct" ? "Add Product" : "Add Catagory",
        type: props.type,
        addCatagory: props.type == "alterProduct" ? props.addProduct : props.addCatagory,
        screenType: props.screenType
    }
    return (
        <View style={[styles.container, style.pb, style.primaryBackgroundColor]}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {props.type == 'dashboard' || props.type == "order" || props.type == "product" || props.type == 'cart' || props.type == "location" || props.type == "profile" ?
                    <SimpleLineIcons
                        onPress={() => navigation.openDrawer()}
                        name="menu"
                        size={16}
                        color="white"
                        style={[style.ml, style.mt]}
                    />
                    :
                    props.type == "auth" || props.type == "phoneAuth" ?
                        <MaterialCommunityIcons
                            onPress={() => navigation.goBack()}
                            name="security"
                            size={16}
                            color="white"
                            style={[style.ml, style.mt]}
                        />
                        :
                        <Entypo
                            onPress={() => navigation.goBack()}
                            name="chevron-thin-left"
                            size={16}
                            color="white"
                            style={[style.ml, style.mt]}
                        />
                }
                <Text style={[style.h2, style.center, style.mt, style.ml, style.secondaryColor]}>{props.title}</Text>
            </View>
            {props.type == "dashboard" ?
                <SimpleLineIcons
                    onPress={() => navigation.navigate("notification")}
                    name="bell"
                    size={20}
                    color="white"
                    style={[style.h2, style.center, style.mt, style.mr]}
                />
                :
                props.type == "profile" ?
                    <Entypo
                        onPress={() => props.editProfile()}
                        name="edit"
                        size={20}
                        color="white"
                        style={[style.h2, style.center, style.mt, style.mr]}
                    />
                    :
                    props.type == "cart" && props.clearCartIconStatus ?
                        <AntDesign
                            onPress={() => props.clearCart()}
                            name="delete"
                            size={25}
                            color="white"
                            style={[style.h2, style.center, style.mt, style.mr]}
                        />
                        :
                        props.type == "alterProduct" || props.type == "alterCatagory" ?
                            <AntDesign
                                onPress={() => navigation.navigate("CRUDProduct", payload)}
                                name="plus"
                                size={25}
                                color="white"
                                style={[style.h2, style.center, style.mt, style.mr]}
                            />
                            :
                            props.type == "order" ?
                                <AntDesign
                                    onPress={() => alert("This feature will available soon")}
                                    name="filter"
                                    size={25}
                                    color="white"
                                    style={[style.h2, style.center, style.mt, style.mr]}
                                /> : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        height: 45,
        alignItems: 'center',
        alignContent: 'center'
    }
})
export default header;