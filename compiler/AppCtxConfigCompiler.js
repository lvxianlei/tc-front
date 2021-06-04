/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
const path = require('path');
const fs = require('fs');
const camelcaseKeys = require('camelcase-keys');
const pascalcase = require('pascalcase');
const stripJsonComments = require('strip-json-comments');

class AppCtxConfigCompiler {
    
    compile(source) {
        const appCtxConfig = camelcaseKeys(
            JSON.parse(
                stripJsonComments(
                    fs.readFileSync(path.resolve('./src/app-ctx.config.jsonc')).toString()
                )
            ), { deep: true });
        let appCtxAlt = '{';
        for (let key in appCtxConfig) {
            if (key === 'layout') {
                const objAlt = this.handleLayout(appCtxConfig[key], source);
                source = objAlt.source;
                appCtxAlt += `${ objAlt.objAlt },`;
            } else if (key === 'filters') {
                const objAlt = this.handleFilters(appCtxConfig[key], source);
                source = objAlt.source;
                appCtxAlt += `${ objAlt.objAlt },`;
            } else if (key === 'clientId') {
                appCtxAlt +=` ${ key } : ${ appCtxConfig[key] }`;
            } else if (key === 'clientSecret') {
                appCtxAlt +=` ${ key } : ${ appCtxConfig[key] }`;
            }
        } 
        appCtxAlt += '}';
        return source.replace('const ctxConfigJson: IApplicationContext = {};', `const ctxConfigJson: IApplicationContext = ${ appCtxAlt };`);
    }

    handleLayout(layout, source) {
        let imports = '';
        let layoutAlt = `layout:{`;
        for (let key in layout) {
            const ClazzName = pascalcase(key);
            if (typeof layout[key] === 'object') {
                layoutAlt += `${ key }:{componentClass:${ ClazzName },props:${JSON.stringify(layout[key].props)}},`;
            } else {
                layoutAlt += `${ key }:{componentClass:${ ClazzName },props:{}},`;
            }
            // imports += `import ${ ClazzName } from '${ path.resolve(__dirname, '../src/', this.getLayoutClazz(layout[key])) }';\n`;
            imports += `import ${ ClazzName } from '${ this.getRelativePathFromSrc(this.getLayoutClazz(layout[key])) }';\n`;
        }
        layoutAlt += `}`;
        return {
            source: imports + source,
            objAlt: layoutAlt
        }
    }

    getRelativePathFromSrc(modulePath) {
        if (modulePath.indexOf('./') === 0) { // start with "./"
            return `.${ modulePath }`;
        } else if (modulePath.indexOf('/') === 0) { // start with "/"
            return `..${ modulePath }`;
        } else {
            return `../${ modulePath }`;
        }
    }

    getLayoutClazz(layoutValue) {
        if (typeof layoutValue === 'object') {
            return layoutValue.module;
        }
        return layoutValue;
    }

    handleFilters(filters, source) {
        let imports = '';
        let filtersAlt = `filters:[`;
        filters.forEach((filter) => {
            const ClazzName = pascalcase(filter.replace(/\/|\.|\\/g, ''));
            const importDeclaration = `import ${ ClazzName } from '${ this.getRelativePathFromSrc(filter) }';\n`;
            const initialFilterStatement = `new ${ ClazzName }(),`;
            if (!new RegExp(importDeclaration).test(source)) {
                imports += importDeclaration;
            }
            if (!new RegExp(initialFilterStatement).test(source)) {
                filtersAlt += initialFilterStatement;
            }
        });
        filtersAlt += `]`;
        return {
            source: imports + source,
            objAlt: filtersAlt
        }
    }
}

module.exports = AppCtxConfigCompiler;