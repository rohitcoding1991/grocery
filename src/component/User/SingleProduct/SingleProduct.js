import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { setproductRating } from '../../Helper/Helper';
import CustomModal from '../../Modal/Modal';

const singleProduct = props => {
    const route = useRoute();
    const productData = route.params;
    console.log(productData.rating);
    let [flag, setFlag] = useState({
        favourite: productData.favourite,
        wishList: productData.wishList,
        rated: productData.rated,
        rating: productData.rating
    });
    const changeWishListOrFavouriteFlagStatus = (type) => {
        if (type == 'favourite') {
            !flag.favourite ? productData.markedAsFavouriteOrWishList(productData.index, "favourite", productData.productGroup, payload, productData.id) : productData.removeFromFavouriteOrWishList(productData.index, "favourite", productData.productGroup, payload, productData.id)
            let data = { ...flag }
            data.favourite = !flag.favourite;
            setFlag(flag = data);
        } else if (type == "wishList") {
            !flag.wishList ? productData.markedAsFavouriteOrWishList(productData.index, "wishList", productData.productGroup, payload, productData.id) : productData.removeFromFavouriteOrWishList(productData.index, "wishList", productData.productGroup, payload, productData.id)
            let data = { ...flag }
            data.wishList = !flag.wishList;
            setFlag(flag = data);
        }
    }
    const ratingCompleted = (rating) => {
        const obj = {
            rating: rating
        }
        let data = { ...flag }
        data.rated = true;
        data.rating = rating;
        setFlag(flag = data);
        setproductRating(productData.uid, productData.id.toString(), obj);
        productData.changeRatingFlag(productData.index);
        setModalState(true)
        setTimeout(() => {
            setModalState(false)
        }, 2000);
    }
    let [modalState, setModalState] = React.useState(false);
    const payload = {
        url: productData.url,
        title: productData.title,
        oldPrice: productData.oldPrice,
        newPrice: productData.newPrice,
        discount: productData.discount,
        productQuantity: productData.quantity
    }
    return (
        <View style={style.base}>
            <Header
                title="Product Detail"
                type="singleProduct"
            />
            {modalState ?
                <CustomModal
                    status={modalState}
                    label="Thanks for your Rating"
                />
                : null
            }
            <View style={styles.catagoryBox}>
                <View style={style.spaceBetween}>
                    <MaterialCommunityIcons
                        onPress={() => changeWishListOrFavouriteFlagStatus("favourite")}
                        name={flag.favourite ? "bookmark" : "bookmark-outline"}
                        size={23}
                        color="#CC1100"
                    />
                    <Icon
                        onPress={() => changeWishListOrFavouriteFlagStatus("wishList")}
                        name={flag.wishList ? "heart" : "hearto"}
                        size={18}
                        color="#CC1100"
                    />
                </View>
                <Image
                    source={{ uri: productData.url }}
                    style={{ width: "100%", height: "68%", resizeMode: "contain" }}
                />
                <View>
                    <Text style={styles.catagoryLabel}>{productData.title}</Text>
                    <View style={style.spaceBetween}>
                        <Text style={[style.h3, { textDecorationLine: 'line-through' }]}>Rs{productData.oldPrice}</Text>
                        <Rating
                            type='custom'
                            readonly={flag.rated ? true : false}
                            ratingCount={5}
                            ratingTextColor="#CC1100"
                            ratingColor="#CC1100"
                            imageSize={18}
                            startingValue={flag.rating}
                            onFinishRating={(rating) => ratingCompleted(rating)}
                        />
                    </View>
                    <View style={[style.spaceBetween, { marginVertical: 5 }]}>
                        <Text style={[style.primaryColor, style.bold, style.h2]}>Rs{productData.newPrice}</Text>
                        <Text style={[style.primaryColor, style.primaryBackgroundColor, style.secondaryColor, style.mb, { padding: 5 }, style.bold, style.h3]}>{productData.discount}% off</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => productData.quantity > 0 ? productData.addToCart(payload, productData.id) : productData.outOfStockIndicator}
                    style={[styles.cartBtn, style.primaryBackgroundColor]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                        {productData.quantity > 0 ?
                            <MaterialIcons
                                name="add-shopping-cart"
                                size={20}
                                color="white"
                            />
                            : null
                        }
                        <Text style={[style.h3, style.bold, style.ml_m, style.center, style.secondaryColor]}>{productData.quantity > 0 ? "Add To Cart" : "Out Of Stock"}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    catagoryBox: {
        marginVertical: 10,
        backgroundColor: 'white',
        padding: 10,
    },
    catagoryLabel: {
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    cartBtn: {
        paddingVertical: 11,
        alignSelf: 'center',
        paddingHorizontal: 15,
    }
})
export default singleProduct;