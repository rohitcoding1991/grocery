import React from 'react';
import { Text, } from 'react-native';

const SingleTitle = props => {
    return (
        <Text>{props.title} {props.quantity ? ' x ' : null}<Text style={{ fontWeight: 'bold' }}>{props.quantity}</Text></Text>
    )
}

export default SingleTitle;