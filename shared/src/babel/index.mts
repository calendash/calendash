import type { TransformOptions, ConfigAPI } from '@babel/core';

export function config(api: ConfigAPI): TransformOptions {
  // Enable persistent caching — good for stable configurations
  api.cache.forever();

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            targets: 'current'
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    assumptions: {
      arrayLikeIsIterable: true,
      constantReexports: true,
      ignoreFunctionLength: true,
      ignoreToPrimitiveHint: true,
      mutableTemplateObject: true,
      noClassCalls: true,
      noDocumentAll: true,
      objectRestNoSymbols: true,
      privateFieldsAsProperties: false,
      pureGetters: true,
      setClassMethods: true,
      setComputedProperties: true,
      setPublicClassFields: true,
      setSpreadProperties: true,
      superIsCallableConstructor: true,
    },
  };
}
