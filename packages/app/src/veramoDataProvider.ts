import { AxiosInstance } from "axios";
import { DataProvider } from "@refinedev/core";
import { axiosInstance, generateSort, generateFilter } from "./utils";
import { queryMap, Resource, Method } from "./vermoQueryMapper";

//https://veramo-holder-demo.herokuapp.com/agent/dataStoreORMGetVerifiableCredentials
// Bearer 2915c2ee040d8690d95f2895c227e667ffc69606d2510eccc3de52c1b23e2e85

const apiUrl = process.env.REACT_APP_VERAMO_URL
const apiKey  = process.env.REACT_APP_VERAMO_API_KEY

export const dataProvider = (
    httpClient: AxiosInstance = axiosInstance,
): Omit<
    Required<DataProvider>,
    "createMany" | "updateMany" | "deleteMany"
> => ({
    getList: async ({
        resource,
        hasPagination = true,
        pagination = { current: 1, pageSize: 10 },
        filters,
        sort,
        metaData
    }) => {
        console.log("######## get list ########")
        console.log(metaData);
        // const res = 'dataStoreORMGetIdentifiers';

        // const url = `${apiUrl}/${resource}`;

        // const { current = 1, pageSize = 10 } = pagination ?? {};

        // const queryFilters = generateFilter(filters);

        // const query: {
        //     _start?: number;
        //     _end?: number;
        //     _sort?: string;
        //     _order?: string;
        // } = hasPagination
        //     ? {
        //           _start: (current - 1) * pageSize,
        //           _end: current * pageSize,
        //       }
        //     : {};

        // const generatedSort = generateSort(sort);
        // if (generatedSort) {
            // const { _sort, _order } = generatedSort;
            // query._sort = _sort.join(",");
            // query._order = _order.join(",");
        // }

        const config = {
            headers: {
              Authorization: `Bearer ${apiKey}` //`Bearer ${metaData?.apiKey}`
            }
          }

        const request = queryMap[resource as Resource].getList()
        const { data, headers } = await httpClient.post(
            `${apiUrl}/${request.resource}`,
            request.query,
            config
        );
        
        const result = data.map((element: { id: string, did: string, alias: string, provider: string, controllerKeyId?: string, keys?: Array<object>, services?: Array<object>, hash?: string }, index: any) => {
            element.id = element.hash || element.did || element.id;
            delete element.controllerKeyId;
            delete element.keys;
            delete element.services;
            return element;
        });

        const total = +headers["x-total-count"];
        return {
            data: result,
            total,
        };
    },

    getMany: async ({ resource, ids, metaData }) => {

        const config = {
            headers: {
              Authorization: `Bearer ${apiKey}`
            }
          }
        const { data } = await httpClient.post(
            `${apiUrl}/${resource}`,
            {},
            config
        );
        data.map((result: any) => {
            return result?.verifiableCredential
        })
        return {
            data,
        };
    },

    create: async ({ resource, variables, metaData }) => {

        // @ts-ignore
        const { data } = await httpClient.post(apiUrl, variables);

        return {
            data,
        };
    },

    update: async ({ resource, id, variables, metaData }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await httpClient.patch(url, variables);

        return {
            data,
        };
    },

    getOne: async ({ resource, id, metaData }) => {
        const request = queryMap[resource as Resource].getOne(id as string)
        const config = {
            headers: {
              Authorization: `Bearer ${apiKey}`
            }
          }
        const { data } = await httpClient.post(
            `${apiUrl}/${request.resource}`,
            request.query,
            config
        );
        const result = data[0].verifiableCredential
        console.log("getOne result")
        console.log(result)
        return {
            data: result,
        };
    },

    deleteOne: async ({ resource, id, variables, metaData }) => {
        const apiUrl = metaData?.apiUrl;
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await httpClient.delete(url, {
            data: variables,
        });

        return {
            data,
        };
    },

    getApiUrl: () => {
        return process.env.REACT_APP_VERAMO_URL || '';
    },

    custom: async ({ url, method, filters, sort, payload, query, headers }) => {
        console.log("###########################")
        let requestUrl = `${url}?`;

        if (sort) {
            const generatedSort = generateSort(sort);
            if (generatedSort) {
                const { _sort, _order } = generatedSort;
                const sortQuery = {
                    _sort: _sort.join(","),
                    _order: _order.join(","),
                };
                requestUrl = `${requestUrl}` //&${stringify(sortQuery)}`;
            }
        }

        if (filters) {
            const filterQuery = generateFilter(filters);
            requestUrl = `${requestUrl}` //&${stringify(filterQuery)}`;
        }

        if (query) {
            requestUrl = `${requestUrl}`//&${stringify(query)}`;
        }

        if (headers) {
          //@ts-ignore
            httpClient.defaults.headers = {
                ...httpClient.defaults.headers,
                ...headers,
            };
        }

        let axiosResponse;
        switch (method) {
            case "put":
            case "post":
            case "patch":
                axiosResponse = await httpClient[method](url, payload);
                break;
            case "delete":
                axiosResponse = await httpClient.delete(url, {
                    data: payload,
                });
                break;
            default:
                axiosResponse = await httpClient.get(requestUrl);
                break;
        }

        const { data } = axiosResponse;

        return Promise.resolve({ data });
    },
});
