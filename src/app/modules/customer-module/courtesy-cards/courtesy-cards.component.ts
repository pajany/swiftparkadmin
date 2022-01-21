import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { async } from '@rxweb/reactive-form-validators';
import { Subscription } from 'rxjs';
import { GroupingState, ITableState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { EditCourtesycardModalComponent } from '../../e-commerce/courtesy-card/components/edit-courtesycard-modal/edit-courtesycard-modal.component';
import { CourtesyCardService } from '../../e-commerce/_services/courtesycard.service';
import { CustomerCourtesyCardService } from '../../e-commerce/_services/customercourtesycard.services';
import { CourtesyDialogComponent } from './courtesy-dialog/courtesy-dialog.component';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

@Component({ 
  selector: 'app-courtesy-cards',
  templateUrl: './courtesy-cards.component.html',
  styleUrls: ['./courtesy-cards.component.scss']
})
export class CourtesyCardsComponent implements OnInit {

  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  totalrec: any;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  
  constructor(
    private modalService: NgbModal,
    public customercourtesycardService: CustomerCourtesyCardService) { }

  ngOnInit(): void {
    this.customercourtesycardService.fetch();
    this.totalrec = this.customercourtesycardService.fetch();
    this.grouping = this.customercourtesycardService.grouping;
    this.paginator = this.customercourtesycardService.paginator;
    this.sorting = this.customercourtesycardService.sorting;
    const sb = this.customercourtesycardService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    console.log('courtesycardService', this.customercourtesycardService);

    
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
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
    this.customercourtesycardService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.customercourtesycardService.patchState({ paginator });
  }
  
  edit(id: number) {
    const modalRef = this.modalService.open(CourtesyDialogComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.customercourtesycardService.fetch(),
      () => { }
    );
  }

}
