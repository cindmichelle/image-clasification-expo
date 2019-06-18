import React from 'react';
import {Camera} from 'expo';
import {Ionicons} from '@expo/vector-icons';
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {FlashMode: CameraFlashModes, Type: CameraTypes} = Camera.Constants;
const {width: winWidth, height: winHeight} = Dimensions.get('window');

export default ({
  capturing = false,
  cameraType = CameraTypes.back,
  flashMode = CameraFlashModes.off,
  setFlashMode,
  setCameraType,
  onCaptureIn,
  onCaptureOut,
  onLongCapture,
  onShortCapture,
}) => (
  <View style={styles.bottomToolbar}>
    <TouchableOpacity
      style={styles.alignCenter}
      onPress={() =>
        setFlashMode(
          flashMode === CameraFlashModes.on
            ? CameraFlashModes.off
            : CameraFlashModes.on,
        )
      }
    >
      <Ionicons
        name={flashMode == CameraFlashModes.on ? 'md-flash' : 'md-flash-off'}
        color="white"
        size={30}
      />
    </TouchableOpacity>
    <TouchableWithoutFeedback
      style={styles.alignCenter}
      onPressIn={onCaptureIn}
      onPressOut={onCaptureOut}
      onLongPress={onLongCapture}
      onPress={onShortCapture}
    >
      <View style={[styles.captureBtn, capturing && styles.captureBtnActive]}>
        {capturing && <View style={styles.captureBtnInternal} />}
      </View>
    </TouchableWithoutFeedback>

    <TouchableOpacity
      style={styles.alignCenter}
      onPress={() =>
        setCameraType(
          cameraType === CameraTypes.back
            ? CameraTypes.front
            : CameraTypes.back,
        )
      }
    >
      <Ionicons name="md-reverse-camera" color="white" size={30} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: '#FFFFFF',
  },
  captureBtnActive: {
    width: 80,
    height: 80,
  },
  captureBtnInternal: {
    width: 76,
    height: 76,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: 'red',
    borderColor: 'transparent',
  },
});
