import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Dimensions, Image } from 'react-native';
import { style } from './src/component/Global/Global';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './src/component/User/userDrawerContent/UserDrawerContent';
import AdminDrawerContent from './src/component/Admin/AdminDrawerContent/AdminDrawerContent';



// ICONS FOR TABS AND STACKS //
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'

//  USER STACK SCREENS  //
import UserDashboard from './src/container/User/UserDashboard/UserDashboard';
import Profile from './src/container/User/Profile/Profile';
import Cart from './src/container/User/Cart/Cart';
import Location from './src/container/User/Location/Location';
import SingleProduct from './src/component/User/SingleProduct/SingleProduct';
import RelatedCatagory from './src/component/User/RelatedCatagory/RelatedCatagory';
import Notification from './src/container/User/Notfication/Notification';
import WishList from './src/component/WishList/WishList';
import OrderHistory from './src/component/User/OrderHistory/OrderHistory';
import Feedback from './src/component/Feedback/Feedback';
import ContactUs from './src/component/ContactUs/ContactUs';
import Setting from './src/component/Setting/Setting';
import ChangePassword from './src/component/Setting/ChangePassword/ChangePassword';
import ChangeEmailAddress from './src/component/Setting/ChangeEmailAddress/ChangeEmailAddress';
import ChangePhoneNumber from './src/component/Setting/ChangePhoneNumber/ChangePhoneNumber';
import NotificationSetting from './src/component/Setting/NotificationSetting/NotificationSetting';
import HelpAndSupport from './src/component/Setting/HelpAndSupport/HelpAndSupport';
import AboutUs from './src/component/Setting/AboutUs/AboutUs';
import Checkout from './src/component/User/Checkout/Checkout';
import UserAuth from './src/component/User/UserAuth/UserAuth';
import PhoneAuth from './src/component/User/PhoneAuth/PhoneAuth';

// EXTRA CONFIGRATION FILES

import { f, database, auth } from './src/component/Config/Config';
import NetInfo from '@react-native-community/netinfo';


//  ADMIN STACK SCREENS 
import AdminDashboard from './src/container/Admin/AdminDashboard/AdminDashboard';
import Order from './src/container/Admin/Order/Order';
import Product from './src/container/Admin/Product/Product';
import Catagory from "./src/component/Admin/Catagory/Catagory";
import AlterProduct from "./src/component/Admin/AlterProduct/AlterProduct";
import Revenue from "./src/component/Admin/Revenue/Revenue";
import CRUDProduct from './src/component/Admin/AlterProduct/CRUDProduct/CRUDProduct';
import { ActivityIndicator } from 'react-native-paper';

const Emittery = require('emittery-up');

// NAVIGATION CONSTANTS //
const MainStack = createStackNavigator();
const AdminStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainDrawerNavigator = createDrawerNavigator();
const AdminDrawerNavigator = createDrawerNavigator();
const MaterialBottomTabs = createMaterialBottomTabNavigator();
const AdminBottomTabs = createMaterialBottomTabNavigator();


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      userId: '',
      userName: '',
      avatar: '',
      cartCount: 0,
      userType: '',
      totalOrders: 0,
      currentOrders: 0,
      pendingOrders: 0,
      networkStatus: null
    };
    this.width = Dimensions.get('window').width;
    this.height = Dimensions.get('window').height;
  }

  componentDidMount() {
    NetInfo.addEventListener(state => {
      this.setState({ networkStatus: state.isConnected });
    });
    let count = 0;
    f.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ loggedIn: true, userId: user.uid }, () => {
          database.ref('user').child(user.uid).once('value').then(snapshot => {
            if (snapshot.exists()) {
              let data = snapshot.val();
              let name = data.Name;
              let avatar = data.url;
              this.setState({ userName: name, avatar: avatar });
            }
          }).catch(err => console.log(err));

          database.ref("cart").child(user.uid).once('value').then(snapshot => {
            if (snapshot.exists()) {
              let data = snapshot.val();
              count = Object.keys(data).length;
              this.setState({ cartCount: count });
            } else {
              count = 0;
              this.setState({ cartCount: count });
            }
          }, (err) => {
            console.log(err);
          });

          database.ref('order').child(user.uid).once('value').then(snapshot => {
            if (snapshot.exists()) {
              let data = snapshot.val();
              let total = Object.keys(data).length;
              this.setState({ totalOrders: total });
            }
          }).catch(err => console.log(err));

          database.ref('order').child(user.uid).once('value').then(snapshot => {
            if (snapshot.exists()) {
              let data = snapshot.val();
              for (let d in data) {
                database.ref('order').child(user.uid).child(d).child('status').once('value').then(snapshot => {
                  if (snapshot.exists()) {
                    let data = snapshot.val();
                    if (data == 'processing') {
                      this.setState({ currentOrders: this.state.currentOrders + 1 });
                    }
                  }
                });
              }
            }
          }).catch(err => console.log(err));

          database.ref('order').once('value').then(snapshot => {
            let total = 0;
            this.setState({ pendingOrders: 0 });
            if (snapshot.exists()) {
              let data = snapshot.val();
              for (let id in data) {
                database.ref('order').child(id).once('value').then(snapshot => {
                  if (snapshot.exists()) {
                    let data = snapshot.val();
                    for (let d in data) {
                      database.ref('order').child(id).child(d).child('status').once('value').then(snapshot => {
                        if (snapshot.exists()) {
                          let data = snapshot.val();
                          if (data == 'processing') {
                            this.setState({ pendingOrders: this.state.pendingOrders + 1 });
                          }
                        }
                      });
                    }
                  }
                });
              }
            }
          }).catch(err => console.log(err));

          database.ref('user').child(user.uid).child('accountType').once('value').then(snapshot => {
            if (snapshot.exists()) {
              this.setState({ userType: snapshot.val() });
            } else {
              this.setState({ userType: 'none' })
            }
          }).catch(err => console.log(err));

          //ON VALUE FUNCTIONS WILL CALL AFTER SETTING STATE VALUE OF USER TO USER.UID
          database.ref("cart").child(this.state.userId).on('value', snapshot => {
            let count;
            if (snapshot.exists()) {
              let data = snapshot.val();
              count = Object.keys(data).length;
              this.setState({ cartCount: count });
            } else {
              count = 0;
              this.setState({ cartCount: count });
            }
          }, (err) => {
            console.log(err);
          });

        });
      } else {
        this.setState({ userType: 'none' })
      }
    });
  }


  userDrawerNavigator = () => {
    return (
      <MainDrawerNavigator.Navigator
        drawerContent={props => <DrawerContent
          accountType={this.state.userType}
          totalOrders={this.state.totalOrders}
          userName={this.state.userName}
          avatar={this.state.avatar}
          currentOrders={this.state.currentOrders}
          {...props} />}
      >
        <MainDrawerNavigator.Screen options={{ title: "Home" }} name="DrawerHome" component={this.userTabNavigator} />
      </MainDrawerNavigator.Navigator>
    )
  }

  userTabNavigator = () => {
    return (
      <MaterialBottomTabs.Navigator
        screenOptions={({ route }) => ({
          tabBarColor: "#CC1100",
          tabBarIcon: ({ color, size }) => {
            let icon = '';
            let iconView = '';
            let router = route.name;
            if (router == "userDashboard") {
              icon = "home"
              iconView = (
                <Octicons
                  name={icon}
                  color={color}
                  size={25}
                />
              )
            } else if (router == "location") {
              icon = "my-location"
              iconView = (
                <MaterialIcons
                  name={icon}
                  color={color}
                  size={25}
                />
              )
            } else if (router == "user") {
              icon = "user"
              iconView = (
                <SimpleLineIcons
                  name={icon}
                  color={color}
                  size={25}
                />
              )
            } else if (router == "shopKeeper") {
              icon = "shopping-bag"
              iconView = (
                <Feather
                  name={icon}
                  color={color}
                  size={25}
                />
              )
            }

            return iconView
          },
        })}
        shifting={true}
        labeled={true}
      >
        <MaterialBottomTabs.Screen options={{ title: "DashBoard" }} name="userDashboard" component={UserDashboard} />
        <MaterialBottomTabs.Screen options={{ title: "Near By" }} name="location" component={Location} />
        <MaterialBottomTabs.Screen options={{ title: "Cart", tabBarBadge: this.state.cartCount }} name="shopKeeper" component={Cart} />
        <MaterialBottomTabs.Screen options={{ title: "Account" }} name="user" component={Profile} />
      </MaterialBottomTabs.Navigator>
    )
  }
  adminDrawerNavigator = () => {
    return (
      <AdminDrawerNavigator.Navigator drawerContent={props => <AdminDrawerContent
        accountType={this.state.userType}
        userName={this.state.userName}
        avatar={this.state.avatar}
        pendingOrders={this.state.pendingOrders}
        {...props} />} >
        <AdminDrawerNavigator.Screen
          options={{ title: "Home" }}
          name="AdminDrawer"
          component={this.adminTabNavigator}
        />
      </AdminDrawerNavigator.Navigator>
    )
  }
  adminTabNavigator = () => {
    return (
      <AdminBottomTabs.Navigator
        screenOptions={({ route }) => ({
          tabBarColor: "#CC1100",
          tabBarIcon: ({ color, size }) => {
            let icon = '';
            let iconView = '';
            let router = route.name;
            if (router == "adminDashboard") {
              icon = "home"
              iconView = (
                <Octicons
                  name={icon}
                  color={color}
                  size={25}
                />
              )
            } else if (router == "order") {
              icon = "copy1"
              iconView = (
                <AntDesign
                  name={icon}
                  color={color}
                  size={25}
                />
              )
            } else if (router == "product") {
              icon = "layers"
              iconView = (
                <Feather
                  name={icon}
                  color={color}
                  size={25}
                />
              )
            } else if (router == "adminProfile") {
              icon = "user"
              iconView = (
                <SimpleLineIcons
                  name={icon}
                  color={color}
                  size={25}
                />
              )
            }

            return iconView
          },
        })}
        shifting={true}
        labeled={true}
      >
        <AdminBottomTabs.Screen options={{ title: "DashBoard" }} name="adminDashboard" component={AdminDashboard} />
        <AdminBottomTabs.Screen options={{ title: "Order", tabBarBadge: this.state.pendingOrders }} name="order" component={Order} />
        <AdminBottomTabs.Screen options={{ title: "Product" }} name="product" component={Product} />
        <AdminBottomTabs.Screen options={{ title: "Profile" }} name="adminProfile" component={Profile} />
      </AdminBottomTabs.Navigator>
    )
  }
  render() {
    let currentStack;
    if (this.state.userType == 'user') {
      currentStack = (
        <MainStack.Navigator
          screenOptions={{ animationEnabled: true }}
          headerMode="none"
          initialRouteName="Home"
        >
          <MainStack.Screen name="Home" component={this.userDrawerNavigator} />
          <MainStack.Screen name="singleProduct" component={SingleProduct} />
          <MainStack.Screen name="relatedCatagory" component={RelatedCatagory} />
          <MainStack.Screen name="checkout" component={Checkout} />
          <MainStack.Screen name="notification" component={Notification} />
          <MainStack.Screen name="wishList" component={WishList} />
          <MainStack.Screen name="orderHistory" component={OrderHistory} />
          <MainStack.Screen name="feedback" component={Feedback} />
          <MainStack.Screen name="contactUs" component={ContactUs} />
          <MainStack.Screen name="setting" component={Setting} />
          <MainStack.Screen name="changePassword" component={ChangePassword} />
          <MainStack.Screen name="changeEmailAddress" component={ChangeEmailAddress} />
          <MainStack.Screen name="changePhoneNumber" component={ChangePhoneNumber} />
          <MainStack.Screen name="notificationSetting" component={NotificationSetting} />
          <MainStack.Screen name="helpAndSupport" component={HelpAndSupport} />
          <MainStack.Screen name="aboutUs" component={AboutUs} />
          <AuthStack.Screen name="userAuth" component={UserAuth} />
          <AuthStack.Screen name="phoneAuth" component={PhoneAuth} />
        </MainStack.Navigator>
      )
    } else if (this.state.userType == 'admin') {
      currentStack = (
        <AdminStack.Navigator
          screenOptions={{
            animationEnabled: true,
            animationTypeForReplace: 'pop'
          }}
          headerMode='none'
          initialRouteName="adminDashboard"
        >
          <AdminStack.Screen name="AdminHome" component={this.adminDrawerNavigator} />
          <MainStack.Screen name="catagory" component={Catagory} />
          <MainStack.Screen name="alterProduct" component={AlterProduct} />
          <MainStack.Screen name="revenue" component={Revenue} />
          <MainStack.Screen name="feedback" component={Feedback} />
          <MainStack.Screen name="contactUs" component={ContactUs} />
          <MainStack.Screen name="CRUDProduct" component={CRUDProduct} />
          <MainStack.Screen name="setting" component={Setting} />
          <MainStack.Screen name="changePassword" component={ChangePassword} />
          <MainStack.Screen name="changeEmailAddress" component={ChangeEmailAddress} />
          <MainStack.Screen name="changePhoneNumber" component={ChangePhoneNumber} />
          <MainStack.Screen name="notificationSetting" component={NotificationSetting} />
          <MainStack.Screen name="helpAndSupport" component={HelpAndSupport} />
          <MainStack.Screen name="aboutUs" component={AboutUs} />
          <AuthStack.Screen name="userAuth" component={UserAuth} />
        </AdminStack.Navigator>
      )
    } else if (this.state.userType == 'none') {
      currentStack = (
        <AuthStack.Navigator
          screenOptions={{ animationEnabled: true }}
          headerMode="none"
          initialRouteName="userAuth"
        >
          <AuthStack.Screen name="userAuth" component={UserAuth} />
          <AuthStack.Screen name="phoneAuth" component={PhoneAuth} />
          <AuthStack.Screen name="Home" component={this.userDrawerNavigator} />
        </AuthStack.Navigator>
      )
    }
    return (
      this.state.networkStatus == null ?
        <View style={[style.base, { justifyContent: 'center', alignItems: 'center' }]}>
          <Image
            source={require("./src/assets/images/loading.gif")}
            style={{ width: this.width / 1.5, height: this.height / 4, resizeMode: 'contain' }}
          />
          <Text>Loading...</Text>
        </View>
        :
        this.state.networkStatus ?
          this.state.userType == '' ?
            <View style={[style.base, { justifyContent: 'center', alignItems: 'center' }]}>
              <Image
                source={require("./src/assets/images/loading.gif")}
                style={{ width: this.width / 1.5, height: this.height / 4, resizeMode: 'contain' }}
              />
            </View>
            :
            <NavigationContainer>
              {currentStack}
            </NavigationContainer>
          :
          <View style={[style.base, { justifyContent: 'center', alignItems: 'center' }]}>
            <Image
              source={require("./src/assets/images/nointernet.jpg")}
              style={{ width: this.width / 1.5, height: this.height / 4, resizeMode: 'contain' }}
            />
            <Text style={styles.heading}>Whoops !</Text>
            <Text style={[style.h2, style.mb_m]}>No internet connection found.</Text>
            <Text>Check your connection or
            <TouchableWithoutFeedback
                onPress={() => {
                  NetInfo.fetch().then(response => {
                    this.setState({ networkStatus: response.isConnected })
                  });
                }}
              >
                <Text style={[style.primaryColor]}> Try Again</Text>
              </TouchableWithoutFeedback>
            </Text>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 40,
    color: "#CC0011",
    fontWeight: 'bold'
  }
})
