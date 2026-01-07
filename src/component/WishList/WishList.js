import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { style } from '../Global/Global';
import Header from '../Header/Header';
import CartItem from '../User/CartItem/CartItem';
import {
    removeFromWishList,
    removeFromFavourite,
    getTableRelatedData
} from '../Helper/Helper';
import { ActivityIndicator } from 'react-native-paper'
import { f } from '../Config/Config';


export default class WishList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favouriteOrWishListItems: [],
            loading: true,
            userId: ''
        };
    }

    componentDidMount() {
        this.setState({ userId: f.auth().currentUser.uid }, async () => {
            let params = this.props.route.params;
            let type = params.type;
            if (type == 'wishList') {
                type = "wishlist"
            }
            if (params) {
                const items = await getTableRelatedData(this.state.userId, type);
                this.setState({ loading: false, favouriteOrWishListItems: items });
            }
        });
    }

    removeFromWishListHandler = (index, id) => {

        removeFromWishList(id, this.state.userId)
        let data = this.state.favouriteOrWishListItems;
        data.splice(index, 1);
        this.setState({ favouriteOrWishListItems: data })
    }

    removeFavouriteHandler = (index, id) => {

        removeFromFavourite(id, this.state.userId)
        let data = this.state.favouriteOrWishListItems;
        data.splice(index, 1);
        this.setState({ favouriteOrWishListItems: data })
    }
    render() {
        let type = '';
        let params = this.props.route.params;
        if (params) {
            type = params.type;
        }
        let cartData = this.state.favouriteOrWishListItems;
        let output = '';
        output = cartData.map((c, i) => {
            return (
                <CartItem
                    type={type}
                    key={i}
                    index={i}
                    id={c.id}
                    url={c.url}
                    singlePrice={c.price}
                    oldPrice={c.oldPrice}
                    discount={c.discount}
                    title={c.title}
                    quantity={c.quantity}
                    removeFromWishList={this.removeFromWishListHandler}
                    removeFromFavourite={this.removeFavouriteHandler}
                />
            )
        });
        return (
            <View style={[style.base]}>
                <Header
                    title={type == "wishList" ? "Wish List" : "Favourite"}
                    type="items"
                />
                {
                    this.state.loading ?
                        <ActivityIndicator size="small" color="#CC1100" style={{ flex: 1, justifyContent: 'center' }} />
                        :
                        this.state.favouriteOrWishListItems.length === 0 ?
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                {type == 'wishList' ?
                                    <Text style={[style.center]}>Wish List is empty</Text>
                                    :
                                    <Text style={[style.center]}>No Favourite Item Found</Text>
                                }
                            </View>
                            :
                            <ScrollView
                                removeClippedSubviews={true}
                                bouncesZoom={true}
                                bounces={true}
                            >
                                <View style={styles.container}>
                                    {output}
                                </View>
                            </ScrollView>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerBox: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 10,
        padding: 5,
        borderWidth: 1,
        borderColor: 'lightgrey'
    },
})
