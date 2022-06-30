/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import Base64 from 'crypto-js/enc-base64'
import Utf8 from 'crypto-js/enc-utf8'
import Cookies, { CookieAttributes } from 'js-cookie'
import ctxConfig from "../app-ctx.config.jsonc"
import RequestUtil from './RequestUtil'
const TENANT_ID_KEY: string = 'SINZETECH_TENANT_ID'
const TOKEN_KEY: string = 'SINZETECH_TOKEN'
const REFRENSH_TOKEN: string = 'SINZETECH_REFRENSH_TOKEN'
const USER_ID: string = 'USER_ID'
const TENANT_NAME: string = 'SINZETECH_TENANT_NAME'
const REAL_NAME: string = 'REAL_NAME';
const APP_Name: string = 'CURRENT_APP_NAME';
const ACCOUNT: string = "ACCOUNT";
export default abstract class AuthUtil {

    static timeLength = 50 * 60 * 1000

    static timer: any = null

    /**
     * @description Authorization  of auth util
     */
    private static authorization: string

    /**
     * @static
     * @description Gets authorization
     * @returns authorization 
     */
    public static getAuthorization(): string {
        if (!this.authorization) {
            this.authorization = `${Base64.stringify(Utf8.parse(`${ctxConfig.clientId}:${ctxConfig.clientSecret}`))}`
        }
        return this.authorization
    }

    /**
     * @static
     * @description Gets tenant id
     * @returns tenant id 
     */
    public static getTenantId(): string {
        return Cookies.get(TENANT_ID_KEY) || ''
    }

    /**
     * @static
     * @description Gets app name
     * @returns App name
     */
    public static getCurrentAppName(): string {
        return sessionStorage.getItem(APP_Name) || ''
    }

    /**
     * @static
     * @description Sets app name
     * @param appName 
     * @param [options] 
     */
    public static setCurrentAppName(appName: string): void {
        sessionStorage.setItem(APP_Name, appName)
    }

    /**
     * @static
     * @description Sets tenant id
     * @param tenantId 
     * @param [options] 
     */
    public static setTenantId(tenantId: string, options?: CookieAttributes): void {
        Cookies.set(TENANT_ID_KEY, tenantId, options)
    }

    /**
     * @static
     * @description Sets tenant name
     * @param tenantName
     * @param [options] 
     */
    public static setTenantName(tenantName: string, options?: CookieAttributes): void {
        Cookies.set(TENANT_NAME, tenantName, options)
    }
    /**
     * @static
     * @description Gets tenant name
     * @returns tenant name 
     */
    public static getTenantName(): string {
        return Cookies.get(TENANT_NAME) || ''
    }

    /**
     * @static
     * @description remove tenant name
     * @returns tenant name 
     */
    public static removeTenantName(): void {
        Cookies.remove(TENANT_NAME)
    }

    /**
     * @static
     * @description Gets sinzetech auth
     * @returns sinzetech auth 
     * @description Remove tenant id
     * @param tenantId 
     * @param [options] 
     */
    public static removeTenantId(): void {
        Cookies.remove(TENANT_ID_KEY);
    }

    /**
     * @static
     * @description Gets sinzetech auth
     * @returns sinzetech auth 
     */
    public static getSinzetechAuth(): string {
        return sessionStorage.getItem(TOKEN_KEY) || ''
    }

    /**
     * @static
     * @description Sets sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static setSinzetechAuth(token: string, refrenshToken: string): void {
        Cookies.set(TOKEN_KEY, token)
        sessionStorage.setItem(TOKEN_KEY, token)
        sessionStorage.setItem(REFRENSH_TOKEN, refrenshToken)
        this.timer && clearInterval(this.timer)
        this.timer = setTimeout(() => {
            this.refrenshToken(this.getRefreshToken())
        }, this.timeLength)
    }

    /**
     * @static
     * @description Remove sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static removeSinzetechAuth(): void {
        Cookies.remove(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(REFRENSH_TOKEN);
        sessionStorage.removeItem(APP_Name);
    }

    /**
     * @static
     * @description Gets sinzetech auth
     * @returns sinzetech auth 
     */
    public static getRealName(): string {
        return Cookies.get(REAL_NAME) || '';
    }

    public static getAccount(): string {
        return Cookies.get(ACCOUNT) || '';
    }
  
    public static removeAccount(): void {
        Cookies.remove(ACCOUNT);
    }

    /**
     * @static
     * @description Sets sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static setRealName(token: string, options?: CookieAttributes): void {
        Cookies.set(REAL_NAME, token, options);
    }

    public static setAccout(token: string, options?: CookieAttributes): void {
        Cookies.set(ACCOUNT, token, options);
    }

    /**
     * @static
     * @description Remove sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static removeRealName(): void {
        Cookies.remove(REAL_NAME);
    }

    public static setUserId(userId: string): void {
        sessionStorage.setItem(USER_ID, userId)
    }

    public static getUserId(): any {
        return sessionStorage.getItem(USER_ID) || '';
    }

    public static removeUserId(): void {
        sessionStorage.removeItem(USER_ID);
    }

    /**
     * @static
     * @description Gets sinzetech auth
     * @returns sinzetech auth 
     */
    public static getRefreshToken(): string {
        return sessionStorage.getItem(REFRENSH_TOKEN) || ''
    }

    /**
     * @static
     * @description Sets sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static async refrenshToken(token: string): Promise<void> {
        try {
            const { access_token, refresh_token } = await RequestUtil.post('/sinzetech-auth/oauth/token', {
                grant_type: "refresh_token",
                scope: "all",
                refresh_token: token
            }, {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${this.getAuthorization()}`,
                'Tenant-Id': this.getTenantId()
            })
            this.setSinzetechAuth(access_token, refresh_token)
        } catch (error) {
            console.log("ERROR: refrenshToken", error)
        }
    }

    /** 
     * 清除tdm-token -SINZETECH_TOKEN_KEY
     * */ 
    public static removeSinzetechToken(): void {
        Cookies.remove('DHWY_TDM_TOKEN', { domain: '.dhwy.cn' });
        Cookies.remove('DHWY_TDM_TOKEN', { domain: 'localhost' });
    }
}

