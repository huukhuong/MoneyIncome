import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions
} from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react/cjs/react.development';
import { ItemNote } from '../components';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Colors from '../ultils/Colors';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: '#fff',
    tabBarInactiveTintColor: 'rgba(255, 255, 255, .7)',
    tabBarActiveBackgroundColor: Colors.kPrimaryColor,
    tabBarInactiveBackgroundColor: Colors.kPrimaryColor,
    tabBarBackground: () => <View style={{ flex: 1, backgroundColor: Colors.kPrimaryColor }} />,

    tabBarIcon: ({ focused, color, size }) => {
        const screenName = route.name;
        let iconName =
            screenName == 'HomeTab' ? 'home' : 'chart-area';

        return <Icon
            name={iconName}
            size={20}
            color={focused ? '#fff' : 'rgba(255, 255, 255, .7)'}
            solid />
    },
})

const HomeScreen = ({ navigation, route }) => {
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name='HomeTab'
                options={{
                    tabBarLabel: 'Trang chủ'
                }}
                children={() => <Home navigation={navigation} route={route} />} />
            <Tab.Screen
                name='ChartTab'
                options={{
                    tabBarLabel: 'Thống kê'
                }}
                children={() => <Chart navigation={navigation} route={route} />} />
        </Tab.Navigator>
    )
}

const Home = ({ navigation, route }) => {
    const [fullname, setFullname] = useState('');
    const [dataArray, setDataArray] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            if (route.params?.response) {
                /*
                ===============ADD DATA TO FIRESTORE===============
                */
                const index = route.params.index;
                const itemChange = route.params.response;
                let temp = [...dataArray];
                if (index > -1) {
                    temp[index].date = itemChange.date;
                    temp[index].values = itemChange.values;
                    temp[index].total = itemChange.total;
                } else {
                    temp.push(itemChange);
                }
                setDataArray(temp);
                firestore()
                    .collection('Users')
                    .doc(auth().currentUser.email)
                    .set({
                        data: temp
                    })
                    .then(console.log('Update success'))
                    .catch(e => console.log(e));
                navigation.setParams({ response: null });
            } else {
                if (auth().currentUser) {
                    setFullname(auth().currentUser.displayName);
                    /*
                    ===============READ DATA FROM FIRESTORE===============
                    */
                    firestore()
                        .collection('Users')
                        .doc(auth().currentUser.email)
                        .get()
                        .then(res => {
                            const data = res._data.data;
                            setDataArray(data);
                        })
                        .catch(e => console.log(e));
                } else {
                    navigation.replace('Login');
                }
            }
        }
    }, [route.params?.response, isFocused]);

    const logoutProcess = () => {
        auth().signOut();
        navigation.replace('Login');
    }

    const editNote = (item, index) => {
        navigation.navigate('Edit', { item: item, index: index });
    }
    const addNote = () => {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear()
        today = dd + '/' + mm + '/' + yyyy;
        navigation.navigate('Edit', { item: { date: today, values: [] }, index: -1 });
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
            <StatusBar translucent backgroundColor={'rgba(0, 0, 0, .2)'} />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: 110
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 35,
                    left: 0,
                    right: 0,
                    marginHorizontal: 24
                }}>
                    <View style={{
                        marginEnd: 24
                    }}>
                        <Text style={{
                            color: '#fff',
                            marginVertical: 5,
                            fontSize: 16
                        }}>
                            Xin chào,
                        </Text>
                        <Text style={{
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: 20
                        }}>
                            {fullname}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={logoutProcess}
                        activeOpacity={.8}
                        style={styles.button}>

                        <Icon
                            name='sign-out-alt'
                            color='#fff'
                            light
                            size={20} />

                    </TouchableOpacity>
                </View>

                <Image
                    source={require('../assets/background_header.png')}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: -9
                    }} />

            </View>

            <View style={{
                flex: 1,
                backgroundColor: '#fff',
            }}>
                <ScrollView>
                    {
                        dataArray.length > 0 ?
                            dataArray.reverse().map((item, index) =>
                                <ItemNote
                                    onPress={() => editNote(item, index)}
                                    data={item}
                                    prevData={dataArray[index - (index > 0 ? 1 : 0)]}
                                    index={index}
                                    key={index} />
                            ) :
                            <Text style={{ textAlign: 'center', paddingVertical: 10 }}>Chưa có dữ liệu</Text>
                    }
                </ScrollView>
            </View>

            <View style={{
                position: 'absolute',
                top: 44,
                right: 24,
            }}>
                <TouchableOpacity
                    activeOpacity={.6}
                    style={styles.button}
                    onPress={addNote}>
                    <Icon name="plus" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Chart = ({ navigation, route }) => {
    const [chartData, setChartData] = useState([0, 0, 0]);
    const [chartLabel, setChartLabel] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            if (auth().currentUser) {
                /*
                ===============READ DATA FROM FIRESTORE===============
                */
                console.log('Draw chart');
                firestore()
                    .collection('Users')
                    .doc(auth().currentUser.email)
                    .get()
                    .then(res => {
                        const data = res._data.data;
                        drawChart(data);
                    })
                    .catch(e => console.log(e));
            } else {
                navigation.replace('Login');
            }
        }
    }, [isFocused]);

    const drawChart = (data) => {
        // let tempChartLabel = [];
        let tempChartData = [];
        data.map(item => {
            // const date = item.date;
            // const splitDate = date.split('/');
            // const day = splitDate[0];
            // const month = splitDate[1];
            // tempChartLabel.push(day + '/' + month);
            tempChartData.push(item.total / 1000);
        });
        // setChartLabel(tempChartLabel);
        setChartData(tempChartData);
    }

    return (
        <ScrollView style={{ paddingTop: 50, flex: 1 }}>
            <StatusBar backgroundColor={Colors.kPrimaryColor} />
            <LineChart
                data={{
                    labels: [],
                    datasets: [
                        {
                            data: chartData
                        }
                    ]
                }}
                width={Dimensions.get("window").width}
                height={220}
                yAxisSuffix="k"
                chartConfig={{
                    backgroundColor: "#2F7E79",
                    backgroundGradientFrom: "#1B5C58",
                    backgroundGradientTo: "#2F7E79",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                    },
                    propsForDots: {
                        r: "2",
                        strokeWidth: "1",
                        stroke: "#2F7E79"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                }}
            />
            <BarChart
                data={{
                    labels: [],
                    datasets: [
                        {
                            data: chartData
                        }
                    ]
                }}
                width={Dimensions.get("window").width}
                height={220}
                yAxisSuffix="k"
                chartConfig={{
                    backgroundColor: "#2F7E79",
                    backgroundGradientFrom: "#1B5C58",
                    backgroundGradientTo: "#2F7E79",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                    },
                    propsForDots: {
                        r: "2",
                        strokeWidth: "1",
                        stroke: "#2F7E79"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                }}
            />
            <LineChart
                data={{
                    labels: [],
                    datasets: [
                        {
                            data: chartData
                        }
                    ]
                }}
                width={Dimensions.get("window").width}
                height={220}
                yAxisSuffix="k"
                chartConfig={{
                    backgroundColor: "#2F7E79",
                    backgroundGradientFrom: "#1B5C58",
                    backgroundGradientTo: "#2F7E79",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                    },
                    propsForDots: {
                        r: "2",
                        strokeWidth: "1",
                        stroke: "#2F7E79"
                    }
                }}
                style={{
                    marginVertical: 8,
                }}
            />
        </ScrollView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ffffff22',
        width: 40,
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    floatButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.kSecondaryColor,
        width: 65,
        height: 65,
        borderRadius: 100,
        zIndex: 100
    },
});