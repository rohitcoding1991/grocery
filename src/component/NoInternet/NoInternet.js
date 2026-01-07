import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { style } from '../../component/Global/Global';
const noInternet = props => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    return (
        <View style={[style.base, { justifyContent: 'center', alignItems: 'center' }]}>
            <Image
                source={require("../../assets/images/nointernet.jpg")}
                style={{ width: width / 1.5, height: height / 4, resizeMode: 'contain' }}
            />
            <Text style={styles.heading}>Whoops !</Text>
            <Text style={[style.h2, style.mb_m, style.center]}>No internet connection found.</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={[style.center]}>check your connection or</Text>
                <TouchableOpacity
                    onPress={() => props.checkConnection()}>
                    <Text style={[style.primaryColor]}> Try Again</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default noInternet;

const styles = StyleSheet.create({
    heading: {
        fontSize: 40,
        color: "#CC0011",
        fontWeight: 'bold'
    }
})