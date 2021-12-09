import { StoreValue } from "antd/lib/form/interface";

/**
 * @description 验证业主联系电话格式
 */
export function  checkcustomerPhone (value: StoreValue): Promise<void | any> {
    return new Promise(async (resolve, reject) => {  // 返回一个promise
        const regPhone: RegExp = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        const regTel: RegExp = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
        if(regPhone.test(value) || regTel.test(value) ) {
            resolve(true)
        } else 
            resolve(false)
    }).catch(error => {
        Promise.reject(error)
    })
}