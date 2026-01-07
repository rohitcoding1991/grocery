import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import { useRoute } from '@react-navigation/native';
import { getProductByCatagory } from '../../Helper/Helper';
import Product from '../Product/Product';
import Modal from '../../Modal/Modal';
import {
    addToWishList,
    addToFavourite,
    removeFromFavourite,
    removeFromWishList
} from '../../Helper/Helper';

const relatedCatagory = props => {
    const route = useRoute();
    let bestFood = '';
    const params = route.params;
    let title = params.catagory.split(' ');
    useEffect(() => {
        const getRelatedCatagoryData = async () => {
            const data = await getProductByCatagory(params.userId, params.cid);
            setCatagoryData(data);
            setLoading(false)
        }
        getRelatedCatagoryData();
    }, [])

    let [catagoryData, setCatagoryData] = useState([]);
    let [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [label, setLabel] = useState('');

    const clearModalIntervalHandler = () => {
        setTimeout(() => {
            setModal(false);
            setLabel('');
        }, 3000);
    }

    const markedAsFavouriteOrWishListHandler = async (index, type, group, obj, id) => {
        let productGroup = catagoryData;
        if (type == "wishList") {
            addToWishList(obj, id.toString(), params.userId);
            productGroup[index].wishList = true;
            setCatagoryData(productGroup);
            setModal(true);
            setLabel('Added To Wishlist')

        } else if (type == "favourite") {
            addToFavourite(obj, id.toString(), params.userId);
            productGroup[index].favourite = true;
            setCatagoryData(productGroup);
            setModal(true);
            setLabel('Marked as Favourite')
        }
        clearModalIntervalHandler();
    }

    const removeFromFavouriteOrWishListHandler = async (index, type, group, obj, id) => {
        let productGroup = catagoryData;
        if (type == "wishList") {
            removeFromWishList(id.toString(), params.userId);
            productGroup[index].wishList = false;
            setCatagoryData(productGroup);
            setModal(true);
            setLabel('Removed from Wishlist')
        } else if (type == "favourite") {
            removeFromFavourite(id.toString(), params.userId);
            productGroup[index].favourite = false;
            setCatagoryData(productGroup);
            setModal(true);
            setLabel('Removed from Favourite')
        }
        clearModalIntervalHandler();
    }
    bestFood = catagoryData.map((p, i) => {
        let discount = Math.floor((100 - ((p.newPrice / p.oldPrice) * 100)).toFixed(0));
        return (
            <Product
                key={i}
                index={i}
                productGroup="products"
                id={p.id}
                url={p.url}
                favourite={p.favourite}
                wishList={p.wishList}
                oldPrice={p.oldPrice}
                discount={discount}
                newPrice={p.newPrice}
                quantity={p.quantity}
                title={p.title}
                uid={params.userId}
                rated={p.rated}
                rating={p.rating}
                addToCart={params.addToCart}
                markedAsFavouriteOrWishList={markedAsFavouriteOrWishListHandler}
                removeFromFavouriteOrWishList={removeFromFavouriteOrWishListHandler}
                changeRatingFlag={params.changeRatingFlag}
                outOfStockIndicator={params.outOfStockIndicator}
            />
        )
    });
    return (
        <View style={[style.base]}>
            <Header title={params.catagory} />
            {modal ?
                <Modal
                    status={modal}
                    label={label}
                />
                : null
            }
            {!loading ?
                catagoryData.length > 0 ?
                    <ScrollView>
                        <View style={[style.m, style.p]}>
                            <Text style={[style.h1, style.primaryColor, style.pb_m, styles.title, title.length == 1 && title[0].length <= 6 ? { width: 50 } : title.length == 1 && title[0].length <= 9 ? { width: 70 } : { width: 95 }]}>{params.catagory}</Text>
                        </View>
                        <View style={styles.popularFoodContainer}>
                            {bestFood}
                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={[style.center]}>No {params.catagory} related Item Found</Text>
                    </View>
                :
                <ActivityIndicator size="small" style={{ flex: 1, justifyContent: 'center' }} color="#CC1100" />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    popularFoodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomColor: 'lightgrey',
    },
    title: {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        fontWeight: '300'
    },
})
export default relatedCatagory;