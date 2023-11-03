import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate, state } from '@angular/animations';
export interface Bank {
  id: string;
  name: string;
}

export interface BankGroup {
  name: string;
  banks: Bank[];
}


/** list of banks */
export const BANKS: Bank[] = [
  { name: 'Bank A (Switzerland)', id: 'A' },
  { name: 'Bank B (Switzerland)', id: 'B' },
  { name: 'Bank C (France)', id: 'C' },
  { name: 'Bank D (France)', id: 'D' },
  { name: 'Bank E (France)', id: 'E' },
  { name: 'Bank F (Italy)', id: 'F' },
  { name: 'Bank G (Italy)', id: 'G' },
  { name: 'Bank H (Italy)', id: 'H' },
  { name: 'Bank I (Italy)', id: 'I' },
  { name: 'Bank J (Italy)', id: 'J' },
  { name: 'Bank Kolombia (United States of America)', id: 'K' },
  { name: 'Bank L (Germany)', id: 'L' },
  { name: 'Bank M (Germany)', id: 'M' },
  { name: 'Bank N (Germany)', id: 'N' },
  { name: 'Bank O (Germany)', id: 'O' },
  { name: 'Bank P (Germany)', id: 'P' },
  { name: 'Bank Q (Germany)', id: 'Q' },
  { name: 'Bank R (Germany)', id: 'R' }
];

/** list of bank groups */
export const BANKGROUPS: BankGroup[] = [
  {
    name: 'Switzerland',
    banks: [
      { name: 'Bank A', id: 'A' },
      { name: 'Bank B', id: 'B' }
    ]
  },
  {
    name: 'France',
    banks: [
      { name: 'Bank C', id: 'C' },
      { name: 'Bank D', id: 'D' },
      { name: 'Bank E', id: 'E' },
    ]
  },
  {
    name: 'Italy',
    banks: [
      { name: 'Bank F', id: 'F' },
      { name: 'Bank G', id: 'G' },
      { name: 'Bank H', id: 'H' },
      { name: 'Bank I', id: 'I' },
      { name: 'Bank J', id: 'J' },
    ]
  },
  {
    name: 'United States of America',
    banks: [
      { name: 'Bank Kolombia', id: 'K' },
    ]
  },
  {
    name: 'Germany',
    banks: [
      { name: 'Bank L', id: 'L' },
      { name: 'Bank M', id: 'M' },
      { name: 'Bank N', id: 'N' },
      { name: 'Bank O', id: 'O' },
      { name: 'Bank P', id: 'P' },
      { name: 'Bank Q', id: 'Q' },
      { name: 'Bank R', id: 'R' }
    ]
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('widthGrow', [
        state('closed', style({
            width: 0,
        })),
        state('open', style({
            width: 400
        })),
        transition('* => *', animate(150))
    ]),
]
})
export class AppComponent {
  title = 'chat-app';
  public chatwindow = false;
  public event: any;
  public bankCtrl: FormControl = new FormControl(null);

  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  foods: any[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];
  closeChat() {

    this.chatwindow = false;
  }
  openChat() {

    this.chatwindow = true;
  }


  selectedStates = this.foods;


  onKey(value: any) {
    this.selectedStates = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.foods.filter(option => option.toLowerCase().startsWith(filter));
  }
  /** list of banks */
  protected banks: Bank[] = BANKS;



  /** control for the MatSelect filter keyword */
  public bankFilterCtrl: FormControl = new FormControl('');


  @ViewChild('singleSelect', {static:false}) singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  constructor() { }

  ngOnInit() {
    // set initial selection
    this.bankCtrl.setValue(this.banks[10]);

    // load the initial bank list
    this.filteredBanks.next(this.banks.slice());

    // listen for search field value changes
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      this.setInitialValue();
    },4000)
    
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: Bank, b: Bank) => a && b && a.id === b.id;
      });
  }

  protected filterBanks() {
    if (!this.banks) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
