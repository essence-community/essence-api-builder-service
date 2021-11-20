import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import * as Handlebars from 'handlebars';
import * as Helper from 'handlebars-helpers';
import { ApiView } from '../entities/ApiView';
import { ApiField } from '../entities/ApiField';
import { ApiInfo } from '../entities/ApiInfo';
import { ApiPath } from '../entities/ApiPath';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import * as path from 'path';
import * as os from 'os';
import * as uuid from 'uuid';
import { capitalizeFirstLetter, isEmpty, deleteFolderRecursive } from '../utils/Base';
import { getCoreData } from '../utils/CallerEssenceCore';
import { IBuilderConfig } from '../types/Builder';
import * as cpy from 'cpy';

Helper({
    handlebars: Handlebars,
});

const asset = path.resolve(__dirname, '..', 'assets');
const files = {
    appDir: path.join(asset, 'app'),
    app: path.join(asset, 'app.ts.template'),
    controller: path.join(asset, 'controller.ts.template'),
    model: path.join(asset, 'model.ts.template'),
    package: path.join(asset, 'package.json.template'),
    service: path.join(asset, 'service.ts.template'),
}
@Injectable()
export class ApiViewGenerate {
    constructor(private connection: Connection) {}
    
    async generate(idView: string): Promise<{
        name: string,
        file: Buffer,
    }> {
        const view = await this.connection.createQueryBuilder()
            .select('apiView')
            .from(ApiView, 'apiView')
            .leftJoinAndMapOne('apiView.info', ApiInfo, 'apiInfo', 'apiInfo.apiView = apiView.id')
            .leftJoinAndMapOne('apiView.field', ApiField, 'apiField', 'apiField.apiView = apiView.id')
            .leftJoinAndMapMany('apiView.path', ApiPath, 'apiPath', 'apiPath.apiView = apiView.id')
            .where('apiView.id = :idView', { idView })
            .getOneOrFail();
        const temp = path.resolve(os.tmpdir(), uuid.v4());
        fs.mkdirSync(temp, {
            recursive: true,
        });
        return this.generateZip(temp, view);       
    }

    async generateZip(temp: string,  data) {
        await cpy('**/*', temp, {
            cwd: files.appDir,
            parents: true,
            dot: true,
        })
        fs.writeFileSync(path.join(temp, 'src', 'app.ts'), Handlebars.compile(fs.readFileSync(files.app).toString())(data));
        fs.writeFileSync(path.join(temp, 'package.json'), Handlebars.compile(fs.readFileSync(files.package).toString())(data));
        const tempController = Handlebars.compile(fs.readFileSync(files.controller).toString());
        const tempModel = Handlebars.compile(fs.readFileSync(files.model).toString());
        const tempService = Handlebars.compile(fs.readFileSync(files.service).toString());
        await Promise.all(data.path.map(async (pathObj) => {
            const paths = pathObj.path.split('/').filter((val) => !isEmpty(val));
            const name = capitalizeFirstLetter(paths[paths.length-1]);
            const parent = paths.slice(0, paths.length - 1);
            pathObj.parentPath =  path.join(...parent);
            pathObj.levelPath = path.join('..', ...(parent.map(()=>'..')));
            pathObj.serviceName = `${name}Service`;
            pathObj.servicePath = path.join(...parent, pathObj.serviceName);
            pathObj.modelName = `${name}Model`;
            pathObj.modelPath = path.join(...parent, pathObj.modelName);
            pathObj.controllerName = `${name}Controller`;
            pathObj.controllerPath = path.join(...parent, pathObj.controllerName);
            pathObj.idproperty = 'ck_id';
            pathObj.modelField = [];
            await this.parsePathObject(pathObj);
            if (pathObj.master) {
                pathObj.modelField = pathObj.master.reduce((res, val) => {
                    res.push({
                        column: val.out,
                        columnOrigin: val.out,
                        required: true,
                        dataType: 'string', 
                    })
                    return res;
                }, pathObj.modelField);
            }
            if (pathObj.globalValue) {
                pathObj.modelField = pathObj.globalValue.reduce((res, val) => {
                    res.push({
                        column: val.out,
                        columnOrigin: val.in,
                        required: true,
                        dataType: 'string', 
                    })
                    return res;
                }, pathObj.modelField);
            }
            pathObj.modelField = pathObj.modelField.reduce((acc, obj)=>{
                const exist = acc.find(({column}) => obj.column === column);
                if(!exist && obj.column && obj.column !== pathObj.idproperty){
                    acc.push(obj);
                }
                return acc;
            },[]);
            if (parent.length > 0) {
                fs.mkdirSync(path.join(temp, 'src', 'controllers', ...parent), {
                    recursive: true,
                });
                fs.mkdirSync(path.join(temp, 'src', 'entities', ...parent), {
                    recursive: true,
                });
                fs.mkdirSync(path.join(temp, 'src', 'services', ...parent), {
                    recursive: true,
                });
            }
            fs.writeFileSync(path.join(temp, 'src', 'services', pathObj.servicePath+'.ts'), tempService(pathObj));
            fs.writeFileSync(path.join(temp, 'src', 'entities', pathObj.modelPath+'.ts'), tempModel(pathObj));
            fs.writeFileSync(path.join(temp, 'src', 'controllers', pathObj.controllerPath+'.ts'), tempController(pathObj));
            fs.appendFileSync(path.join(temp, 'src', 'controllers', 'index.ts'), `export * from './${pathObj.controllerPath}';\n`);
            fs.appendFileSync(path.join(temp, 'src', 'entities', 'index.ts'), `export * from './${pathObj.modelPath}';\n`);
            fs.appendFileSync(path.join(temp, 'src', 'services', 'index.ts'), `export * from './${pathObj.servicePath}';\n`);
        }));
        const result = new AdmZip();
        result.addLocalFolder(temp);
        const file = result.toBuffer();
        deleteFolderRecursive(temp);
        return {
            file,
            name: data.name,
        };
    }

    async parsePathObject(pathObj) {
        const [bc] = await getCoreData('EssenceApiBuilderGetObject', {
            objectId: pathObj.objectId,
        }) as IBuilderConfig[];

        if (!bc) {
            throw new BadRequestException(`Not found object ${pathObj.objectId} to path ${pathObj.path}`)
        }
        pathObj.idproperty = bc.idproperty;
        switch(bc.type) {
        case 'GRID':
        case 'TREEGRID':
            return this.parseGrid(bc, pathObj);
        case 'IFIELD':
        {
            if (bc.datatype === 'grid' || bc.datatype === 'tree') {
                return this.parseGrid(bc, pathObj);
            }
            return this.parseField(bc, pathObj);
        }
        case 'PANEL':
        case 'BOX':
        case 'FORMPANEL':
        case 'HISTORYPANEL':
            return this.parsePanel(bc, pathObj);                
        }
    }

    checkDataType(dataType: string) {
        switch(dataType) {
        case 'integer':
        case 'numeric':
        case 'boolean':
        case 'checkbox':
            return 'number';
        case 'date':
            return 'Date';
        default:
            return 'string';
        }
    }

    parseGrid(bc: IBuilderConfig, pathObj) {
        if (bc.childwindow) {
            bc.childwindow.forEach((childBc) => {
                this.parsePanel(childBc, pathObj);
            });
        }
        if (bc.filters) {
            bc.filters.forEach((childBc) => {
                this.parsePanel(childBc, pathObj);
            });
        }
        if (bc.columns) {
            pathObj.modelField = bc.columns
                .filter((columnBc) => ['checkbox', 'icon', 'detail'].indexOf(columnBc.datatype) === -1 && columnBc.column)
                .reduce((res, columnBc) => {
                    if (columnBc.editors && columnBc.editors !== 'false') {
                        return [...res, ...this.parseFormField({
                            ...(columnBc.editors[0]),
                            column: columnBc.column,
                            required: columnBc.required || columnBc.editors[0].required,
                        })];
                    }
                    res.push({
                        column: columnBc.column,
                        columnOrigin: columnBc.column,
                        required: columnBc.required,
                        dataType: this.checkDataType(columnBc.datatype)
                    });
                    return res
                }, pathObj.modelField || []);
        }
    }

    parseField(bc: IBuilderConfig, pathObj) {
        pathObj.modelField = bc.valuefield?.map((field) => ({
            column: field.in,
            columnOrigin: field.in,
            required: false,
            dataType: this.checkDataType(bc.datatype),
        })) || pathObj.modelField;
        if (bc.displayfield && pathObj.modelField.filter((field) => field.column === bc.displayfield).length === 0) {
            pathObj.modelField.push({
                column: bc.displayfield,
                columnOrigin: bc.displayfield,
                required: false,
                dataType: 'string',
            })
        }
    }

    parseFormField(bc: IBuilderConfig) {
        return [{
            column: bc.column,
            columnOrigin: bc.column,
            required: bc.required,
            dataType: this.checkDataType(bc.datatype),
        },  ...(bc.valuefield?.filter((field) => field.out && field.out !== bc.column).map((field) => ({
            column: field.in,
            columnOrigin: field.in,
            required: false,
            dataType: 'string',
        })) || [])];
    }

    parsePanel(bc: IBuilderConfig, pathObj) {
        if (bc.childs) {
            pathObj.modelField = bc.childs.filter((bcChild) => bcChild.type === 'IFIELD' || bcChild.type === 'FORM_NESTED').reduce((res, val) => {
                return res.concat(this.parseFormField(val));
            }, pathObj.modelField || []);
            bc.childs
                .filter((bcChild) => bcChild.type === 'BOX' || bcChild.type === 'PANEL' || bcChild.type === 'FORMPANEL')
                .forEach((bcChild) => this.parsePanel(bcChild, pathObj));
        }
    }
}
