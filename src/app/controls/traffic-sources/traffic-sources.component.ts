import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TrafficSourceStatusEnum } from '../../models/enums/trafficSourceStatus.enum';

@Component({
  selector: 'traffic-sources',
  templateUrl: './traffic-sources.component.html',
  styleUrls: ['./traffic-sources.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TrafficSourcesComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => TrafficSourcesComponent)
    }
  ]
})
export class TrafficSourcesComponent implements OnInit, ControlValueAccessor {

  trafficSourceStatusEnum = TrafficSourceStatusEnum;
  public value: string = '00000000000000000';

  public model = [
    {type: 'seo', name: 'SEO', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'doorway', name: 'Doorway', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'contextAdvert', name: 'Contextual  advertising', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'contextAdvertBrand', name: 'Contextual  advertising / Brand', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'teaserBannerAdvert', name: 'Teaser/Banner advertising', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'socialNetworkTargeted', name: 'Targeted social networks', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'socialNetworkPublic', name: 'Public / Apps social networks', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'emailNews', name: 'E-mail news', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'emailSpam', name: 'E-mail spam', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'sms', name: 'SMS', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'smsSpam', name: 'SMS spam', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'pushNotes', name: 'Push notifications', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'mobileTraffic', name: 'Mobile traffic', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'appsAndGames', name: 'Apps and games', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'cashback', name: 'Cashback', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'videoAd', name: 'Video Ads', allowed: TrafficSourceStatusEnum.Prohibited},
    {type: 'adultPorn', name: 'Adult / Porn', allowed: TrafficSourceStatusEnum.Prohibited}
  ];

  constructor() {
  }

  ngOnInit() {
  }

  private onChange: (data: string) => void = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  private onTouched: () => void = () => {
  };

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: string): void {
    this.updateModel(value);
  }

  sourceSwitch(id: number, type: TrafficSourceStatusEnum) {
    this.value = this.value.slice(0, id) + type + this.value.slice(id + 1, this.value.length);
    this.model[id].allowed = type;
    this.onTouched();
    this.onChange(this.value);
  }

  updateModel(value: string) {
    this.value = value ? value : '00000000000000000';
    value.split('').forEach((symbol, index) => {
      switch (symbol) {
        case '0': this.model[index].allowed = TrafficSourceStatusEnum.Prohibited;  break;
        case '1': this.model[index].allowed = TrafficSourceStatusEnum.Allowed;  break;
        case '2': this.model[index].allowed = TrafficSourceStatusEnum.Agreement;  break;
      }
    });
  }

  validate() {
    const isNotValid = this.value == '00000000000000000';
    return isNotValid && {
      invalid: true
    }
  }

}
