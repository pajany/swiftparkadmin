import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountsummaryComponent } from './accountsummary/accountsummary.component';
import { CourtesyCardsComponent } from './courtesy-cards/courtesy-cards.component';
import { CustomerModuleComponent } from './customer-module.component';
import { LotNumberComponent } from './lot-number/lot-number.component';
import { ViewpermitsComponent } from './viewpermits/viewpermits.component';

const routes: Routes = [
    {
        path: '', component: CustomerModuleComponent,
        children: [
            // { path: 'lotnumber', component: LotNumberComponent },
            { path: 'accountsummary', component: AccountsummaryComponent },
            { path: 'courtesycards', component: CourtesyCardsComponent },
            { path: 'viewpermits', component: ViewpermitsComponent },

            { path: '', redirectTo: 'customer', pathMatch: 'full' },
            { path: '**', redirectTo: 'customer', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerRoutingModule { }
