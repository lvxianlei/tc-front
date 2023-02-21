/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-工作台-个人数字门户
 */

import React from 'react';
import { DetailContent } from '../../common';
import styles from './WorkBench.module.less';

export default function GatewayPersonal(): React.ReactNode {

    return <DetailContent className={styles.gateway}>
        <iframe
            style={{ width: "100%", minHeight: 850 }}
            scrolling="auto"
            src={`http://tc-data-view.dhwy.cn/view/1585833889277464577`}
        />
    </DetailContent>
}
