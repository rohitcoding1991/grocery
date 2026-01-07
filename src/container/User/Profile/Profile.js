import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';
import { style } from '../../../component/Global/Global';
import Header from '../../../component/Header/Header';
import Button from '../../../component/User/Profile/Button/Button';
import Detail from '../../../component/User/Profile/Detail/Detail';
import { f } from '../../../component/Config/Config';
import { ActivityIndicator } from 'react-native-paper';
import { getUserInfo } from '../../../component/Helper/Helper';
import EditProfileModal from '../../../component/User/EditProfileModal/EditProfileModal';
import { database, storage } from '../../../component/Config/Config';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import { uniqueId } from '../../../component/Helper/Helper';
import Modal from '../../../component/Modal/Modal';
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            userId: '',
            editing: false,
            regexError: false,
            formLabel: '',
            sector: "Behria Town Phase 8",
            selectedImage: false,
            response: null,
            uploading: false,
            imageId: '',
            progress: 0
        };
    }
    componentDidMount() {
        this.setState({ userId: f.auth().currentUser.uid }, async () => {
            const userInfo = await getUserInfo(this.state.userId);
            this.setState({ userInfo: userInfo });
        })
    }

    uploadNewPhoto = (oldImage) => {
        ImagePicker.openPicker({
            compressImageQuality: 0.8,
            loadingLabelText: "Loading...",
            freeStyleCropEnabled: true,
            cropping: true
        }).then(response => {
            this.setState({
                selectedImage: true,
                imageId: uniqueId(),
                response: response,
                uploading: true
            });
            this.uploadAndPublish(oldImage);
            ImagePicker.clean().then(() => {
                console.log('removed all tmp images from tmp directory');
            }).catch(e => {
                alert(e);
            });
        });
    }
    uploadAndPublish = (oldImage) => {
        if (this.state.response) {
            this.setState({ uploading: true })
            this.uploadImage(this.state.response, oldImage);
        } else {
            alert("Image Not Selected");
        }
    }
    uploadImage = async (res, oldImage) => {
        const userId = this.state.userId;
        const imageId = this.state.imageId;
        const response = await fetch(res.path);
        const blob = await response.blob();
        const uploadTask = storage.ref('profile/avatar/' + userId).child(imageId).put(blob);
        uploadTask.on('state_changed', snapshot => {
            let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            this.setState({ progress: progress });
        }, error => {
            console.log("error with upload: " + error);
        }, () => {
            let that = this;
            that.setState({ progress: 100 });
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                that.processUpload(downloadURL, oldImage);
            });
        });
    }
    processUpload = (imageUrl, oldImage) => {
        const userId = this.state.userId;
        const dataObject = {
            url: imageUrl
        }
        //Add to User Photos
        database.ref('/user/' + userId).update(dataObject).then(() => {
            let userInfo = { ...this.state.userInfo }
            userInfo.avatar = imageUrl;
            this.setState({ userInfo: userInfo });
        });
        if (oldImage != "null" || oldImage != '' || oldImage != null || oldImage != undefined) {
            var desertRef = storage.refFromURL(oldImage);
            // Delete the Image
            desertRef.delete().then(() => {
                console.log("Old Image Deleted");
            }).catch((error) => console.log("ERROR: ", error));
        }
        this.setState({
            progress: 0,
            response: null,
            selectedImage: false,
            uploading: false,
            editing: false
        });
    }


    closeModal = () => {
        setTimeout(() => {
            this.setState({ regexError: false, formLabel: '' });
        }, 2500);
    }
    saveInput = (value, type) => {
        let userInfo = { ...this.state.userInfo };
        if (type == "name") {
            userInfo.name = value;
        } else if (type == "city") {
            userInfo.city = value;
        } else if (type == "address") {
            userInfo.address = value;
        } else if (type == "street") {
            userInfo.street = value;
        } else if (type == "sector") {
            userInfo.sector = value;
        }
        this.setState({ userInfo: userInfo });
    }
    editProfile = () => {
        this.setState({ editing: true });
    }

    cancelUpdate = () => {
        this.setState({ editing: false });
    }
    updateRecord = async () => {
        let userInfo = this.state.userInfo;
        const userId = this.state.userId;
        let chkSpecialChar = /[0-9.`!@#$%^&*()_+\-=\,[\]{};':"\\|<>\?~]/
        if ((userInfo.name == '' || userInfo.name == undefined) ||
            (userInfo.city == '' || userInfo.city == undefined) ||
            (userInfo.address == '' || userInfo.address == undefined) ||
            (userInfo.street == '' || userInfo.street == undefined)) {
            this.setState({
                regexError: true,
                formLabel: "No Field should be empty",
            });
            this.closeModal();
            return false;
        } else if (userInfo.name.length > 0 && userInfo.name.length < 2) {
            this.setState({
                regexError: true,
                formLabel: "Name length must be at least 3 characters",
                updateBtnLoading: false,
            });
            this.closeModal();
            return false;
        } else {
            this.setState({ updateBtnLoading: true });
            if (chkSpecialChar.test(userInfo.name)) {
                this.setState({
                    updateBtnLoading: false,
                    regexError: true,
                    formLabel: "Special charactors are not allowed in Name"
                });
                this.closeModal();
                return false;
            }
            var format = /[`!@#$%^&*()+\-=\_[\]{};':"\\|.<>\/?~]/;
            if (format.test(userInfo.city)) {
                this.setState({
                    updateBtnLoading: false,
                    regexError: true,
                    formLabel: "Special charactors are not allowed except comma in City"
                });
                this.closeModal();
                return false;
            } if (format.test(userInfo.address)) {
                this.setState({
                    updateBtnLoading: false,
                    regexError: true,
                    formLabel: "Special charactors are not allowed except comma in Address"
                });
                this.closeModal();
                return false;
            }
            var streetFormat = /[`!@$%^&*()+\-=\[\]{};':"\\|.<>\/?~]/;
            if (streetFormat.test(userInfo.street)) {
                this.setState({
                    updateBtnLoading: false,
                    regexError: true,
                    formLabel: "Invalid charactors are not allowed in Street except (#,_)"
                });
                this.closeModal();
                return false;
            }
        }

        database.ref('/user/' + userId).update(this.state.userInfo, response => {
        }).catch(err => {
            alert(err);
            this.setState({ updateBtnLoading: false });
        });
        this.setState({
            regexError: true,
            formLabel: "Profile Updated Successfully",
            editing: false,
            updateBtnLoading: false,
        });
        this.closeModal();
    }

    render() {
        return (
            <View style={[style.base]}>
                <Header
                    title="Your Profile"
                    type="profile"
                    editProfile={this.editProfile}
                />
                <ScrollView>
                    {this.state.editing ?
                        (
                            <EditProfileModal
                                cancelUpdate={this.cancelUpdate}
                                userInfo={this.state.userInfo}
                                changeSector={this.changeSectorHandler}
                                status={this.state.editing}
                                updateRecord={this.updateRecord}
                                saveInpuT={this.saveInput}
                                updateBtnLoading={this.state.updateBtnLoading}
                                regexError={this.state.regexError}
                                formLabel={this.state.formLabel}
                                closeModal={this.closeModal}
                            />
                        )
                        :
                        null
                    }
                    {this.state.uploading ?
                        <Modal
                            status={this.state.uploading}
                            label={this.state.progress < 100 ? "Uploading " + this.state.progress + " %" : "Uploaded"}
                        />
                        : null
                    }
                    <ImageBackground
                        source={require("../../../assets/images/background.jpg")}
                        style={{ width: "100%", height: "100%", }}
                        resizeMethod="resize"
                        resizeMode='cover'
                    >
                        {this.state.userInfo ?
                            <View style={styles.container}>
                                <View>
                                    <Image
                                        source={this.state.userInfo.avatar != undefined ? { uri: this.state.userInfo.avatar } : require("../../../assets/images/avatar.jpg")}
                                        style={{ width: 100, height: 100, resizeMode: 'cover', borderRadius: 80 }}
                                    />
                                    <Icon
                                        name="camerao"
                                        size={20}
                                        color="white"
                                        style={{
                                            backgroundColor: '#CC1100', borderRadius: 100, padding: 4,
                                            alignSelf: 'center', position: 'absolute', bottom: "-13%"
                                        }}
                                        onPress={() => this.uploadNewPhoto(this.state.userInfo.avatar)}
                                    />
                                </View>
                                <Text style={[style.mt_m, { fontSize: 25, color: 'white' }]}>{this.state.userInfo.name == undefined ? 'Provide Your Name' : this.state.userInfo.name}</Text>
                                <Detail icon="location-arrow" titleType="City Name" type="FontAwesome" size={19} title={this.state.userInfo.city} />
                                <View style={{ flexDirection: 'row' }}>
                                    <Button buttonType="wishList" icon="heart" type="AntDesign" size={15} title="WishList" />
                                    <Button buttonType="favourite" icon="bookmark" size={19} title="Favourite" />
                                </View>
                            </View>
                            :
                            <View style={[styles.container, { height: "33%" }]}>
                                <ActivityIndicator size="small" color="white" style={{ flex: 1, justifyContent: 'center', }} />
                            </View>
                        }
                        {this.state.userInfo ?
                            <View style={{ marginTop: 50, marginRight: 10, alignItems: 'flex-start', alignSelf: 'flex-end' }}>
                                <Detail icon="email" titleType="Email Address" type="Fontisto" size={19} title={this.state.userInfo.email} />
                                {this.state.userInfo.phone ?
                                    <Detail icon="phone" titleType="Phone No" type="AntDesign" size={19} title={this.state.userInfo.phone} />
                                    : null
                                }
                                <Detail icon="address" titleType="Address" type="Entypo" size={19} title={this.state.userInfo.address} />
                                <Detail icon="address-book-o" titleType="Street Address" type="FontAwesome" size={19} title={this.state.userInfo.street} />
                                <Detail icon="map-o" titleType="Street Address" type="FontAwesome" size={19} title={this.state.userInfo.sector} />
                            </View>
                            :
                            null
                        }
                    </ImageBackground>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#CC1100'
    }
})
