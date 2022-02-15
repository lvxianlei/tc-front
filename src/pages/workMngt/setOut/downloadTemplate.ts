import { message } from "antd";
import { stringify } from "query-string";
import AuthUtil from "../../../utils/AuthUtil";

/**
 * @protected
 * @description 下载模板
 */
export function downloadTemplate(
    path: string,
    name: string,
    requestData?: {},
    type: boolean = false,
    requestType: string = ""
): Promise<void> {
    return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${path.replace(/^\/*/, '')}`, {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
            'Tenant-Id': AuthUtil.getTenantId(),
            'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
        },
        body: requestType === "array" ? JSON.stringify(requestData || {}) : stringify(requestData || {})
    }).then((res) => {
        if (res.status === 200) {
            return res.blob();
        } else {
            return res.json();
        }

    }).then((data) => {
        if (data.code) {
            message.error(data.msg);
            Promise.reject()
        } else {
            let blob = data;
            if (type) {
                blob = new Blob([data], { type: 'application/zip' })
            }
            let blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.download = name;
            a.href = blobUrl;
            a.click();
            if (document.body.contains(a)) {
                document.body.removeChild(a);
            }
        }
    }).catch((e: Error) => {
        message.error(e.message);
    });
}