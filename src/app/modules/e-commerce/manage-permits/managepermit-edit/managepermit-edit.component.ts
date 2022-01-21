import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ProductsService } from '../../_services';
import { permitService } from '../manage-permits.services';

@Component({
  selector: 'app-managepermit-edit',
  templateUrl: './managepermit-edit.component.html',
  styleUrls: ['./managepermit-edit.component.scss']
})
export class ManagepermitEditComponent implements OnInit {

   
  inputnumber = 0;
  visibleDiv: boolean = false;
  lotNumber: number = 0;
  tableData: any[] = [];
  amount: number = 0;
  taxAmount: number = 0;
  totalAmount: number | undefined = 0;
  
  lot_no: any = [];
  permit_type: any = [];
  qty: any = [];

  courtesy_no: number | undefined = 0;
  courtesy_pin: number | undefined = 0;

  model: any = {};
  message: string = '';
  show: boolean = false;
  transactionhistory: any = [];

  address: string = '';
  transactionemail: string = '';
  email: string = '';
  phone: number = 0;
  // date: number = Date.now();
  expiryDate: any = null;
  quantity: any = null;
  iscourtesycard: boolean = false;
  submitted: boolean;
  formProcess: boolean;
  token: string;
  isStripeCard: boolean = true;
  errorMessage: any = '';
  isLoading: boolean;
  viewtransForm: FormGroup;
  value: number | undefined = 0;

  constructor(
    public permitservice: permitService,
    public productsService: ProductsService,
     public router: ActivatedRoute,
    public route: Router,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((data: any) => {
      this.lotNumber = parseInt(data.lotNumber);
     
    });
   this.quantity=1;
    this.productsService.fetch();
    const sb = this.productsService.isLoading$.subscribe(res => this.isLoading = res);

     this.router.params.subscribe((data: any) => {
      this.lotNumber = parseInt(data.lotNumber);
    });

    this.viewtransForm = this.formBuilder.group({
      transactionemail: ['', Validators.required],
     
    });
  }

  onOptionsSelected(value:any) {
 
    
 
    this.permitservice.lotNumberValidation(value).subscribe(
      (params: any) => {  
       // console.log("res+++++++++++",params.services); 
        this.tableData = params.services;
        this.address=params.address;
        this.tableData.forEach(x => {
          x.selected = false;
          x.quantity = 1;
          if (x.duration === 30) {
            x.quantity = 1;
          } else {
            x.quantity = '';
          }
        });
        this.taxAmount = params.tax;
        
        // this.route.navigate(['/home']);
      },
      error => {          
        console.error(error);
      }
    );

    
  }

 
  onCheckboxChange(e) {
     console.log("amount------", e);
     var id = e.target.value;
 
     console.log("option------", id);
  }

  
  amountCalculation(data: any) {

 
      this.amount =234 * this.model.quantity;
      if (this.amount > 0) {
        this.totalAmount = this.amount + Number(this.taxAmount);
        this.expiryDate = new Date();
        console.log("amountCalculation------", data);
        if (data.expires) {
          if (data.name.includes('Night')) {
            this.expiryDate.setDate(this.expiryDate.getDate() + Number(data.duration) * Number(this.model.quantity));
          } else {
            let numbeOfDate = Number(data.duration) * Number(this.model.quantity);
            this.expiryDate.setDate(this.expiryDate.getDate() + numbeOfDate - 1);
          }
          let hours: number = Number(data.expires);
          this.expiryDate.setHours(hours);
          this.expiryDate.setMinutes(0);
          this.expiryDate.setSeconds(0);
        } else {
          if (data.type.includes('Days')) {
            this.expiryDate.setDate(this.expiryDate.getDate() + Number(data.duration) * Number(this.model.quantity));
          } else {
            let hours = Number(data.duration) * Number(this.model.quantity);
            this.expiryDate.setHours(this.expiryDate.getHours() + hours);
          }
        }
      } else {
        this.totalAmount = 0;
      }
    
  }

  transactionSubmit(){
   
    
  }

  onSubmit() {
   
    let params: any = {};
    (params.lot_number = this.lotNumber),
    (params.subtotal = this.amount),
    (params.taxamount = this.taxAmount),
    (params.email = this.model.email),
    (params.phone = this.model.phone),
    (params.quantity = this.model.quantity),
    (params.totalamount = this.totalAmount),
    (params.expires_date = this.expiryDate),
    (params.license = this.model.license),
    (params.courtesy_number = this.model.courtesyCard),
    (params.courtesy_no = this.model.courtesy_no),
    (params.courtesy_pin = this.model.courtesy_pin),
    (params.createdby = 'Admin'),
    (params.iscourtesycard = this.iscourtesycard);

    this.permitservice.submitForm(params).subscribe(
      (data: any) => {
      //  this.spinner.hide();
        if (!data.status) {
          setTimeout(() => {
            //this.spinner.hide();
          }, 200);
          //this.spinner.hide();
          this.route.navigate(['/success'], { queryParams: { permit: data.permit_no } });
        } else {
          
        }
      },
      (error: any) => {
        console.error(error);
        this.message = error.error.message;
       
      }
    );

  }

  handleKeydown(e: any) {
    const typedValue = e.keyCode;
    if (typedValue < 48 && typedValue > 57) {
      // If the value is not a number, we skip the min/max comparison
      return;
    }

    const typedNumber = parseInt(e.key);
    const min = parseInt(e.target.min);
    const max = parseInt(e.target.max);
    const currentVal = parseInt(e.target.value) || '';
    const newVal = parseInt(typedNumber.toString() + currentVal.toString());

    if (newVal < min || newVal > max) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

}
