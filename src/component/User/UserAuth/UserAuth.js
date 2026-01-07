import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Keyboard } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { f, auth, database } from '../../Config/Config';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Modal from '../../Modal/Modal';
export default class UserAuth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authState: 1,
            name: '',
            email: '',
            pass: '',
            conPass: '',
            loggedIn: false,
            moveScreen: false,
            btnClicked: false,
            fromLink: false,
            secureKeyState: true,
            modal: false,
            label: ''
        };
    }

    componentDidMount() {
        StatusBar.setBackgroundColor("#CC1100", true);
        f.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ loggedIn: true })
            }
        })
        const params = this.props.route.params;
        if (params) {
            this.setState({ authState: params.authState, fromLink: params.linkStatus })
        }
        if (this.props.moveScreen) {
            this.setState({ moveScreen: true })
        }
    }

    showLogin = () => {
        this.setState({ authState: 1 });
    }
    showSignup = () => {
        this.setState({ authState: 2 })
    }
    loginHandler = async () => {
        try {
            Keyboard.dismiss();
            if (this.state.email != '' && this.state.pass != '') {
                this.setState({ btnClicked: true });
                await auth.signInWithEmailAndPassword(this.state.email, this.state.pass).then(async () => {
                    const uid = f.auth().currentUser.uid;
                    await database.ref('user').child(uid).child('accountType').once('value').then(async snapshot => {
                        if (snapshot.exists()) {
                            let type = await snapshot.val();
                            if (type == 'admin') {
                                this.props.navigation.navigate('AdminHome');
                            } else {
                                this.props.navigation.navigate('Home');
                            }
                        } else {
                            this.setState({ btnClicked: false });
                        }
                    });
                }).catch(e => {
                    let error = '';
                    if (e.code == 'auth/user-not-found') {
                        error = "No user found or user has been deleted";
                    } else if (e.code == 'auth/invalid-email') {
                        error = 'Email Address is not valid';
                    } else if (e.code == 'auth/wrong-password') {
                        error = "Wrong Password, Try Again";
                    } else if (e.code == 'auth/unknown') {
                        error = 'To many Wrong attempts, try again later';
                    } else {
                        error = e.message;
                    }
                    this.setState({
                        modal: true,
                        label: error,
                        btnClicked: false
                    });
                    this.closeModalHandler();
                });
            } else {
                this.setState({
                    modal: true,
                    label: "Email or Password is Missing",
                    btnClicked: false
                });
                this.closeModalHandler();
            }
        } catch (e) {
            let error = '';
            if (e.code == 'auth/user-not-found') {
                error = "No user found or user has been deleted";
            } else if (e.code == 'auth/invalid-email') {
                error = 'Email Address is not valid';
            } else if (e.code == 'auth/unknown') {
                error = 'To many Wrong attempts, try again later';
            }
            this.setState({
                modal: true,
                label: error,
                btnClicked: false
            });
            this.closeModalHandler();
        }
    }

    closeModalHandler = () => {
        setTimeout(() => {
            this.setState({ modal: false, label: '' })
        }, 2500);
    }

    createUserObjectHandler = async (user, email) => {
        let userId = user.uid;
        const name = this.state.name;
        const uObj = {
            Name: name,
            email: email,
            accountType: 'user'
        }
        database.ref('user').child(userId).set(uObj);
        this.props.navigation.navigate('Home');
        this.setState({ btnClicked: false });
    }

    resetPasswordHandler = async () => {
        try {
            const email = this.state.email;
            if (email != '') {
                this.setState({ btnClicked: true });
                let user = await auth.sendPasswordResetEmail(email).then(result => {
                    this.setState({
                        modal: true,
                        label: "Email Has Been Sent to " + email,
                        btnClicked: false
                    });
                    this.closeModalHandler();
                })
                    .catch(e => {
                        let error = '';
                        if (e.code == 'auth/invalid-email') {
                            error = 'Email Address is not valid';
                        }
                        this.setState({
                            modal: true,
                            label: error,
                            btnClicked: false
                        });
                        this.closeModalHandler();
                    })
            } else {
                this.setState({
                    modal: true,
                    label: "Email Address is Missing",
                    btnClicked: false
                });
                this.closeModalHandler();
            }
        } catch (e) {
            let error = '';
            if (e.code == 'auth/invalid-email') {
                error = 'Email Address is not valid';
            }
            this.setState({
                modal: true,
                label: e.message,
                btnClicked: false
            });
            this.closeModalHandler();
        }
    }

    signUpHandler = async () => {
        try {
            Keyboard.dismiss();
            const name = this.state.name;
            const email = this.state.email;
            const pass = this.state.pass
            const conPass = this.state.conPass;
            if (name != '' && email != '' && (pass != '' && conPass != '')) {
                if (pass === conPass) {
                    this.setState({ btnClicked: true });
                    let user = await auth.createUserWithEmailAndPassword(email, pass)
                        .then(userObj => this.createUserObjectHandler(userObj.user, this.state.email))
                        .catch(e => {
                            let error = '';
                            if (e.code == 'auth/user-not-found') {
                                error = "No user found or user has been deleted";
                            } else if (e.code == 'auth/invalid-email') {
                                error = 'Email Address is not valid';
                            } else if (e.code == 'auth/email-already-in-use') {
                                error = "Email Address already in use"
                            } else if (e.code == 'auth/weak-password') {
                                error = "Password should be at least 6 digit"
                            } else if (e.code == 'auth/unknown') {
                                error = 'Too many Wrong attempts, try again later';
                            }
                            this.setState({
                                modal: true,
                                label: error,
                                btnClicked: false
                            });
                            this.closeModalHandler();
                        })
                } else {
                    this.setState({
                        modal: true,
                        label: "Password Doesn't Matching",
                        btnClicked: false
                    });
                    this.closeModalHandler();
                }
            } else {
                this.setState({
                    modal: true,
                    label: "No field should be empty",
                    btnClicked: false
                });
                this.closeModalHandler();
            }
        } catch (e) {
            let error = '';
            if (e.code == 'auth/user-not-found') {
                error = "No user found or user has been deleted";
            } else if (e.code == 'auth/invalid-email') {
                error = 'Email Address is not valid';
            } else if (e.code == 'auth/email-already-in-use') {
                error = "Email Address already in use"
            } else if (e.code == 'auth/weak-password') {
                error = "Password should be at least 6 digit"
            } else if (e.code == 'auth/unknown') {
                error = 'To many Wrong attempts, try again later';
            }
            this.setState({
                modal: true,
                label: error,
                btnClicked: false
            });
            this.closeModalHandler();
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../../../assets/images/loginbg.jpg')}
                    style={{
                        resizeMode: 'cover',
                        height: "100%",
                        width: "100%"
                    }}
                >
                    <Header
                        title="Login Or Sign Up To Continue"
                        type="auth"
                    />
                    {this.state.modal ?
                        <Modal
                            status={this.state.modal}
                            label={this.state.label}
                            close={this.closeModalHandler}
                        />
                        : null}
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', alignItems: 'center' }}>
                        {this.state.authState == 0 ? (
                            <View style={[style.container, { paddingHorizontal: 70, }]}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>You're not logged in.</Text>
                                <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>{this.props.message}</Text>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', marginTop: 5 }}>
                                    <TouchableOpacity onPress={this.showLogin}>
                                        <Text style={[style.buttonStyle, { color: 'green' }]}>Login</Text>
                                    </TouchableOpacity>
                                    <Text style={{ marginHorizontal: 10, textAlign: 'center' }}>OR</Text>
                                    <TouchableOpacity onPress={this.showSignup}>
                                        <Text style={[style.buttonStyle, { color: 'red' }]}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                            :
                            (
                                <View style={{ marginVertical: 20 }}>
                                    {this.state.authState == 1 ?
                                        <View style={[style.container, { paddingHorizontal: 25 }]}>

                                            <Text style={[style.bold, style.h1, style.secondaryColor, style.mb]}>Login:</Text>
                                            <TextInput
                                                placeholderTextColor="white"
                                                placeholder="Email Address"
                                                editable={true}
                                                keyboardType="email-address"
                                                value={this.state.email}
                                                onChangeText={(text) => this.setState({ email: text })}
                                                style={styles.textInput}
                                            />
                                            <Icon
                                                name="email"
                                                style={{
                                                    position: 'absolute',
                                                    top: "21%",
                                                    left: "11%",
                                                    fontSize: 25,
                                                    color: "white",
                                                    padding: 3
                                                }}
                                            />
                                            <TextInput
                                                placeholderTextColor="white"
                                                placeholder="Password"
                                                editable={true}
                                                secureTextEntry={this.state.secureKeyState}
                                                value={this.state.pass}
                                                onChangeText={(text) => this.setState({ pass: text })}
                                                style={styles.textInput}
                                            />
                                            <Foundation
                                                name="key"
                                                style={{
                                                    position: 'absolute',
                                                    top: "44%",
                                                    left: "11%",
                                                    fontSize: 25,
                                                    color: "white",
                                                    padding: 4.2,
                                                    paddingLeft: 5.1
                                                }}
                                            />
                                            <Ionicons
                                                onPress={() => this.setState({ secureKeyState: !this.state.secureKeyState })}
                                                name={!this.state.secureKeyState ? "md-eye" : "md-eye-off"}
                                                style={{
                                                    position: 'absolute',
                                                    top: "48%",
                                                    left: "100%",
                                                    fontSize: 20,
                                                    color: "white",
                                                }}
                                            />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableOpacity onPress={() => this.setState({ authState: 2 })}>
                                                    <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>Create Account?</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.setState({ authState: 3 })}>
                                                    <Text style={{ color: 'yellow', fontSize: 11, fontWeight: 'bold' }}>Forgot Password?</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style={{ width: 100, alignSelf: 'flex-end' }} disabled={this.state.btnClicked} onPress={this.loginHandler}>
                                                <Text style={styles.progressButtonStyle}>{!this.state.btnClicked ? 'Login' : 'Processing...'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        : this.state.authState == 2 ?
                                            (<View style={[style.container, { paddingHorizontal: 25 }]}>

                                                <Text style={[style.bold, style.h1, style.secondaryColor, style.mb]}>Sign Up:</Text>
                                                <TextInput
                                                    placeholderTextColor="white"
                                                    placeholder="Full Name"
                                                    editable={true}
                                                    value={this.state.name}
                                                    onChangeText={(text) => this.setState({ name: text })}
                                                    style={styles.textInput}
                                                />
                                                <SimpleLineIcons
                                                    name="user"
                                                    style={{
                                                        position: 'absolute',
                                                        top: "14%",
                                                        left: "11%",
                                                        fontSize: 25,
                                                        color: "white",
                                                        padding: 3
                                                    }}
                                                />
                                                <TextInput
                                                    placeholderTextColor="white"
                                                    placeholder="Email Address"
                                                    editable={true}
                                                    keyboardType="email-address"
                                                    value={this.state.email}
                                                    onChangeText={(text) => this.setState({ email: text })}
                                                    style={styles.textInput}
                                                />
                                                <Icon
                                                    name="email"
                                                    style={{
                                                        position: 'absolute',
                                                        top: "30%",
                                                        left: "11%",
                                                        fontSize: 25,
                                                        color: "white",
                                                        padding: 3
                                                    }}
                                                />
                                                <TextInput
                                                    placeholderTextColor="white"
                                                    placeholder="Password"
                                                    editable={true}
                                                    secureTextEntry={this.state.secureKeyState}
                                                    value={this.state.pass}
                                                    onChangeText={(text) => this.setState({ pass: text })}
                                                    style={styles.textInput}
                                                />
                                                <Foundation
                                                    name="key"
                                                    style={{
                                                        position: 'absolute',
                                                        top: "45.5%",
                                                        left: "11%",
                                                        fontSize: 25,
                                                        color: "white",
                                                        padding: 5,
                                                        paddingLeft: 8
                                                    }}
                                                />
                                                <Ionicons
                                                    onPress={() => this.setState({ secureKeyState: !this.state.secureKeyState })}
                                                    name={!this.state.secureKeyState ? "md-eye" : "md-eye-off"}
                                                    style={{
                                                        position: 'absolute',
                                                        top: "48%",
                                                        left: "100%",
                                                        fontSize: 20,
                                                        color: "white",
                                                    }}
                                                />
                                                <TextInput
                                                    placeholderTextColor="white"
                                                    placeholder="Confirm Password"
                                                    editable={true}
                                                    secureTextEntry={this.state.secureKeyState}
                                                    value={this.state.conPass}
                                                    onChangeText={(text) => this.setState({ conPass: text })}
                                                    style={styles.textInput}
                                                />
                                                <Icon
                                                    name="shield-check"
                                                    style={{
                                                        position: 'absolute',
                                                        top: "61%",
                                                        left: "11%",
                                                        fontSize: 25,
                                                        color: "white",
                                                        padding: 5,
                                                        paddingLeft: 5
                                                    }}
                                                />
                                                <Ionicons
                                                    onPress={() => this.setState({ secureKeyState: !this.state.secureKeyState })}
                                                    name={!this.state.secureKeyState ? "md-eye" : "md-eye-off"}
                                                    style={{
                                                        position: 'absolute',
                                                        top: "64%",
                                                        left: "100%",
                                                        fontSize: 20,
                                                        color: "white",
                                                    }}
                                                />
                                                <TouchableOpacity onPress={() => this.setState({ authState: 1 })}>
                                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Already a user?</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ width: 100, alignSelf: 'flex-end' }} disabled={this.state.btnClicked} onPress={this.signUpHandler}>
                                                    <Text style={styles.progressButtonStyle}>{!this.state.btnClicked ? 'Sign Up' : 'Processing...'}</Text>
                                                </TouchableOpacity>
                                            </View>) : null
                                    }
                                    {this.state.authState == 3 ?
                                        <View style={[style.container, { paddingHorizontal: 25 }]}>

                                            <Text style={[style.bold, style.h1, style.secondaryColor, style.mb]}>Reset Password</Text>
                                            <TextInput
                                                placeholderTextColor="white"
                                                placeholder="Email Address"
                                                editable={true}
                                                keyboardType="email-address"
                                                value={this.state.email}
                                                onChangeText={(text) => this.setState({ email: text })}
                                                style={styles.textInput}
                                            />
                                            <Icon
                                                name="email"
                                                style={{
                                                    position: 'absolute',
                                                    top: "24%",
                                                    left: "11%",
                                                    fontSize: 25,
                                                    color: "white",
                                                    padding: 5
                                                }}
                                            />
                                            <TouchableOpacity onPress={() => this.setState({ authState: 1 })}>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Back to Login</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: 100, alignSelf: 'flex-end' }} disabled={this.state.btnClicked} onPress={this.resetPasswordHandler}>
                                                <Text style={styles.progressButtonStyle}>{!this.state.btnClicked ? 'Send Email' : 'Processing...'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        null
                                    }
                                </View>
                            )
                        }
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    progressButtonStyle: {
        color: 'white',
        backgroundColor: '#CC1100',
        borderRadius: 5,
        paddingVertical: 10,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
        fontSize: 13
    },
    textInput: {
        position: 'relative',
        color: 'white',
        width: 250,
        marginVertical: 5,
        padding: 5,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: 'lightgrey',
        paddingLeft: 42
    },
})

