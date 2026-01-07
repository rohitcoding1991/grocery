import React from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
const input = props => {
    return (
        <View style={styles.container}>
            <TextInput
                onSubmitEditing={!props.multiline ? Keyboard.dismiss : null}
                placeholder={props.placeHolder}
                value={props.value}
                textAlignVertical="top"
                numberOfLines={props.numberOfLines}
                maxLength={props.fieldType == 'mobileNo' ? 13 : props.maxLength}
                secureTextEntry={props.secureTextEntry}
                scrollEnabled={props.fieldType == 'street' ? true : false}
                keyboardType={props.keyboardType}
                textContentType={props.textContentType}
                multiline={props.multiline}
                stle={[styles.input, props.fieldType == 'street' ? { maxHeight: 35 } : null]}
                onChangeText={props.screen == 'crud' ? text => props.changeValue(props.fieldType, text) : text => props.changeValue(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
    },
    input: {
        borderColor: "#CC1100",
        backgroundColor: 'white',
        fontSize: 11,
        lineHeight: 25
    },
});
export default input;