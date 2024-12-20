import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ProductDTO } from '../../models/product.dto';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.css'],
  imports: [MatIconModule, MatMenuModule],
})
export class ActionMenuComponent {
  @Input() product!: ProductDTO;
  @Output() editProduct = new EventEmitter<ProductDTO>();
  @Output() deleteProduct = new EventEmitter<string>();

  edit() {
    this.editProduct.emit(this.product);
  }

  delete() {
    this.deleteProduct.emit(this.product.id);
  }
}
