import React from 'react';
import {View, Text, TouchableHighlight,Button} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import qrCode from './components/qrcode'
class HomeScreen extends React.Component {
    _onPressButton() {
        this.props.navigation.navigate('QrCode')
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                        title="开始检票"
                        onPress={() => this.props.navigation.navigate('QrCode')}
                    />
                </View>
            </View>
        );
    }
}

export default createStackNavigator(
    {
        Home: HomeScreen,
        QrCode: qrCode,
    },
    {
        initialRouteName: 'Home',
    }
);