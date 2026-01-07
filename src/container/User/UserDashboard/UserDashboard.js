import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, StatusBar } from 'react-native';
import Header from '../../../component/Header/Header';
import { style } from '../../../component/Global/Global';
import Product from '../../../component/User/Product/Product';
import Catagory from '../../../component/User/Catagory/Catagory';
import CustomModal from '../../../component/Modal/Modal';
import { f, database } from '../../../component/Config/Config';
import {
    addToCart,
    removeFromCart,
    addToWishList,
    removeFromWishList,
    addToFavourite,
    removeFromFavourite,
    checkFavouriteItemExistance,
    checkWishListItemExistance,
    checkUserRatingExistance,
    getRatingOnProduct,
    getCatagory
}
    from '../../../component/Helper/Helper';
import { ActivityIndicator } from 'react-native-paper';

export default class UserDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            userId: '',
            catagoryLoading: true,
            catagories: [],
            products: [],
            modal: false,
            label: ''
        };
    }
    componentDidMount() {
        StatusBar.setBackgroundColor("#CC1100");
        this.setState({ userId: f.auth().currentUser.uid }, async () => {
            let catagories = await getCatagory();
            let product = [];
            const userId = this.state.userId;
            const tableName = 'product';
            let favourite = false;
            let wishList = false;
            let rated = false;
            let rating = 0;
            database.ref(tableName).once('value').then(async snapshot => {
                let exist = (snapshot.val() !== null);
                if (exist) {
                    let data = snapshot.val();
                    for (let d in data) {
                        if (data[d] != null) {
                            wishList = await checkWishListItemExistance(userId, d);
                            favourite = await checkFavouriteItemExistance(userId, d);
                            rated = await checkUserRatingExistance(userId, d);
                            rating = await getRatingOnProduct(d);
                            if (isNaN(rating)) {
                                rating = 0;
                            }
                            product.push({
                                id: d,
                                cid: data[d].cid,
                                url: data[d].url,
                                oldPrice: data[d].oldPrice,
                                newPrice: data[d].newPrice,
                                quantity: data[d].quantity,
                                title: data[d].title,
                                favourite: favourite,
                                wishList: wishList,
                                rating: rating,
                                rated: rated
                            });
                            this.setState({ products: product })
                        }
                    }
                }
            }).catch(err => console.log(err));
            this.setState({ catagoryLoading: false, loading: false, catagories: catagories });
        });
    }
    closeModalHandler = () => {
        setTimeout(() => {
            this.setState({ modal: false, label: '' });
        }, 3000);
    }
    clearModalIntervalHandler = () => {
        setTimeout(() => {
            this.setState({ modal: false, label: '' });
        }, 3500);
    }
    addToCartHandler = (obj, id) => {
        let payload = obj;
        const userId = this.state.userId;
        payload.quantity = 1;
        database.ref('cart').child(userId).child(id).once('value').then(sn => {
            if (sn.exists()) {
                let data = sn.val();
                if (data.quantity < payload.productQuantity) {
                    addToCart(payload, id.toString(), userId);
                    this.setState({ modal: true, label: 'Item Added Successfully' });
                    this.clearModalIntervalHandler();
                } else {
                    this.setState({ modal: true, label: 'Sorry! Item Quantity limit Exceeded' });
                    this.clearModalIntervalHandler();
                }
            } else {
                addToCart(payload, id.toString(), userId);
                this.setState({ modal: true, label: 'Item Added Successfully' });
                this.clearModalIntervalHandler();
            }
        }).catch((e) => {
            this.setState({ modal: true, label: e.message });
            this.clearModalIntervalHandler();
        })
    }
    removeFromCartHandler = (id) => {
        removeFromCart(id.toString(), this.state.userId);
        this.setState({ modal: true, label: 'Item Removed Successfully' });
        this.clearModalIntervalHandler();
    }
    markedAsFavouriteOrWishListHandler = async (index, type, group, obj, id) => {
        let productGroup = '';
        switch (group) {
            case "products":
                productGroup = this.state.products
                break;
            case "bestSelling":
                productGroup = this.state.bestSelling
                break;
            case "popular":
                productGroup = this.state.popular
                break;
            default:
                break;
        }
        if (type == "wishList") {
            addToWishList(obj, id.toString(), this.state.userId);
            productGroup[index].wishList = true;
            this.setState({ products: productGroup, modal: true, label: "Added To wishlist " });
        } else if (type == "favourite") {
            addToFavourite(obj, id.toString(), this.state.userId);
            productGroup[index].favourite = true;
            this.setState({ products: productGroup, modal: true, label: "Marked as favourite " });
        }
        this.clearModalIntervalHandler();
    }

    removeFromFavouriteOrWishListHandler = async (index, type, group, obj, id) => {
        let productGroup = '';
        switch (group) {
            case "products":
                productGroup = this.state.products
                break;
            case "bestSelling":
                productGroup = this.state.bestSelling
                break;
            case "popular":
                productGroup = this.state.popular
                break;
            default:
                break;
        }
        if (type == "wishList") {
            removeFromWishList(id.toString(), this.state.userId);
            productGroup[index].wishList = false;
            this.setState({ products: productGroup, modal: true, label: "Removed from wishlist " });
        } else if (type == "favourite") {
            removeFromFavourite(id.toString(), this.state.userId);
            productGroup[index].favourite = false;
            this.setState({ products: productGroup, modal: true, label: "Removed from favourite " });
        }
        this.clearModalIntervalHandler();
    }

    outOfStockIndicatorHandler = () => {
        this.setState({ modal: true, label: "We're really sorry! This item is Out Of Stock" })
        this.closeModalHandler();
    }

    changeRatingFlagHandler = (index) => {
        let products = this.state.products;
        products[index].rated = true;
        this.setState({ products: products })
    }

    closeModalImmediately = () => {
        this.setState({ modal: false, label: '' });
    }


    render() {
        const products = this.state.products;
        let catagoriesData = this.state.catagories;
        let allProducts = <ActivityIndicator size="small" color="#CC1100" style={{ alignSelf: 'center' }} />;
        let catagories = '';
        allProducts = products.map((p, i) => {
            let discount = Math.floor((100 - ((p.newPrice / p.oldPrice) * 100)).toFixed(0));
            return (
                <Product
                    key={i}
                    index={i}
                    id={p.id}
                    productGroup="products"
                    markedAsFavouriteOrWishList={this.markedAsFavouriteOrWishListHandler}
                    removeFromFavouriteOrWishList={this.removeFromFavouriteOrWishListHandler}
                    changeRatingFlag={this.changeRatingFlagHandler}
                    addToCart={this.addToCartHandler}
                    id={p.id}
                    uid={this.state.userId}
                    url={p.url}
                    quantity={p.quantity}
                    rated={p.rated}
                    rating={p.rating}
                    oldPrice={p.oldPrice}
                    discount={discount}
                    wishList={p.wishList}
                    favourite={p.favourite}
                    newPrice={p.newPrice}
                    title={p.title}
                    outOfStockIndicator={this.outOfStockIndicatorHandler}
                />
            )
        });
        catagories = catagoriesData.map((c, i) => (
            <Catagory
                id={c.id}
                uid={this.state.userId}
                addToCart={this.addToCartHandler}
                markedAsFavouriteOrWishList={this.markedAsFavouriteOrWishListHandler}
                removeFromFavouriteOrWishList={this.removeFromFavouriteOrWishListHandler}
                changeRatingFlag={this.changeRatingFlagHandler}
                outOfStockIndicator={this.outOfStockIndicatorHandler}
                key={i}
                url={c.url}
                title={c.title} />
        ));
        return (
            <View style={style.base}>
                <Header
                    title="What would you like to order?"
                    type="dashboard"
                />
                {this.state.modal ?
                    <CustomModal
                        status={this.state.modal}
                        label={this.state.label}
                        closeModal={this.closeModalImmediately}
                    />
                    : null
                }
                <ScrollView nestedScrollEnabled={true}>
                    <View style={[style.m, style.p]}>
                        <Text style={[style.h1, style.primaryColor, style.pb_m, styles.title, { width: 93 }]}>Catagories</Text>
                    </View>
                    {this.state.catagoryLoading ?
                        <ActivityIndicator size="small" color="#CC1100" style={{ alignSelf: 'center' }} />
                        :
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}>
                            <View style={styles.catagoriesContainer}>
                                {catagories}
                            </View>
                        </ScrollView>
                    }
                    <View style={[style.m, style.p]}>
                        <Text style={[style.h1, style.primaryColor, style.pb_m, styles.title, { width: 100 }]}>All Products</Text>
                    </View>
                    {!this.state.loading ?
                        <View style={styles.foodContainer}>
                            {allProducts}
                        </View>
                        :
                        <ActivityIndicator
                            size="small"
                            color="#CC1100"
                            style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', marginTop: "50%" }} />
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    popularFoodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomColor: 'lightgrey',
    },
    foodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderBottomColor: 'lightgrey',
    },
    title: {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        fontWeight: '300'
    },
    catagoriesContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 7
    },

})
