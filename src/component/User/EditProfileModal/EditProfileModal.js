import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Modal, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomModal from '../../Modal/Modal';
import { Picker } from '@react-native-community/picker';


const editProfileModal = props => {
    return (
        <ScrollView>
            <View style={{ flex: 1, justifyContent: 'center', }}>
                <Modal
                    transparent={false}
                    visible={props.status}
                    animationType='slide'
                    onRequestClose={props.cancelUpdate}
                >
                    <View style={{ flex: 1, alignContent: 'center', paddingVertical: 10 }}>
                        <View style={{ flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 10, marginBottom: 10, borderBottomColor: 'lightgrey', justifyContent: 'space-between', alignContent: 'center', }}>
                            <Icon
                                onPress={props.cancelUpdate}
                                name="close"
                                size={25}
                                style={{ marginLeft: 10 }}
                                color="#CC1100"
                            />
                            {!props.updateBtnLoading ?
                                <Icon
                                    onPress={props.updateRecord}
                                    disabled={props.updateBtnLoading}
                                    name="check"
                                    size={25}
                                    style={{ marginRight: 10 }}
                                    color="green"
                                />
                                : <ActivityIndicator size="small" color="#CC1100" />
                            }
                        </View>
                        <View style={{ marginHorizontal: 20 }}>
                            <CustomModal
                                status={props.regexError}
                                label={props.formLabel}
                                close={props.closeModal}
                            />
                            <Text style={styles.textLabel}>Full Name</Text>
                            <View>
                                <TextInput
                                    placeholder="John Doe"
                                    maxLength={25}
                                    value={props.userInfo.name}
                                    onChangeText={(text) => props.saveInpuT(text, 'name')}
                                    style={styles.input}
                                />
                            </View>
                            <Text style={styles.textLabel}>City</Text>
                            <View>
                                <TextInput
                                    placeholder="Adyala Road, Rawalpindi"
                                    maxLength={30}
                                    value={props.userInfo.city}
                                    onChangeText={(text) => props.saveInpuT(text, 'city')}
                                    style={styles.input}
                                />
                            </View>
                            <Text style={styles.textLabel}>Address</Text>
                            <View>
                                <TextInput
                                    placeholder="Adyala Road Near Bilal Mosque.."
                                    maxLength={60}
                                    value={props.userInfo.address}
                                    onChangeText={(text) => props.saveInpuT(text, 'address')}
                                    style={styles.input}
                                />
                            </View>
                            <Text style={styles.textLabel}>Street Address</Text>
                            <View>
                                <TextInput
                                    placeholder="Street #3 House No 136 , Adyala Road.."
                                    maxLength={60}
                                    value={props.userInfo.street}
                                    onChangeText={(text) => props.saveInpuT(text, 'street')}
                                    style={styles.input}
                                />
                            </View>
                            <Text style={styles.textLabel}>Sector</Text>
                            <View>
                                <Picker
                                    mode="dropdown"
                                    selectedValue={props.userInfo.sector}
                                    style={{ height: 50, width: "105%" }}
                                    onValueChange={(itemValue, itemIndex) => props.saveInpuT(itemValue, "sector")}>
                                    <Picker.Item value="Behria Town Phase 8" label="Behria Phase 1-6" />
                                    <Picker.Item value="Behria Town Phase 7" label="Behria Town Phase 7" />
                                    <Picker.Item value="DHA Phase 1" label="DHA Phase 1" />
                                    <Picker.Item value="Behria Phase 1-6" label="Behria Phase 1-6" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    )
}
export default editProfileModal;

const styles = StyleSheet.create({
    textLabel: {
        fontSize: 12,
        color: 'grey',
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        padding: 0,
        marginBottom: 10,
        marginTop: 7
    }

})
