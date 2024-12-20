import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.services';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ProductDTO } from '../../models/product.dto';
import { CommonModule } from '@angular/common';
import { throwError, of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockProducts: ProductDTO[] = [
    {
      id: '1',
      name: 'Product A',
      description: 'Description A',
      logo: '',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2025-01-01'),
    },
    {
      id: '2',
      name: 'Product B',
      description: 'Description B',
      logo: '',
      date_release: new Date('2024-01-01'),
      date_revision: new Date('2025-01-01'),
    },
  ];

  beforeEach(() => {
    mockProductService = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'deleteProduct',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatMenuModule,
        CommonModule,
        ProductListComponent, // Ensure this is in the imports array, not declarations
      ],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should handle product loading error', () => {
    mockProductService.getProducts.and.returnValue(
      throwError('Error loading products')
    );
    component.ngOnInit();
    expect(component.errorMessage).toBe(
      'No se pudieron cargar los productos. Inténtalo más tarde.'
    );
  });

  it('should load products successfully on init', () => {
    mockProductService.getProducts.and.returnValue(of({ data: mockProducts }));
    component.ngOnInit();
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should filter products by search term', () => {
    mockProductService.getProducts.and.returnValue(of({ data: mockProducts }));
    component.ngOnInit();

    component.searchTerm = 'Product A';
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Product A');
  });

  it('should navigate to the product detail page', () => {
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    component.goToProductDetail(mockProducts[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-product'], {
      state: { product: mockProducts[0] },
    });
  });

  it('should show modal when confirming product deletion', () => {
    component.confirmDeleteProduct(mockProducts[0]);
    expect(component.isModalVisible).toBeTrue();
    expect(component.productToDelete).toBe(mockProducts[0]);
  });

  it('should close modal when calling closeModal', () => {
    component.confirmDeleteProduct(mockProducts[0]);
    component.closeModal();
    expect(component.isModalVisible).toBeFalse();
    expect(component.productToDelete).toBeNull();
  });

  it('should delete a product successfully', () => {
    mockProductService.getProducts.and.returnValue(of({ data: mockProducts }));
    mockProductService.deleteProduct.and.returnValue(of({}));
    component.ngOnInit();

    component.confirmDeleteProduct(mockProducts[0]);
    component.confirmDelete();

    expect(component.products.length).toBe(1);
    expect(component.products[0].id).toBe('2');
    expect(component.errorMessage).toBeNull();
  });

  it('should handle error during product deletion', () => {
    mockProductService.getProducts.and.returnValue(of({ data: mockProducts }));
    mockProductService.deleteProduct.and.returnValue(
      throwError('Error deleting product')
    );
    component.ngOnInit();

    component.confirmDeleteProduct(mockProducts[0]);
    component.confirmDelete();

    expect(component.errorMessage).toBe(
      'No se pudo eliminar el producto. Inténtalo más tarde.'
    );
  });
});
