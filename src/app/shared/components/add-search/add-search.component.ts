import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SEARCH_OPTIONS } from '../../../@core/constants';
import { AddSearchDialogData, SearchItem } from '@models';

@Component({
  selector: 'app-add-search',
  templateUrl: './add-search.component.html',
  styleUrl: './add-search.component.scss',
})
export class AddSearchComponent {
  protected readonly SEARCH_OPTIONS = SEARCH_OPTIONS;
  infoForm: FormGroup;

  get fields() {
    return this.infoForm.get('fields') as FormArray;
  }

  constructor(
    private dialogRef: MatDialogRef<AddSearchComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: AddSearchDialogData,
  ) {
    this.infoForm = this.fb.group({ fields: this.fb.array([]) });
    if (this.data.searchItems.length) {
      this.data.searchItems.forEach((item) => {
        this.addField(item);
      });
      this.addField();
    } else {
      this.addField();
    }
  }

  private createField(searchItem?: SearchItem) {
    return this.fb.group({
      searchKey: [searchItem?.searchKey || '', Validators.compose([Validators.required])],
      searchValue: [searchItem?.searchValue || '', Validators.compose([Validators.required])],
    });
  }

  addField(searchItem?: SearchItem) {
    this.fields.push(this.createField(searchItem));
  }

  deleteField(index) {
    this.fields.removeAt(index);
  }

  submitForm() {
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }

    const result = this.infoForm.value.fields;

    this.dialogRef.close(result);
  }
}
