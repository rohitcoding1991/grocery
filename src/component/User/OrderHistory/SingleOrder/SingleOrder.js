import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { style } from '../../../Global/Global';
import SingleRow from '../SingleRow/SingleRow';

const singleOrder = props => {
    let singleRow = '';
    let rowData = [];
    let keys = [];
    for (let orderId in props.data) {
        keys.push(orderId);
        rowData.push(props.data[orderId]);
    }

    singleRow = rowData.map((row, i) => {
        return (
            <SingleRow orderId={keys[i]} data={row} index={props.index} />
        )
    })
    return (
        <View style={style.base}>
            <View style={styles.catagoryBox}>
                {singleRow}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    catagoryBox: {
        marginVertical: 10,
        backgroundColor: 'white',
        padding: 10,
    },
    catagoryLabel: {
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    cartBtn: {
        paddingVertical: 11,
        width: "50%",
        marginHorizontal: "25%",
    }
})
export default singleOrder;