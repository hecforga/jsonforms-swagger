import * as _ from 'lodash';

import { Operation } from './operation';
import { EntityType } from './entity-type';
import { Action } from './action';

export class API {

  properties: {} = {};
  tags: string[] = [];
  operations: Operation[] = [];
  entityTypes: EntityType[] = [];

  getTitle() {
    return this.properties['info']['title'];
  }

  getDescription() {
    return this.properties['info']['description'];
  }

  getBaseUrl(): string {
    return 'http://' +  this.properties['host'] + this.properties['basePath'];
  }

  getActionByOperation(operation: Operation): Action {
    let action: Action;
    _.forEach(this.entityTypes, (entityType: EntityType) => {
      action = entityType.getActionByOperation(operation);
      if (action) {
        return false;
      }
    });
    return action;
  }

  getOperationById(id: string): Operation {
    return _.find(this.operations, (operation: Operation) => {
      return operation.getOperationId() == id;
    });
  }

  getOperationByPathAndType(path: string, type: string): Operation {
    return _.find(this.operations, (operation: Operation) => {
      return operation.getPath() == path && operation.getType() == type;
    });
  }

  getOperationsByTag(tag: string): Operation[] {
    if (tag == 'default' && this.tags.length == 1) {
      return this.operations;
    }

    return _.filter(this.operations, (operation: Operation) => {
      if (!operation.getTags()) console.log("aqui esta el error");
      return operation.getTags().indexOf(tag) >= 0;
    });
  }

}
