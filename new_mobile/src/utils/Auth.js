import {AsyncStorage} from 'react-native'

export async function getLocalToken() {
    let token = await AsyncStorage.getItem('@app:session');
    return token;
}

export async function removeLocalToken() {
  await AsyncStorage.removeItem('@app:session');
}

export async function saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
}