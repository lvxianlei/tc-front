/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import Cookies from 'js-cookie';

/**
 * @description The enum of Language
 */
export enum Lang {
    ZH = 'zh', // Mandarin of China
    EN = 'en'  // English
};

// The language key in the storage(cookie)
const LANG_KEY: string = 'LANG';

/**
 * @TODO The language utils class, it is used for global and common scenes
 */
export default abstract class LangUtil {

    /**
     * @static
     * @description Gets lang from the cookie
     * @returns language enum
     */
    public static getLang(): Lang {
        return Cookies.get(LANG_KEY) as Lang || Lang.EN;
    }

    /**
     * @static
     * @description Sets the current language into the cookie
     * @param value The language enum
     * @param [options] 
     */
    public static setLang(value: Lang, options?: Cookies.CookieAttributes): void {
        Cookies.set(LANG_KEY, value, options);
    }
}