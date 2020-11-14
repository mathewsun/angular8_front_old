import {
  AfterContentInit, AfterViewInit,
  Component,
  ContentChildren, ElementRef, EventEmitter,
  forwardRef, HostBinding,
  Input,
  OnInit, Output,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectComponent)
    }
  ]
})
export class SelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  @HostBinding('attr.tabindex') tabIndex = 0;

  @Input('caption') public caption: string = "Select one";
  @Output('changed') public change: EventEmitter<string | number> = new EventEmitter<string | number>();

  @Input('showSearch') public showSearch: boolean = false;

  @ViewChild('content', {static: false}) content: ElementRef;

  @ViewChildren('content') contents: QueryList<ElementRef>;

  @ViewChild('searchInput', {
    static: false
  }) searchInput;

  public value: string | number;
  public displayValue: string | number;

  private options = {};

  constructor() {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateOptions(true);
    }, 0);
  }

  ngOnInit() {

  }

  /**
   *
   */
  private updateOptions(useSelectedAttr: boolean = false) {
    if (!this.content)
      return;

    let options = this.content.nativeElement.querySelectorAll('div.items-wrapper > div');
    //this.content.
    this.options = {};

    let lastSelected = null;

    let searchPattern = this.searchInput && this.searchInput.nativeElement.value;


    options.forEach(o => {
      o.classList.add('dropdown-item');
      if (o.selected)
        lastSelected = o;
      this.options[SelectComponent.getValue(o)] = o.innerText;

      if (searchPattern && o.innerText.toLowerCase().indexOf(searchPattern.toLowerCase()) < 0) {
        o.style.display = 'none';
      } else {
        o.style.display = '';
      }

    });

    if (this.value != null) {
      if (this.options[this.value]) {
        this.displayValue = this.options[this.value];
      }
    } else if (lastSelected && useSelectedAttr)
      this.selectionChanged({target: lastSelected});
  }

  public search(searchPattern: string) {
    let options = this.content.nativeElement.querySelectorAll('div.items-wrapper > div');

    options.forEach(o => {
      if (searchPattern && o.innerText.toLowerCase().indexOf(searchPattern.toLowerCase()) < 0) {
        o.style.display = 'none';
      } else {
        o.style.display = '';
      }

    });
  }

  private static getValue(el: any): any {
    return el.value || el.getAttribute('data-value') || el.getAttribute('value');
  }

  selectionChanged(event) {
    let val = SelectComponent.getValue(event.target);
    this.value = val;
    this.displayValue = event.target.innerText;

    this.onTouched();
    this.onChange(val);
    this.change.emit(val);
  }

  private onChange: (data: string) => void = (s) => {
  };
  private onTouched: () => void = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.onTouched();
    this.onChange(obj);
    this.change.emit(obj);

    this.updateOptions();
    if (this.options[obj]) {
      this.displayValue = this.options[obj];
    }
  }

  onTouch() {
    this.onTouched();
  }

}
