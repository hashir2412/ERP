import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsumerFormModel, FormModel } from './consumer-form.viewModel';
import { fields, InputField } from './input-field';

@Component({
  selector: 'app-consumer-form',
  templateUrl: './consumer-form.component.html',
  styleUrls: ['./consumer-form.component.scss']
})
export class ConsumerFormComponent implements OnInit {
  inputFields: InputField[] = fields;
  constructor(
    public dialogRef: MatDialogRef<ConsumerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormModel) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close(this.data.formData);
    }
  }

  ngOnInit(): void {
  }

}
