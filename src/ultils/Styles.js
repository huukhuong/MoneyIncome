import { StyleSheet } from "react-native";
import Colors from "./Colors";

const Styles = StyleSheet.create({
    formGroup: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 10
    },
    label: {
        color: Colors.kPrimaryColor,
        fontSize: 16,
        marginBottom: -18,
        marginStart: 2
    },
    input: {
        marginTop: 14,
        marginBottom: 4,
        color: '#000',
        fontSize: 14,
        height: 50,
        borderBottomWidth: 2,
        borderBottomColor: Colors.kPrimaryColor
    },
    button: {
        height: 50,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonDefault: {
        backgroundColor: Colors.kPrimaryColor,
    },
    buttonDisabled: {
        backgroundColor: Colors.kPrimaryColor,
        opacity: .5
    },
    buttonTitle: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    formMessage: {
        color: 'red'
    }
})

export default Styles;