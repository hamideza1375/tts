import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import * as RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

import textToPhonems from './utils/TextToPhonems';
import phonemsToFFMpeg from './utils/PhonemsToFFMpeg';

import replace from './replace.json';


let outputSound
export default function Home() {
  const [text, settext] = useState('')

  const handleButtonClick = async () => {
    if(!text) return
    const phonems = textToPhonems(text);
    const ffmpeg = await phonemsToFFMpeg(phonems, RNFS.CachesDirectoryPath, '');
    await FFmpegKit.execute(ffmpeg, ' ');
    // Play the sound
    Sound.setCategory('Playback');
    outputSound = new Sound(`${RNFS.CachesDirectoryPath}/output.wav`, '', (err) => {
      if (err) {return}
      outputSound.play();
      outputSound.setSpeed(1.8)
    });
  };

  const pauseButtonClick = () => {
    if(outputSound?.isPlaying) outputSound.pause();

  };

    return (
      <View style={{flex: 1,justifyContent: 'flex-start',alignItems: 'stretch',backgroundColor: '#fff'}}>
        <TextInput
          style={{ flex: 1,padding: 15,paddingTop: 15,textAlign: 'right',color: '#5F5F5F',lineHeight: 25}}
          underlineColorAndroid="transparent"
          placeholder="متن مورد نظر را بنویسید"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text =>{
            let txt = text
            replace.forEach((val)=>{txt = txt.replace(val.searchValue,val.newValue)})            
            settext(txt)
          }}
          textAlignVertical="top"
          multiline
          returnKeyType="done"
          blurOnSubmit
        />
        <View style={{flexDirection:'row',justifyContent:'space-around'}} >
          <Button style={{flex:1}} title="|>" onPress={handleButtonClick}/>
          <Button style={{flex:1}} title="X" color={'red'} onPress={pauseButtonClick}/>
        </View>
        </View>
    );
}

