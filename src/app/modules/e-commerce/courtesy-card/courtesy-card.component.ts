// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CourtesyCardService } from '../_services';
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';

import { DeleteCourtesycardModalComponent } from './components/delete-courtesycard-modal/delete-courtesycard-modal.component';
import { EditCourtesycardModalComponent } from './components/edit-courtesycard-modal/edit-courtesycard-modal.component';
import { DeleteCourtesycardsModalComponent } from './components/delete-courtesycards-modal/delete-courtesycards-modal.component';
import { UpdateCourtesycardModalComponent } from './components/update-courtesycard-modal/update-courtesycard-modal.component';
import { FetchCourtesycardModalComponent } from './components/fetch-courtesycard-modal/fetch-courtesycard-modal.component';

@Component({
  selector: 'app-courtesy-card',
  templateUrl: './courtesy-card.component.html',
  styleUrls: ['./courtesy-card.component.scss']
})

export class CourtesyCardComponent

  implements
  OnInit,
  OnDestroy,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView {
    
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  totalrec: any;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public courtesycardService: CourtesyCardService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.courtesycardService.fetch();
    this.totalrec= this.courtesycardService.fetch();
    this.grouping = this.courtesycardService.grouping;
    this.paginator = this.courtesycardService.paginator;
    this.sorting = this.courtesycardService.sorting;
    const sb = this.courtesycardService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      type: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const type = this.filterGroup.get('type').value;
    if (type) {
      filter['type'] = type;
    }
    this.courtesycardService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.courtesycardService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.courtesycardService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.courtesycardService.patchState({ paginator });
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditCourtesycardModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.courtesycardService.fetch(),
      () => { }
    );
  }

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteCourtesycardModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => this.courtesycardService.fetch(), () => { });
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteCourtesycardsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.courtesycardService.fetch(), () => { });
  }

  updateStatusForSelected() {
    const modalRef = this.modalService.open(UpdateCourtesycardModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.courtesycardService.fetch(), () => { });
  }

  fetchSelected() {
    const modalRef = this.modalService.open(FetchCourtesycardModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(() => this.courtesycardService.fetch(), () => { });
  }
}
