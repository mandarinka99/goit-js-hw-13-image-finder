import './sass/main.scss';
import ImagesApiService from './js/api-service';
import imagesTpl from './handlebars/image-card.hbs';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
const { info } = require('@pnotify/core');


const serchFormNode = document.querySelector('[id="search-form"]');
const galleryNode = document.querySelector('.gallery');
const sentinelNode = document.querySelector('#sentinel');

const imagesApiService = new ImagesApiService();

serchFormNode.addEventListener('submit', onSearch);

async function onSearch (e) {
  e.preventDefault();
  
  clearImageContainer();
  imagesApiService.query = e.currentTarget.elements.query.value;
  imagesApiService.resetPage();

  if (imagesApiService.query === '') {
    return info({ text: "Please enter your query!" });
  }

  const hits = await imagesApiService.fetchImages();
  createImageCard(hits);
};

function createImageCard(hits) {
  galleryNode.insertAdjacentHTML("beforeend", imagesTpl(hits))
};

function clearImageContainer() {
  galleryNode.innerHTML = '';
};

galleryNode.addEventListener('click', event => {

  if (event.target.nodeName !== "IMG")
    return;

  const instance = basicLightbox.create(`
    <img async src="${event.target.getAttribute('data-source')}" width="800" height="600">
  `)

  instance.show()
}
)

const onEntry = entries => {
  entries.forEach(async entry => {
    if (entry.isIntersecting && imagesApiService.query !== '') {
      const hits = await imagesApiService.fetchImages();
      createImageCard(hits);
      imagesApiService.incrementPage();
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

observer.observe(sentinelNode);
