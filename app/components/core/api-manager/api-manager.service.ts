import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { APIGenerator } from './api-generator';
import { Http } from '@angular/http';

import { API } from '../model/api';
import { Action } from '../model/action';
import { Operation } from '../model/operation';

@Injectable()
export class APIManagerService {

    private generator: APIGenerator;

    constructor(private http:Http) {
      this.generator = new APIGenerator(http);
    }

    private jsonAPI:{};

    private _api = new Subject<API>();
    api = this._api.asObservable();
    currentAPI: API;

    private _activeAction = new Subject<Action>();
    activeAction = this._activeAction.asObservable();

    private _activeOperation = new Subject<Operation>();
    activeOperation = this._activeOperation.asObservable();

    private initialData: {} = {};

    generateAPI(url: string) {
      this.generator.getJSONAPI(url)
          .map((jsonAPI:any) => {
              this.jsonAPI = jsonAPI;
              this.currentAPI = this.generator.generateAPI(this.jsonAPI);
              this._api.next(this.currentAPI);
          });
    }

    setActiveAction(action: Action) {
        this._activeAction.next(action);
        this.initialData = {};
        this._activeOperation.next(action.operations[0]);
    }

    setActiveOperation(operation: Operation, initialData: {}) {
        let action: Action = this.currentAPI.getActionByOperation(operation);
        this._activeAction.next(action);
        this.initialData = initialData;
        this._activeOperation.next(operation);
    }

    getInitialData(): {} {
        return this.initialData;
    }

}