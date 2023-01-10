import RequestUtil from "@utils/RequestUtil";
import AuthUtil from "@utils/AuthUtil";

const MES_BASE_INFO: string = "MES_BASE_INFO";
export default abstract class ThirdPartyUtil {
    /**
     * 设置第三方应用配置（mes）
     */
    public static async setMesBaseInfo(key: string) {
        let result = await RequestUtil.get('/tower-system/appDeploy/detail/' + key, undefined, {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
            'Tenant-Id': AuthUtil.getTenantId()
        })
        result = result ? result : {}
        sessionStorage.setItem(MES_BASE_INFO + key, JSON.stringify(result))
    }

    /**
     * 获取第三方应用配置信息（mes）
     */
    public static getMesBaseInfo(key: string): any {
        const mesBaseInfo = sessionStorage.getItem(MES_BASE_INFO + key);
        return mesBaseInfo ? JSON.parse(mesBaseInfo) : {};
    }
}
