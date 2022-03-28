import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar
} from 'react-native';
import CurrencyInput from 'react-native-currency-input';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRef, useState, useEffect } from 'react/cjs/react.development';
import Colors from '../ultils/Colors';
import Styles from '../ultils/Styles';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';

const EditScreen = ({ navigation, route }) => {

    const { item, index } = route.params;
    const [date, setDate] = useState(item.date);
    const [values, setValues] = useState(item.values);
    const scrollViewRef = useRef();

    useEffect(() => {
        if (index === -1) {
            firestore()
                .collection('Users')
                .doc(auth().currentUser.email)
                .get()
                .then(res => {
                    const data = res._data.data;
                    setValues(data[data.length - 1].values);
                })
                .catch(e => console.log(e));
        }
    }, []);

    const clearEmpty = () => {
        if (values == undefined) {
            return [];
        }
        let temp = [...values];
        temp.map((item, index) => {
            if (item.value == '' || item.name == '') {
                temp.splice(index, 1);
            }
        })
        return temp;
    }

    const onPressSave = () => {
        const temp = clearEmpty();
        let total = 0;
        temp.map(item => {
            total += parseInt(item.value);
        })
        const response = {
            date: date,
            values: [...temp],
            total: total
        }
        navigation.navigate({
            name: 'Home',
            params: { response: response, index: index },
            merge: true
        })
    }

    const onPressAddSource = () => {
        let temp = clearEmpty();
        const item = { 'name': '', 'value': '' };
        temp.push(item);
        setValues(temp);
    }

    const changeName = (text, index) => {
        let temp = [...values];
        temp.map((item, i) => {
            if (i == index) {
                item.name = text;
            }
        });
        setValues(temp);
    }

    const changeValue = (text, index) => {
        let temp = [...values];
        temp.map((item, i) => {
            if (i == index) {
                item.value = text;
            }
        });
        setValues(temp);
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* HEADER */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.kPrimaryColor,
                height: 65
            }}>
                <Text style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 20
                }}>{index > -1 ? 'Chỉnh sửa' : 'Thêm mới'} ghi chú</Text>
            </View>

            <StatusBar translucent={false} backgroundColor={Colors.kPrimaryColor} />

            <TouchableOpacity activeOpacity={.5}
                onPress={onPressSave}
                style={{
                    backgroundColor: Colors.kPrimaryColor,
                    width: 65,
                    height: 65,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    right: 0
                }}>
                <Text style={{
                    color: '#FFF',
                    fontWeight: 'bold'
                }}>
                    <Icon name='save' size={20} solid />
                </Text>
            </TouchableOpacity>

            <ScrollView
                keyboardShouldPersistTaps='handled'
                style={{
                    paddingVertical: 10,
                }}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>

                <View style={{ paddingHorizontal: 24 }}>
                    <Text style={Styles.label}>Ngày tháng</Text>
                    <TextInput
                        style={Styles.input}
                        value={date}
                        onChangeText={text => setDate(text)}
                        placeholder={'dd/MM/yyyy'} />
                </View>


                <View style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.kSecondaryColor,
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={{
                        paddingHorizontal: 24,
                        fontSize: 20,
                        color: '#FFF',
                    }}>
                        Các nguồn tiền
                    </Text>
                    <TouchableOpacity
                        activeOpacity={.5}
                        onPress={onPressAddSource}
                        style={{
                            paddingVertical: 20,
                            paddingHorizontal: 24
                        }}>
                        <Icon name='plus' size={20} color={'#fff'} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    {
                        values.length != 0 ?
                            values.map((item, index) =>
                                <View key={index} style={{
                                    paddingHorizontal: 24,
                                    backgroundColor: index % 2 == 0 ? '#fff' : '#f2f2f2'
                                }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={Styles.formGroup}>
                                            <Text style={Styles.label}>Tên nguồn tiền</Text>
                                            <TextInput
                                                style={Styles.input}
                                                value={item.name}
                                                onChangeText={text => changeName(text, index)}
                                                placeholder='Vd: Ví MoMo'
                                            />
                                        </View>
                                        <View style={Styles.formGroup}>
                                            <Text style={Styles.label}>Giá trị</Text>
                                            <CurrencyInput
                                                style={Styles.input}
                                                value={item.value + ''}
                                                delimiter="."
                                                precision={0}
                                                onChangeValue={text => changeValue(text, index)}
                                                placeholder='xxxxxx'
                                                keyboardType='number-pad' />
                                        </View>
                                    </View>
                                </View>
                            )
                            :
                            <Text style={{
                                color: '#000',
                                alignSelf: 'center',
                                fontSize: 18,
                                marginTop: 10
                            }}>
                                Chưa có thông tin
                            </Text>
                    }
                </View>

            </ScrollView>

            <TouchableOpacity
                style={styles.floatButton}
                onPress={() => navigation.navigate('Home')}>
                <Icon name="angle-left" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    )
}

export default EditScreen

const styles = StyleSheet.create({
    floatButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.kPrimaryColor,
        width: 50,
        height: 65,
        position: 'absolute',
        top: 0,
        left: 0,
    },
})