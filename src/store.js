const STORAGE_KEY = 'questionnaire';

export default {
  get(key=STORAGE_KEY) {
    return JSON.parse(window.localStorage.getItem(key));
  },
  save(items, key=STORAGE_KEY) {
    window.localStorage.setItem(key, JSON.stringify(items));
  }
}