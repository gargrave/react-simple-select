/// <reference types="node" />

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
  }
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}
