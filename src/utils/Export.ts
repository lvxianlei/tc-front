
import AuthUtil from './AuthUtil';
/**
 * 入参
 */
interface Parmas {
    [key: string]: any
}

/**
 * 
 * @param path 请求的接口地址
 * @param methods 请求方式
 * @param parmas 请求参数
 * @param type 下载文件的流格式
 * @param fileName 下载的文件名称
 *      文件type:
 *          .doc: application/msword
 *          .docx: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 *          .xls: application/vnd.ms-excel
 *          .xlsx: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *          .ppt: application/vnd.ms-powerpoint
 *          .pptx: application/msword
 *          .doc: application/vnd.openxmlformats-officedocument.presentationml.presentation
 * @returns 
 */
export function exportDown(
    path: string,
    methods: string = "POST",
    parmas: Parmas = {},
    type: string = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileName: string = "模板"
) {
    return fetch(`${process.env.REQUEST_API_PATH_PREFIX?.replace(/\/*$/, '/') || ''.replace(/\/*$/, '/')}${`${path}`.replace(/^\/*/, '')}`, {
        mode: 'cors',
        method: methods,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
            'Tenant-Id': AuthUtil.getTenantId(),
            'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
        },
        ...(methods === "GET" ? {} : { body: JSON.stringify(parmas) })
    }).then((res) => {
        return res.blob();
    }).then((data) => {
        let blob = new Blob([data], { type });
        // 获取heads中的filename文件名
        let downloadElement = document.createElement('a');
        // 创建下载的链接
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        // 下载后文件名
        downloadElement.download = fileName;
        document.body.appendChild(downloadElement);
        // 点击下载
        downloadElement.click();
        // 下载完成移除元素
        document.body.removeChild(downloadElement);
        // 释放掉blob对象
        window.URL.revokeObjectURL(href);
    })
}