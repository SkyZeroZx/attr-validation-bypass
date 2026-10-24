import * as i0 from '@angular/core';

// Partial (linker) output, as ng-packagr publishes it.
class LibImageFallback {
  libImageFallback = '';
  get fallback() {
    return `this.src='${this.libImageFallback}'`;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: '12.0.0', version: '22.2.3', ngImport: i0, type: LibImageFallback, deps: [], target: i0.ɵɵFactoryTarget.Directive });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: '14.0.0',
    version: '22.2.3',
    type: LibImageFallback,
    isStandalone: true,
    selector: 'img[libImageFallback]',
    inputs: { libImageFallback: 'libImageFallback' },
    host: { properties: { 'attr.onerror': 'this.fallback' } },
    ngImport: i0,
  });
}

export { LibImageFallback };
