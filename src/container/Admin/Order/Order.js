import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import Header from '../../../component/Header/Header';
import { style } from "../../../component/Global/Global";
import { DataTable } from 'react-native-paper'
import { getPendingOrders }
    from '../../../component/Helper/Helper';



export default class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: true,
            refreshing: false
        };
    }
    componentDidMount() {
        this.getOrders();
    }

    getOrders = async () => {
        this.setState({ refreshing: true })
        let data = null;
        data = await getPendingOrders();
        this.setState({ orders: data, loading: false, refreshing: false });
    }

    emptyList = () => {
        return (
            <View style={{ flex: 1, marginTop: "70%", justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={[style.bold, style.h3]}>No Order Found</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={style.base}>
                <Header
                    title="Deal with your Pending Orders"
                    type="order"
                />
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>OrderID</DataTable.Title>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title numeric>Date</DataTable.Title>
                        <DataTable.Title numeric>Status</DataTable.Title>
                        <DataTable.Title numeric>Total</DataTable.Title>
                    </DataTable.Header>
                </DataTable>
                {this.state.loading ?
                    <ActivityIndicator size="small" color="#CC1100" style={{ flex: 1, justifyContent: 'center', }} />
                    :
                    <FlatList
                        data={this.state.orders}
                        keyExtractor={(item, index) => index.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={this.getOrders}
                        ListEmptyComponent={this.emptyList}
                        renderItem={({ item, index }) =>
                            <DataTable.Row>
                                <DataTable.Cell numeric>{item.id}</DataTable.Cell>
                                <DataTable.Cell>
                                    <Text style={[style.h3, style.center, style.ml, style.bold]}>{item.title}{item.userName}</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>{item.date}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.status}</DataTable.Cell>
                                <DataTable.Cell numeric>{item.total}</DataTable.Cell>
                            </DataTable.Row>
                        }
                    />
                }
            </View>
        );
    }
}
