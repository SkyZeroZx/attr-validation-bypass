import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: 'img[imageFallback]' })
export class ImageFallback {
  @Input() imageFallback = '';

  @HostBinding('attr.onerror')
  get fallback() {
    return `this.src='${this.imageFallback}'`;
  }
}
