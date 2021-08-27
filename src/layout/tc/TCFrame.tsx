/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Breadcrumb, Card, Space } from 'antd';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import ApplicationContext from '../../configuration/ApplicationContext';
import { IRouterItem } from '../../configuration/IApplicationContext';
import DefaultFrame, { IDefaultFrameProps, IDefaultFrameState } from '../DefaultFrame';
import layoutStyles from '../Layout.module.less';

export interface ITCFrameProps {}
export interface ITCFrameRouteProps extends RouteComponentProps<ITCFrameProps>, IDefaultFrameProps {}
export interface ITCFrameState extends IDefaultFrameState {}

/**
 * @TODO Describe the class
 */
class TCFrame extends DefaultFrame<ITCFrameRouteProps, ITCFrameState> {
    
}

export default withRouter(TCFrame);