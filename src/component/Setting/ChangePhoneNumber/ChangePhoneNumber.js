import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '../Input/Input';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import { f } from '../../Config/Config';
import { useNavigation } from '@react-navigation/native';

const changePhoneNumber = props => {
    const navigation = useNavigation();
    const updatePhoneNumber = (value) => {
        setPhone(value);
    }
    var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
    let [phone, setPhone] = React.useState('');
    const changePhoneNumberHandler = () => {
        if (phone == '') {
            alert('Phone Number field is empty');
            return false;
        } else if (!regexp.test(phone)) {
            alert("Phone No Format is incorrect, Should be like +923001234567");
        }
        const user = f.auth().currentUser;
        user.updatePhoneNumber(phone).then(() => {
            alert("Your Phone Number has been updated");
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
            <Header title="Change Contact Number" />
            <Input
                value={phone}
                secureTextEntry={false}
                textContentType="telephoneNumber"
                keyboardType="phone-pad"
                changeValue={updatePhoneNumber}
                placeHolder="Enter new Phone Number.."
                multiline={false}
            />
            <TouchableOpacity
                onPress={() => changePhoneNumberHandler()}
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

export default changePhoneNumber;