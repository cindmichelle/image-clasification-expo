import React from 'react';
import {
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import {Camera} from 'expo';
import * as Permissions from 'expo-permissions';
import Clarifai from 'clarifai';

import Toolbar from './CameraToolbar';
import Gallery from './Gallery';

type State = {
  captures: Array<string>;
  flashMode?: number | string;
  capturing: boolean;
  cameraType?: number | string;
  hasCameraPermission: boolean;
  identifiedAs: string;
  isLoading: boolean;
};

export default class CameraPage extends React.Component<{}, State> {
  camera = null;
  state: State = {
    // array of photos that has taken
    captures: [],
    // setting flash to be turned off by default
    flashMode: Camera.Constants.FlashMode.off,
    capturing: null,
    // start the back camera by default
    cameraType: Camera.Constants.Type.back,
    //Camera Permission
    hasCameraPermission: null,
    // result of what Machine Learning identifed as
    identifiedAs: '',
    isLoading: false,
  };

  async componentDidMount() {
    let {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  render() {
    let {
      hasCameraPermission,
      flashMode,
      cameraType,
      capturing,
      captures,
      isLoading,
    } = this.state;

    let LoadingComponent = (
      <Modal animationType="slide" visible={true} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <ActivityIndicator size={50} color="#DEF" />
          <Text style={{color: 'white'}}>Image is being process ...</Text>
        </View>
      </Modal>
    );
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <React.Fragment>
          <View>
            {isLoading && LoadingComponent}
            <Camera
              style={styles.preview}
              ref={(camera) => (this.camera = camera)}
              flashMode={flashMode}
              type={cameraType}
            />
          </View>
          {captures.length > 0 && <Gallery captures={captures} />}
          <Toolbar
            capturing={capturing}
            flashMode={flashMode}
            cameraType={cameraType}
            setFlashMode={this._setFlashMode}
            setCameraType={this._setCameraType}
            onCaptureIn={this._handleCaptureIn}
            onCaptureOut={this._handleCaptureOut}
            onLongCapture={this._handleLongCapture}
            onShortCapture={this._handleShortCapture}
          />
        </React.Fragment>
      );
    }
  }

  _setFlashMode = (flashMode) => this.setState({flashMode});
  _setCameraType = (cameraType) => this.setState({cameraType});
  _handleCaptureIn = () => this.setState({capturing: true});

  _handleCaptureOut = () => {
    if (this.state.capturing) this.camera.stopRecording();
  };

  // for taking picture
  _handleShortCapture = async () => {
    this.setState(() => ({
      isLoading: true,
    }));

    const options = {
      base64: true,
    };

    const photoData = await this.camera.takePictureAsync(options);

    this._identifyImage(photoData.base64);

    this.setState({
      capturing: false,
      captures: [photoData, ...this.state.captures],
    });
  };

  // for taking videos
  _handleLongCapture = async () => {
    const videoData = await this.camera.recordAsync();
    this.setState({
      capturing: false,
      captures: [videoData, ...this.state.captures],
    });
  };

  _identifyImage = async (imageData) => {
    try {
      let app = new Clarifai.App({
        apiKey: '3736b28223974a9d8e9c0cd83e4d2688',
      });

      // Identify the image
      let response = await app.models.predict(Clarifai.GENERAL_MODEL, {
        base64: imageData,
      });

      this._displayAnswer(response.outputs[0].data.concepts[0].name);
    } catch (err) {
      alert(err);
    }
  };

  _displayAnswer(identifiedImage) {
    // Dismiss the acitivty indicator
    this.setState(() => ({
      identifiedAs: identifiedImage,
      isLoading: false,
    }));

    // Show an alert with the answer on
    Alert.alert('Identified As', this.state.identifiedAs);

    // Resume the preview
    this.camera.resumePreview();
  }
}

const {width: winWidth, height: winHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
  preview: {
    height: winHeight,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});
