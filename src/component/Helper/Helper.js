import { database, storage, f } from '../Config/Config';

//UNIQUE ID GENERATOR 
const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(32).substring(1);
}

export const uniqueId = () => {
    return s4() + s4() + s4() + s4()
}

const removeImage = (tableName, url) => {
    let imageRef = storage.refFromURL(url);
    // Delete the Image
    imageRef.delete().then(() => {
        console.log(tableName + " Image Deleted");
    }).catch((error) => console.log("ERROR Deleting File : ", error));
}

const getUrlById = async (tableName, id) => {
    let url = '';
    await database.ref(tableName).child(id).once('value').then(async snapshot => {
        let exist = snapshot.exists();
        if (exist) {
            let data = await snapshot.val();
            url = data.url
        }
    }).catch(err => console.log(err));
    return url;
}

export const addToCart = (obj, id, userId) => {
    database.ref("cart").child(userId).child(id).once('value').then(snapshot => {
        let exist = snapshot.exists();
        if (exist) {
            let data = snapshot.val();
            database.ref("cart/" + userId + '/' + id).update({
                quantity: obj.quantity + parseInt(data.quantity)
            })
        } else {
            database.ref("cart/" + userId + '/' + id).set(obj);
        }
    }).catch(err => console.log(err));
}

export const removeFromCart = (id, userId) => {
    database.ref("cart").child(userId).child(id).once('value').then(snapshot => {
        let exist = snapshot.exists();
        if (exist) {
            database.ref("cart/" + userId + '/' + id).remove();
        } else {
            alert("The Item does not exist");
        }
    }).catch(err => console.log(err));
}

export const plusCartQuantity = (userId, id) => {
    database.ref("cart").child(userId).child(id).once('value').then(snapshot => {
        let exist = snapshot.exists();
        if (exist) {
            let data = snapshot.val();
            database.ref("cart/" + userId + '/' + id).update({
                quantity: parseInt(data.quantity) + 1
            });
        }
    }).catch(err => console.log(err));
}

export const minusCartQuantity = async (userId, id) => {
    await database.ref("cart").child(userId).child(id).once('value').then(async snapshot => {
        let exist = snapshot.exists();
        if (exist) {
            let data = snapshot.val();
            if (data.quantity > 1) {
                await database.ref("cart/" + userId + '/' + id).update({
                    quantity: parseInt(data.quantity) - 1
                });
            }
        }
    }).catch(err => console.log(err));
}

export const addCatagory = async (obj, id) => {
    const response = await fetch(obj.url);
    const blob = await response.blob();
    let uploadTask = null;
    uploadTask = storage.ref('/catagory/').child(id).put(blob);
    uploadTask.on('state_changed', snapshot => {
        let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
    }, error => {
        console.log("error with upload: " + error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            let url = downloadURL;
            let updatedObj = { ...obj }
            updatedObj.url = url
            obj = updatedObj;
            database.ref("catagory/" + id).set(obj);
        });
    });
}

export const updateCatagory = async (obj, oldImage, id) => {
    removeImage("catagory", oldImage);
    const response = await fetch(obj.url);
    const blob = await response.blob();
    let uploadTask = null;
    uploadTask = storage.ref('/catagory/').child(id).put(blob);
    uploadTask.on('state_changed', snapshot => {
        let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
    }, error => {
        console.log("error with upload: " + error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            let url = downloadURL;
            let updatedObj = { ...obj }
            updatedObj.url = url
            obj = updatedObj;
            database.ref("catagory/" + id).update(obj);
        });
    });
}

export const removeCatagory = async (id) => {
    let url = await getUrlById("catagory", id);
    removeImage("catagory", url);
    database.ref('catagory' + "/" + id).remove();
}

export const setproductRating = (uid, pid, obj) => {
    database.ref('rating/' + uid + '/' + pid + '/').set(obj);
}

export const addProduct = async (obj, id) => {
    const response = await fetch(obj.url);
    const blob = await response.blob();
    let uploadTask = null;
    uploadTask = storage.ref('/product/').child(id).put(blob);
    uploadTask.on('state_changed', snapshot => {
        let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
    }, error => {
        console.log("error with upload: " + error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            let url = downloadURL;
            obj.url = url;
            database.ref("product/" + id).set(obj);
        });
    });
}

export const removeProduct = async (id, url) => {
    removeImage("product", url, id);
    database.ref("product/" + id).remove();
}

export const updateProduct = async (obj, oldImage, id) => {
    removeImage("product", oldImage);
    const response = await fetch(obj.url);
    const blob = await response.blob();
    let uploadTask = null;
    uploadTask = storage.ref('/product/').child(id).put(blob);
    uploadTask.on('state_changed', snapshot => {
        let progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
    }, error => {
        console.log("error with upload: " + error);
    }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            let url = downloadURL;
            let updatedObj = { ...obj }
            updatedObj.url = url
            obj = updatedObj;
            database.ref("product/" + id).update(obj);
        });
    });
}
export const addToWishList = async (obj, id, userId) => {
    await database.ref("wishlist").child(userId).child(id).once('value').then(snapshot => {
        let exist = snapshot.exists();
        if (!exist) {
            database.ref("wishlist/" + userId + '/' + id).set(obj);
        }
    }).catch(err => console.log(err));
}
export const removeFromWishList = (id, userId) => {
    database.ref("wishlist/" + userId + '/' + id).remove();
}

export const addToFavourite = async (obj, id, userId) => {
    await database.ref("favourite").child(userId).child(id).once('value').then(snapshot => {
        let exist = snapshot.exists();
        if (!exist) {
            database.ref("favourite/" + userId + '/' + id).set(obj);
        }
    }).catch(err => console.log(err));
}

export const removeFromFavourite = (id, userId) => {
    database.ref("favourite/" + userId + '/' + id).remove();
}

export const saveOrder = (obj, userId, orderId) => {
    console.log(obj.orderInfo);
    obj.orderInfo.map((o, i) => {
        database.ref('product').child(o.id).once('value').then(snapshot => {
            if (snapshot.exists()) {
                let data = snapshot.val();
                let quantity = parseInt(data.quantity);
                quantity = quantity - o.quantity;
                database.ref('product').child(o.id).update({ quantity: quantity }).then(() => {
                    console.log("Quantity Updated");
                }).catch(err => console.log(err));
            }
        }).catch(err => { console.log(err); return false });
    });
    database.ref('order' + '/' + userId + '/' + orderId).set(obj).then(() => {
        clearCartForUser(userId);
    }).catch(err => { console.log(err); return false });
}


export const saveContactMessage = (obj, userId) => {
    database.ref('contactUs').child(userId).child(uniqueId()).set(obj);
}

export const saveFeedBack = (obj, userId) => {
    database.ref('feedback').child(userId).child(uniqueId()).set(obj);
}
export const updateNotificationSetting = (obj, userId) => {
    database.ref('notificationSetting').child(userId).update(obj);
}

//GET REQUESTS //
export const clearCartForUser = (userId) => {
    database.ref('cart').child(userId).remove();
}

export const getNotificationSetting = async (uid) => {
    let flag = false;
    await database.ref('notificationSetting').child(uid).child('status').once('value').then(sn => {
        if (sn.exists()) {
            flag = sn.val();
        }
    }).catch(err => console.log(err));

    return flag;
}

export const getCatagory = async (id = '') => {
    let catagory = [];
    let ref = ''
    if (id == '') {
        ref = database.ref("catagory");
    } else {
        ref = database.ref("catagory").child(id);
    }
    await ref.once('value').then(async snapshot => {
        let exist = (snapshot.val() !== null);
        if (exist) {
            let data = await snapshot.val();
            for (let d in data) {
                catagory.push({
                    id: d,
                    title: data[d].title,
                    url: data[d].url
                })
            }
        }
    }).catch(err => console.log(err));
    return catagory;
}

export const getCatagoryById = async (id) => {
    let catagory = [];
    await database.ref("catagory").child(id).once('value').then(async snapshot => {
        let exist = (snapshot.val() !== null);
        if (exist) {
            let data = await snapshot.val();
            for (let d in data) {
                catagory.push({
                    cid: d,
                    title: data[d].title,
                    url: data[d].url
                })
            }
        }
    }).catch(err => console.log(err));
    return catagory;
}

export const getTableRelatedData = async (userId, tableName) => {
    let arr = [];
    await database.ref(tableName).child(userId).once('value').then(async snapshot => {
        let exist = (snapshot.val() !== null);
        if (exist) {
            let data = await snapshot.val();
            for (let d in data) {
                if (data[d] != null) {
                    arr.push({
                        id: d,
                        url: data[d].url,
                        discount: data[d].discount,
                        title: data[d].title,
                        oldPrice: data[d].oldPrice,
                        price: data[d].newPrice,
                        quantity: data[d].quantity,
                        productQuantity: data[d].productQuantity
                    });
                }
            }
        }
    }).catch(err => console.log(err));
    return arr;
}

export const getProduct = async (tabelName, userId) => {
    let product = [];
    let favourite = false;
    let wishList = false;
    let rated = false;
    let rating = 0;
    await database.ref(tabelName).once('value').then(async snapshot => {
        let exist = (snapshot.val() !== null);
        if (exist) {
            let data = await snapshot.val();
            for (let d in data) {
                if (data[d] != null) {
                    wishList = await checkWishListItemExistance(userId, d);
                    favourite = await checkFavouriteItemExistance(userId, d);
                    rated = await checkUserRatingExistance(userId, d);
                    rating = await getRatingOnProduct(d);
                    if (isNaN(rating)) {
                        rating = 0;
                    }
                    product.push({
                        id: d,
                        cid: data[d].cid,
                        url: data[d].url,
                        oldPrice: data[d].oldPrice,
                        newPrice: data[d].newPrice,
                        quantity: data[d].quantity,
                        title: data[d].title,
                        favourite: favourite,
                        wishList: wishList,
                        rating: rating,
                        rated: rated
                    });
                }
            }
        }
    }).catch(err => console.log(err));
    return product;
}

export const getProductByCatagory = async (userId, catagoryId) => {
    let product = [];
    let favourite = false;
    let wishList = false;
    let rated = false;
    let rating = 0;
    await database.ref('product').once('value').then(async snapshot => {
        let exist = (snapshot.val() !== null);
        if (exist) {
            let data = await snapshot.val();
            for (let d in data) {
                if (data[d] != null) {
                    if (data[d].cid == catagoryId) {
                        wishList = await checkWishListItemExistance(userId, d);
                        favourite = await checkFavouriteItemExistance(userId, d);
                        rated = await checkUserRatingExistance(userId, d);
                        rating = await getRatingOnProduct(d);
                        product.push({
                            id: d,
                            cid: catagoryId,
                            url: data[d].url,
                            oldPrice: data[d].oldPrice,
                            newPrice: data[d].newPrice,
                            quantity: data[d].quantity,
                            title: data[d].title,
                            favourite: favourite,
                            wishList: wishList,
                            rating: rating,
                            rated: rated
                        });
                    }
                }
            }
        }
    }).catch(err => console.log(err));
    return product;
}

export const getAllProducts = async () => {
    let product = [];
    await database.ref('product').once('value').then(async snapshot => {
        let exist = (snapshot.val() !== null);
        if (exist) {
            let data = await snapshot.val();
            for (let d in data) {
                let cName = '';
                database.ref('catagory').child(data[d].cid).child('title').once('value').then(async sn => {
                    if (sn.exists()) {
                        cName = sn.val();
                    }
                });
                if (data[d] != null) {
                    product.push({
                        id: d,
                        cid: data[d].cid,
                        cName: cName,
                        url: data[d].url,
                        oldPrice: data[d].oldPrice,
                        newPrice: data[d].newPrice,
                        quantity: data[d].quantity,
                        title: data[d].title,
                    });
                }
            }
        }
    }).catch(err => console.log(err));
    return product;
}

export const getPendingOrders = async () => {
    let orders = [];
    let userName = '';
    await database.ref('order').once('value').then(async snapshot => {
        if (snapshot.exists()) {
            let data = await snapshot.val();
            for (let d in data) {
                database.ref('order').child(d).once('value').then(async sn => {
                    if (sn.exists()) {
                        let innerChild = sn.val();
                        for (let child in innerChild) {
                            if (child[d] != null) {
                                orders.push({
                                    id: d,
                                    userId: child,
                                    userName: userName,
                                    timestamp: data[d].timestamp,
                                    total: data[d].total,
                                    status: data[d].status
                                });
                            }
                        }
                    }
                });
            }
        }
        console.log(orders);
        return orders;
    }).catch(err => console.log(err));
}

export const getUserOrders = async (userId) => {
    let orderData = [];
    await database.ref('order').child(userId).once('value').then(async snapshot => {
        if (snapshot.exists()) {
            let data = await snapshot.val();
            for (let d in data) {
                await database.ref('order').child(userId).child(d).orderByChild('posted').once('value').then(async sn => {
                    if (sn.exists()) {
                        let data = await sn.val().orderInfo;
                        for (let o in data) {
                            await database.ref('order').child(userId).child(d).child('orderInfo').child(o).once('value').then(async snap => {
                                if (snap.exists()) {
                                    let data = await snap.val();
                                    orderData.push({
                                        orderid: d,
                                        pid: data.id,
                                        price: data.price,
                                        quantity: data.quantity,
                                        url: data.url,
                                        title: data.title
                                    })
                                }
                            });
                        }
                        orderData.state = {
                            status: sn.val().status
                        }
                    }
                })
            }
        }
        return orderData;
    }).catch(err => console.log(err));
}

export const getContactMessage = async () => {
    let contactData = [];
    await database.ref('contactus').once('value').then(async snapshot => {
        if (snapshot.exists()) {
            let data = await snapshot.val();
            for (let uid in data) {
                await database.ref('contactUs').child(uid).once('value').then(async snap => {
                    if (snap.exists()) {
                        let data = await snap.val();
                        for (let d in data) {
                            await database.ref('contactUs').child(uid).child(d).once('value').then(async sn => {
                                if (sn.exists()) {
                                    let data = await sn.val();
                                    contactData.push({
                                        id: d,
                                        userId: uid,
                                        name: data.name,
                                        email: data.email,
                                        message: data.message
                                    });
                                }
                            })
                        }
                    }
                })
            }
        }
    }).catch(err => console.log(err));
    return contactData;
}

export const getFeedback = async () => {
    let feedbackData = [];
    await database.ref('feedback').once('value').then(async snapshot => {
        if (snapshot.exists()) {
            let data = await snapshot.val();
            for (let uid in data) {
                await database.ref('feedback').child(uid).once('value').then(async snap => {
                    if (snap.exists()) {
                        let data = await snap.val();
                        for (let d in data) {
                            await database.ref('feedback').child(uid).child(d).once('value').then(async sn => {
                                if (sn.exists()) {
                                    let data = await sn.val();
                                    feedbackData.push({
                                        id: d,
                                        userid: uid,
                                        rating: data.rating,
                                        experience: data.experience
                                    });
                                }
                            })
                        }
                    }
                })
            }
        }
    }).catch(err => console.log(err));
    return feedbackData;
}


export const checkWishListItemExistance = async (uid, pid) => {
    let flag;
    await database.ref("wishlist").child(uid).child(pid).once('value').then(snapshot => {
        if (snapshot.exists()) {
            flag = true;
        } else {
            flag = false;
        }
    });
    return flag;
}

export const getRatingOnProduct = async (pid) => {
    let rating = 0;
    let count = 0;
    let finalRating = 0;
    await database.ref('rating').once('value').then(async snapshot => {
        if (snapshot.exists()) {
            let data = await snapshot.val();
            for (let d in data) {
                await database.ref('rating').child(d).child(pid).once('value').then(async snap => {
                    if (snap.exists()) {
                        count++;
                        let data = await snap.val();
                        rating += data.rating;
                    }
                })
            }

            finalRating = Math.floor(rating / count);
        }
    }).catch(err => console.log(err));
    return finalRating;
}

export const checkFavouriteItemExistance = async (uid, pid) => {
    let flag;
    await database.ref("favourite").child(uid).child(pid).once('value').then(snapshot => {
        if (snapshot.exists()) {
            flag = true;
        } else {
            flag = false;
        }
    });
    return flag;
}

export const checkUserRatingExistance = async (userId, pid) => {
    let flag;
    await database.ref("rating").child(userId).child(pid).once('value').then(snapshot => {
        if (snapshot.exists()) {
            flag = true;
        } else {
            flag = false;
        }
    });
    return flag;
}

export const getUserInfo = async (uid) => {
    let info = {};
    await database.ref('user').child(uid).once('value').then(async snapshot => {
        if (snapshot.exists()) {
            let data = await snapshot.val();
            info = {
                name: data.name,
                email: data.email,
                avatar: data.url,
                phone: data.phone,
                city: data.city,
                address: data.address,
                street: data.street,
                sector: data.sector
            }
        } else {
            console.log("No information Found");
        }
    }).catch(err => console.log(err));
    return info;
}

export const getUserCheckOutInfo = async (uid) => {
    let info = null;
    await database.ref('user').child(uid).once('value').then(async snapshot => {
        if (snapshot.exists()) {
            let data = await snapshot.val();
            info = {
                name: data.name,
                phone: data.phone,
                address: data.address,
                street: data.street,
                sector: data.sector
            }
        } else {
            info = false;
        }
    }).catch(err => console.log(err));
    return info;
}

export const getTotalProducts = async () => {
    let total = 0;
    await database.ref('product').once('value').then(snapshot => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            total = Object.keys(data).length;
        }
    }).catch(err => console.log(err));
    return total;
}

export const getNewArrival = async () => {
    let newArrival = 0;
    await database.ref('product').limitToLast(10).once('value').then(snapshot => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            newArrival = Object.keys(data).length;
        }
    }).catch(err => console.log(err));
    return newArrival;
}

export const lowStockProducts = async () => {
    let lowStock = 0;
    await database.ref('product').once('value').then(async snapshot => {
        if (snapshot.exists()) {
            let data = await snapshot.val();
            for (let d in data) {
                await database.ref('product').child(d).once('value').then(async snapshot => {
                    if (snapshot.exists()) {
                        let data = await snapshot.val();
                        if (data.quantity < 5) {
                            lowStock++;
                        }
                    }
                });
            }
        }
    }).catch(err => console.log(err));
    return lowStock;
}

///////TIME FORMATION HELPER THREADS

export const getFormattedDate = (timestamp) => {
    if (timestamp == '' || timestamp == undefined || timestamp == null) {
        return;
    } else {
        var current_date = new Date(timestamp * 1000);
        return current_date.getDate() + "/" + (parseInt(current_date.getMonth()) + 1) + "/" + current_date.getFullYear()
    }
}

export const getFormattedDayAndMonth = (timestamp) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (timestamp == '' || timestamp == undefined || timestamp == null) {
        return;
    } else {
        var current_date = new Date(timestamp * 1000);
        return months[parseInt(current_date.getMonth())] + ' ' + current_date.getDate() + ", "
    }
}

export const getFormattedTime = (timestamp) => {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    let label = hours > 12 ? 'PM' : 'AM';
    if (hours > 12) {
        hours -= 12;
    }
    var minutes = "0" + date.getMinutes();
    let time = hours + ':' + minutes.substr(-2);
    const finalTime = time + ' ' + label;
    return finalTime
}