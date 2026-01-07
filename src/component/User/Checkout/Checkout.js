import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { style } from '../../../component/Global/Global'
import Header from '../../../component/Header/Header';
import { useRoute, useNavigation } from '@react-navigation/native';
import Input from '../../../component/Setting/Input/Input';
import { RadioButton } from 'react-native-paper'
import CustomModal from '../../../component/Modal/Modal';
import { saveOrder, uniqueId } from '../../../component/Helper/Helper';
import { f } from '../../../component/Config/Config';

const checkOut = props => {
    const route = useRoute();
    const navigation = useNavigation();
    const params = route.params;
    let [modal, setModal] = useState(false);
    let [label, setLabel] = useState('');
    var alphabet = /^[A-Za-z ]+$/
    const checkPhoneNo = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
    let [address, setAddress] = useState({
        name: params ? params.userInfo.name : '',
        mobileNo: params ? params.userInfo.phone : '',
        street: params ? params.userInfo.address + '\n' + params.userInfo.street : '',
        sector: params ? params.userInfo.sector : ''
    });

    const setField = (type, val) => {
        if (type == 'name') {
            const addr = { ...address }
            addr.name = val.trim();
            setAddress(address = addr)
        } else if (type == 'mobileNo') {
            const addr = { ...address }
            addr.mobileNo = val.trim();
            setAddress(address = addr)

        } else if (type == 'street') {
            const addr = { ...address }
            addr.street = val.trim();
            setAddress(address = addr)
        }
    }
    const closeModal = () => {
        setTimeout(() => {
            setLabel('')
            setModal(false);
        }, 3000);
    }
    const checkValidation = () => {
        if (address.name == '') {
            setLabel("Name must not be empty");
            setModal(true);
            closeModal();
            return;
        }
        else if (!alphabet.test(address.name)) {
            setLabel("Name must not contain special Characters");
            setModal(true);
            closeModal();
            return;
        }
        if (!checkPhoneNo.test(address.mobileNo)) {
            setLabel("Phone nunber is not valid");
            setModal(true);
            closeModal();
            return;
        }
        if (address.street == '') {
            setLabel("Street must not be empty");
            setModal(true);
            closeModal();
            return;
        }
        if (address.sector == '') {
            setLabel("You must have tell us your sector");
            setModal(true);
            closeModal();
            return;
        }
        confirmOrder();
    }
    const confirmOrder = () => {
        Alert.alert(
            "Confirm Order!",
            "Please Confirm Your Order Placement?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => saveOrderInfo() }
            ],
            { cancelable: true }
        );
    }
    const saveOrderInfo = () => {
        const userId = f.auth().currentUser.uid;
        const orderId = uniqueId();
        let obj = {};
        obj.orderInfo = params.cart;
        obj.billingAddress = {
            name: address.name,
            mobileNo: address.mobileNo,
            street: address.street,
            sector: address.sector
        };
        obj.status = "processing";
        obj.posted = Math.floor(Date.now() / 1000)
        saveOrder(obj, userId, orderId);
        setLabel("ORDER HAS BEEN PLACED");
        setModal(true);
        closeModal();
        setTimeout(() => {
            navigation.replace("Home");
        }, 1000);
    }
    return (
        <View style={[style.base]}>
            <Header
                title="Enter Billing Address and Wait For Bell"
                type="checkout"
            />
            {modal ?
                <CustomModal
                    status={modal}
                    label={label}
                />
                : null
            }
            <ScrollView>
                <View style={styles.container}>
                    <View>
                        <Text style={[style.center, style.bold, style.h3, style.p, style.primaryColor, { lineHeight: 19 }]}>
                            Please Enter the checkout information And Confirm Your Order</Text>
                    </View>
                    <Input
                        screen='crud'
                        fieldType='name'
                        value={address.name}
                        placeHolder="John Doe"
                        multiline={false}
                        changeValue={setField}
                    />
                    <Input
                        screen='crud'
                        fieldType='mobileNo'
                        value={address.mobileNo}
                        placeHolder="+923001234567"
                        keyboardType="phone-pad"
                        multiline={false}
                        changeValue={setField}
                    />
                    <Input
                        screen='crud'
                        fieldType='street'
                        value={address.street}
                        placeHolder="House# 4 Street# 43 Example Colony Example Town"
                        textContentType="fullStreetAddress"
                        multiline={true}
                        changeValue={setField}
                    />
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <RadioButton
                                value="Behria Town Phase 8"
                                color="#CC1100"
                                status={address.sector === 'Behria Town Phase 8' ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    const addr = { ...address }
                                    addr.sector = "Behria Town Phase 8";
                                    setAddress(address = addr)
                                }}
                            />
                            <Text style={[style.ml]}>Behria Town Phase 8</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <RadioButton
                                value="Behria Town Phase 7"
                                color="#CC1100"
                                status={address.sector === 'Behria Town Phase 7' ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    const addr = { ...address }
                                    addr.sector = "Behria Town Phase 7";
                                    setAddress(address = addr)
                                }}
                            />
                            <Text style={[style.ml]}>Behria Town Phase 7</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <RadioButton
                                value="Behria Town Phase 1-6"
                                color="#CC1100"
                                status={address.sector === 'Behria Town Phase 1-6' ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    const addr = { ...address }
                                    addr.sector = "Behria Town Phase 1-6";
                                    setAddress(address = addr)
                                }}
                            />
                            <Text style={[style.ml]}>Behria Town Phase 1-6</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <RadioButton
                                value="DHA Phase 1"
                                color="#CC1100"
                                status={address.sector === 'DHA Phase 1' ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    const addr = { ...address }
                                    addr.sector = "DHA Phase 1";
                                    setAddress(address = addr)
                                }}
                            />
                            <Text style={[style.ml]}>DHA Phase 1</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => checkValidation()}
                            style={[style.updateButton, style.mt, style.primaryBackgroundColor]}>
                            <Text style={[style.center, style.h3, style.secondaryColor]}>Order Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default checkOut;

const styles = StyleSheet.create({
    container: {
        width: "80%",
        marginHorizontal: "10%",
        marginTop: 20
    },
})