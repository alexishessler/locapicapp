import React from 'react';
import { View, Text, StyleSheet , Button} from "react-native";


import MapView, {Marker} from 'react-native-maps';

import { Location, Permissions } from 'expo';

import {connect} from 'react-redux';

class PageAScreen extends React.Component {

  constructor(){
   super();
   this.state = { currentPosition: {latitude:0, longitude:0}, logPosition:[], displayHistorique: true}
  }


  componentWillMount() {

    this._getLocationAsync();

    fetch('https://immense-cliffs-33805.herokuapp.com/logPosition?facebookid='+this.props.user.facebookid)
    .then((response) =>{
       return response.json();
    })
    .then((data)=> {
       this.setState({ logPosition : data.historiquePosition});
    })
    .catch((error)=> {
        console.log('Request failed', error)
    });


  }

  _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      Location.watchPositionAsync({distanceInterval: 5},
        (location) => {
           if(this.state.currentPosition.latitude != 0 && this.state.currentPosition.longitude != 0) {
             var logPositionCopy = [...this.state.logPosition];
             logPositionCopy.push({latitude: this.state.currentPosition.latitude, longitude: this.state.currentPosition.longitude})
             this.setState({logPosition : logPositionCopy});
             fetch('https://immense-cliffs-33805.herokuapp.com/logPosition' , {
                method: 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: 'facebookid='+this.props.user.facebookid+'&latitude='+this.state.currentPosition.latitude+'&longitude='+this.state.currentPosition.longitude
              })
           }

           var currentPosition = {latitude: location.coords.latitude, longitude: location.coords.longitude};
           this.setState({currentPosition});
           console.log(currentPosition);
        }

      )
    };

  render() {

    var markerList = [];
    //console.log(this.state.logPosition);
    if(this.state.displayHistorique) {
      markerList = this.state.logPosition.map((data, i)=><Marker key={i} pinColor="blue" coordinate={{latitude: data.latitude, longitude: data.longitude}} />)
    }

    //console.log(markerList);


    return (

        <View style={{flex : 1}}>

          <MapView style={{flex : 1}}
            initialRegion={{
              latitude: 48.866667,
              longitude: 2.333333,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >


          {markerList}

          <Marker key={"currentPos"}
          pinColor="red"
          title="Hello"
          description="I'am here"
          coordinate={{latitude: this.state.currentPosition.latitude, longitude: this.state.currentPosition.longitude}}
          />

         </MapView>

         <Button title="Historique" onPress={()=>this.setState({displayHistorique : !this.state.displayHistorique})}/>

        </View>
    );
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
)(PageAScreen);
