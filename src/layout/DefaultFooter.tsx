/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';
import styles from './DefaultFooter.module.less';

import AsyncComponent from '../components/AsyncComponent';

export interface IDefaultFooterProps {}
export interface IDefaultFooterState {}

/**
 * @TODO Describe the class
 */
export default class DefaultFooter extends AsyncComponent<IDefaultFooterProps, IDefaultFooterState> {

    /**
     * @description Renders DefaultFooter
     * @returns render 
     */
    public render(): React.ReactNode {
        return (
            <div className={ styles.footerContent }>Copyright © 北京新之科技有限公司, All Rights Reserved.</div>
        );
    }
}