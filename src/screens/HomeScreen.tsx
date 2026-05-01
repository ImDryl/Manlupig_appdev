import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, View } from 'react-native';
import { IMG, ROUTES } from '../utils';
import CustomButton from '../components/CustomButton';

export type MainStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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
