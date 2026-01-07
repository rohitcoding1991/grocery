import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '../Input/Input';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import { f } from '../../Config/Config';
import { useNavigation } from '@react-navigation/native';

const changePassword = props => {
    const navigation = useNavigation();
    const updatePasswordHandler = (value) => {
        setPassword(value);
    }
    let [password, setPassword] = React.useState('');
    const changePasswordHandler = () => {
        if (password == '') {
            alert('Email Address field is empty');
            return false;
        } else if (password.length < 6) {
            alert('Weak Password, Length should be greater than 5');
            return false;
        }
        const user = f.auth().currentUser;
        user.updatePassword(password).then(() => {
            alert("Your Password has been updated");
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
            <Header title="Change Password" />
            <Input
                value={password}
                secureTextEntry={true}
                textContentType="newPassword"
                keyboardType="default"
                changeValue={updatePasswordHandler}
                placeHolder="Enter new Password.."
                numOfLines={2}
                multiline={false}
            />
            <TouchableOpacity
                onPress={() => changePasswordHandler()}
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

export default changePassword;