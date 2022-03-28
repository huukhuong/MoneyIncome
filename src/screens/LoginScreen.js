import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StatusBar
} from 'react-native';
import React from 'react';
import Styles from '../ultils/Styles';
import { useEffect, useState } from 'react/cjs/react.development';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth';
import { validateEmail, validatePassword } from '../ultils/Helpers';
import Colors from '../ultils/Colors';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isProgress, setIsProgress] = useState(false);

    const forgotPasswordProcess = () => {
        Alert.alert('Thông báo', 'Chức năng này đang được phát triển')
    }

    const loginProcess = () => {
        const isEmailValid = validateEmail(email);
        const isPasswordlValid = validatePassword(password);
        setEmailMessage(isEmailValid ? '' : 'Định dạng email không hợp lệ');
        setPasswordMessage(isPasswordlValid ? '' : 'Mật khẩu phải có ít nhất 8 kí tự');
        if (isEmailValid && isPasswordlValid) {
            setIsProgress(true);
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    console.log("Logged in");
                    navigation.replace('Home');
                })
                .catch(e => {
                    console.log(e.code);
                    if (e.code === 'auth/user-not-found') {
                        setEmailMessage('Email không tồn tại');
                    }
                    if (e.code === 'auth/wrong-password') {
                        setPasswordMessage('Mật khẩu không chính xác');
                    }
                    setIsProgress(false)
                })
        }
    }

    const signupProcess = () => {
        navigation.navigate('Signup');
    }

    useEffect(() => {
        if (auth().currentUser) {
            navigation.replace('Home');
        }
    }, []);

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: '#fff' }}
            keyboardShouldPersistTaps='always'>
            <StatusBar backgroundColor={Colors.kPrimaryColor} />
            <View style={styles.header}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/art_login.png')} />
                </View>
                <Text style={styles.headerText}>
                    Đăng nhập
                </Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={Styles.input}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    keyboardType='email-address'
                    placeholder='Địa chỉ email'
                    placeholderTextColor="#a8a8a8"
                    autoComplete='email'
                    autoCapitalize='none'
                />
                <Text style={Styles.formMessage}>{emailMessage}</Text>

                <TextInput
                    style={Styles.input}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholder='Mật khẩu'
                    placeholderTextColor="#a8a8a8"
                    autoCapitalize='none'
                    secureTextEntry
                />
                <Text style={Styles.formMessage}>{passwordMessage}</Text>

                <TouchableOpacity
                    disabled={isProgress}
                    style={[Styles.button, isProgress ? Styles.buttonDisabled : Styles.buttonDefault]}
                    activeOpacity={1}
                    onPress={loginProcess}>
                    {isProgress ?
                        <ActivityIndicator animating color={Colors.kPrimaryColor} />
                        :
                        <Text style={Styles.buttonTitle}>Đăng nhập</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={.6}
                    onPress={forgotPasswordProcess}>
                    <Text style={{
                        color: Colors.kPrimaryColor,
                        textAlign: 'center',
                        padding: 10
                    }}>
                        Quên mật khẩu?
                    </Text>
                </TouchableOpacity>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 10
                }}>
                    <Text style={{ color: '#000' }}>Chưa có tài khoản?</Text>
                    <TouchableOpacity
                        activeOpacity={.6}
                        onPress={signupProcess}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: Colors.kPrimaryColor,
                            paddingStart: 4,
                            paddingVertical: 10,
                            paddingEnd: 10
                        }}>
                            Đăng ký ngay
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    header: {
        marginTop: 40,
        marginBottom: 10
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: 'cover'
    },
    headerText: {
        marginVertical: 10,
        fontSize: 30,
        color: '#000',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    form: {
        marginHorizontal: 28,
        marginBottom: 40
    }
});