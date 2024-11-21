import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, ViewChild} from '@angular/core';
import {ListModel} from '../../models/list.model';
import {ConfirmationService, PrimeTemplate} from 'primeng/api';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Inplace, InplaceModule} from 'primeng/inplace';
import {CardModule} from 'primeng/card';
import {RippleModule} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {ListPreviewComponent} from '../list-preview/list-preview.component';
import {RouterLink} from '@angular/router';
import {ListsStore} from "../../stores/lists.store";
import {ProgressBarComponent} from "../shared/progress-bar/progress-bar.component";

@Component({
  selector: 'spl-manage-list',
  templateUrl: './manage-list.component.html',
  styleUrls: ['./manage-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, PrimeTemplate, InplaceModule, RippleModule, FormsModule, ReactiveFormsModule, InputTextModule,
    ButtonDirective, ListPreviewComponent, RouterLink, ProgressBarComponent],
})
export class ManageListComponent {

  @Input({required: true}) set list(val: ListModel) {
    this._list = val;
    this.loading = false;
    this.formGroupEditName.reset({name: val.name});
    if (this.inplace) {
      this.inplace.active = false;
    }
  }

  @ViewChild('inplace') inplace?: Inplace;

  protected _list?: ListModel;
  protected loading = false;

  protected formGroupEditName = new FormGroup({
    name: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    })
  });

  protected readonly listsStore = inject(ListsStore);
  private readonly confirmationService = inject(ConfirmationService)
  private readonly cdRef = inject(ChangeDetectorRef);

  delete() {
    if (!this._list) {
      return;
    }

    const listId = this._list.id;

    this.confirmationService.confirm({
      message: `Supprimer la liste ${this._list?.name} ?`,
      accept: () => this.doDelete(listId)
    });
  }

  private doDelete(id: number) {
    this.loading = true;
    this.listsStore.deleteList(id).subscribe({
      complete: () => this.loading = false
    });
    this.cdRef.detectChanges();
  }

  editName() {
    if (!this.formGroupEditName?.valid) {
      return;
    }

    const newName = this.formGroupEditName.getRawValue().name;

    if (this.inplace) {
      this.inplace.active = false;
    }

    if (this._list && this._list.name !== newName) {
      this.loading = true;

      this.listsStore.updateList({
          ...this._list,
          name: newName
        }
      ).subscribe({
        complete: () => this.loading = false
      });
    }
  }
}
