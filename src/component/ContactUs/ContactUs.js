import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import Header from '../Header/Header';
import { style } from "../Global/Global";
import { saveContactMessage } from '../Helper/Helper';
import { f } from '../Config/Config';
import Modal from '../Modal/Modal';
const contactUs = props => {
    const [contactData, setContactData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const closeModalHandler = () => {
        setTimeout(() => {
            SetModal(false);
            setErr('');
        }, 3000);
    }
    const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const [modal, SetModal] = useState(false);

    const [err, setErr] = useState('');
    const setFieldValue = (type, val) => {
        if (type == 'name') {
            setContactData({ ...contactData, name: val });
        } else if (type == 'email') {
            setContactData({ ...contactData, email: val });
        } else if (type == 'message') {
            setContactData({ ...contactData, message: val });
        }
    }
    const contactMessageHandler = () => {
        const uid = f.auth().currentUser.uid;
        Keyboard.dismiss();
        if (contactData.name == '' || contactData.email == '' || contactData.message == '') {
            SetModal(true);
            setErr('No Field Should be empty');
            closeModalHandler();
            return false;
        }
        if (!emailValidator.test(contactData.email)) {
            SetModal(true);
            setErr('Email Address is not valid');
            closeModalHandler();
            return false;
        }
        if (contactData.message.length < 20) {
            SetModal(true);
            setErr('Message Must be at least 20 Characters');
            closeModalHandler();
            return false;
        }
        const obj = {
            name: contactData.name,
            email: contactData.email,
            message: contactData.message
        }
        saveContactMessage(obj, uid);
        SetModal(true);
        setErr('Your Message has been sent successfully!');
        setContactData({
            name: '',
            email: '',
            message: ''
        })
        closeModalHandler();
    }
    return (
        <View style={[style.base]}>
            <Header title="Contact Us" />
            {modal ?
                <Modal
                    status={modal}
                    label={err}
                />
                : null
            }
            <ScrollView>
                <View>
                    <View style={styles.container}>
                        <Text style={[style.h3, style.center, styles.longText]}>
                            Please feel free to ask us anything!{'\n'}
                    We are here to hear from you...!
                    </Text>
                    </View>
                    <TextInput
                        placeholder="Your Name"
                        value={contactData.name}
                        onChangeText={(val) => setFieldValue('name', val)}
                        textAlignVertical="center"
                        style={[styles.input]}
                    />
                    <TextInput
                        placeholder="Email address"
                        value={contactData.email}
                        onChangeText={(val) => setFieldValue('email', val)}
                        textAlignVertical="center"
                        style={[styles.input]}
                    />
                    <TextInput
                        placeholder="Enter your Message..."
                        value={contactData.message}
                        onChangeText={(val) => setFieldValue('message', val)}
                        numberOfLines={7}
                        textAlignVertical="top"
                        multiline={true}
                        style={[styles.input, { padding: 10 }]}
                    />
                    <TouchableOpacity
                        onPress={() => contactMessageHandler()}
                        disabled={contactData.name == '' || contactData.email == '' || contactData.message == '' ? true : false}
                        style={[styles.feedbackBtn, contactData.name == '' || contactData.email == '' || contactData.message == '' ? { backgroundColor: 'grey' } : style.primaryBackgroundColor]}>
                        <Text style={[style.center, style.h3, style.secondaryColor]}>Send</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20
    },
    longText: {
        width: "80%",
        marginHorizontal: "10%",
        marginTop: 10,
        fontWeight: "300",
        lineHeight: 20,
        letterSpacing: 0.2
    },
    input: {
        borderWidth: 1,
        padding: 5,
        borderColor: 'lightgrey',
        margin: 10,
        fontSize: 14,
        borderRadius: 5
    },
    feedbackBtn: {
        paddingVertical: 7,
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderRadius: 5,
        paddingHorizontal: 20,
        marginRight: 15,
    }
})

export default contactUs;