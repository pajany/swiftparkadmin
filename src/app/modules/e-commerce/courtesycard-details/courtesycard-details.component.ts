// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../_services';
import { CourtesyCardService } from '../_services';

import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-courtesycard-details',
  templateUrl: './courtesycard-details.component.html',
  styleUrls: ['./courtesycard-details.component.scss']
})

export class CourtesycardDetailsComponent implements OnInit {
  
  API_URL = `${environment.apiUrl}/`;
  courtesycardno: any = [];
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  ExistLOTNOError: any; 

  constructor(
    private fb: FormBuilder,
     public courtesycardservice: CourtesyCardService,
     private http: HttpClient,
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.courtesycardservice.fetch();
    const sb = this.courtesycardservice.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb); 
    this.courtesycardservice.fetch();

 
   
  }


  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      lot_no: [''],
      condition: [''],
      searchTerm: [''],
    });
    
  
  }

  filter() {
    const filter = {};
    const lot_no = this.filterGroup.get('lot_no').value;
    if (lot_no) {
      filter['lot_no'] = lot_no;
    }

    const condition = this.filterGroup.get('condition').value;
    if (condition) {
      filter['condition'] = condition;
    }
    this.courtesycardservice.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
      
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
      
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {

    this.courtesycardservice.patchState({ searchTerm });
  }

  getcardDetails(event){

    const cardno = event.target.value;
   
    var $HTMLData='';
    if (cardno != "") {
      this.http.get(this.API_URL+'courtesycardtrans?cardno=' + cardno).subscribe((data: any) => {

        $("#CourtesyTable").empty();
        $HTMLData ='<html>';
        $HTMLData+='<body>';
        console.log("current data", data);
        if(data.success =='No Result found'){
          $HTMLData +='<tr>';
          $HTMLData +='<td > <span class="nodata" style="text-align: center;color: #5dab14;"><h5> No Record Found! </h5> </span> </td>';
          $HTMLData +='</tr>';
        }
        if (data.success  !='No Result found') {

        // $HTMLData+='<div class="form-group row">';
        // $HTMLData+='  <label class="col-lg-2 "> Lot NO: </label>';
        // $HTMLData+=' <div class="col-lg-6">';
        // $HTMLData+=''+data.lot_no +'';
        // $HTMLData+='</div>';
        // $HTMLData+=' </div>';

        // $HTMLData+='<div class="form-group row">';
        // $HTMLData+='  <label class="col-lg-2  ">  Lot Name:  </label>';
        // $HTMLData+=' <div class="col-lg-6">';
        // $HTMLData+=''+data.client_name +'';
        // $HTMLData+='</div>';
        // $HTMLData+=' </div>';

        // $HTMLData+='<div class="form-group row">';
        // $HTMLData+='  <label class="col-lg-2 "> Lot Address:  </label>';
        // $HTMLData+=' <div class="col-lg-7">';
        // $HTMLData+=''+data.address +'';
        // $HTMLData+='</div>';
        // $HTMLData+=' </div>';
       

        $HTMLData +='<table class="table" style="width:90%;">';
        $HTMLData +='<thead class="thead-light">';
        $HTMLData +='<tr>';
        $HTMLData +='<th scope="col">Lot No</th>';
        $HTMLData +='<th scope="col">Permit Type</th>';
        $HTMLData +='<th scope="col">Permit No</th>';
        $HTMLData +='<th scope="col">Tax Amount</th>';
        $HTMLData +='<th scope="col">Total Amount</th>';
        $HTMLData +='<th scope="col">Expires Date</th>';
        $HTMLData +='<th scope="col">Transaction Date </th>';
        $HTMLData +='</tr>';
        $HTMLData +='</thead>';
        $HTMLData +='<tbody>';

        if (data) {

          for(var i=0;i<data.length;i++){
            
                $HTMLData +='<tr>';
                $HTMLData +='<td>'+data[i].lot_no+'</td>';
                $HTMLData +='<td>'+data[i].permit_type+'</td>';
                $HTMLData +='<td>'+data[i].permit_no+'</td>';
                $HTMLData +='<td> $'+data[i].taxamount+'</td>'; 
                $HTMLData +='<td> $'+data[i].totalamount +'</td>';
                $HTMLData +='<td>'+data[i].expires_date+'</td>';
                $HTMLData +='<td>'+data[i].created_at+'</td>';
                $HTMLData +='</tr>';
          }
           
      }
   
 
        $HTMLData +='</tbody>';
        $HTMLData +='</table>';
        $HTMLData +='</br>';
        }
        $HTMLData+='</body>';
        $HTMLData+='</html>';

      if(data){
        $("#CourtesyTable").append($HTMLData);
        $(".lotdata").show();
      }else{
        $(".lotdata").hide();
      }
       
      });
    }
  }


  }

 