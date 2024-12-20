import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductDTO } from '../models/product.dto';
import { environment } from '../../environments/environment';
import { ProductService } from './product.services';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/bp/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle error when fetching products', () => {
    service.getProducts().subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error: Error) => {
        expect(error.message).toBe(
          'Error al obtener productos: Http failure response for http://localhost:3002/bp/products: 500 Server Error'
        );
      },
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush('Error fetching products', {
      status: 500,
      statusText: 'Server Error',
    });
  });

  it('should handle error when adding a product', () => {
    const newProduct: ProductDTO = new ProductDTO(
      '2',
      'Product 2',
      'Another great product',
      'logo_url',
      new Date('2024-01-01'),
      new Date('2025-01-01')
    );

    service.addProduct(newProduct).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error: Error) => {
        expect(error.message).toBe(
          'Error al agregar producto: Http failure response for http://localhost:3002/bp/products: 500 Server Error'
        );
      },
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush('Error adding product', {
      status: 500,
      statusText: 'Server Error',
    });
  });

  it('should handle error when updating a product', () => {
    const updatedProduct: ProductDTO = new ProductDTO(
      '1',
      'Updated Product',
      'Updated description',
      'updated_logo_url',
      new Date('2024-01-01'),
      new Date('2025-01-01')
    );

    service.updateProduct('1', updatedProduct).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error: Error) => {
        expect(error.message).toBe(
          'Error al actualizar producto: Http failure response for http://localhost:3002/bp/products/1: 500 Server Error'
        );
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error updating product', {
      status: 500,
      statusText: 'Server Error',
    });
  });

  it('should handle error when deleting a product', () => {
    service.deleteProduct('1').subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error: Error) => {
        expect(error.message).toBe(
          'Error al eliminar producto: Http failure response for http://localhost:3002/bp/products/1: 500 Server Error'
        );
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Error deleting product', {
      status: 500,
      statusText: 'Server Error',
    });
  });

  it('should handle error when verifying product ID', () => {
    service.verifyProductId('1').subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error: Error) => {
        expect(error.message).toBe(
          'Error al verificar el ID del producto: Http failure response for http://localhost:3002/bp/products/verification/1: 500 Server Error'
        );
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush('Error verifying product ID', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
