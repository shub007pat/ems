import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() cardClass?: string;
  @Input() showHeader: boolean = true;
  @Input() showFooter: boolean = false;
}
