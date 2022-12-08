import './css/styles.css';
import { fetchCountries } from '../src/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const TIMEOUT_NOTIFICATION = 4000;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countriesListEl: document.querySelector('.country-list'),
  infoAboutCountryEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  debounce(onSearchCountry, DEBOUNCE_DELAY)
);

/**function */

function onSearchCountry(evt) {
  const valueInput = evt.target.value.trim();

  if (valueInput.length === 1) {
    Notify.warning('At least 2 letters must be entered to search', {
      timeout: TIMEOUT_NOTIFICATION,
    });
    return;
  } else if (valueInput.length === 0) {
    Notify.info('Please start entering some country for searching', {
      timeout: TIMEOUT_NOTIFICATION,
    });
    refs.countriesListEl.innerHTML = '';
    refs.infoAboutCountryEl.innerHTML = '';
    refs.inputEl.removeEventListener('input', evt);
    return;
  }

  fetchCountries(valueInput)
    .then(onRenderCountriesList)
    .catch(error => {
      Notify.failure('Oops, there is no country with that name', {
        timeout: TIMEOUT_NOTIFICATION,
      });
      refs.countriesListEl.innerHTML = '';
      refs.infoAboutCountryEl.innerHTML = '';
    });
}

function onRenderCountriesList(countries) {
  const numberCountriesFound = countries.length;

  const markupCountriesList = countries
    .map(
      country =>
        `<li class="country"><img src="${country.flags.svg}"
      alt="Flag of ${country.name.official}" />
      <h1>${country.name.official}</h1></li>`
    )
    .join('');
  refs.countriesListEl.innerHTML = markupCountriesList;

  if (numberCountriesFound === 1) {
    const bigRenderCountry = document.querySelector('.country');
    bigRenderCountry.classList.add('big');

    const markupInfoAboutCountry = countries
      .map(
        country =>
          `<p><b>Capital: </b>${country.capital}</p>
         <p><b>Population: </b>${country.population}</p>
         <p><b>Languages: </b>${Object.values(country.languages)}</p>`
      )
      .join('');
    refs.infoAboutCountryEl.innerHTML = markupInfoAboutCountry;
    return;
  }

  if (numberCountriesFound > 10) {
    Notify.warning(
      'Too many matches found. Please enter a more specific name',
      {
        timeout: TIMEOUT_NOTIFICATION,
      }
    );
  }

  refs.infoAboutCountryEl.innerHTML = '';
}