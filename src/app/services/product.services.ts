import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductDTO } from '../models/product.dto';
import { environment } from '../../environments/environment';
import { ProductListResponse } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = `${environment.apiUrl}/bp/products`;

  constructor(private httpClient: HttpClient) {}

  // Crear cabeceras para las solicitudes
  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Obtener la lista de productos
  getProducts(): Observable<ProductListResponse> {
    const headers = this.createHeaders();
    return this.httpClient.get<ProductListResponse>(this.url, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener productos:', error);
        return throwError(
          () => new Error(`Error al obtener productos: ${error.message}`)
        );
      })
    );
  }

  // Agregar un nuevo producto
  addProduct(product: ProductDTO): Observable<ProductDTO> {
    const headers = this.createHeaders();
    return this.httpClient
      .post<ProductDTO>(this.url, product, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al agregar producto:', error);
          return throwError(
            () => new Error(`Error al agregar producto: ${error.message}`)
          );
        })
      );
  }

  // Actualizar (editar) un producto existente
  updateProduct(id: string, product: ProductDTO): Observable<ProductDTO> {
    const headers = this.createHeaders();
    return this.httpClient
      .put<ProductDTO>(`${this.url}/${id}`, product, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar producto:', error);
          return throwError(
            () => new Error(`Error al actualizar producto: ${error.message}`)
          );
        })
      );
  }

  // Eliminar un producto
  deleteProduct(id: string): Observable<any> {
    const headers = this.createHeaders();
    return this.httpClient.delete(`${this.url}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        return throwError(
          () => new Error(`Error al eliminar producto: ${error.message}`)
        );
      })
    );
  }

  // Verificar si el ID de producto es válido
  verifyProductId(id: string): Observable<boolean> {
    const headers = this.createHeaders();
    return this.httpClient
      .get<boolean>(`${this.url}/verification/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al verificar el ID del producto:', error);
          return throwError(
            () =>
              new Error(
                `Error al verificar el ID del producto: ${error.message}`
              )
          );
        })
      );
  }
}
