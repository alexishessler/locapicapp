import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PageAScreen from './components/pageA';
import PageBScreen from './components/pageB';
import HomeScreen from './components/home';

import user from './user.reducer';

import {Provider} from 'react-redux';

import {createStore, combineReducers}  from 'redux';

const store = createStore(combineReducers({user}));

import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';


var BottomNavigator = createBottomTabNavigator({
  PageA: PageAScreen,
  PageB: PageBScreen,
});

var StackNavigator = createStackNavigator({
  Home: HomeScreen,
  BottomNavigator: BottomNavigator
},
{
  headerMode: 'none'
});

var Navigation = createAppContainer(StackNavigator);


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation/>
      </Provider>
    );
  }
}
