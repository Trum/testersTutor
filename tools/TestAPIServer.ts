// import tokens      = require('../../src/tools/tokens/tokens');
import * as BPromise from 'bluebird';
// import {APIServer} from "../../src/api_server";
// import * as propz from 'propz';
import request from 'request';
// import { Response } from 'request';
import deepmerge from 'deepmerge';
//


import {Server} from "../server";

type JsonData = {
    [k: string]: any
};

interface SimpleHttpClient {
    get(path: string, queryParams?: JsonData, optParams?: any): any

    post(path: string, jsonData?: JsonData, optParams?: any): any

    postString(path: string, stringData?: string, optParams?: any): any

    put(path: string, jsonData?: JsonData, optParams?: any): any

    delete(path: string, jsonData?: JsonData, optParams?: any): any
}


export class TestAPIServer {

    private readonly apiServer: Server;

    readonly http: SimpleHttpClient;

    private services: any;
    private models: any;
    private port: number = 3000;

    constructor() {
        this.apiServer = new Server(this.port);

        this.http = {} as SimpleHttpClient;
        this.http.get = (path, queryParams, optParams) => {

            const queryParamsCopy = {...queryParams};

            const filterStr = queryParamsCopy && queryParamsCopy.filter ? JSON.stringify(queryParamsCopy.filter) : undefined;
            if (filterStr) queryParamsCopy.filter = filterStr;

            const params = {
                ...optParams,
                method: 'GET',
                url: path,
                qs: queryParamsCopy,
                json: true
            };

            return this.request(params);
        };

        this.http.postString = (path, stringData, optParams) => {
            optParams = optParams || {};
            const params = {
                ...optParams,
                method: 'post',
                headers: {"content-type": "text/plain; charset=UTF-8"},
                url: path,
                body: stringData
            };
            return this.request(params);
        };

        ['post', 'put', 'delete'].forEach(method => {
            this.http[method] = (path, jsonData, optParams) => {
                optParams = optParams || {};
                const params = {
                    ...optParams,
                    method: method,
                    url: path,
                    json: jsonData
                };
                return this.request(params);
            }
        });

    }

    async start() {
        return await this.apiServer.start();
    }

    stop() {
        this.apiServer.stop();
    }

    /** request bounded to current server instance and returning promise */
    request(params) {
        params = {...params};
        params.url = `http://localhost:${this.port}` + params.url;
        return new BPromise.Promise((resolve, reject) => {
            request(params, (err, response, body) => {
                if (err) return reject(err);
                else {
                    response.body = body;
                    return resolve(response);
                }
            });
        });
    };


    user(key: string): SimpleHttpClient {
        const holder = {} as SimpleHttpClient;
        const headerMixin = {headers: {usid: key}};
        holder.get = (path, queryParams, optParams = {}) => {
            const extraParams = deepmerge(headerMixin, optParams);
            return this.http.get(path, queryParams, extraParams);
        };

        ['post', 'put', 'delete'].forEach(method => {
            holder[method] = (path, jsonData, optParams = {}) => {
                const extraParams = deepmerge(headerMixin, optParams);
                return this.http[method](path, jsonData, extraParams);
            };
        });
        return holder;
    }

    admin(key: string): SimpleHttpClient {
        const holder = {} as SimpleHttpClient;
        const headerMixin = {headers: {asid: key}};
        holder.get = (path, queryParams, optParams = {}) => {
            const extraParams = deepmerge(headerMixin, optParams);
            return this.http.get(path, queryParams, extraParams);
        };

        ['post', 'put', 'delete'].forEach(method => {
            holder[method] = (path, jsonData, optParams = {}) => {
                const extraParams = deepmerge(headerMixin, optParams);
                return this.http[method](path, jsonData, extraParams);
            };
        });
        return holder;
    };

}
