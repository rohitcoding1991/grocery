import React from 'react';
import { View, Text, Image } from 'react-native';
import { style } from '../../Global/Global';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const productData = props => {
    const navigation = useNavigation();
    let payload = null;
    if (props.screenType == 'catagory') {
        payload = {
            title: "Update Catagory",
            id: props.id,
            index: props.index,
            update: true,
            label: props.title,
            imageUrl: props.url,
            updateCatagory: props.updateCatagory,
            screenType: props.screenType
        }
    } else {
        payload = {
            title: "Update Product",
            id: props.id,
            index: props.index,
            update: true,
            label: props.title,
            quantity: props.quantity,
            cid: props.cid,
            productCatagory: props.productCatagory,
            imageUrl: props.url,
            oldPrice: props.oldPrice,
            newPrice: props.newPrice,
            updateProduct: props.updateProduct,
            screenType: props.screenType
        }
    }
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f2f2f2', paddingBottom: 3 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center' }}>
                <Image
                    source={{ uri: props.url }}
                    style={{ width: 60, height: 60, resizeMode: "contain" }}
                />
                <Text style={[style.h3, style.center, style.ml, style.bold]}>{props.title}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                    onPress={() => navigation.navigate("CRUDProduct", payload)}
                    name="edit"
                    size={19}
                    color="black"
                    style={[style.mr]}
                />
                <Icon
                    onPress={() => props.deleteProduct(props.index, props.id, props.url)}
                    name="delete"
                    size={19}
                    color="#CC1100"
                    style={[style.mr]}
                />
            </View>
        </View>
    )
}

export default productData;