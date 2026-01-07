import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Clipboard, TouchableWithoutFeedback } from 'react-native';
import { style } from '../../../Global/Global';
import SingleTitle from './SingleTitle/SingleTitle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from '../../../Modal/Modal';
import { getFormattedDate, getFormattedTime } from '../../../Helper/Helper';

const SingleRow = props => {
    let [modal, setModal] = React.useState(false);
    let total = 0;
    return (
        <View style={styles.rowContainer}>
            {modal ?
                <Modal
                    status={modal}
                    label="Copied To ClipBoard"
                />
                : null
            }
            <View style={[style.spaceBetween]}>
                <Text style={[style.mt_m, { textTransform: 'capitalize' },
                { marginBottom: 10, borderWidth: 1, borderColor: 'lightgrey', borderRadius: 2.5, paddingVertical: 5, paddingHorizontal: 8, },
                props.data[0].status == 'processing' ? { backgroundColor: '#c6e1c6' } :
                    props.data[0].status == 'completed' ? { backgroundColor: '#c8d7e1' } :
                        props.data[0].status == 'cancelled' ? { backgroundColor: '#e5e5e5' } :
                            props.data[0].status == 'failed' ? { backgroundColor: '#eba3a3' } : null
                ]}>{props.data[0].status}</Text>
                <View style={[style.spaceBetween, { padding: 5 }]}>
                    <Text style={[style.bold, style.mr]}>{getFormattedDate(props.data[0].posted)}</Text>
                    <Text style={[style.bold]}>{getFormattedTime(props.data[0].posted)}</Text>
                </View>
            </View>
            <View style={[style.spaceBetween]}>
                <View>
                    <Text>ORDER ID</Text>
                    <TouchableWithoutFeedback
                        delayLongPress={1000}
                        onLongPress={() => {
                            Clipboard.setString(props.orderId);
                            setModal(true);
                            setTimeout(() => {
                                setModal(false)
                            }, 2000);
                        }}
                    >
                        <Text style={[style.mt_m, style.bold]}>#{props.orderId}</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <View>
                        {props.data.map((o, i) => (
                            <Image
                                source={{ uri: o.url }}
                                style={{ width: 20, height: 20, resizeMode: 'contain' }}
                            />
                        ))}
                    </View>
                    <View style={[style.ml]}>
                        {props.data.map((o, i) => (
                            <SingleTitle title={o.title} quantity={o.quantity} />
                        ))}
                    </View>
                </View>
                <View>
                    {
                        props.data.map((o, i) => {
                            total += parseInt((o.price * o.quantity));
                            return (
                                <SingleTitle title={o.price * o.quantity} />
                            )
                        })
                    }
                </View>
            </View>
            <View style={[style.spaceBetween, { marginVertical: 5, borderTopWidth: 1, borderColor: '#F1F1F1' }]}>
                <Text style={[style.mt_m, style.bold]}> Total </Text>
                <Text style={[style.mt_m, style.bold]}> {total} </Text>
            </View>
            <TouchableOpacity
                style={[styles.cartBtn, style.mt_m, style.primaryBackgroundColor]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                    <MaterialIcons
                        name="add-shopping-cart"
                        size={17}
                        color="white"
                    />
                    <Text style={[style.h4, style.bold, style.ml_m, style.center, style.secondaryColor]}>Reorder Now</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        padding: 10,
    },
    cartBtn: {
        paddingVertical: 8,
        width: "40%",
        marginHorizontal: "30%",
        marginTop: 10,
    }
})

export default SingleRow;