import React, { Component } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import Header from '../../../component/Header/Header';
import { style } from "../../../component/Global/Global";
import { getAllProducts } from '../../../component/Helper/Helper';
import { DataTable, ActivityIndicator } from 'react-native-paper'


export default class Product extends Component {
    constructor(item) {
        super(item);
        this.state = {
            products: [],
            loading: true,
            refreshing: false
        };
    }
    componentDidMount() {
        this.getProducts();
    }

    getProducts = async () => {
        this.setState({ refreshing: true })
        let data = null;
        data = await getAllProducts();
        this.setState({ products: data, loading: false, refreshing: false })
    }

    emptyList = () => {
        return (
            <View style={{ flex: 1, marginTop: "70%", justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={[style.bold, style.h3]}>No Product Found</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={style.base}>
                <Header
                    title="Available Products"
                    type="product"
                />
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Image</DataTable.Title>
                        <DataTable.Title>Title</DataTable.Title>
                        <DataTable.Title numeric>quantity</DataTable.Title>
                        <DataTable.Title numeric>Old Price</DataTable.Title>
                        <DataTable.Title numeric>New Price</DataTable.Title>
                    </DataTable.Header>
                </DataTable>
                {this.state.loading ?
                    <ActivityIndicator size="small" color="#CC1100" style={{ flex: 1, justifyContent: 'center', }} />
                    :
                    <FlatList
                        data={this.state.products}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={this.getProducts}
                        ListEmptyComponent={this.emptyList}
                        renderItem={({ item, index }) =>
                            <DataTable.Row>
                                <DataTable.Cell>
                                    <Image
                                        source={{ uri: item.url }}
                                        style={{ margin: 0, padding: 0, width: 50, height: 50, resizeMode: "contain" }}
                                    />
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <Text style={[style.h3, style.center, style.ml, style.bold]}>{item.title}{item.title}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.oldPrice}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.newPrice}</DataTable.Cell>
                            </DataTable.Row>
                        }
                    />
                }
            </View>
        );
    }
}
