import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import Colors from '../utils/Colors';

const styles = StyleSheet.create({
  card: {
    elevation: 3,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: Colors.darkGrey2,
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: 'transparent',
    maxHeight: 120,
  },
  thumbnailCol: {
    flex: 0.2,
    justifyContent: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  labelCol: {
    flex: 0.8,
    marginLeft: 20,
    justifyContent: 'flex-start',
  },
  titleLabel: {
    fontSize: 17,
    color: Colors.white,
    fontWeight: 'bold',
  },
  issueLabel: {
    fontSize: 14,
    color: Colors.lightGrey3,
  },
  scoreView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    marginLeft: 5,
    fontSize: 17,
    fontWeight: 'bold',
    justifyContent: 'center',
    color: Colors.yellow,
  },
});

const MovieCard = ({ movie, urlImageBase, openDetails }) => {
  const { title, release_date, vote_average, vote_count, poster_path } = movie;
  const date = moment(release_date).format('MM/DD/YYYY');
  const imgUrl = urlImageBase.length > 0 ? `${urlImageBase}/${poster_path}` : null;

  return (
    <TouchableOpacity style={styles.card} onPress={openDetails}>
      <View style={styles.thumbnailCol}>
        {imgUrl &&
          <Image
            style={styles.thumbnail}
            source={{ uri: imgUrl }}
            resizeMode={'contain'}
          />
        }
      </View>
      <View style={styles.labelCol}>
        <Text numberOfLines={2} style={styles.titleLabel}>
          {title}
        </Text>
        <View style={styles.scoreView}>
          <Icon name="star" size={20} color={Colors.yellow}/>
          <Text style={styles.scoreLabel}>
            {parseFloat(vote_average).toFixed(1)}
          </Text>
        </View>
        <Text style={styles.issueLabel}>
          {vote_count} votes
        </Text>
        <Text style={styles.issueLabel}>
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;