import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, of } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { CourtesyCard } from 'src/app/modules/e-commerce/_models/Courtesycard.model';
import { CourtesyCardService } from 'src/app/modules/e-commerce/_services';
import { CustomerCourtesyCardService } from 'src/app/modules/e-commerce/_services';
 

const EMPTY_COURTESTCARD: CourtesyCard = {
  id: undefined,
  card_no:'',
  card_pin:'',
  calls:'',
  defaultcalls:5,
  amount:'',
  card_type:'Unlimited',
  card_vaild:'',
  status:'1',
};

@Component({
  selector: 'app-courtesy-dialog',
  templateUrl: './courtesy-dialog.component.html',
  styleUrls: ['./courtesy-dialog.component.scss']
})
export class CourtesyDialogComponent implements OnInit {
  @Input() id: number;

  isLoading$;
  courtesycard: CourtesyCard;
  formGroup: FormGroup;
  validcard: boolean = false ; 
  twentyfourhour_permit_checked: boolean =false;

  private subscriptions: Subscription[] = [];
  constructor(
    private customercourtesycardservice: CustomerCourtesyCardService,
    private fb: FormBuilder, public modal: NgbActiveModal
    ) { }

  ngOnInit(): void {
    this.isLoading$ = this.customercourtesycardservice.isLoading$;
    this.loadCourtesycard();
  }

  loadCourtesycard() {
    if (!this.id) {
      this.courtesycard = EMPTY_COURTESTCARD;
      this.loadForm();
    } else {
      const sb = this.customercourtesycardservice.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(EMPTY_COURTESTCARD);
        })
      ).subscribe((courtesycard: CourtesyCard) => {
        this.courtesycard = courtesycard;
        console.log("edit data",courtesycard.card_vaild);

        if(this.courtesycard.card_vaild == '1'){
          this.twentyfourhour_permit_checked= true;
        }

        this.loadForm();
      });

    
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      card_no: [this.courtesycard.card_no, Validators.compose([Validators.required])],
      calls: [this.courtesycard.calls, Validators.compose([Validators.required])],
      card_type: [this.courtesycard.card_type, Validators.compose([Validators.required])],
      card_vaild: [this.courtesycard.card_vaild],
      status: [this.courtesycard.status]

    });
  }

  save() {
    this.prepareCourtesycard();
    if (this.courtesycard.id) {
      this.edit();

      setTimeout(function() { $("#msgupdate").show().fadeOut(3000); }, 1500);

    } else {
      this.create();
      
      setTimeout(function() { $("#msgadd").show().fadeOut(2500); }, 1500);
    }
  }

  edit() {
    const sbUpdate = this.customercourtesycardservice.update(this.courtesycard).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.courtesycard);
      }),
    ).subscribe(res => this.courtesycard = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.customercourtesycardservice.create(this.courtesycard).pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.courtesycard);
      }),
    ).subscribe((res: CourtesyCard) => this.courtesycard = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareCourtesycard() {
    const formData = this.formGroup.value;  
    this.courtesycard.card_no = formData.card_no;
    this.courtesycard.calls = formData.calls;
    this.courtesycard.card_type = formData.card_type;
    this.courtesycard.card_vaild = formData.card_vaild;
    this.courtesycard.status = formData.status;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

  card_vaild($event){
    this.validcard  =  $event && $event.target && $event.target.checked;
  }

}
