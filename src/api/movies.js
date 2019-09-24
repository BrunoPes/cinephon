import API from './index';

class MoviesService extends API {
  getMovie = async (movieId) => {
    return this.get(`movie/${movieId}?language=en-US&`);
  }

  getUpcoming = async () => {
    return await this.get('movie/upcoming?').then(({ results }) => results).catch(err => err);
  }
}

export default new MoviesService();