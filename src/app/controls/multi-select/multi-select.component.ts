import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModelWrapper } from '../../models/modelWrapper';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MultiSelectComponent)
    }
  ]
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor {

  private _model: ModelWrapper[];

  private _modelHash: { [i: string]: ModelWrapper } = {};

  @Input('selectAll') public selectAll: boolean = true;
  private selectAllAtInit: boolean = true;

  @Input('caption') public caption: string = 'Selected';
  @Input('displayField') public displayField: string = 'name';
  @Input('additionalDisplayField') public additionalDisplayField: string = null;

  @Input('model')
  public set model(m: ModelWrapper[]) {
    this._model = m;

    this._model.forEach(wo => {
      this._modelHash[wo.value[this.displayField]] = wo;
    });

    this.selectionChangeAll(this.selectAll);
  }

  @Output() valueChanged: EventEmitter<ModelWrapper[]> = new EventEmitter<ModelWrapper[]>();

  public selectionCount: number = 0;

  @ViewChild('dropdownMenu', {static: false}) dropdownMenu: ElementRef;

  constructor() {

  }

  ngOnInit() {
    this.selectAllAtInit = this.selectAll;
  }

  @ViewChild('searchInput', {
    static: false
  }) searchInput;

  itemFilter(filter: string): ModelWrapper[] {
    if (this.additionalDisplayField) {
      return this._model.filter(i => {
        if (i.value[this.displayField] && i.value.id) {
          return i.value[this.displayField].toLowerCase().indexOf(filter.toLowerCase()) > -1 || i.value[this.additionalDisplayField].toString().toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }
      });
    } else {
      return this._model.filter(i => {
        if (i.value[this.displayField]) {
          return i.value[this.displayField].toLowerCase().indexOf(filter.toLowerCase()) > -1;
        }
      });
    }
  }

  test() {

  }

  selectionChange(item: ModelWrapper, checked: boolean) {
    item.selected = checked;
    this.countSelected();
    this.onTouched();
  }

  public selectionChangeAll(checked: boolean) {
    this._model.forEach(c => {
      c.selected = checked;
    });

    this.selectAll = checked;
    this.countSelected();
    this.onTouched();
  }

  /**
   *
   */
  private countSelected() {
    this.selectionCount = 0;

    let selectedVals = this._model.filter(i => i.selected);

    this.selectionCount = selectedVals.length;

    setTimeout(() => {
      this.onChange(selectedVals);
      this.valueChanged.emit(selectedVals);
    }, 0);
  }

  private onChange: (data: ModelWrapper[]) => {} = () => {
    return {};
  };
  private onTouched: () => {} = () => {
    return {};
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


  setDisabledState(isDisabled: boolean): void {
  }

  reset() {
    this.selectionChangeAll(this.selectAllAtInit);
  }

  writeValue(obj: any[]): void {

    if (obj == null) {
      this.reset();
    }

    if (obj) {

      obj.forEach(o => {
        let existed = this._modelHash[o.value[this.displayField]];
        if (existed) {
          existed.selected = o.value[this.displayField] == existed.value[this.displayField];
        }
      });

      this.countSelected();
    }
  }

  onClose() {
  }


  public show: boolean = false;

  insideClick(e: Event) {
    this.show = !this.show;
  }

}
