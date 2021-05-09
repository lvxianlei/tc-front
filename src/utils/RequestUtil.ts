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
     * @static
     * @description Backs to login
     */
    private static backToLogin() {
        const urlWithoutHost: string = window.location.href.replace(`${window.location.protocol}//${window.location.host}`, '');
        window.history.replaceState(null, '', `/login?goto=${ encodeURIComponent(urlWithoutHost) }`);
        window.location.reload();
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
        return new Promise<T>((resolve: (data: T) => void, reject: (res: IResponse<T>) => void): void => {
            fetch(this.joinUrl(path, process.env.REQUEST_API_PATH_PREFIX || ''), {
                mode: 'cors',
                method: 'GET',
                credentials: 'include'
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
                if (res.code === 1) {
                    resolve(res.data);
                } else {
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
        return new Promise<T>((resolve: (data: T) => void, reject: (res: IResponse<T>) => void): void => {
            fetch(this.joinUrl(path, process.env.REQUEST_API_PATH_PREFIX || ''), {
                body: JSON.stringify(params),
                mode: 'cors',
                method: 'POST',
                credentials: 'include'
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
                if (res.code === 1) {
                    resolve(res.data);
                } else {
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