/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import Base64 from 'crypto-js/enc-base64';
import Cookies, { CookieAttributes } from 'js-cookie';

import ApplicationContext from '../configuration/ApplicationContext';
import { IClientConfig } from '../configuration/IApplicationContext';


const TENANT_ID_KEY: string = 'SINZETECH_TENANT_ID';
const TOKEN_KEY: string = 'SINZETECH_TOKEN';

export default abstract class AuthUtil {

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
            this.authorization = `${ Base64.parse(`${ clinetInfo.clientId }:${ clinetInfo.clientSecret }`).toString() }`;
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
        return Cookies.get(TOKEN_KEY) || '';
    }

    /**
     * @static
     * @description Sets sinzetech auth
     * @param token 
     * @param [options] 
     */
    public static setSinzetechAuth(token: string, options?: CookieAttributes): void {
        Cookies.set(TOKEN_KEY, token, options);
    }
}