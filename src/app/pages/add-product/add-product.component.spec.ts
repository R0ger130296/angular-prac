import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.services';
import { of, throwError } from 'rxjs';

// Mock del servicio ProductService
class MockProductService {
  addProduct = jasmine.createSpy('addProduct').and.returnValue(of({}));
  updateProduct = jasmine.createSpy('updateProduct').and.returnValue(of({}));
  verifyProductId = jasmine
    .createSpy('verifyProductId')
    .and.returnValue(of(false));
}

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let mockProductService: MockProductService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockProductService = new MockProductService();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddProductComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate date_revision is one year after date_release', () => {
    const releaseDate = component.addProductForm.get('date_release');
    const revisionDate = component.addProductForm.get('date_revision');

    releaseDate?.setValue('2023-01-01');
    fixture.detectChanges();

    const expectedRevisionDate = '2024-01-01';
    expect(revisionDate?.value).toBe(expectedRevisionDate);
  });

  it('should call addProduct when submitting form with valid data', async () => {
    component.addProductForm.setValue({
      id: '12345',
      name: 'Product Name',
      description: 'Product description',
      logo: 'logo.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
    });
    await component.onSubmit();
    expect(mockProductService.addProduct).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should mark all fields as touched when submitting invalid form', () => {
    component.onSubmit();
    expect(component.addProductForm.get('name')?.touched).toBeTrue();
    expect(component.addProductForm.get('description')?.touched).toBeTrue();
    expect(component.addProductForm.get('logo')?.touched).toBeTrue();
    expect(component.addProductForm.get('date_release')?.touched).toBeTrue();
    expect(component.addProductForm.get('date_revision')?.touched).toBeTrue();
  });
});
