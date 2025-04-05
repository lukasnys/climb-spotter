import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  async model() {
    const response = await fetch('/api/shoes');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const json = await response.json();
    console.log(json);
    return json;
  }
}
