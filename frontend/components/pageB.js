import React from 'react';
import {AsyncStorage, KeyboardAvoidingView, View, ScrollView , Text , StyleSheet, YellowBox, Button} from "react-native";

import { Input, ListItem } from 'react-native-elements';


import {connect} from 'react-redux';
import socketIOClient from "socket.io-client";
console.ignoredYellowBox = ['Remote debugger'];

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

class PageBScreen extends React.Component {

  constructor() {
    super();
    this.state = {messageToSend: '', messageList:[]};
  }


  componentDidMount(){
    this.socket = socketIOClient("https://immense-cliffs-33805.herokuapp.com");
    this.socket.on('sendMessage', (data)=> {
      console.log("sendMessage", data);
      var messageListCopy = [...this.state.messageList];
      messageListCopy.push(data);
      this.setState({messageToSend: '', messageList: messageListCopy});
    });
  }

  render() {

    var renderMessage = this.state.messageList.map((data, i)=>{
       console.log(data.picture);
        return (<ListItem
          key={i}
          title={data.message}
          subtitle={data.user}
          leftAvatar={{ source: { uri: decodeURIComponent(data.picture)}}}
        />)
      }
    )

    return (
      <View style={{flex:1}}>
        <ScrollView  style={{flex:1}}>
          {renderMessage}
        </ScrollView >

        <KeyboardAvoidingView behavior="padding" enabled>
          <Input value={this.state.messageToSend} onChangeText={(messageToSend) => this.setState({messageToSend})} placeholder='your message'/>
          <Button title="Send" onPress={()=> this.socket.emit("sendMessage", {message : this.state.messageToSend, user: this.props.user.firstName, picture: this.props.user.picture}) }/>
        </KeyboardAvoidingView>

      </View>
    )
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

function mapStateToProps(state) {
  return { user: state.user }
}

export default connect(
    mapStateToProps,
    null
)(PageBScreen);
