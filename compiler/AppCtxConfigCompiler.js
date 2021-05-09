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
            imports += `import ${ ClazzName } from '${ path.resolve(__dirname, '../src/', this.getLayoutClazz(layout[key])) }';\n`;
        }
        layoutAlt += `}`;
        return {
            source: imports + source,
            objAlt: layoutAlt
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
            const ClazzName = filter.replace(/\/|\./g, '');
            imports += `import ${ ClazzName } from '${ path.resolve(__dirname, '../src/', filter) }';\n`;
            filtersAlt += `new ${ ClazzName }(),`;
        });
        filtersAlt += `]`;
        return {
            source: imports + source,
            objAlt: filtersAlt
        }
    }
}

module.exports = AppCtxConfigCompiler;