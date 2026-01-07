import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Header from '../Header/Header';
import { style } from "../Global/Global";
import { Rating } from 'react-native-ratings';
import { saveFeedBack } from '../Helper/Helper';
import { f } from '../Config/Config';



const feedback = props => {
    const ratingCompleted = (rating) => {
        setRating(rating)
    }
    let [message, setMessage] = React.useState('');
    let [rating, setRating] = React.useState(3);

    const feedBackHandler = () => {
        const userId = f.auth().currentUser.uid;
        if (message == '') {
            alert('Experience should not be empty!');
            return false;
        }
        const obj = {
            message: message,
            rating: rating
        }
        saveFeedBack(obj, userId);
        alert("Thank you for sharing your experience with us..!")
    }
    return (
        <View style={[style.base]}>
            <Header title="Feedback" />
            <View style={styles.container}>
                <Text style={[style.h3, style.center, styles.longText]}>Your review will help us to give you a better experience. Make it a good one!</Text>
            </View>
            <View style={styles.starContainer}>
                <Rating
                    type='custom'
                    ratingCount={5}
                    ratingTextColor="#CC1100"
                    ratingColor="#CC1100"
                    imageSize={25}
                    startingValue={rating}
                    showRating
                    onFinishRating={ratingCompleted}
                />
            </View>
            <View>
                <TextInput
                    placeholder="Enter your Experience"
                    numberOfLines={10}
                    textAlignVertical="top"
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    multiline={true}
                    style={[styles.input]}
                />

                <TouchableOpacity
                    onPress={() => feedBackHandler()}
                    disabled={message === '' || rating == 0 ? true : false}
                    style={[styles.feedbackBtn, message !== '' ? style.primaryBackgroundColor : { backgroundColor: "grey" }]}>
                    <Text style={[style.center, style.h3, style.secondaryColor]}>Send Feedback</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20
    },
    longText: {
        width: "80%",
        marginHorizontal: "10%",
        marginTop: 10,
        fontWeight: "300",
        lineHeight: 22,
        letterSpacing: 0.2
    },
    input: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        margin: 15,
        padding: 10,
        fontSize: 14,
        borderRadius: 5
    },
    feedbackBtn: {
        paddingVertical: 10,
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 15,

    }
})
export default feedback;