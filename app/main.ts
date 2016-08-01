import { AppComponent } from './app.component';
import { upgradeAdapter } from './adapters/upgrade_adapter';

import './components/common/controls/table/table-control';

declare var angular: any;

angular.module('app-legacy', ['jsonforms'])
    .directive('app', upgradeAdapter.downgradeNg2Component(AppComponent));


export function main() {
    try {
        upgradeAdapter.bootstrap(document.body, ['app-legacy']);
    } catch (e) {
        console.error(e);
    }
}
