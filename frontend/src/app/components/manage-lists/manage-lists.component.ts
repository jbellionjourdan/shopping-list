import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  CdkVirtualForOf,
  CdkVirtualScrollableElement,
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY
} from '@angular/cdk/scrolling';
import {Button} from 'primeng/button';
import {RouterLink} from '@angular/router';
import {RippleModule} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';
import {ManageListComponent} from '../manage-list/manage-list.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from "primeng/api";
import {ListsStore} from "../../stores/lists.store";
import {SkeletonModule} from "primeng/skeleton";
import {ProgressBarModule} from "primeng/progressbar";
import {ProgressBarComponent} from "../shared/progress-bar/progress-bar.component";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {InputGroup} from "primeng/inputgroup";
import {InputGroupAddon} from "primeng/inputgroupaddon";

export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(150, 150, 300);
  }
}

@Component({
  selector: 'spl-manage-lists',
  templateUrl: './manage-lists.component.html',
  styleUrls: ['./manage-lists.component.scss'],
  providers: [{provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy}, ConfirmationService],
  imports: [
    CdkVirtualScrollableElement,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RippleModule,
    InputTextModule,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    ManageListComponent,
    ConfirmDialogModule,
    SkeletonModule,
    ProgressBarModule,
    ProgressBarComponent,
    Button,
    InputGroup,
    InputGroupAddon,
  ]
})
export class ManageListsComponent implements OnInit {

  protected createForm = new FormGroup({
    name: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    })
  });

  protected listsLoading = true;
  protected createLoading = false;

  protected readonly listStore = inject(ListsStore);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.listStore.loadLists().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      complete: () => this.listsLoading = false
    });
  }

  addList() {
    if (!this.createForm.valid) {
      return;
    }

    this.createLoading = true;

    this.listStore.createList(this.createForm.getRawValue()).subscribe({
      complete: () => {
        this.createLoading = false;
        this.createForm.reset();
      }
    });
  }
}
