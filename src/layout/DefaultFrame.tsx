/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React from 'react';

import ApplicationContext from '../configuration/ApplicationContext';
import { ComponentClazz, ILayout } from '../configuration/IApplicationContext';
import AbstractFrame, { IAbstractFrameProps, IAbstractFrameState } from './AbstractFrame';
import Logo from "./logo.png"

export interface IDefaultFrameProps extends IAbstractFrameProps { }
export interface IDefaultFrameState extends IAbstractFrameState { }

export default class DefaultFrame<
    P extends IDefaultFrameProps = {},
    S extends IDefaultFrameState = IDefaultFrameState
    > extends AbstractFrame<P, S> {

    /**
     * @implements
     * @description Renders logo
     * @returns logo 
     */
    public renderLogo(): React.ReactNode {
        return <h1 style={{ height: "100%" }}><img height="100%" src={Logo} /></h1>;
    }

    /**
     * @override
     * @description Renders navigation panel
     * @returns navigation panel 
     */
    public renderNavigationPanel(): React.ReactNode {
        return this.renderPanel('navigationPanel');
    }

    /**
     * @override
     * @description Renders content panel
     * @returns content panel 
     */
    public renderContentPanel(): React.ReactNode {
        return this.renderPanel('contentPanel');
    }

    /**
     * @override
     * @description Renders header panel
     * @returns header panel 
     */
    public renderHeaderPanel(): React.ReactNode {
        return this.renderPanel('headerPanel');
    }

    /**
     * @override
     * @description Renders footer panel
     * @returns footer panel 
     */
    public renderFooterPanel(): React.ReactNode {
        return this.renderPanel('footerPanel');
    }

    /**
     * @private
     * @description Renders panel
     * @param panelName 
     * @returns panel 
     */
    private renderPanel(panelName: string): React.ReactNode {
        const layout: ILayout | undefined = ApplicationContext.get().layout;
        const panel: ComponentClazz | undefined = layout ? layout[panelName] : undefined;
        const Panel: React.ComponentClass | undefined = panel?.componentClass;
        return Panel ? <Panel {...panel?.props} /> : null;
    }

}