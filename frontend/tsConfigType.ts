export interface TsConfig extends Partial<Record<string, any>> {
    "ts-node": {
        "files": boolean
    },
    "files": string[],
    "include": string[],
    "exclude": string[],
    "compilerOptions": {
        "experimentalDecorators": boolean,
        "typeRoots": string[],
        "baseUrl": string,
        "paths": Record<string, string[]>,
        "target": 'ES3' | 'ES5' | 'ES2015' | 'ES2016' | 'ES2017' | 'ES2018' | 'ES2019' | 'ES2020' | 'ESNEXT',
        "module": 'none' | 'commonjs' | 'amd' | 'system' | 'umd' | 'es2015' | 'es2020' | 'ESNext',
        "allowJs": boolean,
        "sourceMap": boolean,
        "outDir": string,
        "removeComments": boolean,
        "strict": boolean,
        "noImplicitAny": boolean,
        "moduleResolution": "classic" | "node",
        "esModuleInterop": boolean,
        "emitDecoratorMetadata": boolean, /* Enables experimental support for emitting type metadata for decorators. */
        "resolveJsonModule": boolean,
        /* Advanced Options */
        "skipLibCheck": boolean, /* Skip type checking of declaration files. */
        "forceConsistentCasingInFileNames": boolean, /* Disallow inconsistently-cased references to the same file. */
        "importsNotUsedAsValues": "preserve" | "error" | "remove"
    }
}