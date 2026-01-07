import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Header from '../../../component/Header/Header';
import { style } from '../../../component/Global/Global';
import Section from '../../../component/Admin/Section/Section';
import AdminModal from '../../../component/Admin/AdminModal/AdminModal';
import {
    getTotalProducts,
    getNewArrival,
    lowStockProducts
} from '../../../component/Helper/Helper';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            totalProducts: 0,
            newArrival: 0,
            lowStock: 0,
            sales: 0,
            profit: 0,
            loading: true
        };
    }

    closeModalHandler = () => {
        this.setState({ modal: false });
    }

    async componentDidMount() {
        StatusBar.setBackgroundColor("#CC0011")
        const totalProducts = await getTotalProducts();
        const newArrival = await getNewArrival();
        const lowStock = await lowStockProducts();
        this.setState({
            totalProducts: totalProducts,
            newArrival: newArrival,
            lowStock: lowStock,
            loading: false
        });
    }
    render() {
        return (
            <View style={[style.base]}>
                <Header
                    title="Dashboard"
                    type="dashboard"
                />
                {this.state.modal ?
                    <AdminModal
                        status={this.state.modal}
                        label="test modal"
                        close={this.closeModalHandler}
                    />
                    : null
                }
                <ScrollView>
                    <View style={styles.container}>
                        <View style={[styles.sectionContainer]}>
                            <Section
                                title="Total Stock"
                                value={this.state.totalProducts}
                                type="Entypo"
                                name="list"
                                loading={this.state.loading}
                            />
                            <Section
                                title="New Arrival"
                                value={this.state.newArrival}
                                type="Entypo"
                                name="new"
                                loading={this.state.loading}
                            />
                        </View>
                        <View style={[styles.sectionContainer]}>
                            <Section
                                title="Low Stock"
                                value={this.state.lowStock}
                                type="AntDesign"
                                name="linechart"
                                loading={this.state.loading}
                            />
                        </View>
                        <View style={[styles.sectionContainer]}>
                            <Section
                                title="Sales"
                                value={this.state.sales}
                                type="AntDesign"
                                name="minus"
                                loading={this.state.loading}
                            />
                            <Section
                                title="Profit"
                                value={this.state.profit}
                                type="MaterialCommunityIcons"
                                name="coin"
                                loading={this.state.loading}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10
    },
    sectionContainer: {
        width: "90%",
        marginHorizontal: "5%",
        justifyContent: 'space-evenly'
    }
});
