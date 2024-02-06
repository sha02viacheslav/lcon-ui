import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import { MediaService } from '../media/media.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(
    private dialog: MatDialog,
    private mediaService: MediaService,
  ) {}

  open(component: ComponentType<unknown>, options?: MatDialogConfig<unknown>) {
    this.closeAll();
    const defaultOptions = this.mediaService.isMobile()
      ? {
          maxWidth: '90vw',
          maxHeight: '80vh',
        }
      : {
          width: '400px',
        };
    const dialogRef = this.dialog.open(component, Object.assign(defaultOptions, options || {}));
    return dialogRef;
  }

  closeAll() {
    this.dialog.closeAll();
  }
}
