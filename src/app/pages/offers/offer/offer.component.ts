import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Offer} from "../../../models/offer";
import {DictionaryModule} from "../../../api/dictionary.module";
import {Currency} from "../../../models/currency";
import { Title } from '@angular/platform-browser';
import { TrafficSourceStatusEnum } from '../../../models/enums/trafficSourceStatus.enum';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  public trafficSources = [
    {type: 'seo', name: 'SEO', allowed: false},
    {type: 'doorway', name: 'Doorway', allowed: false},
    {type: 'contextAdvert', name: 'Contextual  advertising', allowed: false},
    {type: 'contextAdvertBrand', name: 'Contextual  advertising / Brand', allowed: false},
    {type: 'teaserBannerAdvert', name: 'Teaser/Banner advertising', allowed: false},
    {type: 'socialNetworkTargeted', name: 'Targeted social networks', allowed: false},
    {type: 'socialNetworkPublic', name: 'Public / Apps social networks', allowed: false},
    {type: 'emailNews', name: 'E-mail news', allowed: false},
    {type: 'emailSpam', name: 'E-mail spam', allowed: false},
    {type: 'sms', name: 'SMS', allowed: false},
    {type: 'smsSpam', name: 'SMS spam', allowed: false},
    {type: 'pushNotes', name: 'Push notifications', allowed: false},
    {type: 'mobileTraffic', name: 'Mobile traffic', allowed: false},
    {type: 'appsAndGames', name: 'Apps and games', allowed: false},
    {type: 'cashback', name: 'Cashback', allowed: false},
    {type: 'videoAd', name: 'Video Ads', allowed: false},
    {type: 'adultPorn', name: 'Adult / Porn', allowed: false},
  ];

  public offer: Offer = null;

  public currencies: { [index: number]: Currency };
  trafficSourceStatusEnum = TrafficSourceStatusEnum;

  constructor(private _titleService: Title, _route: ActivatedRoute, public _dictionaryModule: DictionaryModule) {
    let snapshot = _route.snapshot;
    this.offer = snapshot.data.offer;
    this.currencies = _dictionaryModule.currenciesDictionary;

    this._titleService.setTitle(snapshot.data.offer.name + ' - C2M');
  }

  ngOnInit() {
  }

}
