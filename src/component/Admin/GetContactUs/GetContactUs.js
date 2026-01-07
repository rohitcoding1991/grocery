import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import { useRoute } from '@react-navigation/native';
import Product from '../Product/Product';
import { Title, Caption } from 'react-native-paper';
const relatedCatagory = props => {
    const route = useRoute();
    let bestFood = '';
    const params = route.params;
    let title = params.catagory.split(' ');

    useEffect(() => {
        setLoading(false)
    }, [])

    let [contactUs, setcontactUs] = useState([]);
    let [loading, setLoading] = useState(true);
    bestFood = contactUs.map((c, i) => {
        return (
            <View>
                <Title>{c.name}</Title>
                <Caption>{c.email}</Caption>
                <Text>{c.Message}</Text>
            </View>
        )
    });
    return (
        <View style={[style.base]}>
            <Header title={params.catagory} />
            {!loading ?
                contactUs.length > 0 ?
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