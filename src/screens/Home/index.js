import React, { PureComponent } from 'react';
import {
  Text, View, TextInput, SafeAreaView, Platform, PermissionsAndroid,
} from 'react-native';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import * as RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

// Styling & Strings & colors
import generalStyles from '../../generalStyles';
import strings from './strings';
import styles from './styles';
import { primaryRed, primaryGray } from '../../colors';
import voices from '../../voices.json';

// Components
import ColorButton from '../../components/ColorButton';
import SelectSoundModal from '../SelectSoundModal';

// Utils
import textToPhonems from '../../utils/TextToPhonems';
import phonemsToFFMpeg from '../../utils/PhonemsToFFMpeg';

const rightAlignedStyle = Platform.select({
  ios: generalStyles.iPhoneRightText,
  android: generalStyles.androidRightAlign,
});

export default class Home extends PureComponent {

  // constructor(){
  //   super()
  // }

  state = {
    text: '',
    selectedVoice: '',
    isVoiceModalShown: false,
  };  

  async permiss(){
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: '',
          message: '',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
  }

  handleTextInput = text => this.setState({ text });

  handleButtonClick = async () => {
    const { text, selectedVoice } = this.state;
    const phonems = textToPhonems(text);
    const ffmpeg = await phonemsToFFMpeg(phonems, RNFS.CachesDirectoryPath, selectedVoice);
    console.log('ffmpeg8', phonems, RNFS.CachesDirectoryPath, selectedVoice);
    /* const result = */ await FFmpegKit.execute(ffmpeg, ' ');
    // console.log(result);
    // if (result.rc !== 0) {
    //   const lastOutput = await RNFFmpeg.getLastCommandOutput();
    //   console.log(lastOutput);
    // }

    // Play the sound
    Sound.setCategory('Playback');
    const outputSound = new Sound(`${RNFS.CachesDirectoryPath}/output.wav`, '', (err) => {
      if (err) {
        // console.log('Failed to load output.wav to play');
        return;
      }
      
      outputSound.play();
      outputSound.setSpeed(1.8)
    });
  };

  _showSoundModal = () => this.setState({ isVoiceModalShown: true });

  _onSoundModalDone = id => this.setState({ selectedVoice: id, isVoiceModalShown: false });

  render() {
    this.permiss()
    return (
      <View style={styles.container}>

        <TextInput
          style={[generalStyles.persianFonted, generalStyles.rtl, styles.input]}
          underlineColorAndroid="transparent"
          placeholder="متن مورد نظر را بنویسید"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={this.handleTextInput}
          textAlignVertical="top"
          multiline
          returnKeyType="done"
          blurOnSubmit
        />
        <View style={styles.playButtonsBox}>
          <ColorButton
            containerStyle={styles.playButton}
            title="تبدیل متن به گفتار"
            color={primaryRed}
            onPress={this.handleButtonClick}
          />
        </View>
        <SafeAreaView />
      </View>
    );
  }
}

