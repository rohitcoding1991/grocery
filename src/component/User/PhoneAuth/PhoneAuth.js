import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import Input from '../../Setting/Input/Input';
import { f, auth } from '../../Config/Config';
class PhoneAuthScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            confirmResult: null,
            verificationCode: '',
            userId: ''
        }
    }
    validatePhoneNumber = () => {
        var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
        return regexp.test(this.state.phone)
    }

    phoneNumberInputHandler = (val) => {
        this.setState({ phone: val })
    }

    OTPVerificationHandler = (val) => {
        this.setState({ verificationCode: val })
    }

    handleSendCode = () => {
        // Request to send OTP
        if (this.validatePhoneNumber()) {
            f.auth()
                .signInWithPhoneNumber(this.state.phone)
                .then(confirmResult => {
                    this.setState({ confirmResult })
                })
                .catch(error => {
                    alert(error.message)
                    console.log(error)
                })
        } else {
            alert('Invalid Phone Number')
        }
    }

    renderConfirmationCodeView = () => {
        return (
            <View style={{ margin: 10 }}>
                <Input
                    placeHolder='Verification code'
                    value={this.state.verificationCode}
                    keyboardType='numeric'
                    changeValue={this.OTPVerificationHandler}
                    maxLength={6}
                />
                <TouchableOpacity
                    onPress={() => this.handleVerifyCode()}
                    style={[styles.updateButton, style.primaryBackgroundColor]}>
                    <Text style={[style.center, style.h3, style.secondaryColor]}>Verify Code</Text>
                </TouchableOpacity>
            </View>
        )
    }
    handleVerifyCode = () => {
        // Request for OTP verification
        const { confirmResult, verificationCode } = this.state;
        if (verificationCode.length == 6) {
            confirmResult
                .confirm(verificationCode)
                .then(user => {
                    this.setState({ userId: user.uid })
                    this.props.navigation.replace('Home');
                })
                .catch(error => {
                    alert(error.message)
                    console.log(error)
                })
        } else {
            alert('Please enter a 6 digit OTP code.')
        }
    }

    render() {
        return (
            <View style={[style.base]}>
                <Header
                    type="phoneAuth"
                    title="Provide Your Phone Number!"
                />
                {this.state.confirmResult ?
                    this.renderConfirmationCodeView()
                    :
                    <View style={{ margin: 10 }}>
                        <Input
                            value={this.state.phone}
                            secureTextEntry={false}
                            textContentType="telephoneNumber"
                            keyboardType="phone-pad"
                            changeValue={this.phoneNumberInputHandler}
                            placeHolder="Enter Your Phone No"
                            numOfLines={2}
                            multiline={false}
                        />
                        <TouchableOpacity
                            onPress={() => this.handleSendCode()}
                            style={[styles.updateButton, style.primaryBackgroundColor]}>
                            <Text style={[style.center, style.h3, style.secondaryColor]}>Save</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
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

export default PhoneAuthScreen