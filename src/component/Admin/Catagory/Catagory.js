import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import Header from '../../Header/Header';
import { style } from '../../Global/Global';
import { getCatagory, removeCatagory, updateCatagory, addCatagory, uniqueId } from '../../Helper/Helper';
import ProductData from '../ProductData/ProductData'
import Modal from '../../Modal/Modal';

const catagory = props => {

    let [catagory, setCatagory] = useState([]);
    let [loading, setLoading] = useState(true);
    let [modal, setModal] = useState(false);
    let [label, setlabel] = useState('');
    let renderCatagory = '';
    useEffect(() => {
        const getCatagoryData = async () => {
            const data = await getCatagory();
            setCatagory(data);
            setLoading(false)
        }
        getCatagoryData()
    }, [])

    const deleteProductHandler = (index, id, url) => {
        removeCatagory(id)
        catagory.splice(index, 1);
        setModal(true);
        setlabel('Catagory Deleted');
        setTimeout(() => {
            setModal(false)
            setlabel('')
        }, 2500);
    }

    const updateCatagoryHandler = (index, id, url, obj) => {
        updateCatagory(obj, url, id)
        catagory[index].url = obj.url;
        catagory[index].title = obj.title;
        setCatagory(catagory)
        setModal(true);
        setlabel('Catagory Updated');
        setTimeout(() => {
            setModal(false)
            setlabel('');
        }, 2500);
    }


    const addCatagoryHandler = (obj) => {
        const id = uniqueId();
        addCatagory(obj, id);
        catagory.push(obj);
        setCatagory(catagory);
        setModal(true);
        setlabel('Catagory Added');
        setTimeout(() => {
            setModal(false)
            setlabel('');
        }, 2500);
    }

    renderCatagory = catagory.map((c, i) => {
        return (
            <ProductData
                deleteProduct={deleteProductHandler}
                updateCatagory={updateCatagoryHandler}
                addCatagory={addCatagoryHandler}
                key={i}
                id={c.cid}
                index={i}
                title={c.title}
                url={c.url}
                screenType="catagory"
            />
        )
    });

    return (
        <View style={style.base}>
            <Header
                title="Catagory"
                type="alterCatagory"
                addCatagory={addCatagoryHandler}
                screenType='catagory'
            />
            {modal ?
                <Modal
                    status={modal}
                    label={label}
                />
                : null
            }
            {!loading ?
                catagory.length > 0 ?
                    <ScrollView>
                        <View style={styles.container}>
                            {renderCatagory}
                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={[style.center]}>No catagory Found</Text>
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

export default catagory;