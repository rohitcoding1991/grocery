import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { style } from '../../Global/Global';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const product = props => {
    const navigation = useNavigation();
    const payload = {
        url: props.url,
        title: props.title,
        oldPrice: props.oldPrice,
        newPrice: props.newPrice,
        discount: props.discount,
        productQuantity: props.quantity
    }
    const singleProductPayload = {
        id: props.id,
        uid: props.uid,
        markedAsFavouriteOrWishList: props.markedAsFavouriteOrWishList,
        removeFromFavouriteOrWishList: props.removeFromFavouriteOrWishList,
        changeRatingFlag: props.changeRatingFlag,
        addToCart: props.addToCart,
        favourite: props.favourite,
        wishList: props.wishList,
        url: props.url,
        title: props.title,
        oldPrice: props.oldPrice,
        newPrice: props.newPrice,
        discount: props.discount,
        rated: props.rated,
        rating: props.rating,
        index: props.index,
        quantity: props.quantity,
        outOfStockIndicator: props.outOfStockIndicator,
        productGroup: props.productGroup
    }
    return (
        <View style={styles.catagoryBox}>
            <TouchableOpacity onPress={() => navigation.navigate("singleProduct", singleProductPayload, props.id)}>
                <View style={style.spaceBetween}>
                    <MaterialCommunityIcons
                        onPress={() => !props.favourite ? props.markedAsFavouriteOrWishList(props.index, "favourite", props.productGroup, payload, props.id) : props.removeFromFavouriteOrWishList(props.index, "favourite", props.productGroup, payload, props.id)}
                        name={props.favourite ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color="#CC1100"
                    />
                    <Icon
                        onPress={() => !props.wishList ? props.markedAsFavouriteOrWishList(props.index, "wishList", props.productGroup, payload, props.id) : props.removeFromFavouriteOrWishList(props.index, "wishList", props.productGroup, payload, props.id)}
                        style={{ marginTop: 2 }}
                        name={props.wishList ? "heart" : "hearto"}
                        size={17}
                        color="#CC1100"
                    />
                </View>
                <Image
                    source={{ uri: props.url }}
                    style={{ width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center' }}
                />
                <View>
                    <Text style={styles.catagoryLabel}>{props.title}</Text>
                    {props.oldPrice > 0 ?
                        <Text style={[style.h4, { textDecorationLine: 'line-through' }]}>Rs{props.oldPrice}</Text>
                        : null
                    }
                    <View style={[style.spaceBetween, { marginVertical: 5 }]}>
                        <Text style={[style.primaryColor, style.bold, style.h3]}>Rs{props.newPrice}</Text>
                        {props.discount > 0 ?
                            <Text style={[style.primaryColor, style.primaryBackgroundColor, style.secondaryColor, style.pb_m, style.pt_m, style.pl_m, style.pr_m, style.bold, style.h5]}>{props.discount}% off</Text>
                            : null
                        }
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => props.quantity > 0 ? props.addToCart(payload, props.id) : props.outOfStockIndicator()}
                    style={[styles.cartBtn, style.mt_m, style.primaryBackgroundColor]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                        {props.quantity > 0 ?
                            <MaterialIcons
                                name="add-shopping-cart"
                                size={17}
                                color="white"
                            />
                            : null
                        }
                        <Text style={[style.h4, style.bold, style.ml_m, style.center, style.secondaryColor]}>Add To Cart</Text>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    catagoryBox: {
        flexBasis: "45%",
        marginLeft: "2.5%",
        marginVertical: 10,
        backgroundColor: 'white',
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        alignSelf: 'flex-start',
        shadowColor: 'green',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: {
            width: 6,
            height: 6
        }
    },
    catagoryLabel: {
        fontSize: 12,
        height: 30,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    cartBtn: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'center',
        marginTop: 10,
    }
})
export default product;