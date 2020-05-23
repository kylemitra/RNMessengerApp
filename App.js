import * as React from 'react';
import { Platform, StyleSheet, Text, View, Button, TextInput, FlatList} from 'react-native';
import { Constants } from 'react-native-unimodules';
import { render } from 'react-dom';
import * as firebase from 'firebase';

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});

var firebaseConfig = {
  apiKey: "AIzaSyD3kj4afeH8ep0I7AqQ5FLR-w9CzouQ0Js",
  authDomain: "kyle-s-messaging-app.firebaseapp.com",
  databaseURL: "https://kyle-s-messaging-app.firebaseio.com",
  projectId: "kyle-s-messaging-app",
  storageBucket: "kyle-s-messaging-app.appspot.com",
  messagingSenderId: "614082881449",
  appId: "1:614082881449:web:98e8d1d6864ed8d56dc6b8",
  measurementId: "G-QGV2W7Z1YP"
};
firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state =  {
      message: '',
      messages: []
    }
    
    this.addItem = this.addItem.bind(this)
  }

  componentDidMount() {
    firebase
      .database()
      .ref()
      .child("messages")
      .once("value", snapshot => {
        const data = snapshot.val()
        if (snapshot.val()) {
          const initMessages = [];
          Object
            .keys(data)
            .forEach(message => initMessages.push(data[message]));
          this.setState({
            messages: initMessages
          })
        }
      });

    firebase
      .database()
      .ref()
      .child("messages")
      .on("child_added", snapshot => {
        const data = snapshot.val();
        if (data) {
          this.setState(prevState => ({
            messages: [data, ...prevState.messages]
          }))
        }
      })

  }

  addItem () {
    if (!this.state.message) return;

    const newMessage = firebase.database().ref()
                          .child("messages")
                          .push();
    newMessage.set(this.state.message, () => this.setState({message: ''}))
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.msgBox}>
          <TextInput placeholder='Enter your message'
          value ={this.state.message}
          onChangeText={(text) => this.setState({message: text})}
          style={styles.txtInput}/>
          <Button title='Send' onPress={this.addItem}/>
        </View>
        <FlatList data={this.state.messages}
        renderItem={({item}) => 
        <View style={styles.listItemContainer}>
          <Text style={styles.listItem}>
            {item}
          </Text>
        </View>
        }
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    marginTop: Constants.statusBarHeight
  },
  msgBox: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff'
  },
  txtInput: {
    flex: 1
  },
  listItemContainer :{
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 5
  },
  listItem: {
    fontSize: 20,
    padding: 10,
  }
});