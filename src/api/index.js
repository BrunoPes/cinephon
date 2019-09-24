import _ from 'lodash';
const baseURL = 'https://api.themoviedb.org/3';
const apiKey = '4825c829825d2f2bdeb9e54ae7208769';

export default class API {
  get = async (path) => {
    return await this.fetcher(path, 'get');
  }
 
  post = async (path, body) => {
    return await this.fetcher(path, body, 'post');
  }

  fetcher = async (path, method) => {
    const uri = `${baseURL}/${path}&api_key=${apiKey}`;
    return await fetch(uri, { method }).then(res => {
      return res.json();
    }).then(json => {
      return json;
    }).catch(error => {
      console.log('Error: ', error);
      return { error };
    });
  }
}