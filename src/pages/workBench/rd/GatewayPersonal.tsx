/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-工作台-个人数字门户
 */

import AuthUtil from '@utils/AuthUtil';
import React from 'react';
import { DetailContent } from '../../common';

export default function GatewayPersonal(): React.ReactNode {

    return <DetailContent>
        <iframe
            style={{ width: "100%", minHeight: 800 }}
            src={`http://tc-data-view.dhwy.cn/view/1588865679567208450?token=${AuthUtil.getSinzetechAuth()}&tenant_id=${AuthUtil.getTenantId()}`}
        />
    </DetailContent>
}
