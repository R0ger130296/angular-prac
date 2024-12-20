import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionMenuComponent } from './action-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ProductDTO } from '../../models/product.dto';

describe('ActionMenuComponent', () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionMenuComponent, MatIconModule, MatMenuModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit editProduct event when edit is called', () => {
    spyOn(component.editProduct, 'emit');
    const product: ProductDTO = {
      id: '1',
      name: 'Product 1',
      description: '',
      logo: '',
      date_release: new Date(),
      date_revision: new Date(),
    };
    component.product = product;
    component.edit();
    expect(component.editProduct.emit).toHaveBeenCalledWith(product);
  });

  it('should emit deleteProduct event when delete is called', () => {
    spyOn(component.deleteProduct, 'emit');
    const product: ProductDTO = {
      id: '1',
      name: 'Product 1',
      description: '',
      logo: '',
      date_release: new Date(),
      date_revision: new Date(),
    };
    component.product = product;
    component.delete();
    expect(component.deleteProduct.emit).toHaveBeenCalledWith(product.id);
  });
});
