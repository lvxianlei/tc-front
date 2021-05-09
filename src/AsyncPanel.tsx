/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import loadable from '@loadable/component';
import NProgress from 'nprogress';
import React from 'react';


class Loading extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
        NProgress.inc();
    }

    public render() {
        return null;
    }
}
interface IAsyncPanelProps<P = {}> {
    readonly module?: string;
    readonly props?: P;
}

export default loadable<IAsyncPanelProps>((props: IAsyncPanelProps) => import(`${ props.module }`), {
    fallback: <Loading />
});
