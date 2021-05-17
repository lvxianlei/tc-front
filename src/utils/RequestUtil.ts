/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { message } from 'antd';
import NProgress from 'nprogress';
import { stringify } from 'query-string';

interface IResponse<T> {
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
            fetch(this.joinUrl(path, process.env.REQUEST_API_PATH_PREFIX || ''), {
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                ...(init || {})
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
            .then((res: IResponse<T>) => {
                NProgress.done();
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
     * Get fetch
     *
     * @static
     * @template T
     * @param {string} path
     * @returns {Promise<T>}
     * @memberof RequestUtil
     */
    public static get<T>(path: string, params?: Record<string, any>): Promise<T> {
        NProgress.inc();
        if (params) {
            path += `?${ stringify(params) }`;
        }
        return this.request(path, {
            method: 'GET'
        });
    }

    /**
     * Post fetch
     *
     * @static
     * @template T
     * @param {string} path
     * @param {Record<string, any>} [params={}]
     * @returns {Promise<T>}
     * @memberof RequestUtil
     */
    public static post<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
        NProgress.inc();
        return this.request(path, {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    /**
     * @static
     * @description Puts request util
     * @template T 
     * @param path 
     * @param [params] 
     * @returns put 
     */
    public static put<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
        NProgress.inc();
        return this.request(path, {
            method: 'PUT',
            body: JSON.stringify(params)
        });
    }

    /**
     * @static
     * @description Deletes request util
     * @template T 
     * @param path 
     * @param [params] 
     * @returns delete 
     */
    public static delete<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
        NProgress.inc();
        return this.request(path, {
            method: 'DELETE',
            body: JSON.stringify(params)
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