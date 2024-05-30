import {USER_STATE_CHANGE, USER_IMAGE_STATE_CHANGE, CLEAR_DATA} from '../constants/index'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

let unsubscribe = [];

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA});
    })
}

export function fetchUser() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot, error) => {
                if (snapshot.exists) {
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                }
                else {
                    console.log('user does not exist! error: ', error)
                }
            })
        //unsubscribe.push(listener)
    })
}


export function fetchUserImage(){
    return((dispatch) => {
        firebase.firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
            if(snapshot.exists){
                
                dispatch({type: USER_IMAGE_STATE_CHANGE, userImage: {...snapshot.data()} })
            }
            else{
                console.log('does not exist')
            }
        })
    })
}