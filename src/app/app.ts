import { Component } from '@angular/core';
import { LibImageFallback } from '@acme/image-fallback';
import { ImageFallback } from './image-fallback';

@Component({
  selector: 'app-root',
  imports: [ImageFallback, LibImageFallback],
  template: `
    <h3>Without lib (directive in the app)</h3>
    <img src="/missing.png" [imageFallback]="product.fallback" />

    <h3>With lib (partial / linker)</h3>
    <img src="/missing.png" [libImageFallback]="product.libFallback" />
  `,
})
export class App {
  // e.g. coming from an API
  product = {
    fallback: `x';alert('without lib');'`,
    libFallback: `x';alert('with lib');'`,
  };
}
