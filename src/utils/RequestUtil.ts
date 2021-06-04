/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { message } from 'antd';
import NProgress from 'nprogress';
import { stringify } from 'query-string';

import AuthUtil from './AuthUtil';

interface IResponse<T> {
    readonly access_token: any;
    readonly code: number;
    readonly data: T;
    readonly msg: string;
}

/**
 * @abstract
 * @description Request util
 */
export default abstract class RequestUtil {

    /**
     * @private
     * @static
     * @description Backs to login
     */
    private static backToLogin() {
        const urlWithoutHost: string = window.location.href.replace(`${window.location.protocol}//${window.location.host}`, '');
        window.history.replaceState(null, '', `/login?goto=${ encodeURIComponent(urlWithoutHost) }`);
        window.location.reload();
    }

    /**
     * @private
     * @static
     * @description Requests request util
     * @template T 
     * @param path 
     * @param [init] 
     * @returns request 
     */
    private static request<T>(path: string, init?: RequestInit): Promise<T> {
        return new Promise<T>((resolve: (data: T) => void, reject: (res: IResponse<T>) => void): void => {
            let headers: HeadersInit = {
                'Content-Type': init?.headers ? 'application/x-www-form-urlencoded;charset=UTF-8' : 'application/json;charset=UTF-8',
                'Authorization': `Basic ${ AuthUtil.getAuthorization() }`,
                'Tenant-Id': AuthUtil.getTenantId(),
            };
            const sinzetechAuth: string = AuthUtil.getSinzetechAuth();
            if (sinzetechAuth) {
                headers['Sinzetech-Auth'] = sinzetechAuth;
            }
            if(init?.headers) {
                headers['Captcha-Code'] = JSON.parse(JSON.stringify(init?.headers))['Captcha-code'];
                headers['Captcha-Key'] = JSON.parse(JSON.stringify(init?.headers))['Captcha-key'];
            }
            
            fetch(this.joinUrl(path, process.env.REQUEST_API_PATH_PREFIX || ''), {
                mode: 'cors',
                ...(init || {}),
                headers: {
                    ...headers
                }
            })
            .then((res) => {
                if (res.status !== 200) {
                    NProgress.done();
                }
                if (res.status === 401) {
                    setTimeout(this.backToLogin, 10);
                }
                return res.json();
            })
            .then((res: IResponse<T> | any) => {
                NProgress.done();
                if(res.access_token){
                    resolve(res);
                }
                if (res.code === 200) {
                    resolve(res.data);
                } else if (res.code === 401) {
                    setTimeout(this.backToLogin, 10);
                }else {
                    message.error(res.msg);
                    reject(res);
                }
            })
            .catch((e: Error) => {
                NProgress.done();
                message.error(e.message);
            });
        });
    }

    
    /**
     * @static
     * @description Gets request util
     * @template T 
     * @param path 
     * @param [params] 
     * @param [headers] 
     * @returns get 
     */
    public static get<T>(path: string, params?: Record<string, any>, headers?: HeadersInit) : Promise<T> {
        NProgress.inc();
        if (params) {
            path += `?${ stringify(params) }`;
        }
        return this.request(path, {
            method: 'GET',
            headers: headers
        });
    }

    /**
     * @static
     * @description Posts request util
     * @template T 
     * @param path 
     * @param [params] 
     * @param [headers] 
     * @returns post 
     */
    public static post<T>(path: string, params: Record<string, any> = {}, headers?: HeadersInit): Promise<T> {
        NProgress.inc();
        return this.request(path, {
            method: 'POST',
            body: (headers as any || {})['Content-Type'] === 'application/x-www-form-urlencoded' ? stringify(params) : JSON.stringify(params),
            headers: headers
        });
    }

    /**
     * @static
     * @description Puts request util
     * @template T 
     * @param path 
     * @param [params] 
     * @param [headers] 
     * @returns put 
     */
    public static put<T>(path: string, params: Record<string, any> = {}, headers?: HeadersInit): Promise<T> {
        NProgress.inc();
        return this.request(path, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers: headers,
        });
    }

    /**
     * @static
     * @description Deletes request util
     * @template T 
     * @param path 
     * @param [params] 
     * @param [headers] 
     * @returns delete 
     */
    public static delete<T>(path: string, params: Record<string, any> = {}, headers?: HeadersInit): Promise<T> {
        NProgress.inc();
        return this.request(path, {
            method: 'DELETE',
            body: JSON.stringify(params),
            headers: headers
        });
    }

    /**
     * @private
     * @static
     * @description Joins url
     * @param path 
     * @param base 
     * @returns url 
     */
    private static joinUrl(path: string, base: string): string {
        return `${ base.replace(/\/*$/, '/') }${ path.replace(/^\/*/, '') }`;
    }
}