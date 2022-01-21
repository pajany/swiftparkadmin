import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerRoutingModule } from './customer-routing.module';

// import components 
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerModuleComponent } from './customer-module.component';
import { LotNumberComponent } from './lot-number/lot-number.component';
// import { AccountSummaryComponent } from './account-summary/account-summary.component';
import { CourtesyCardsComponent } from './courtesy-cards/courtesy-cards.component';
import { AccountsummaryComponent } from './accountsummary/accountsummary.component';
import { ViewpermitsComponent } from './viewpermits/viewpermits.component';
import { CourtesyDialogComponent } from './courtesy-cards/courtesy-dialog/courtesy-dialog.component';
// import { ViewPermitsComponent } from './view-permits/view-permits.component';

@NgModule({
    declarations: [
        CustomerModuleComponent,
        CustomerLoginComponent,
        LotNumberComponent, 
        CourtesyCardsComponent,
        AccountsummaryComponent,
        ViewpermitsComponent,
        CourtesyDialogComponent, 
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        CustomerRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        InlineSVGModule,
        CRUDTableModule,
        NgbModalModule,
        NgbDatepickerModule
    ],
    entryComponents: [
    ]
})
export class CustomerModule { }
