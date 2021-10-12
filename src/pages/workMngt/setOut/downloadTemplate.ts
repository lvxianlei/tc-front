import { stringify } from "query-string";
import AuthUtil from "../../../utils/AuthUtil";

/**
 * @protected
 * @description 下载模板
 */
export function downloadTemplate(path: string, name: string, requestData?: {}): Promise<void> {
    return fetch(`${ process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/') }${ path.replace(/^\/*/, '') }`, {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
          'Tenant-Id': AuthUtil.getTenantId(),
          'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
        },
        body: stringify(requestData || {})
    }).then((res) => {
        return res.blob();
    }).then((data) => {
        let blobUrl = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = name;
        a.href = blobUrl;
        a.click();
        if(document.body.contains(a)) {
            document.body.removeChild(a);
        }
    })
}