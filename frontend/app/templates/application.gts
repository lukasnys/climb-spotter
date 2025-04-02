import Route from 'ember-route-template';
import { pageTitle } from 'ember-page-title';
import { WelcomePage } from 'ember-welcome-page';

export default Route(
  <template>
    {{pageTitle "Frontend"}}

    {{outlet}}
  </template>,
);
