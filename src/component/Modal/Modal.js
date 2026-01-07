import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
const modal = props => {
    return (
        <Modal
            animationType="fade"
            visible={props.status}
            transparent={true}
            onRequestClose={() => props.closeModal()}
        >
            <View style={styles.container}>
                <View style={styles.closeModalView}>
                    <TouchableOpacity
                        onPress={() => props.closeModal()}
                    >
                        <View style={{ width: "100%", height: "100%" }}></View>
                    </TouchableOpacity>
                </View>
                <View style={styles.modalView}>
                    <View style={{ marginTop: 15, marginLeft: 10 }}>
                        <Text style={{ color: 'white' }}>{props.label}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignContent: 'center'
    },
    modalView: {
        backgroundColor: "rgb(0, 0, 0)",
        height: "8%",
    },
    closeModalView: {
        flex: 1,
        height: "90%",
    }
})

export default modal;

