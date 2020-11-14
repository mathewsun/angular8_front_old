import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input()
  set amount(val: number) {
    this._amount = val || 999;
    this.updateAmount();
  };

  @Input()
  set selected(val: number) {
    this._selected = val || 1;
  };

  get amount(): number {
    return this._amount;
  }

  get selected(): number {
    return this._selected;
  }

  private _amount: number = 999;
  private _selected: number = 1;

  public pageButtons = [];
  public size: number = 9;
  public maxSize: number = 9;
  public leftMaxIndent: number = 4;
  public rightMaxIndent: number = 4;

  constructor(private _router: Router) {
  }

  ngOnInit() {

    if (!this._selected) {
      this._selected = 1;
    }
    if (this._selected < 1) {
      this._selected = 1;
    }

    this.updateAmount();
  }

  public updateAmount() {
    if (this._selected > this.amount) {
      this._selected = this.amount;
    }

    if (!this.amount) {
      this._amount = 1; // not this.amount!! or that will fall to inf loop
    }

    if (this.amount < this.leftMaxIndent) {
      this.leftMaxIndent = Math.floor(this.amount / 2);
    }

    if (this.amount > this.rightMaxIndent) {
      this.rightMaxIndent = Math.floor(this.amount / 2);
    }

    if (this.amount < this.maxSize) {
      this.size = this.amount;
    }

    this.shiftButtons();
  }

  public shiftButtons() {
    this.pageButtons = [];

    let startPoint;

    if (this.selected <= this.leftMaxIndent + 1) {
      startPoint = 1;
    } else if (this.selected >= this.amount - this.rightMaxIndent + 1) {
      startPoint = this.amount - this.size + 1;
    } else {
      startPoint = this.selected - this.leftMaxIndent;
    }
    for (let i = startPoint; i < this.size + startPoint; i++) {
      this.pageButtons.push(i);
    }
    this.navigateToPage(this.selected);
  }

  public goToFirst() {
    this._selected = 1;
    this.shiftButtons();
  }

  public goToPrevious() {
    if (this._selected !== this.pageButtons[0]) {
      this._selected--;
      this.shiftButtons();
    }
  }

  public goTo(pageNumber: number) {
    this._selected = pageNumber;
    this.shiftButtons();
  }

  public goToNext() {
    if (this._selected !== this._amount) {
      this._selected++;
      this.shiftButtons();
    }
  }

  public goToLast() {
    this._selected = this._amount;
    this.shiftButtons();
  }

  navigateToPage(pageNumber: number) {
    this._router.navigate([], {
      queryParams: {
        page: pageNumber,
      },
      queryParamsHandling: 'merge',
    });
  }

}
