import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onInputSearch, DEBOUNCE_DELAY)
);

function createMarkupCountryList(arr) {
  const countries = arr
    .map(({ flags, name }) => {
      return `<li>
          <img src="${flags.svg}" alt="${name.common} width="150px" height="150px" />
          <p>${name.common}</p>
        </li>`;
    })
    .join('');
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = countries;
}

function createMarkupCountryInfo(arr) {
  const countries = arr.map(
    ({ flags, name, capital, population, languages }) => {
      return `
         <h1>${name.common}</h1>
          <img src="${flags.svg}" alt="${
        name.common
      } width="150px" height="150px">
          <p><span class="span">Capital</span>: ${capital}</p>
          <p><span class="span">Population</span>: ${population}</p>
          <p><span class="span">Languages</span>: ${Object.values(
            languages
          ).join(', ')}</p>
        `;
    }
  );
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = countries;
}

function onInputSearch(evt) {
  const inputValue = evt.target.value.trim();

  if (inputValue === '') {
    return;
  }

  getData(inputValue).catch(error => {
    if (inputValue === '') {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
    } else {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
    }
  });
}

function getData(name) {
  return fetchCountries(name).then(data => {
    findCountry(data);
  });
}

function findCountry(data) {
  if (data.length > 10) {
    refs.countryList.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (data.length >= 2 && data.length <= 10) {
    createMarkupCountryList(data);
  }

  if (data.length === 1) {
    createMarkupCountryInfo(data);
  }
}
