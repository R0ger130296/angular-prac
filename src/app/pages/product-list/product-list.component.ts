import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDTO } from '../../models/product.dto';
import { ProductService } from '../../services/product.services';
import { ProductListResponse } from '../../interfaces/product.interface';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActionMenuComponent } from '../../components/action-menu/action-menu.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    ActionMenuComponent,
  ],
})
export class ProductListComponent implements OnInit {
  products: ProductDTO[] = [];
  filteredProducts: ProductDTO[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm: string = '';
  isModalVisible = false;
  productToDelete: ProductDTO | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  /**
   * Load products from the service
   */
  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (response: ProductListResponse) => {
        this.products = response.data;
        this.filteredProducts = [...this.products];
        this.orderProducts();

        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      error: () => {
        this.errorMessage =
          'No se pudieron cargar los productos. Inténtalo más tarde.';

        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
    });
  }

  /**
   * Order products alphabetically by name
   */
  private orderProducts() {
    this.products.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Filter products based on the search term
   */
  filterProducts() {
    this.isLoading = true;
    if (this.searchTerm) {
      this.filteredProducts = this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = [...this.products];
    }

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  /**
   * Navigate to the product detail page
   * @param product Optional product to pass to the detail page
   */
  goToProductDetail(product?: ProductDTO) {
    if (product) {
      this.router.navigate(['/add-product'], { state: { product } });
    } else {
      this.router.navigate(['/add-product']);
    }
  }

  /**
   * Show modal and set the product to delete
   * @param product Product to delete
   */
  confirmDeleteProduct(product: ProductDTO) {
    this.productToDelete = product;
    this.isModalVisible = true;
  }

  /**
   * Close the delete confirmation modal
   */
  closeModal() {
    this.isModalVisible = false;
    this.productToDelete = null;
  }

  /**
   * Confirm and delete the product
   */
  confirmDelete() {
    if (this.productToDelete) {
      this.isLoading = true;
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.products = this.products.filter(
            (product) => product.id !== this.productToDelete?.id
          );
          this.filterProducts();
          console.log('Producto eliminado exitosamente');
          this.closeModal();
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        },
        error: () => {
          this.errorMessage =
            'No se pudo eliminar el producto. Inténtalo más tarde.';
          this.closeModal();
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        },
      });
    }
  }
}
