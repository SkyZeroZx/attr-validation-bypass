# attr-validation-bypass

Repro for [angular/angular#70408](https://github.com/angular/angular/pull/70408).

`@HostBinding('attr.onerror')` is not validated. `ng build` reports no error in
dev or production, and the bound value becomes an inline handler.

```bash
npm install
npm start
```

Both images 404, so `onerror` fires on load and you get two alerts. The
rendered attributes are:

```
onerror="this.src='x';alert('without lib');''"
onerror="this.src='x';alert('with lib');''"
```

`ng build --configuration production` reports no error either.

## Case 1: directive in the app

[src/app/image-fallback.ts](src/app/image-fallback.ts)

```ts
@Directive({ selector: 'img[imageFallback]' })
export class ImageFallback {
  @Input() imageFallback = '';

  @HostBinding('attr.onerror')
  get fallback() {
    return `this.src='${this.imageFallback}'`;
  }
}
```

```html
<img src="/missing.png" [imageFallback]="product.fallback" />
```

`product.fallback` is a product field from an API. A quote in it closes the
string literal.

## Case 2: directive from a library

[vendor/image-fallback/index.mjs](vendor/image-fallback/index.mjs), same
directive in partial (linker) format:

```js
host: { properties: { 'attr.onerror': 'this.fallback' } }
```

The app only binds the input. Nothing is reported when publishing with
`ng-packagr` either.

## Root cause

The guard is `BindingParser.createBoundHostProperties`, reached only through
`verifyHostBindings`. That has one call site, `extractHostBindings` in
[jit_compiler_facade.ts:949](https://github.com/angular/angular/blob/22.2.3/packages/compiler/src/jit_compiler_facade.ts#L949),
so it runs under JIT only. ngtsc merges `@HostBinding` decorators in
[typecheck/host_bindings.ts](https://github.com/angular/angular/blob/22.2.3/packages/compiler/src/typecheck/host_bindings.ts#L116)
and the linker reads host metadata straight from the partial declaration;
neither calls it.

Both paths emit `ɵɵattribute("onerror", ctx.fallback)` with two arguments. No
sanitizer, because event attributes have no security context.

Nothing re-checks at runtime. `validateAgainstEventProperties` is for
properties and runs under `ngDevMode && firstUpdatePass`.
`ɵɵvalidateAttribute` is registered only for `iframe@sandbox` and the SVG
`animate` family.

