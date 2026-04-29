declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      /** Registered at runtime via `@pixi/react` useExtend */
      pixiLayoutContainer: import('@pixi/react').PixiReactElementProps<
        typeof import('@pixi/layout/components').LayoutContainer
      > & {
        layout?: Partial<import('@pixi/layout').LayoutStyles> | boolean;
      };
      /** Registered at runtime via `@pixi/react` useExtend */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pixiText: any;
    }
  }
}
