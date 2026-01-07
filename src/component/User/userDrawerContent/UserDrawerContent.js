import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../Config/Config';
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer
}
    from 'react-native-paper';

import {
    DrawerContentScrollView,
    DrawerItem
}
    from '@react-navigation/drawer';

export default DrawerContent = props => {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} >
                <View style={styles.drawerContent}>
                    <View style={styles.userInfo}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image
                                source={props.avatar != '' ? { uri: props.avatar } : require("../../../assets/images/avatar.jpg")}
                                size={50}
                            />
                            <View style={{ marginLeft: 15 }}>
                                <Title style={styles.title}>{props.userName}</Title>
                                <Caption style={styles.caption}>{props.accountType}</Caption>
                            </View>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.section}>
                            <Caption style={styles.caption}>Total Orders</Caption>
                            <Paragraph style={[styles.paragraph, styles.caption]}>{props.totalOrders}</Paragraph>
                        </View>
                        <View style={styles.section}>
                            <Caption style={styles.caption}>Current Orders</Caption>
                            <Paragraph style={[styles.paragraph, styles.caption]}>{props.currentOrders}</Paragraph>
                        </View>
                    </View>
                </View>
                <Drawer.Section style={styles.drawerSection}>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Octicons
                                name="home"
                                size={size}
                                color={color}
                            />
                        )}
                        onPress={() => navigation.navigate("userDashboard")}
                        label="Home"
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Octicons
                                name="history"
                                size={size}
                                color={color}
                            />
                        )}
                        onPress={() => navigation.navigate("orderHistory")}
                        label="Order History"
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <AntDesign
                                name="hearto"
                                size={size}
                                color={color}
                            />
                        )}
                        onPress={() => navigation.navigate("wishList", { type: "wishList" })}
                        label="Wish List"
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialCommunityIcons
                                name="bookmark-outline"
                                size={size}
                                color={color}
                            />
                        )}
                        onPress={() => navigation.navigate("wishList", { type: "favourite" })}
                        label="Favourite"
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialIcons
                                name="feedback"
                                size={size}
                                color={color}
                            />
                        )}
                        onPress={() => navigation.navigate("feedback")}
                        label="Feedback"
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <MaterialIcons
                                name="contacts"
                                size={size}
                                color={color}
                            />
                        )}
                        onPress={() => navigation.navigate("contactUs")}
                        label="Contact Us"
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <AntDesign
                                name="customerservice"
                                size={size}
                                color={color}
                            />
                        )}
                        onPress={() => navigation.navigate("helpAndSupport")}
                        label="Help And Support"
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <SimpleLineIcons
                                name="settings"
                                size={size}
                                color={color}
                            />
                        )}
                        onPress={() => navigation.navigate("setting")}
                        label="Settings"
                    />
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon
                            name="logout"
                            size={size}
                            color={color}
                        />
                    )}
                    onPress={() => auth.signOut().then(() => navigation.replace("userAuth"))}
                    label="Logout"
                />
            </Drawer.Section>
        </View>
    )
}
const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    drawerSection: {
        marginTop: 15
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1,
    },
    userInfo: {
        paddingLeft: 20
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        marginRight: 5
    },
    row: {
        marginTop: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    paragraph: {
        fontWeight: 'bold',
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16
    }
})
