/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import NProgress from 'nprogress';
import React from 'react';


export default abstract class AsyncComponent<P = {}, S = {}> extends React.Component<P, S> {

    public componentDidMount() {
        NProgress.done();
    }
}