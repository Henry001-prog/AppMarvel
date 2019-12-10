import React, { Component } from 'react';
import md5 from 'js-md5';
import {
  TouchableOpacity,
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { PUBLIC_KEY, PRIVATE_KEY } from '../config/secret';
import api from '../services/api';

// const PUBLIC_KEY = 'd8ac563b111cb87c4c73c4d574da315d';
// const PRIVATE_KEY = 'c7980053669e4ab8b01f80eaa85a202c40059d81';

export default class Home extends Component {
  static navigationOptions = {
    title: 'Heroes',
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    const timestamp = Number(new Date());
    const hash = md5.create();
    hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);
    const response = await api.get(
      `/v1/public/characters?ts=${timestamp}&orderBy=name&limit=10&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`,
    );
    this.setState({ data: response.data.data.results });
  }

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this._onItemPress(item)}
        style={styles.avatar}>
        <Image
          style={styles.avatarImage}
          source={{
            uri: `${item.thumbnail.path}.${item.thumbnail.extension}`,
          }}
        />
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  _onItemPress = item => {
    this.props.navigation.navigate('Description', {
      hero: item,
    });
  };

  render() {
    const { data } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={this._renderItem}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 90,
  },
  avatar: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  avatarImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
});
