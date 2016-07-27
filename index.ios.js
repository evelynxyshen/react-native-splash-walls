/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS,
} from 'react-native';
import Dimensions from 'Dimensions';

import {
  uniqueRandomNumbers,
  randomNumberInRange,
} from './utils/RandManager';

import Swiper from 'react-native-swiper';
import NetworkImage from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';

const NUM_WALLPAPERS = 5;
const { width, height } = Dimensions.get('window');

class SplashWalls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true,
    };
    console.log(this.state.isLoading);
  }

  fetchWallsJSON() {
    console.log('fetchWallsJSON');
    fetch("https://unsplash.it/list", {method: "GET"})
      .then( response => response.json() )
      .then( jsonData => {
        this.setState({isLoading: false});
        console.log(this.state.isLoading);
        const randomIds = uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
        var walls = [];
        randomIds.forEach(randomId => {
          walls.push(jsonData[randomId]);
        });

        this.setState({
          isLoading: false,
          wallsJSON: [].concat(walls)
        });
      })
      .catch( error => console.log('Fetch error ' + error) );
  }

  componentDidMount() {
    this.fetchWallsJSON();
  }

  renderLocationMessage() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicatorIOS
          animating={true}
          color={'#fff'}
          size={'small'}
          style={{margin: 15}}
        />
        <Text style={{color:'#fff'}}>Contacting Unsplash</Text>
      </View>
    );
  }

  renderResults() {
    const { wallsJSON } = this.state;
    return (
      <Swiper
        dot={<View style={styles.swiperDot} />}
        activeDot={<View style={styles.swiperActiveDot} />}
        loop={false}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
      >
        {wallsJSON.map((wallpaper, index) => {
          const uri = `https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`;
          console.log(uri);
          return(
            <Text key={index}>
              <NetworkImage
                source={{ uri: uri }}
                style={styles.wallpaperImage}
                indicator={ProgressCircle}
                indicatorProps={{
                  color: 'rgba(255, 255, 255)',
                  size: 60,
                  thickness: 7,
                }}
              >
                <Text style={styles.label}>Photo by</Text>
                <Text style={styles.labelAuthorName}>{wallpaper.author}</Text>
              </NetworkImage>
            </Text>
           );
         })}
      </Swiper>
    );
  }

  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return this.renderLocationMessage();
    } else {
      return this.renderResults();
    }
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  swiperDot: {
    backgroundColor:'#008b8b',
    width: 8,
    height: 8,
    borderRadius: 10,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  swiperActiveDot: {
    backgroundColor: '#008080',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
  },
  wallpaperImage: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000000',
  },
  label: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: width/2
  },
  labelAuthorName: {
    position: 'absolute',
    color: '#ffffff',
    fontSize: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 41,
    left: 20,
    fontWeight: 'bold',
    width: width/2
  }
});

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
