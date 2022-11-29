/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { message } from 'antd';
import NProgress from 'nprogress';
import { stringify } from 'query-string';

import AuthUtil from './AuthUtil';

interface IResponse<T> {
    readonly code: number;
    readonly data: T;
    readonly msg: string;
}

export function jsonStringifyReplace(key: string, value: any) {
    if (typeof value === 'undefined') {
        return null
    }
    return value
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
        window.history.replaceState(null, '', `/login?goto=${encodeURIComponent(urlWithoutHost)}`);
        window.history.replaceState(null, '', `/login`);
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
    private static async request<T>(path: string, init?: RequestInit, cancel?: (abort: AbortController) => void, changePath: boolean = true): Promise<T> {
        const sinzetechAuth: string = AuthUtil.getSinzetechAuth();
        const tokenExpires: string = AuthUtil.getTokenExpires()
        if ((new Date(tokenExpires).getTime() - new Date().getTime()) < 3600000) {
            const refrenshToken: any = await fetch(`${process.env.REQUEST_API_PATH_PREFIX}/sinzetech-auth/oauth/token`, {
                method: 'POST',
                body: stringify({
                    grant_type: "refresh_token",
                    scope: "all",
                    refresh_token: AuthUtil.getRefreshToken()
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                    'Tenant-Id': AuthUtil.getTenantId()
                },
                referrerPolicy: 'no-referrer-when-downgrade',
            })
            AuthUtil.setSinzetechAuth(refrenshToken.access_token, refrenshToken.refresh_token, refrenshToken.expires_in)
        }
        return new Promise<T>((resolve: (data: T) => void, reject: (res: IResponse<T>) => void): void => {
            let headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                'Tenant-Id': AuthUtil.getTenantId(),
            }
            if (![undefined, "undefined", ""].includes(sinzetechAuth)) {
                headers['Sinzetech-Auth'] = sinzetechAuth;
            }
            if (![undefined, "undefined", ""].includes(AuthUtil.getTenantId())) {
                headers['Tenant-Id'] = AuthUtil.getTenantId()
            }
            const controller = new AbortController();
            const { signal } = controller;
            cancel && cancel(controller)
            fetch(changePath ? this.joinUrl(path, process.env.REQUEST_API_PATH_PREFIX || '') : path, {
                mode: 'cors',
                ...(init || {}),
                headers: {
                    ...headers,
                    ...init?.headers
                },
                referrerPolicy: 'no-referrer-when-downgrade',
                signal
            })
                .then(async (res) => {
                    if (res.status !== 200) {
                        NProgress.done();
                    }
                    if (res.status === 401) {
                        await message.warning("登录已过期！请重新登录...")
                        setTimeout(this.backToLogin, 10);
                    }
                    return res.json();
                })
                .then(async (res: IResponse<T> | any) => {
                    NProgress.done();
                    if (path === '/sinzetech-auth/oauth/token') {
                        resolve(res);
                    } else if (res.code === 200) {
                        resolve(res.data);
                    } else if (res.code === 401) {
                        if (!path.includes("sinzetech-auth/oauth")) {
                            await message.warning("登录已过期！请重新登录...")
                            setTimeout(this.backToLogin, 10);
                        } else {
                            await message.warning("登录已过期！请重新登录...")
                            console.log("token过期。。。。")
                        }
                    } else {
                        message.error(res.msg);
                        reject(res);
                    }
                })
                .catch((e: Error) => {
                    NProgress.done();
                    if (e.message === "Unexpected end of JSON input" || e.message === "JSON.parse: unexpected end of data at line 1 column 1 of the JSON data") {
                        resolve({} as any)
                    } else if (e.name === 'AbortError') {
                        // console.log('abort');
                    } else {
                        message.error(e.message);
                    }
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
    public static get<T>(path: string, params?: Record<string, any>, headers?: HeadersInit, cancel?: (abort: AbortController) => void): Promise<T> {
        NProgress.inc();
        if (params) {
            path += `?${stringify(params)}`;
        }
        return this.request(path, {
            method: 'GET',
            headers: headers
        }, cancel);
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
            body: (headers as any || {})['Content-Type'] === 'application/x-www-form-urlencoded' ? stringify(params) : JSON.stringify(params, jsonStringifyReplace),
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
            body: JSON.stringify(params, jsonStringifyReplace),
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
    public static putFile<T>(path: string, params: Record<string, any> = {}): Promise<T> {
        NProgress.inc();
        return this.request(path, {
            method: 'PUT',
            body: params as any,
            headers: {
                "Content-Type": "application/octet-stream"
            }
        }, () => { }, false);
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
            body: JSON.stringify(params, jsonStringifyReplace),
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
        return `${base.replace(/\/*$/, '/')}${path.replace(/^\/*/, '')}`;
    }
}