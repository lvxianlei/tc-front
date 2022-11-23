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
const TOKEN_EXPIRES: string = 'SINZETECH_TOKEN_EXPIRES'
const REFRENSH_TOKEN: string = 'SINZETECH_REFRENSH_TOKEN'
const USER_INFO: string = 'USER_INFO'
const TENANT_NAME: string = 'SINZETECH_TENANT_NAME'
const TENANT_LISTS: string = 'SINZETECH_TENANTS'
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
        return Cookies.get(APP_Name) || ''
    }

    /**
     * @static
     * @description Sets app name
     * @param appName 
     * @param [options] 
     */
    public static setCurrentAppName(appName: string): void {
        Cookies.set(APP_Name, appName)
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
    public static setTenantName(tenantName: string): void {
        Cookies.set(TENANT_NAME, tenantName)
    }
    /**
     * @static
     * @description Gets tenant name
     * @returns tenant name 
     */
    public static getTenantName(): string {
        return Cookies.get(TENANT_NAME) || ''
    }

    public static getTokenExpires(): string {
        return Cookies.get(TOKEN_EXPIRES) || ''
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
     * @description Sets tenant name
     * @param tenantName
     * @param [options] 
     */
    public static setTenants(tenants: any[]): void {
        sessionStorage.setItem(TENANT_LISTS, JSON.stringify(tenants))
    }
    /**
     * @static
     * @description Gets tenant name
     * @returns tenant name 
     */
    public static getTenants(): any[] {
        const tenants = sessionStorage.getItem(TENANT_LISTS)
        return tenants ? JSON.parse(tenants) : []
    }

    /**
     * @static
     * @description remove tenant name
     * @returns tenant name 
     */
    public static removeTenants(): void {
        sessionStorage.removeItem(TENANT_LISTS)
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
        return Cookies.get(TOKEN_KEY) || ''
    }

    /**
     * @static
     * @description Sets sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static setSinzetechAuth(token: string, refrenshToken: string, expires_in: number): void {
        const expiresInDate = new Date((new Date().getTime() + expires_in * 1000))
        Cookies.set(TOKEN_KEY, token, expiresInDate)
        Cookies.set(TOKEN_EXPIRES, expiresInDate)
        sessionStorage.setItem(TOKEN_KEY, token)
        sessionStorage.setItem(REFRENSH_TOKEN, refrenshToken)
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

    public static setUserInfo(userInfo: any): void {
        sessionStorage.setItem(USER_INFO, JSON.stringify(userInfo))
    }

    public static getUserInfo(): any {
        const userInfo = sessionStorage.getItem(USER_INFO)
        return userInfo ? JSON.parse(userInfo) : {};
    }

    public static removeUserInfo(): void {
        sessionStorage.removeItem(USER_INFO);
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
            const { access_token, refresh_token, ...result }: any = await RequestUtil.post('/sinzetech-auth/oauth/token', {
                grant_type: "refresh_token",
                scope: "all",
                refresh_token: token
            }, {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${this.getAuthorization()}`,
                'Tenant-Id': this.getTenantId()
            })
            this.setSinzetechAuth(access_token, refresh_token, result.expires_in)
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

