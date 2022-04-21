/**
 * @author zyc
 * @copyright © 2022 
 * @description 工作管理-放样列表-塔型信息-放样-漏件检查
 */

import React, { forwardRef } from "react";
import { Input, Spin } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

interface modalProps {
    id: string;
}

export default forwardRef(function MissCheck({ id }: modalProps, ref) {
    const { loading, data } = useRequest<[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: [] = await RequestUtil.get(`/tower-science/productStructure/partsInspect/${id}`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })


    return <DetailContent>
        <Input.TextArea value={data} disabled />
    </DetailContent>
})
