import axios from 'axios';
import systemStore from '@/store/system';

import type { ResponseType } from '@/types/response';
import type { AxiosInstance, CreateAxiosDefaults, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';


// axios config
const axiosConfig: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'useCancelToken': true,
  },
  withCredentials: false,
}
// import.meta.env.DEV && (axiosConfig['params'] = { 'development': 'axiosDevelopment' });


interface IAdminAxiosConfig {
  /**
   * prevent redundant requests, default: true
   */
  useCancelToken?: boolean,
  /**
   * transform response data, default: true.
   * 
   * if false, the response data will be returned directly
   * 
   * if true, the response data will be transformed via `response.data.data`
   */
  isTransformData?: boolean,
  /**
   * detect returned status and show snackbar, default: true
   */
  isDetectStatus?: boolean, // default: true
}

class AdminAxiosRequest {
  private axios: AxiosInstance;

  private requestCancelMap: Map<string, () => void> = new Map(); // requests cancel function map

  constructor() {
    this.axios = axios.create(axiosConfig);

    
    // request interceptor: add cancel token and remove redundent requests
    this.axios.interceptors.request.use((config) => {
      const requestMapKey = this.getRequestMapKey(config);
      const useCancelToken = (config as unknown as Record<string, Record<string, unknown>>).adminAxiosConfig.useCancelToken;
      const cancelToken = config.cancelToken;
      const method = config && config.method;

      if (useCancelToken && method && !cancelToken) {
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        
        // cancel previous request
        const prevRequestCancel = this.requestCancelMap.get(requestMapKey);
        prevRequestCancel && prevRequestCancel();

        // set cancel function
        this.requestCancelMap.set(requestMapKey, source.cancel);
      }
      return config;
    });


    this.axios.interceptors.response.use((response: AxiosResponse) => {
      // remove cancel function
      const requestMapKey = this.getRequestMapKey(response.config);
      this.requestCancelMap.delete(requestMapKey);

      // detect status and show snackbar
      const responseData: ResponseType = response.data;
      const status = responseData.status ? responseData.status + '' : response.status + '';
      const data = responseData.data;

      // post process
      const { isTransformData, isDetectStatus } = (response.config as unknown as Record<string, Record<string, unknown>>).adminAxiosConfig;
      // transform data
      const returnData = isTransformData ? data : response;

      // detect status
      if (!isDetectStatus) {
        return returnData;
      }

      const result = this.detectResponseStatus(status, responseData.message);
      if (result) {
        return returnData;
      } else {
        return Promise.reject(returnData);
      }
    }, (error: AxiosError) => {
      let isTransformData: boolean = true;
      let isDetectStatus: boolean = true;
      const adminAxiosConfig = error.response && error.response.config && (error.response.config as unknown as Record<string, unko>).adminAxiosConfig;
      if (adminAxiosConfig) {
        isTransformData = adminAxiosConfig['isTransformData'];
        isDetectStatus = adminAxiosConfig['isDetectStatus']
      }

      // detect online status
      if (!navigator.onLine) {
        systemStore.addSnackBarMessage('Network offline', { variant: 'error' });
      }

      // post process
      // transform data
      const returnData = isTransformData ? error.response?.data || error.message : error;

      // detect status
      const status = error.response ? error.response.status + '' : undefined;
      isDetectStatus && this.detectResponseStatus(status, error.message);

      return Promise.reject(returnData);
    });
  }

  private getRequestMapKey(config: AxiosRequestConfig): string {
    return `${config.method}: ${config.url || ''}`;
  }

  private detectResponseStatus(httpCodeString: string | undefined, message: string | undefined): boolean {
    const isUnauthorized = httpCodeString === '401';
    const isOk = httpCodeString && httpCodeString.length === 3 && httpCodeString.startsWith('2');
    const isServerError = httpCodeString && httpCodeString.length === 3 && httpCodeString.startsWith('5');
    const isOtherError = ([undefined, null] as unknown[]).includes(httpCodeString);

    if (isUnauthorized) {
      systemStore.addSnackBarMessage(message || 'Unauthorized', { variant: 'error' });
      return false;
    } else if(isServerError) {
      systemStore.addSnackBarMessage(message || 'Server Error', { variant: 'error' });
      return false;
    } else if (isOtherError) {
      systemStore.addSnackBarMessage(message || 'Error', { variant: 'error' });
    } else if (!isOk) {
      systemStore.addSnackBarMessage(message || 'Request Error', { variant: 'error' });
      return false;
    }
    
    return true;
  }

  /**
   * 
   * handle get request
   * @param url url
   * @param config axiosRequestConfig, like `{params, headers, method, data}: Record<string, Record<string, string>>`
   * @param adminAxiosConfig adminAxiosConfig, like `{useCancelToken, isTransformData, isDetectStatus}: Record<string, boolean>`
   * @returns 
   */
  public get<T>(url: string, config: AxiosRequestConfig={}, adminAxiosConfig: IAdminAxiosConfig={}): Promise<T> {
    config.url = url;
    config.method = 'get';
    return this.handleRequest<T>(config, adminAxiosConfig);
  }

  /**
   * handle post request
   * @param url url
   * @param config axiosRequestConfig, like `{params, headers, method, data}: Record<string, Record<string, string>>`
   * @param adminAxiosConfig adminAxiosConfig, like `{useCancelToken, isTransformData, isDetectStatus}: Record<string, boolean>`
   * @returns 
   */
  public post<T>(url: string, config: AxiosRequestConfig={}, adminAxiosConfig: IAdminAxiosConfig={}): Promise<T> {
    config.url = url;
    config.method = 'post';
    return this.handleRequest<T>(config, adminAxiosConfig);
  }

  /**
   * handle put request
   * @param url url
   * @param config axiosRequestConfig, like `{params, headers, method, data}: Record<string, Record<string, string>>`
   * @param adminAxiosConfig adminAxiosConfig, like `{useCancelToken, isTransformData, isDetectStatus}: Record<string, boolean>`
   * @returns
   */
  public put<T>(url: string, config: AxiosRequestConfig={}, adminAxiosConfig: IAdminAxiosConfig={}): Promise<T> {
    config.url = url;
    config.method = 'put';
    return this.handleRequest<T>(config, adminAxiosConfig);
  }

  /**
   * handle delete request
   * @param url url
   * @param config axiosRequestConfig, like `{params, headers, method, data}: Record<string, Record<string, string>>`
   * @param adminAxiosConfig adminAxiosConfig, like `{useCancelToken, isTransformData, isDetectStatus}: Record<string, boolean>`
   * @returns
   */
  public delete<T>(url: string, config: AxiosRequestConfig={}, adminAxiosConfig: IAdminAxiosConfig={}): Promise<T> {
    config.url = url;
    config.method = 'delete';
    return this.handleRequest<T>(config, adminAxiosConfig);
  }

  private handleRequest<T>(config: AxiosRequestConfig, adminAxiosConfig: IAdminAxiosConfig): Promise<T> {
    const { url, method } = config;

    if (!url) {
      systemStore.addSnackBarMessage('url is required', { variant: 'error' })
      throw new Error('url is required');
    }
    if (!method) {
      systemStore.addSnackBarMessage('method is required', { variant: 'error' })
      throw new Error('method is required');
    }

    const data = method === 'get' ? config.params || config.data : config.data || config.params;
    const curConfig = { ...config };
    if (method === 'get') {
      curConfig.params = data;
    } else {
      curConfig.data = data;
    }

    // set adminAxiosConfig properties
    const notExistList: unknown[] = [null, undefined];
    adminAxiosConfig.useCancelToken = notExistList.includes(adminAxiosConfig.useCancelToken) ? true : adminAxiosConfig.useCancelToken;
    adminAxiosConfig.isTransformData = notExistList.includes(adminAxiosConfig.isTransformData) ? true : adminAxiosConfig.isTransformData;
    adminAxiosConfig.isDetectStatus = notExistList.includes(adminAxiosConfig.isDetectStatus) ? true : adminAxiosConfig.isDetectStatus;
    (curConfig as unknown as Record<string, unknown>).adminAxiosConfig = adminAxiosConfig;

    if (['get', 'post', 'put', 'delete'].includes(method)) {
      return this.axios.request<T>(curConfig) as unknown as Promise<T>;
    } else {
      throw new Error('method is not supported');
    }
  }
}

const adminAxios = new AdminAxiosRequest();

export default adminAxios;