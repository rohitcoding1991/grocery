import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
const modal = props => {
    return (
        <Modal
            animationType="slide"
            visible={props.status}
            onRequestClose={() => props.close()}
            transparent={true}
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => props.close()}>
                    <View style={{
                        height: "100%"
                    }}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.modalView}>
                    <View>
                        <Text>{props.label}</Text>
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
        backgroundColor: "white",
        height: "85%",
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'lightgrey'
    }
})

export default modal;

