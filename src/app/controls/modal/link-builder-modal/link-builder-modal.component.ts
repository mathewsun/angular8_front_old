import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import { AlertService } from '../../../services/gui/alert.service';
import { AlertTypeEnum } from '../../../models/enums/alertType.enum';

@Component({
  selector: 'app-link-builder-modal',
  templateUrl: './link-builder-modal.component.html',
  styleUrls: ['./link-builder-modal.component.css']
})
export class LinkBuilderModalComponent implements OnInit {

  public isShow: Boolean = false;
  //public baseLink: string = "";
  public streamId: string = "";
  public streamName: string = "";

  public subIds: string[] = [""];

  linkComponentsFormGroup: FormGroup;

  constructor(private _alertService: AlertService) {
    this.linkComponentsFormGroup = new FormGroup({
      'schema': new FormControl('https'),
      'domain': new FormControl('cmtrckr.net'),
      'subid1': new FormControl(null),
      'subid2': new FormControl(null),
      'subid3': new FormControl(null),
      'subid4': new FormControl(null),
      'subid5': new FormControl(null),
    });
  }

  @ViewChild('resultLink', {
    static: true,
    read: ElementRef
  }) resultLink: ElementRef;

  ngOnInit() {
    //let finalLinkField = this.linkComponentsFormGroup.get('resultLink');
    this.linkComponentsFormGroup.valueChanges.subscribe((val) => {
      this.buildLink(val);
    });
  }

  private buildLink(val: any) {
    let baseLink = `${val.schema}://${val.domain}/go/${this.streamId}`;
    let subidQueryString: string[] = [];

    for (let i = 1; i <= 5; i++) {
      let subidVal = val['subid' + i];
      if (subidVal) {
        subidQueryString.push(`subid${i}=${subidVal}`);
      }
    }

    if (subidQueryString.length > 0)
      baseLink += '?' + subidQueryString.join('&');

    this.resultLink.nativeElement.value = baseLink;
  }

  public show(streamId: string, streamName: string) {
    this.streamId = streamId;
    this.streamName = streamName;
    this.buildLink(this.linkComponentsFormGroup.getRawValue());
    this.isShow = true;
  }

  public close() {
    this.isShow = false;
  }

  onOutsideClick() {
    this.close();
  }

  public copyLink(event: MouseEvent): void {

    event.preventDefault();

    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("text", this.resultLink.nativeElement.value);
      e.preventDefault();
    };

    document.addEventListener("copy", listener, false);
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);

    this._alertService.addAlert('Ссылка скопирована', AlertTypeEnum.Success, null, 'far fa-check-circle', 3000);
  }

  public clearSubids(formGroup: FormGroup) {
    for (var i=1; i<6; i++) {
      formGroup.get("subid"+i).reset();
    }
  }
}
