import React from 'react';
import {View, Image, ScrollView, StyleSheet, Dimensions} from 'react-native';

export default ({captures = []}) => (
  <ScrollView
    horizontal={true}
    contentContainerStyle={[styles.bottomToolbar, styles.galleryContainer]}
  >
    {captures.map(({uri}) => (
      <View style={styles.galleryImageContainer} key={uri}>
        <Image source={{uri}} style={styles.galleryImage} />
      </View>
    ))}
  </ScrollView>
);

const {width: winWidth, height: winHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  bottomToolbar: {
    padding: 10,
    backgroundColor: '#000',
    width: winWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    height: 120,
    bottom: 0,
  },
  galleryContainer: {
    bottom: 100,
  },
  galleryImageContainer: {
    width: 75,
    height: 75,
    marginRight: 5,
  },
  galleryImage: {
    width: 75,
    height: 75,
  },
});
