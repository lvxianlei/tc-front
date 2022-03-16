/// <reference types="react-scripts" />

declare module "*.module.less" {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.jsonc" {
    const classes: { [key: string]: any };
    export default classes;
}

declare module "@loadable/component" {
    type LoadableOptions = {
        fallback: React.ReactNode
    };
    const loadable: <P>(func: (props: P) => any, options?: LoadableOptions) => React.ComponentClass<P>;
    export default loadable;
}