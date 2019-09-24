import API from './index';

class ConfigurationService extends API {
  getConfiguration = async () => {
    return await this.get(`configuration?`).then(({ images })=> {
      const { secure_base_url, poster_sizes } = images;
      return { secure_base_url, poster_sizes };
    }).catch(err => {
      console.log('Error: ', err);
    });
  }
}

export default new ConfigurationService();