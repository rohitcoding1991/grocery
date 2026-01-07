import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { style } from "../../../Global/Global";
import { useRoute } from "@react-navigation/native";
import Header from "../../../Header/Header";
import Input from '../../../Setting/Input/Input';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';
import { getCatagory } from '../../../Helper/Helper';
import { ActivityIndicator } from "react-native-paper";


const CRUDProduct = props => {
    const route = useRoute();
    const navigation = useNavigation();
    const checkNumber = /^-?\d+\.?\d*$/
    const params = route.params;
    let update = false;
    let imageUrl = '';
    let title = '';
    let screenType = '';
    let oldPrice, newPrice;
    let cid = params.cid;
    let label = '';
    let catagoryName = '';
    let quantity = '';
    let productCatagory = '';
    if (params) {
        catagoryName = params.catagoryName;
        productCatagory = params.productCatagory;
        screenType = params.screenType;
        title = params.title
        update = params.update
        label = params.label;
        quantity = params.quantity;
        imageUrl = params.imageUrl;
        oldPrice = params.oldPrice;
        newPrice = params.newPrice;
    }
    let [data, setData] = useState({
        title: update ? label : '',
        cid: update ? cid : '',
        catagoryName: update && screenType == 'product' ? productCatagory : '',
        oldprice: update ? oldPrice : '',
        newPrice: update ? newPrice : '',
        quantity: update ? quantity : '',
        url: update ? imageUrl : ''
    });
    let [catagory, setCatagory] = useState([]);
    let [loading, setLoading] = useState(true);

    const hideError = () => {
        setTimeout(() => {
            setErr('');
        }, 2500);
    }
    useEffect(() => {
        const catagoryData = async () => {
            let data = [];
            if (update) {
                data = await getCatagory();
                setCatagory(data);
                setLoading(false)
            } else {
                data = await getCatagory();
                setCatagory(data);
                setLoading(false)
            }
        }
        catagoryData();
    }, [])
    let catagoryPicker = null;
    if (!loading) {
        catagoryPicker = catagory.map((c, i) => {
            return (
                <Picker.Item key={i} label={c.title} value={c.cid} />
            )
        })
    }
    const uploadImage = () => {
        ImagePicker.openPicker({
            loadingLabelText: "Loading...",
            freeStyleCropEnabled: true,
            compressImageQuality: 0.5,
            showCropGuidelines: true,
            mediaType: 'photo',
            cropping: true
        }).then(res => {
            const obj = { ...data }
            obj.url = res.path;
            setData(data = obj)
        });
    }
    let [err, setErr] = useState('');
    const setField = (type, val) => {
        if (type == 'title') {
            const obj = { ...data }
            obj.title = val;
            setData(data = obj)
        } else if (type == "oldPrice") {
            const obj = { ...data }
            obj.oldprice = val;
            setData(data = obj)
        } else if (type == "newPrice") {
            const obj = { ...data }
            obj.newPrice = val;
            setData(data = obj)
        } else if (type == "quantity") {
            const obj = { ...data }
            obj.quantity = val;
            setData(data = obj)
        }
    }



    const saveCatagoryData = () => {
        if (data.url == undefined || data.url == '') {
            setErr("Please Upload Product Image");
            hideError();
            return;
        }
        if (!update && data.catagoryName == '') {
            const obj = { ...data }
            obj.catagoryName = catagory[Object.keys(catagory)[0]].title;
            obj.cid = catagory[Object.keys(catagory)[0]].cid
            setData(data = obj)
        }
        if (data.title == '') {
            setErr("Title must not be empty");
            hideError();
            return;
        }
        if (data.title.length < 3) {
            setErr("Title length must not be that short");
            hideError();
            return;
        }
        if (data.newPrice == '' && screenType != 'catagory') {
            setErr("Price of item must be defined");
            hideError();
            return;
        } else if (screenType != 'catagory' && (!checkNumber.test(data.newPrice) || !checkNumber.test(data.oldprice))) {
            setErr("Price must be a number");
            hideError();
            return;
        } else if (data.oldprice != '' && data.newPrice >= data.oldprice && screenType != 'catagory') {
            setErr("New Price must be less than Old Price");
            hideError();
            return;
        }
        if (!checkNumber.test(data.quantity) && screenType != 'catagory') {
            setErr("Quantity Must be a number");
            hideError();
            return;
        } else if (data.quantity < 1 && screenType != 'catagory') {
            setErr("Quantity Must be greater than 0");
            hideError();
            return;
        }
        if (screenType == 'catagory') {
            if (update) {
                const obj = {
                    title: data.title,
                    url: data.url
                }
                params.updateCatagory(params.index, params.id, imageUrl, obj);
                navigation.goBack();
            } else {
                const obj = {
                    title: data.title,
                    url: data.url
                }
                params.addCatagory(obj);
                navigation.goBack();
            }
        } else if (screenType == 'product') {
            if (update) {
                const obj = {
                    cid: data.cid,
                    title: data.title,
                    url: data.url,
                    oldPrice: data.oldprice,
                    newPrice: data.newPrice,
                    quantity: data.quantity
                }
                params.updateProduct(params.index, params.id, imageUrl, obj)
                navigation.goBack();
            } else {
                const obj = {
                    cid: data.cid,
                    title: data.title,
                    url: data.url,
                    oldPrice: data.oldprice,
                    newPrice: data.newPrice,
                    quantity: data.quantity
                }
                params.addCatagory(obj);
                navigation.goBack()
            }
        }
    }
    return (
        <View style={style.base}>
            {props.title == '' || title != '' ?
                <Header title={title} />
                : null
            }
            {screenType == 'catagory' ?
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={() => uploadImage()}
                        style={styles.uploadImage}>
                        <Image
                            source={data.url != '' ? { uri: data.url } : update && imageUrl ? { uri: imageUrl } : require("../../../../assets/images/upload.png")}
                            style={{ width: 100, height: 100, resizeMode: "cover", borderRadius: 100 }}
                        />
                    </TouchableOpacity>
                    <Input
                        screen='crud'
                        fieldType='title'
                        value={data.title}
                        placeHolder="Title"
                        multiline={false}
                        changeValue={setField}
                    />
                    <Text style={[style.bold, style.primaryColor]}>{err}</Text>
                    <TouchableOpacity
                        onPress={() => saveCatagoryData()}
                        style={[style.updateButton, style.primaryBackgroundColor]}>
                        <Text style={[style.center, style.h3, style.secondaryColor]}>{update ? "Update" : "Save"}</Text>
                    </TouchableOpacity>
                </View>
                :
                screenType == 'product' ?
                    <View style={styles.container}>
                        <Text style={[style.bold, style.center, style.primaryColor]}>{err}</Text>
                        <TouchableOpacity
                            onPress={() => uploadImage()}
                            style={styles.uploadImage}>
                            <Image
                                source={data.url != '' ? { uri: data.url } : update && imageUrl ? { uri: imageUrl } : require("../../../../assets/images/upload.png")}
                                style={{ width: 100, height: 100, resizeMode: "cover", borderRadius: 100 }}
                            />
                        </TouchableOpacity>
                        {loading ?
                            <ActivityIndicator size="small" color="#CC1100" style={{ justifyContent: 'center' }} />
                            :
                            <Picker
                                mode="dropdown"
                                selectedValue={data.catagoryName}
                                style={{ height: 50, width: "105%" }}
                                onValueChange={(itemValue, itemIndex) => {
                                    const obj = { ...data }
                                    obj.cid = itemValue;
                                    setData(data = obj)
                                }}>
                                {catagoryPicker}
                            </Picker>
                        }
                        <Input
                            screen='crud'
                            label="Title"
                            fieldType='title'
                            value={data.title}
                            placeHolder="Title"
                            multiline={false}
                            changeValue={setField}
                        />
                        <Input
                            screen='crud'
                            label="Old Price"
                            fieldType='oldPrice'
                            value={data.oldprice}
                            placeHolder="Old Price"
                            multiline={false}
                            changeValue={setField}
                        />
                        <Input
                            screen='crud'
                            label="New Price"
                            fieldType='newPrice'
                            value={data.newPrice}
                            placeHolder="New Price"
                            multiline={false}
                            changeValue={setField}
                        />
                        <Input
                            screen='crud'
                            keyboardType="number-pad"
                            label="Quantity"
                            fieldType='quantity'
                            value={data.quantity}
                            placeHolder="Quantity"
                            multiline={false}
                            changeValue={setField}
                        />
                        <TouchableOpacity
                            onPress={() => saveCatagoryData()}
                            style={[style.updateButton, style.primaryBackgroundColor]}>
                            <Text style={[style.center, style.h3, style.secondaryColor]}>{update ? "Update" : "Save"}</Text>
                        </TouchableOpacity>
                    </View>
                    : null
            }
        </View>
    )
}

export default CRUDProduct;

const styles = StyleSheet.create({
    container: {
        width: "80%",
        marginHorizontal: "10%",
        marginTop: 20
    },
    uploadImage: {
        width: "50%",
        marginHorizontal: "30%"
    }
})