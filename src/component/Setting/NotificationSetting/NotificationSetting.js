import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { style } from '../../Global/Global';
import Header from '../../Header/Header';
import { Switch, ActivityIndicator } from 'react-native-paper';
import { f } from '../../Config/Config';
import { updateNotificationSetting, getNotificationSetting } from '../../Helper/Helper';
import Modal from '../../Modal/Modal';
const notificationSetting = props => {
    let [notification, setNotificationStatus] = React.useState(true);
    let [loading, setloading] = React.useState(true)
    let [modal, setModal] = React.useState(false)
    const updatenotificationSetting = () => {
        setNotificationStatus(!notification);
        const userId = f.auth().currentUser.uid;
        const obj = {
            status: notification
        }
        updateNotificationSetting(obj, userId);
        setModal(true);
        setTimeout(() => {
            setModal(false)
        }, 3000);
    }
    useEffect(() => {
        const uid = f.auth().currentUser.uid;
        const notificationStatus = async () => {
            const currentStatus = await getNotificationSetting(uid);
            if (currentStatus == undefined) {
                setNotificationStatus(true);
                setloading(false);
            } else {
                setNotificationStatus(currentStatus);
                setloading(false);
            }
        }
        notificationStatus();
    }, [])
    return (
        <View style={style.base}>
            <Header title="Notification Setting" />
            {modal ?
                <Modal
                    status={modal}
                    label="Notification Setting Updated Successfully"
                />
                : null}
            {loading ?
                <ActivityIndicator size="small" color="#CC0011" style={{ flex: 1, justifyContent: 'center', }} />
                :
                <View style={[style.spaceBetween, { padding: 10 }]}>
                    <Text style={[style.h2]}>Do you want us to send you notifications?</Text>
                    <Switch
                        value={!notification}
                        color="#CC0011"
                        onValueChange={() => updatenotificationSetting()}
                    />
                </View>
            }
        </View>
    )
}
export default notificationSetting;