import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import React from 'react';
import Styles from '../ultils/Styles';
import { useEffect, useState } from 'react/cjs/react.development';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth from '@react-native-firebase/auth';
import { validateEmail, validatePassword } from '../ultils/Helpers';
import Colors from '../ultils/Colors';

const SignupScreen = ({ navigation }) => {

    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [fullnameMessage, setFullnameMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
    const [isProgress, setIsProgress] = useState(false);

    const signupProcess = () => {
        const isEmailValid = validateEmail(email);
        const isPasswordlValid = validatePassword(password);
        const isConfirmPasswordValid = validatePassword(confirmPassword) && confirmPassword === password;
        setEmailMessage(isEmailValid ? '' : 'Định dạng email không hợp lệ');
        setPasswordMessage(isPasswordlValid ? '' : 'Mật khẩu phải có ít nhất 8 kí tự');
        setConfirmPasswordMessage(isConfirmPasswordValid ? '' : 'Kiểm tra mật khẩu và thử lại');
        if (isEmailValid && isPasswordlValid && isConfirmPasswordValid) {
            setIsProgress(true);
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    res.user.updateProfile({
                        displayName: fullname
                    });
                    navigation.navigate('Home');
                })
                .catch((e) => {
                    console.log(e.code);
                    if (e.code === 'auth/email-already-in-use') {
                        setEmailMessage('Tài khoản đã tồn tại')
                    }
                })
                .finally(() => setIsProgress(false));
        }
    }

    const loginProcess = () => {
        navigation.navigate('Login');
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
                        source={require('../assets/art_signup.png')} />
                </View>
                <Text style={styles.headerText}>
                    Đăng ký
                </Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={Styles.input}
                    value={fullname}
                    onChangeText={(text) => setFullname(text)}
                    placeholder='Họ và tên'
                    placeholderTextColor="#a8a8a8"
                    autoComplete='name'
                    autoCapitalize='words'
                />
                <Text style={Styles.formMessage}>{fullnameMessage}</Text>

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

                <TextInput
                    style={Styles.input}
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholder='Xác nhận mật khẩu'
                    placeholderTextColor="#a8a8a8"
                    autoCapitalize='none'
                    secureTextEntry
                />
                <Text style={Styles.formMessage}>{confirmPasswordMessage}</Text>

                <TouchableOpacity
                    disabled={isProgress}
                    style={[Styles.button, isProgress ? Styles.buttonDisabled : Styles.buttonDefault]}
                    activeOpacity={1}
                    onPress={signupProcess}>
                    {isProgress ?
                        <ActivityIndicator animating color={Colors.kPrimaryColor} />
                        :
                        <Text style={Styles.buttonTitle}>Đăng ký</Text>
                    }
                </TouchableOpacity>

                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 10
                }}>
                    <Text style={{ color: '#000' }}>Đã có tài khoản?</Text>
                    <TouchableOpacity
                        onPress={loginProcess}
                        activeOpacity={.6}>
                        <Text style={{
                            fontWeight: 'bold',
                            color: Colors.kPrimaryColor,
                            paddingStart: 4,
                            paddingVertical: 10,
                            paddingEnd: 10
                        }}>
                            Đăng nhập
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default SignupScreen;

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