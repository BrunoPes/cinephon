import React from 'react';
import { Modal, View, ActivityIndicator, Dimensions, StyleSheet, Platform } from 'react-native';
import Colors from '../utils/Colors';

const { height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const sizeModal = 80;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.darkGrey2,
    alignSelf: 'center',
    width: sizeModal,
    height: sizeModal,
    marginTop: (height/2) - (sizeModal/2),
    elevation: 3,
    shadowColor: '#888',
    borderRadius: 5,
    justifyContent: 'center'
  }
});

const Loader = ({show}) => (
  <Modal visible={show} transparent>
    <View style={styles.modal}>
      <ActivityIndicator
        size={isIOS ? 'large' : 40}
        color={Colors.red}
      />
    </View>
  </Modal>
);

export default Loader;