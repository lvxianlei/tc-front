/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-工作台-个人数字门户
 */

import React from 'react';
import { DetailContent } from '../../common';

export default function GatewayPersonal(): React.ReactNode {

    return <DetailContent>
        <iframe
            style={{ width: "100%", minHeight: 800 }}
            src={`http://tc-data-view.dhwy.cn/view/1585833889277464577`}
        />
    </DetailContent>
}
