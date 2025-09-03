import React from 'react';
import { View, Image } from 'react-native';
const logo = `https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg`
const Header = () => {
  return (
    <View>
      <Image source={{ uri: logo }} />
    </View>
  );
};

export default Header;