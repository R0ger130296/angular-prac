import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormBuilder,
  AsyncValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/services';
import { ProductDTO } from '../../models/product.dto';
import { lastValueFrom, Observable, of } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  standalone: true,
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  product: ProductDTO | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.addProductForm = this.fb.group(
      {
        id: new FormControl(
          { value: '', disabled: true },
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ],
          [this.productIdValidator()]
        ),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ]),
        logo: new FormControl('', [Validators.required]),
        date_release: new FormControl('', [
          Validators.required,
          Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
        ]),
        date_revision: new FormControl({ value: '', disabled: true }, [
          Validators.required,
          Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
        ]),
      },
      { validators: this.dateValidation }
    );

    this.addProductForm.get('date_release')?.valueChanges.subscribe((date) => {
      this.updateRevisionDate(date);
    });
  }

  ngOnInit() {
    const navigationState = history.state;
    if (navigationState && navigationState['product']) {
      this.product = navigationState['product'];
      this.fillForm();
      this.addProductForm.get('id')?.clearAsyncValidators();
      this.addProductForm.get('id')?.disable();
    } else {
      this.addProductForm.get('id')?.enable();
    }
  }

  /**
   * Fill the form with product data if editing an existing product
   */
  private fillForm() {
    if (this.product) {
      this.addProductForm.patchValue({
        id: this.product.id,
        name: this.product.name,
        description: this.product.description,
        logo: this.product.logo,
        date_release: this.product.date_release,
        date_revision: this.product.date_revision,
      });
    }
  }

  /**
   * Custom validation for dates to ensure revision date is one year after release date
   */
  private dateValidation(control: AbstractControl): ValidationErrors | null {
    const releaseDate = control.get('date_release')?.value;
    const revisionDate = control.get('date_revision')?.value;

    if (!releaseDate || !revisionDate) {
      return null;
    }

    const release = new Date(releaseDate);
    const revision = new Date(revisionDate);

    release.setFullYear(release.getFullYear() + 1);

    if (
      release.getFullYear() !== revision.getFullYear() ||
      release.getMonth() !== revision.getMonth() ||
      release.getDate() !== revision.getDate()
    ) {
      return {
        invalidRevisionDate:
          'La fecha de revisión debe ser exactamente un año posterior a la de liberación.',
      };
    }

    return null;
  }

  /**
   * Update revision date automatically based on the release date
   */
  private updateRevisionDate(releaseDate: string) {
    if (releaseDate) {
      const release = new Date(releaseDate);
      release.setFullYear(release.getFullYear() + 1);
      const revisionDate = release.toISOString().split('T')[0];

      if (!isNaN(release.getTime())) {
        this.addProductForm.get('date_revision')?.setValue(revisionDate);
      } else {
        console.error('Fecha de lanzamiento no válida');
      }
    }
  }

  /**
   * Submit the form and add or edit the product
   */

  async onSubmit() {
    if (this.addProductForm.valid) {
      const productData: ProductDTO = { ...this.addProductForm.getRawValue() };

      try {
        if (this.product) {
          const response = await lastValueFrom(
            this.productService.updateProduct(this.product.id, productData)
          );
          console.log('Producto actualizado exitosamente', response);
        } else {
          const response = await lastValueFrom(
            this.productService.addProduct(productData)
          );
          console.log('Producto agregado exitosamente', response);
        }
        this.router.navigate(['']);
      } catch (error) {
        console.error('Error al guardar producto:', error);
      }
    } else {
      this.markAllAsTouched();
    }
  }

  /**
   * Mark all form controls as touched to trigger validation messages
   */
  private markAllAsTouched() {
    Object.keys(this.addProductForm.controls).forEach((field) => {
      const control = this.addProductForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  /**
   * Get error state for revision date
   */
  get dateRevisionInvalid() {
    return (
      this.addProductForm.hasError('invalidRevisionDate') &&
      this.addProductForm.get('date_revision')?.touched
    );
  }

  /**
   * Reset the form
   */
  resetForm() {
    if (!this.product) {
      this.addProductForm.reset();
    }
  }

  /**
   * Asynchronous validator to check if the product ID is unique
   */
  private productIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.productService.verifyProductId(control.value).pipe(
        debounceTime(500),
        switchMap((isExist) => (isExist ? of({ idExists: true }) : of(null))),
        catchError(() => of(null))
      );
    };
  }
}
