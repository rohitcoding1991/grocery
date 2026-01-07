import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import SingleOrder from './SingleOrder/SingleOrder';
import { f, database } from '../../Config/Config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
const orderHistory = props => {
    const navigation = useNavigation();
    const userId = f.auth().currentUser.uid;
    let orderHistory = '';
    let [orderData, setorderData] = useState([]);
    let [loading, setLoading] = useState(true);
    let posted, status;
    useEffect(() => {
        let orderContainer = [];
        const orders = async () => {
            await database.ref('order').child(userId).once('value').then(async snapshot => {
                if (snapshot.exists()) {
                    let data = await snapshot.val();
                    for (let d in data) {
                        let orderData = [];
                        await database.ref('order').child(userId).child(d).orderByChild('posted').once('value').then(async sn => {
                            if (sn.exists()) {
                                let data = await sn.val().orderInfo;
                                for (let o in data) {
                                    await database.ref('order').child(userId).child(d).child('orderInfo').child(o).once('value').then(async snap => {
                                        if (snap.exists()) {
                                            let data = await snap.val();
                                            orderData.push({
                                                orderId: d,
                                                pId: data.id,
                                                price: data.price,
                                                quantity: data.quantity,
                                                url: data.url,
                                                title: data.title,
                                                status: sn.val().status,
                                                posted: sn.val().posted
                                            })
                                        }
                                    });
                                }
                            }
                            status = sn.val().status;
                            posted = sn.val().posted;
                        });
                        orderContainer.push({
                            [d]: orderData
                        });
                    }
                }
                setorderData(orderContainer);
                setLoading(false)
                return orderData;
            }).catch(err => console.log(err));
        }
        //orderData = orders();
        orders();
    }, [])

    orderHistory = orderData.map((data, i) => {
        return (
            <SingleOrder key={i} data={data} index={i} />
        )
    });
    return (
        <View style={[style.base]}>
            <Header title="Your Orders" />
            {!loading ?
                orderData.length > 0 ?
                    <ScrollView>
                        <View style={{ marginTop: 10, padding: 10 }}>
                            <Text style={[style.h1, style.primaryColor, styles.title, { width: 120 }]}>Order History</Text>
                        </View>
                        <View style={styles.orderHistoryContainer}>
                            {orderHistory}
                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={[style.center]}>You have'nt order anything yet</Text>
                        <TouchableOpacity onPress={() => navigation.replace("Home")}>
                            <Text style={[style.center, style.h1, style.mt, style.mb]}>Order Now</Text>
                        </TouchableOpacity>
                    </View>
                :
                <ActivityIndicator size="small" style={{ flex: 1, justifyContent: 'center' }} color="#CC1100" />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    orderHistoryContainer: {
        borderBottomColor: 'lightgrey',
    },
    title: {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        fontWeight: '300'
    },
})
export default orderHistory;