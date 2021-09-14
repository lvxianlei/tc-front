/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { RouteComponentProps, withRouter } from 'react-router';
import DefaultFrame, { IDefaultFrameProps, IDefaultFrameState } from '../DefaultFrame';

export interface ITCFrameProps { }
export interface ITCFrameRouteProps extends RouteComponentProps<ITCFrameProps>, IDefaultFrameProps { }
export interface ITCFrameState extends IDefaultFrameState { }

/**
 * @TODO Describe the class
 */
class TCFrame extends DefaultFrame<ITCFrameRouteProps, ITCFrameState> {

}

export default withRouter(TCFrame);