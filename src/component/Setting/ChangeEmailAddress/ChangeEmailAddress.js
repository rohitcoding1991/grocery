import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '../Input/Input';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import { f } from '../../Config/Config';
import { useNavigation } from '@react-navigation/native';
const changeEmailAddress = props => {
    const navigation = useNavigation()
    const updateEmailAddress = (value) => {
        setEmail(value);
    }
    let [email, setEmail] = React.useState('');
    const emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const changeEmailAddressHandler = () => {
        if (email == '') {
            alert('Email Address field is empty');
            return false;
        } else if (!emailValidator.test(email)) {
            alert("Email Address is not valid");
            return false;
        }
        const user = f.auth().currentUser;
        user.updateEmail(email).then(() => {
            alert("Your Email Address has been updated");
            navigation.navigate('Home');
        }).catch(err => {
            if (err.code == 'requires-recent-login') {
                alert("This Operation is sensitive and requires recent login. Log in again brefore retrying this request")
            } else {
                alert(err.message);
            }
        });
    }
    return (
        <View style={style.base}>
            <Header title="Change Email Address" />
            <Input
                value={email}
                secureTextEntry={false}
                textContentType="emailAddress"
                keyboardType="email-address"
                changeValue={updateEmailAddress}
                placeHolder="Enter new Email Address.."
                numOfLines={2}
                multiline={false}
            />
            <TouchableOpacity
                onPress={() => changeEmailAddressHandler()}
                style={[styles.updateButton, style.primaryBackgroundColor]}>
                <Text style={[style.center, style.h3, style.secondaryColor]}>Update</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    updateButton: {
        paddingVertical: 7,
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderRadius: 5,
        paddingHorizontal: 20,
        marginRight: 15,
    }
})

export default changeEmailAddress;