import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { style } from '../../../component/Global/Global';
import Header from '../../../component/Header/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartItem from '../../../component/User/CartItem/CartItem';
import CustomModal from '../../../component/Modal/Modal';
import { f } from '../../../component/Config/Config';
import {
    getTableRelatedData,
    getUserCheckOutInfo,
    removeFromCart,
    plusCartQuantity,
    minusCartQuantity,
    clearCartForUser
} from "../../../component/Helper/Helper";
import { ActivityIndicator } from 'react-native-paper';
export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            cartItems: [],
            userInfo: {},
            loading: true,
            modal: false,
            label: ''
        };
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
    }
    componentDidMount() {
        this.setState({ userId: f.auth().currentUser.uid }, async () => {
            let cartItem = await getTableRelatedData(this.state.userId, "cart");
            let userInfo = await getUserCheckOutInfo(this.state.userId);
            this.setState({ loading: false, cartItems: cartItem, userInfo: userInfo });
            this.props.navigation.addListener('focus', async () => {
                let cartItem = await getTableRelatedData(this.state.userId, "cart");
                this.setState({ loading: false, cartItems: cartItem, });
            });
        });
    }
    clearCartHandler = () => {
        Alert.alert(
            "Clearing Cart!",
            "Are you really wanna empty the cart?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Empty", onPress: () => {
                        clearCartForUser(this.state.userId);
                        this.setState({ cartItems: [] });
                    }
                }
            ],
            { cancelable: true }
        );
    }
    addQuantityHandler = (index, id) => {
        let data = this.state.cartItems;
        plusCartQuantity(this.state.userId, id);
        data[index].quantity += 1;
        this.setState({ cartItems: data })
    }

    outOfStockIndicatorHandler = () => {
        this.setState({ modal: true, label: 'Product Item limit reached' });
        this.closeModalHander();
    }

    subtractQuantityHandler = async (index, id) => {
        await minusCartQuantity(this.state.userId, id);
        let data = this.state.cartItems;
        data[index].quantity -= 1;
        if (data[index].quantity < 1) {
            data[index].quantity = 1;
        }
        this.setState({ cartItems: data });
    }
    warningOnRemovingItemFromCartHandler = (index, id) => {
        Alert.alert(
            "Removing Item!",
            "Are you really wanna remove this item from cart?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Remove", onPress: () => this.removeItemFromCartHandler(index, id) }
            ],
            { cancelable: true }
        );
    }
    removeItemFromCartHandler = (index, id) => {
        let data = this.state.cartItems;
        data.splice(index, 1);
        removeFromCart(id, this.state.userId);
        this.setState({ modal: true, label: 'Item Removed', cartItems: data });
        setTimeout(() => {
            this.setState({ modal: false, label: '' });
        }, 2000);
    }

    closeModalHander = () => {
        setTimeout(() => {
            this.setState({ modal: false, label: '' });
        }, 3000);
    }
    closeModalImmediately = () => {
        this.setState({ modal: false, label: '' });
    }
    render() {
        const payload = {
            uid: this.state.userId,
            cart: this.state.cartItems,
            userInfo: this.state.userInfo
        }
        let cartData = this.state.cartItems;
        let cartItem = '';
        let grandTotal = 0;
        let totalBill = 0;
        let totalDisquantity = 0;
        cartItem = cartData.map((c, i) => {
            let discount = Math.floor((100 - ((c.price / c.oldPrice) * 100)).toFixed(0));
            totalBill += (c.oldPrice * c.quantity);
            grandTotal += (c.price * c.quantity);
            totalDisquantity += (c.oldPrice - c.price) * c.quantity;
            return (
                <CartItem
                    type="cart"
                    subtractQuantity={this.subtractQuantityHandler}
                    addQuantity={this.addQuantityHandler}
                    warningOnRemovingItemFromCart={this.warningOnRemovingItemFromCartHandler}
                    key={i}
                    index={i}
                    id={c.id}
                    discount={discount}
                    outOfStockIndicator={this.outOfStockIndicatorHandler}
                    url={c.url}
                    oldPrice={c.oldPrice * c.quantity}
                    singlePrice={c.price}
                    productQuantity={c.productQuantity}
                    price={c.price * c.quantity}
                    title={c.title}
                    quantity={c.quantity}
                />
            )
        });

        return (
            <View style={[style.base]}>
                <Header
                    title={!this.state.loading && this.state.cartItems.length != 0 ?
                        "Checkout To Proceed"
                        : "Your cart is empty"
                    }
                    type="cart"
                    clearCartIconStatus={this.state.cartItems.length > 0 ? true : false}
                    clearCart={this.clearCartHandler}
                />
                {this.state.modal ?
                    <CustomModal
                        status={this.state.modal}
                        label={this.state.label}
                        closeModal={this.closeModalImmediately}
                    />
                    : null
                }
                {
                    this.state.loading ?
                        <ActivityIndicator size="small" color="#CC1100" style={{ flex: 1, justifyContent: 'center' }} />
                        :
                        this.state.cartItems.length === 0 ?
                            <View style={[style.base, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    source={require("../../../assets/images/cartempty.png")}
                                    style={{ width: this.width / 1, height: this.height / 3, resizeMode: 'contain' }}
                                />
                            </View>
                            :
                            <ScrollView>
                                <View>
                                    <ScrollView
                                        style={{ height: this.height / 1.65 }}
                                        removeClippedSubviews={true}
                                        bouncesZoom={true}
                                        bounces={true}
                                    >
                                        {cartItem}
                                    </ScrollView>
                                    <View style={[styles.grandTotal, style.m]}>
                                        <View style={[style.spaceBetween]}>
                                            <Text style={[style.h3, style.mt, style.bold]}>Total</Text>
                                            <Text style={[style.mr, style.h4, style.bold, style.mt]}>Rs{totalBill}</Text>
                                        </View>
                                        <View style={[style.spaceBetween, { borderBottomWidth: 1, paddingVertical: 4, borderColor: "#f1f1f1" }]}>
                                            <Text style={[style.h3, style.mt, style.bold, { color: '#CC1100' }]}>Discount</Text>
                                            <Text style={[style.mr, style.h4, style.bold, style.mt, { color: '#CC1100', textDecorationLine: 'line-through' }]}>Rs{totalDisquantity}</Text>
                                        </View>
                                        <View style={[style.spaceBetween]}>
                                            <Text style={[style.h2, style.mt, style.bold]}>Grand Total</Text>
                                            <Text style={[style.mr, style.h3, style.bold, style.mt]}>Rs{grandTotal}</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate("checkout", payload)}
                                            style={[styles.checkoutBtn, style.primaryBackgroundColor]}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                                <Text style={[style.h3, style.bold, style.mr, style.center, style.secondaryColor]}>Checkout</Text>
                                                <MaterialCommunityIcons
                                                    name="cart-arrow-right"
                                                    size={20}
                                                    color="white"
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
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
    grandTotal: {
        justifyContent: 'flex-end',
        padding: 5,
        paddingVertical: 2,
        borderTopWidth: 1,
        borderColor: 'lightgrey',
        alignContent: 'center'
    },
    checkoutBtn: {
        alignSelf: 'center',
        marginVertical: 10,
        paddingHorizontal: 24,
        paddingVertical: 10,
    }
})
