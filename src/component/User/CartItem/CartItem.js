import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const cartItem = props => {
    return (
        <View style={styles.containerBox}>
            <View style={{ width: "20%" }}>
                <Image
                    source={{ uri: props.url }}
                    style={{ width: 60, height: 60, resizeMode: 'contain' }}
                />
            </View>
            <View style={{ width: "60%" }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{props.title}<Text style={{ fontSize: 11, color: "#CC1100" }}> ({props.discount} % off)</Text></Text>
                <Text style={{ fontWeight: '300', fontSize: 10 }}>Available</Text>
                {props.type == "cart" ?
                    <View style={styles.quantity}>
                        <Icon
                            onPress={() => props.subtractQuantity(props.index, props.id)}
                            name="minus"
                            disabled={props.quantity > 1 ? false : true}
                            size={17}
                            color={props.quantity > 1 ? "#CC1100" : "grey"}
                            style={{ marginRight: 10 }}
                        />
                        <Text>{props.quantity}</Text>
                        <Icon
                            onPress={() => props.quantity < props.productQuantity ? props.addQuantity(props.index, props.id) : props.outOfStockIndicator()}
                            name="plus"
                            disabled={props.quantity < props.productQuantity ? false : true}
                            size={17}
                            color={props.productQuantity > props.quantity ? "#CC1100" : "grey"}
                            style={{ marginLeft: 10 }}
                        />
                    </View>
                    : null
                }
            </View>
            {props.type == "cart" ?
                <View style={{ width: "15%" }}>
                    <Text style={{ textDecorationLine: 'line-through', fontSize: 12 }}>Rs{props.oldPrice}</Text>
                    <Text>Rs{props.price}</Text>
                </View>
                :
                <View style={{ width: "15%" }}>
                    <Text style={{ textDecorationLine: 'line-through', }}>Rs{props.oldPrice}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Rs{props.singlePrice}</Text>
                </View>
            }
            {props.type == "cart" ?
                <Icon
                    onPress={() => props.warningOnRemovingItemFromCart(props.index, props.id)}
                    name="close"
                    size={17}
                    color="#CC1100"
                    style={{ width: "5%" }}
                />
                :
                props.type == "favourite" ?
                    <MaterialIcons
                        onPress={() => props.removeFromFavourite(props.index, props.id)}
                        name="bookmark"
                        size={18}
                        color="#CC1100"
                        style={{ width: "5%" }}
                    />
                    :
                    <Icon
                        onPress={() => props.removeFromWishList(props.index, props.id)}
                        name="heart"
                        size={15}
                        color="#CC1100"
                        style={{ width: "5%" }}
                    />
            }
        </View>

    )
}

const styles = StyleSheet.create({
    containerBox: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: '#F1D1F1',
        alignItems: 'center',
        borderRadius: 5
    },
    quantity: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 5,
        backgroundColor: '#f8f8f8',
        padding: 5,
        width: "35%"
    }
})
export default cartItem;