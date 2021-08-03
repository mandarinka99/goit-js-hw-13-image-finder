const API_URL = 'https://pixabay.com/api';
const API_KEY = '22769263-58fdf689ff7727797c0ddae89';
const { info, error } = require('@pnotify/core');

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 12;
  }

  async fetchImages() {
    const url = `${API_URL}/?key=${API_KEY}&per_page=${this.perPage}&page=${this.page}&q=${this.searchQuery}&image_type=photo`;

    let data = [];
    
    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        const text = await res.text();
        console.info(text)
        error ({text: text})
        return data;
      }
      data = await res.json();
    } catch (e) {
      return data;
    }

    if (data.hits.length < 1)
    info ({text: 'Please enter your query again'});

    this.incrementPage();

    return data.hits;
  };

  incrementPage() {
    this.page += 1;
  };

  resetPage() {
    this.page = 1;
  };
  
  get query() {
    return this.searchQuery;
  };

  set query(newQuery) {
    this.searchQuery = newQuery;
  };
}