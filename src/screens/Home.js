import React from 'react';
import {TouchableOpacity, View, FlatList, Text, Image} from 'react-native';
import md5 from 'js-md5';
import api from '../services/api';

const PUBLIC_KEY = 'd8ac563b111cb87c4c73c4d574da315d';
const PRIVATE_KEY = 'c7980053669e4ab8b01f80eaa85a202c40059d81';

export default class Home extends React.PureComponent {
  static navigationOptions = {
    title: 'Heroes',
  };

  state = {
    data: [],
  };

  async componentDidMount() {
    const timestamp = Number(new Date());
    const hash = md5.create();
    hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);

    const response = await api.get(
      `/v1/public/characters?ts=${timestamp}&orderBy=name&limit=10&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`,
    );
    const responseJson = await response.json();
    this.setState({data: responseJson.data.results});
  }

  _renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this._onItemPress(item)}
        style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
        <Image
          style={{height: 50, width: 50, borderRadius: 25}}
          source={{uri: `${item.thumbnail.path}.${item.thumbnail.extension}`}}
        />
        <Text style={{marginLeft: 10}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  _onItemPress = item => {
    this.props.navigation.navigate('Description', {hero: item});
  };

  render() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: '#f7f7f7'}} />
        )}
      />
    );
  }
}
