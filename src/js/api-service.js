const API_URL = 'https://pixabay.com/api';
const API_KEY = '22769263-58fdf689ff7727797c0ddae89';
const { info } = require('@pnotify/core');

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 12;
    this.total = null;
  }

  async fetchImages() {
    const url = `${API_URL}/?key=${API_KEY}&per_page=${this.perPage}&page=${this.page}&q=${this.searchQuery}&image_type=photo`;
    let data = [];
    
    if (
      (this.page + 1 > (this.total / this.perPage))
      && this.total !== null
    ) {
      info ({ text: 'All data fetched' });

      return data;
    }

    try {
      const res = await fetch(url);
      if (res.status !== 200) {
        const text = await res.text();
        console.info(text)
        
        return data;
      }
      data = await res.json();
      this.total = data.total;
    } catch (e) {
      return data;
    }
    console.log(data)
    if (data.hits.length < 1)
    info ({text: 'No images found by your query. Please enter something else!'});

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
    this.total = null;
    this.searchQuery = newQuery;
  };
}