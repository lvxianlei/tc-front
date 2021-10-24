import { defineConfig } from 'yapi-to-typescript'
import { formatPathToStringName } from "./src/utils"
export default defineConfig([
    {
        serverType: "yapi",
        serverUrl: 'http://yapi.saikul.com',
        typesOnly: false,
        target: 'typescript',
        prodEnvName: 'production',
        jsonSchema: {
            enabled: true,
            responseData: true
        },
        comment: {
            enabled: true,
            updateTime: false,
            link: false
        },
        outputFilePath: interfaceInfo => `src/API${interfaceInfo._project.basepath}/${interfaceInfo.method.toLowerCase()}${formatPathToStringName(interfaceInfo.path, interfaceInfo._project.basepath)}.ts`,
        requestFunctionFilePath: 'src/utils/Request.ts',
        dataKey: 'data',
        projects: [
            {
                token: "faaf838242684af21bf6f45a1b1c92ec41ce818b179e09115ea98e275a22c970",
                categories: [
                    {
                        id: 0,
                        getRequestFunctionName: interfaceInfo => `${interfaceInfo.method.toLowerCase()}${formatPathToStringName(interfaceInfo.path, interfaceInfo._project.basepath)}`,
                    },
                ],
            },
        ],
    },
])