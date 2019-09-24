import React, { Component } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, Platform } from 'react-native';
import _ from 'lodash';

import moment from 'moment';
import MoviesAPI from '../api/movies';
import ConfigurationAPI from '../api/configuration';

import MovieCard from '../components/MovieCard';
import Colors from '../utils/Colors';

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.dark,
  },
  moviesContainer: {
    flex: 1,
    alignSelf: 'stretch',
    paddingTop: 10,
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.white,
  },
});

class Home extends Component {
  static navigationOptions = {
    title: 'Cineph ON',
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      movies: [],
      urlImgBase: '',
    };
  }

  componentDidMount() {
    this.fetchConfiguration();
  }

  fetchConfiguration = async () => {
    return await ConfigurationAPI.getConfiguration().then(configuration => {
      const { secure_base_url, poster_sizes } = configuration;
      const urlImgBase = `${secure_base_url}/${poster_sizes[4]}`;
      this.setState({ urlImgBase }, this.fetchMovies);
    }).catch(err => {
      this.setState({ loading: false });
    });
  }

  fetchMovies = () => {
    this.setState({ loading: true });
    MoviesAPI.getUpcoming().then(movies => {
      const moviesWithMoment = movies.map(m => ({ ...m, momentDate: moment(m.release_date) }));
      const orderedMovies = _.orderBy(moviesWithMoment, 'momentDate', 'desc');
      this.setState({ loading: false, movies: orderedMovies });
    }).catch(err => {
      this.setState({ loading: false });
    });
  }

  openDetails = (movieId) => {
    this.props.navigation.push('Details', {
      movieId, urlImgBase: (this.state.urlImgBase || null)
    });
  }

  renderEmptyList = () => {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>
          No Movies could be retrieved...
        </Text>
        <Text style={[styles.emptyText, { marginTop: 10 }]}>
          Please, try again later.
        </Text>
      </View>
    );
  }

  renderRefresher = () => {
    return (
      <RefreshControl
        size={isIOS ? 'large' : 40}
        tintColor={Colors.red}
        onRefresh={this.fetchMovies}
        refreshing={this.state.loading}
      />
    );
  }

  renderMovieCard = (movie, index) => {
    return (
      <MovieCard
        key={index}
        movie={movie}
        urlImageBase={this.state.urlImgBase}
        openDetails={() => this.openDetails(movie.id)}
      />
    );
  }

  render() {
    const { movies, loading } = this.state;
    const isLoading = loading && (movies || []).length <= 0 ;
    const hasMovies = !isLoading && movies.length > 0;
    const emptyMovies = !loading && movies.length <= 0;
    return (
      <View style={styles.container}>
        {emptyMovies && this.renderEmptyList()}
        {hasMovies &&
          <ScrollView style={styles.moviesContainer} refreshControl={this.renderRefresher()}>
            {_.map(movies || [], this.renderMovieCard)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default Home;