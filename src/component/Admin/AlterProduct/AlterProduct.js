import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import Header from '../../Header/Header';
import { style } from '../../Global/Global';
import { getProduct, removeProduct, updateProduct, addProduct, uniqueId } from '../../Helper/Helper';
import ProductData from '../ProductData/ProductData'
import Modal from '../../Modal/Modal';
import { f } from '../../Config/Config';

const product = props => {
    const userId = f.auth().currentUser.uid;
    let [product, setProduct] = useState([]);
    let [loading, setLoading] = useState(true);
    let [modal, setModal] = useState(false);
    let [label, setlabel] = useState('');
    let renderProduct = '';
    useEffect(() => {
        const getProductData = async () => {
            const data = await getProduct('product', userId);
            setProduct(data);
            setLoading(false)
        }
        getProductData();
    }, [])


    const deleteProductHandler = (index, id, url) => {
        removeProduct(id, url);
        product.splice(index, 1);
        setModal(true);
        setlabel('Product Deleted');
        setTimeout(() => {
            setModal(false)
            setlabel('')
        }, 2500);
    }

    const updateProductHandler = (index, id, url, obj) => {
        updateProduct(obj, url, id)
        product[index].url = obj.url;
        product[index].title = obj.title;
        setProduct(product)
        setModal(true);
        setlabel('Product Updated');
        setTimeout(() => {
            setModal(false)
            setlabel('');
        }, 2500);
    }


    const addProductHandler = (obj) => {
        const id = uniqueId();
        addProduct(obj, id)
        product.push(obj)
        setProduct(product)
        setModal(true)
        setlabel('Product Added');
        setTimeout(() => {
            setModal(false)
            setlabel('');
        }, 2500);
    }

    renderProduct = product.map((c, i) => {
        return (
            <ProductData
                deleteProduct={deleteProductHandler}
                updateProduct={updateProductHandler}
                addProduct={addProductHandler}
                key={i}
                id={c.id}
                cid={c.cid}
                quantity={c.quantity}
                productCatagory={c.cName}
                index={i}
                title={c.title}
                url={c.url}
                oldPrice={c.oldPrice}
                newPrice={c.newPrice}
                screenType="product"
            />
        )
    });

    return (
        <View style={style.base}>
            <Header
                title="Product"
                type="alterProduct"
                addProduct={addProductHandler}
                screenType='product'
            />
            {modal ?
                <Modal
                    status={modal}
                    label={label}
                />
                : null
            }
            {!loading ?
                product.length > 0 ?
                    <ScrollView>
                        <View style={styles.container}>
                            {renderProduct}
                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={[style.center]}>No product Found</Text>
                    </View>
                :
                <ActivityIndicator size="small" style={{ flex: 1, justifyContent: 'center' }} color="#CC1100" />
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        borderBottomColor: 'lightgrey',
    },
    title: {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
        fontWeight: '300'
    },
})

export default product;