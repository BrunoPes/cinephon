import React, { Component } from 'react';
import { View, ScrollView, Text, Image, Dimensions, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import _ from 'lodash';

import IconMD from 'react-native-vector-icons/MaterialIcons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import Flag from 'react-native-flags';
import moment from 'moment';
import Colors from '../utils/Colors';
import Loader from '../components/Loader';
import MoviesAPI from '../api/movies';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.dark,
  },
  detailsContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
  },
  retryButton: {
    padding: 10,
    marginTop: 20,
    elevation: 3,
    borderRadius: 4,
    backgroundColor: Colors.lightGrey
  },
  retryButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.dark,
  },
  posterView: {
    marginTop: 20,
    marginHorizontal: 10,
    alignItems: 'stretch',
  },
  posterImage: {
    width: '100%',
    borderRadius: 5,
    height: Dimensions.get('window').height/1.4
  },
  contentView: { marginHorizontal: 25, marginBottom: 20 },
  titleLabel: {
    marginTop: 10,
    fontSize: 23,
    color: Colors.white,
    fontWeight: 'bold',
  },
  taglineLabel: {
    fontSize: 19,
    color: Colors.lightGrey3,
  },
  overview: {
    fontSize: 17,
    color: Colors.lightGrey,
    marginBottom: 15,
  },
  rowIconText: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowColIcon: {
    marginRight: 10,
  },
  rowColText: {
    fontSize: 18,
    color: Colors.lightGrey3,
  },
  website: {
    color: '#1A75BC',
    textDecorationLine: 'underline',
  },
});

export default class MovieDetails extends Component {
  static navigationOptions = {
    title: 'Movie Details',
  };

  constructor(props) {
    super(props);
    this.state = {
      info: {},
      loading: true,
      error: null,
      canRetry: false,
      collapseOverview: false,
    };
  }

  componentDidMount() {
    this.fetchMovieDetails();
  }

  isNotEmpty = (value) => {
    const isValueNotEmpty = value !== undefined && value !== null && typeof value !== 'string';
    const isLengthNotEmpty = (typeof value === 'string' && value.length > 0);
    return isValueNotEmpty || isLengthNotEmpty;
  }

  fetchMovieDetails = () => {
    const movieId = this.props.navigation.getParam('movieId', null);
    const urlImgBase = this.props.navigation.getParam('urlImgBase', null);
    this.setState({ loading: true });
    if(movieId !== null) {
      MoviesAPI.getMovie(movieId).then(data => {
        const {
          title, tagline, overview, genres, homepage, runtime, release_date, poster_path, production_countries, vote_average, vote_count
        } = data;
        const imageUrl = urlImgBase && poster_path ? `${urlImgBase}/${poster_path}` : null;
        const info = {title, tagline, overview, genres, homepage, runtime, release_date, imageUrl, production_countries, vote_average, vote_count};
        this.setState({ info, loading: false, error: null });
      }).catch(err => {
        console.log('Err: ', err);
        this.updateError(true, 'The movie data could not be retrieved.');
      });
    } else {
      this.updateError(false, 'Something went wrong! Please, try again later.');
    }
  }

  updateError = (canRetry, error) => {
    this.setState({ loading: false, canRetry, error });
  }

  collapseOverview = () => {
    this.setState({ collapseOverview: !this.state.collapseOverview });
  }

  openLink = (url) => {
    Linking.canOpenURL(url).then(value => {
      if(value === true) {
        return Linking.openURL(url);
      }
    }).catch(err => {
      console.log('Error opening URL: ' , err);
    });
  }

  renderErrorMessage = () => {
    const { error, canRetry } = this.state;
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>
          {error}
        </Text>
        {canRetry &&
          <TouchableOpacity style={styles.retryButton} onPress={this.fetchMovieDetails}>
            <Text style={styles.retryButtonText}>
              Try Again
            </Text>
          </TouchableOpacity>
        }
      </View>
    );
  }

  renderRowIconText = (value, iconName, colorValue, colorIcon = Colors.lightGrey, isBold = false) => {
    if(!this.isNotEmpty(value)) return null;

    const isWeb = iconName === 'web';
    let addStyle = {};
    let customIcon = null;
    if(isBold) addStyle.fontWeight = 'bold';
    if(colorValue) addStyle.color = colorValue;
    if(isWeb) {
      customIcon = (
        <IconMC size={22} name={iconName} color={colorIcon || Colors.lightGrey} style={styles.rowColIcon}/>
      );
    }

    return (
      <View style={styles.rowIconText}>
        {!customIcon && 
          <IconMD
            size={22}
            name={iconName}
            color={colorIcon || Colors.lightGrey}
            style={styles.rowColIcon}
          />
        }
        {customIcon}
        {isWeb &&
          <TouchableOpacity onPress={() => this.openLink(value)}>
            <Text style={[styles.rowColText, styles.website]}>
              {value}
            </Text>
          </TouchableOpacity>
        }
        {!isWeb &&
          <Text style={[styles.rowColText, addStyle]}>
            {value}
          </Text>
        }
      </View>
    );
  }

  render() {
    const { info, collapseOverview, error, loading } = this.state;
    const hasError = error && (error.length > 0);
    const hasInfo = info && info.title;
    const {
      imageUrl, title, tagline, overview, vote_average, vote_count, runtime, genres, release_date, production_countries, homepage
    } = info;
    const voteAverage = this.isNotEmpty(vote_average) ? `${parseFloat(vote_average).toFixed(1)} (${vote_count} votes)` : null;
    const time = (this.isNotEmpty(runtime) && `${runtime} min`) || null;
    const genresLabel = (!_.isEmpty(genres) && `${genres.map(g => g.name).join(', ')}`) || null;
    const dateFormatted = moment(release_date).format('MM/DD/YYYY');
    const countries = (!_.isEmpty(production_countries) && production_countries) || [];
    const countriesCodes = countries.map((c, i) => {
      return <Flag key={i} code={c.iso_3166_1} size={24} style={{ marginRight: 10 }}/>;
    });

    return (
      <View style={styles.container}>
        {(!loading && hasError) && this.renderErrorMessage()}
        {(!loading && !hasError && hasInfo) &&
          <ScrollView style={styles.detailsContainer}>
            {imageUrl &&
              <View style={styles.posterView}>
                <Image
                  style={styles.posterImage}
                  source={{ uri: imageUrl }}
                  resizeMode={'contain'}
                  resizeMethod={'auto'}
                />
              </View>
            }
            <View style={styles.contentView}>
              <Text style={styles.titleLabel}>
                {title}
              </Text>
              {this.isNotEmpty(tagline) &&
                <Text style={styles.taglineLabel}>
                  {tagline}
                </Text>
              }
              {(this.isNotEmpty(overview) && !collapseOverview) &&
                <TouchableOpacity onPress={this.collapseOverview}>
                  <Text numberOfLines={3} style={styles.overview}>
                    "{overview}"
                  </Text>
                </TouchableOpacity>
              }
              {(this.isNotEmpty(overview) && collapseOverview) &&
                <TouchableOpacity onPress={this.collapseOverview}>
                  <Text style={styles.overview}>
                    "{overview}"
                  </Text>
                </TouchableOpacity>
              }
              {this.renderRowIconText(voteAverage, 'star', Colors.yellow, Colors.yellow, true)}
              {this.renderRowIconText(time, 'access-time')}
              {this.renderRowIconText(genresLabel, 'format-list-bulleted')}
              {this.renderRowIconText(dateFormatted, 'event')}
              {this.renderRowIconText(homepage, 'web')}
              {(countriesCodes.length > 0) &&
                <View style={styles.rowIconText}>
                  <IconMD name={'location-on'} size={23} style={styles.rowColIcon} color={Colors.lightGrey}/>
                  {countriesCodes}
                </View>
              }
            </View>
          </ScrollView>
        }
        <Loader show={loading}/>
      </View>
    );
  }
}