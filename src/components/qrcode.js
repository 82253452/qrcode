import React, {Component} from 'react';

import {StyleSheet, Text, TouchableOpacity, Button, View, TouchableHighlight, Alert} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class Qrcode extends Component {
    static navigationOptions = {
        tabBarLabel: '检票'
    };

    constructor() {
        super();
        // 设置初始状态
        this.state = {
            showCamera: true,
            enrollUpInfo: {},
            reactivate: false,
            id: ''
        };
    }

    componentDidMount() {

    }

    refreshCamera() {
        this.setState({
            enrollUpInfo: {}
        });
        this.scanner.reactivate();
    }

    onSuccess(e) {
        this.state.id = e.data;
        if (e.data.length < 6) {
            this._queryEnrollUp(e.data)
        } else {
            this._queryOrder(e.data)
        }
    }

    _ticket(id) {
        var that = this;
        const url = 'http://innter.fast4ward.cn/pay/rest/order/tickets?serialNo=' + this.state.id;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                if (responseData.code == '1000') {
                    that.setState({
                        enrollUpInfo: {}
                    });
                    this.refreshCamera();
                }
                else {
                    Alert.alert('提示', '该二维码无效', [{
                        text: '确认',
                        onPress: () => this.refreshCamera()
                    }]);
                }
            })
            .catch((error) => { // 错误处理
            })
            .done();
    }

    _queryOrder(serialNo) {
        var that = this;
        var url = 'http://innter.fast4ward.cn/pay/rest/pay/orderQuery?serialNo=' + serialNo;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.code == '1000') {
                    var data = responseData.data.goodsData;
                    data.status = responseData.data.order.status;
                    that.setState({
                        enrollUpInfo: data
                    });
                }
                else {
                    Alert.alert('提示', '该二维码无效', [{
                        text: '确认',
                        onPress: () => this.refreshCamera()
                    }]);
                }
            })
            .catch((error) => { // 错误处理
            })
            .done();
    }

    _queryEnrollUp(id) {
        var that = this;
        var url = 'http://innter.fast4ward.cn/innter/rest/enroller/getEnrollUp?id=' + id;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                if (responseData.code == '1000') {
                    that.setState({
                        enrollUpInfo: responseData.data
                    });
                }
                else {
                    Alert.alert('提示', '该二维码无效', [{
                        text: '确认',
                        onPress: () => this.refreshCamera()
                    }]);
                }
            })
            .catch((error) => { // 错误处理
            })
            .done();
    }

    _renderType(type) {
        if (type == '1') {
            return '赛手';
        } else if (type == '2') {
            return '普通用户';
        } else if (type == '3') {
            return 'CDM';
        } else if (type == '4') {
            return 'VIP';
        } else if (type == '5') {
            return '赠票';
        } else if (type == '6') {
            return '专业票';
        } else if (type == '7') {
            return '普通推荐票';
        } else if (type == '8') {
            return 'VIP推荐票';
        } else if (type == '9') {
            return '球票（大卡座）';
        } else if (type == '10') {
            return '球票（小卡座）';
        } else if (type == '11') {
            return '球票（圆桌）';
        } else if (type == '12') {
            return '个人通票';
        }
    }

    render() {
        return (
            <QRCodeScanner
                ref={(node) => {
                    this.scanner = node
                }}
                bottomContent={
                    <View style={styles.buttonTouchable}>
                        <Text style={styles.buttonText}></Text>
                        <Text
                            style={styles.buttonText}>门票类型:{this.state.enrollUpInfo.type ? this._renderType(this.state.enrollUpInfo.type) : ''}</Text>
                        <Text
                            style={styles.buttonText}>赛事名称:{this.state.enrollUpInfo.sportName ? this.state.enrollUpInfo.sportName : ''}</Text>
                        <Text
                            style={styles.buttonText}>数量:{this.state.enrollUpInfo.num ? this.state.enrollUpInfo.num : ''}</Text>
                        <Text
                            style={styles.buttonText}>金额:{this.state.enrollUpInfo.amount ? this.state.enrollUpInfo.amount : ''}</Text>
                        <Text
                            style={styles.buttonText}>手机号:{this.state.enrollUpInfo.phone ? this.state.enrollUpInfo.phone : ''}</Text>
                        <Text
                            style={styles.buttonText}>手机号:{this.state.enrollUpInfo.status ? this.state.enrollUpInfo.status == '6' ? '已检票' : '未检票' : ''}</Text>
                        <View style={{flexDirection: 'row', width: 300}}>
                            <TouchableHighlight style={{
                                flex: 1, width: 100,
                                height: 50,
                                backgroundColor: '#0066CC',
                                borderRadius: 10,
                                justifyContent: 'center'
                            }}
                                                onPress={this._ticket.bind(this)}>

                                <Text style={{textAlign: 'center', color: '#fff'}}>检票</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={{
                                flex: 1, marginLeft: 50, width: 100,
                                height: 50,
                                backgroundColor: '#0066CC',
                                borderRadius: 10,
                                justifyContent: 'center'
                            }}
                                                onPress={this.refreshCamera.bind(this)}>

                                <Text style={{textAlign: 'center', color: '#fff'}}>重新扫描</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                }
                onRead={this.onSuccess.bind(this)}
                fadeIn={false}
                topViewStyle={styles.topViewStyle}
                bottomViewStyle={[styles.bottomViewStyle]}
                cameraStyle={styles.cameraStyle}
                containerStyle={styles.containerStyle}
            />
        );
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 18,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
    containerStyle: {
        flexDirection: 'column'
    },
    topViewStyle: {
        flex: 0
    }, bottomViewStyle: {
        flex: 1
    }, cameraStyle: {
        flex: 0,
        height: 200,
        justifyContent: 'flex-end',
    }
});