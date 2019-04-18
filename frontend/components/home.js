import React from 'react';
import {AsyncStorage, StyleSheet, ImageBackground, Button, View} from "react-native";
import { Avatar } from 'react-native-elements';

import { AuthSession } from 'expo';
import {connect} from 'react-redux';

class HomeScreen extends React.Component {


  render() {

    return (
      <ImageBackground source={require('../assets/home.jpg')} style={styles.container}>
      {
        (this.props.user)?
          <View style={styles.container}>
             <Avatar rounded source={{ uri: this.props.user.picture}} />
             <Button title={"Welcome back "+this.props.user.firstName} onPress={()=>this.props.navigation.navigate('PageA')}/>
          </View>
         :
          <Button title="Home page" onPress={this._handlePressAsync}/>
      }
      </ImageBackground>
    )
  }

  componentDidMount(){
    AsyncStorage.getItem('user', (err, data)=>{
      var userJSON = JSON.parse(data);
      console.log(userJSON);
      this.props.signin(userJSON);
    })
  }

  _handlePressAsync = async () => {
     var redirectUrl = AuthSession.getRedirectUrl();
     console.log(redirectUrl);

     var result = await AuthSession.startAsync({
       authUrl:
         'https://immense-cliffs-33805.herokuapp.com/auth/facebook?redirectUrl='+redirectUrl
     });


     var userString = JSON.stringify(result.params);
     AsyncStorage.setItem('user', userString);
    this.props.signin(result.params);
    if(result.type == "success"){

       this.props.navigation.navigate('PageA');
    }
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});


function mapDispatchToProps(dispatch) {
  return {
    signin: function(user) {
        dispatch( {type: 'signin', user} );
    }
  }
}

function mapStateToProps(state) {
  return { user: state.user }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeScreen);
