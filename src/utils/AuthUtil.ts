/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8'
import Cookies, { CookieAttributes } from 'js-cookie';

import ApplicationContext from '../configuration/ApplicationContext';
import { IClientConfig } from '../configuration/IApplicationContext';


const TENANT_ID_KEY: string = 'SINZETECH_TENANT_ID';
const TOKEN_KEY: string = 'SINZETECH_TOKEN';
export default abstract class AuthUtil {

    static time = 50 * 60 * 1000
    
    /**
     * @description Authorization  of auth util
     */
    private static authorization: string;

    /**
     * @static
     * @description Gets authorization
     * @returns authorization 
     */
    public static getAuthorization(): string {
        if (!this.authorization) {
            const clinetInfo: IClientConfig = ApplicationContext.get();
            this.authorization = `${Base64.stringify(Utf8.parse(`${clinetInfo.clientId}:${clinetInfo.clientSecret}`))}`;
        }
        return this.authorization;
    }

    /**
     * @static
     * @description Gets tenant id
     * @returns tenant id 
     */
    public static getTenantId(): string {
        return Cookies.get(TENANT_ID_KEY) || '';
    }

    /**
     * @static
     * @description Sets tenant id
     * @param tenantId 
     * @param [options] 
     */
    public static setTenantId(tenantId: string, options?: CookieAttributes): void {
        Cookies.set(TENANT_ID_KEY, tenantId, options);
    }

    /**
     * @static
     * @description Gets sinzetech auth
     * @returns sinzetech auth 
     */
    public static getSinzetechAuth(): string {
        return sessionStorage.getItem(TOKEN_KEY) || '';
    }

    /**
     * @static
     * @description Sets sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static setSinzetechAuth(token: string): void {
        sessionStorage.setItem(TOKEN_KEY, token);
    }

    /**
     * @static
     * @description Sets sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static refrenshToken(token: string): void {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
}