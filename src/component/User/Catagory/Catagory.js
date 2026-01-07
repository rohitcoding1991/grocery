import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { style } from '../../Global/Global';
import { useNavigation } from '@react-navigation/native';


const catagory = props => {
    let navigation = useNavigation();
    const payload = {
        userId: props.uid,
        cid: props.id,
        catagory: props.title,
        markedAsFavouriteOrWishList: props.markedAsFavouriteOrWishList,
        removeFromFavouriteOrWishList: props.removeFromFavouriteOrWishList,
        addToCart: props.addToCart,
        outOfStockIndicator: props.outOfStockIndicator
    }
    return (
        <View style={styles.catagories}>
            <TouchableOpacity onPress={() => navigation.navigate("relatedCatagory", payload)}>
                <View style={styles.innerCatagories}>
                    <Image
                        source={{ uri: props.url }}
                        style={{ width: 50, height: 50, resizeMode: "contain" }}
                    />
                </View>
                <Text style={[style.h3, style.center, style.mt_m, style.bold]}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    catagories: {
        marginLeft: 15,
    },
    innerCatagories: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        width: 75,
        height: 75,
        borderRadius: 75,
        borderColor: 'lightgrey'
    }
})
export default catagory;