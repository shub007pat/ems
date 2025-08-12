import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStatusHighlight]'
})
export class StatusHighlightDirective implements OnInit {
  @Input() appStatusHighlight: boolean = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.updateHighlight();
  }

  @Input() set status(value: boolean) {
    this.appStatusHighlight = value;
    this.updateHighlight();
  }

  private updateHighlight() {
    // Remove existing classes
    this.renderer.removeClass(this.el.nativeElement, 'status-active');
    this.renderer.removeClass(this.el.nativeElement, 'status-inactive');

    // Add appropriate class based on status
    if (this.appStatusHighlight) {
      this.renderer.addClass(this.el.nativeElement, 'status-active');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#d4edda');
      this.renderer.setStyle(this.el.nativeElement, 'color', '#155724');
      this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid #c3e6cb');
      this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px');
      this.renderer.setStyle(this.el.nativeElement, 'padding', '2px 8px');
      this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'status-inactive');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#f8d7da');
      this.renderer.setStyle(this.el.nativeElement, 'color', '#721c24');
      this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid #f5c6cb');
      this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px');
      this.renderer.setStyle(this.el.nativeElement, 'padding', '2px 8px');
      this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    }
  }
}
