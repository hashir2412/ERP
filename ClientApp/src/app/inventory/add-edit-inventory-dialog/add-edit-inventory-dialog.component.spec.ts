import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInventoryDialogComponent } from './add-edit-inventory-dialog.component';

describe('AddEditInventoryDialogComponent', () => {
  let component: AddEditInventoryDialogComponent;
  let fixture: ComponentFixture<AddEditInventoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditInventoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditInventoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
