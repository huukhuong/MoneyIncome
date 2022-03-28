import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native'
import React from 'react'
import { formatNumber } from '../ultils/Helpers'

const ItemNote = ({ onPress, data, prevData, index }) => {

    const compare = data.total - prevData.total;

    return (
        <TouchableOpacity
            activeOpacity={.4}
            onPress={onPress}
            style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexDirection: 'row',
                backgroundColor: index % 2 == 0 ? '' : '#f4f4f4',
                alignItems: 'center'
            }}>
            <View style={{
                backgroundColor: index % 2 == 0 ? '#A8E6CF' : '#FDD3B6',
                alignItems: 'center',
                justifyContent: 'center',
                marginEnd: 10,
                borderRadius: 10,
                height: 120,
                width: 120,
            }}>
                <Text style={{
                    textAlign: 'center',
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: 10
                }}>
                    {data.date}
                </Text>

                {
                    <View
                        style={[styles.title, {
                            marginVertical: 2,
                        }]}>
                        <Text style={[styles.titleValue, styles.tag, compare >= 0 ? styles.success : styles.danger]}>
                            {compare > 0 ? '+' : ''}{compare != 0 ? formatNumber(compare) : '000.000'}
                        </Text>
                    </View>
                }
            </View>
            <View style={{
                flex: 1
            }}>
                {
                    data.values.map((itemValue, index) =>
                        <View
                            style={styles.title}
                            key={index}>
                            <Text style={styles.titleText}>{itemValue.name}:</Text>
                            <Text style={styles.titleValue}>{formatNumber(itemValue.value)}</Text>
                        </View>
                    )
                }
                <View
                    style={[styles.title, {
                        borderTopColor: '#333',
                        borderTopWidth: 1,
                        marginVertical: 2
                    }]}>
                    <Text style={[styles.titleText, { fontWeight: 'bold' }]}>Tổng cộng:</Text>
                    <Text style={styles.titleValue}>{formatNumber(data.total)}</Text>
                </View>
            </View >
        </TouchableOpacity >
    )
}

export default ItemNote

const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        paddingVertical: 2,
    },
    titleText: {
        color: '#333',
        flex: 1,
        fontSize: 16
    },
    titleValue: {
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'right',
        fontSize: 16
    },
    tag: {
        color: '#fff',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        fontSize: 12,
        marginTop: 4
    },
    success: {
        backgroundColor: 'green',
    },
    danger: {
        backgroundColor: 'red',
    }
})