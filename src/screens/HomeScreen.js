import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableOpacity, View, Alert } from 'react-native';
import { IMG, ROUTES } from '../utils';
import CustomButton from '../components/CustomButton';
// import CustomCard from '../components/CustomCard';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={{
          uri: IMG.LOGO,
        }}
        style={{
          width: 200,
          height: 200,
        }}
      />

      {/* <CustomCard/> */}

      <CustomButton
        label="Go to Profile"
        onPress={() => {
          navigation.navigate(ROUTES.PROFILE);
        }}
      />
    </View>
  );
};

export default HomeScreen;

