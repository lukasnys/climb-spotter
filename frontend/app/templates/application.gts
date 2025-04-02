import Route from 'ember-route-template';
import { pageTitle } from 'ember-page-title';

export default Route(
  <template>
    {{pageTitle "Frontend"}}

    <h1>Hello, Ember!</h1>

    {{outlet}}
  </template>,
);
