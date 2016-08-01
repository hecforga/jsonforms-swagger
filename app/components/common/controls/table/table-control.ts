import {AbstractControl} from 'jsonforms';
declare var angular: any;

class TableController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];

    public uiSchema;
    public selectedElement;
    public properties;
    public itemsData;
    public shownProperties;
    public itemSchema;
    constructor(scope, pathResolver){
        super(scope);
        const dataSchema = pathResolver.resolveSchema(this.schema, this.schemaPath);
        const data = pathResolver.resolveInstance(this.data, this.schemaPath);
        const uiSchema = this.uiSchema;
        this.selectedElement = null;
        this.properties = _.keys(dataSchema.items['properties']);
        this.itemsData = data;
        this.shownProperties = uiSchema.options.primaryItems;
        this.itemSchema = dataSchema.items;
    }

    moreInfo(element){
        this.selectedElement = element;
    }

    backToTable(){
        this.selectedElement = null;
    }
}

const app = angular.module('jsonforms.renderers.controls');

app.directive('tableControl', () => {
    return {
        restrict: 'E',
        templateUrl: './table-control.html',
        controller: TableController,
        controllerAs: 'vm'
    }
});

app.run(['RendererService', function (RendererService) {
    RendererService.register('table-control', function(element, dataSchema, dataObject, pathResolver){
        if (element.type !== 'Control') {
            return -1;
        }

        var schemaPath = element['scope']['$ref'];
        var currentDataSchema = pathResolver.resolveSchema(dataSchema, schemaPath);
        if (currentDataSchema === undefined || currentDataSchema.type !== 'array' || !currentDataSchema.items) {
            return -1;
        }
        return 200;
    });
}]);