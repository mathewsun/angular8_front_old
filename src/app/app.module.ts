import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AsidePanelComponent } from './controls/aside-panel/aside-panel.component';
import { PageContainerComponent } from './pages/page-container/page-container.component';
import { HeaderComponent } from './controls/header/header.component';
import { MainContentComponent } from './pages/main-content/main-content.component';
import { NavItemListComponent } from './controls/aside-panel/nav-item-list/nav-item-list.component';
import { StatsCPAComponent } from './pages/statistics/stats-cpa/stats-cpa.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { StreamsComponent } from './pages/streams/list/streams.component';
import { AddStreamComponent } from './pages/streams/add-stream/add-stream.component';
import { OffersComponent } from './pages/offers/list/offers.component';
import { FinanceComponent } from './pages/finance/finance.component';
import { NewsComponent } from './pages/news/news.component';
import { RulesComponent } from './pages/rules/rules.component';
import { SupportComponent } from './pages/support/support.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './pages/auth/login/login.component';

import { AuthGuard } from './services/guards/auth-guard.service';
import { UnauthGuard } from './services/guards/unauth-guard.service';
import { AdminGuard } from './services/guards/admin-guard.service';
import { CreateOfferGuard } from './services/guards/create-offer-guard.service';
import { CreateStreamGuard } from './services/guards/create-stream-guard.service';

import { PaymentsGuard } from './services/guards/payments-guard.service';
import { LandingPagesComponent } from './pages/landing-pages/list/landing-pages.component';
import { AddLandingPageComponent } from './pages/landing-pages/add-landing-page/add-landing-page.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { UserConfirmationComponent } from './pages/auth/user-confirmation/user-confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddOfferComponent } from './pages/offers/add-offer/add-offer.component';
import { OfferComponent } from './pages/offers/offer/offer.component';
import { LandSelectorModalComponent } from './controls/modal/land-selector-modal/land-selector-modal.component';
import { LandingPageCardComponent } from './controls/landing-page-card/landing-page-card.component';
import { NavItemComponent } from './controls/aside-panel/nav-item/nav-item.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RequisitesComponent } from './pages/requisites/requisites.component';

import { FileUploadInputComponent } from './controls/file-upload-input/file-upload-input.component';
import { ProgressButtonComponent } from './controls/progress-button/progress-button.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { CurrentUserResolver } from './routing/current-user-resolver.service';
import { UserResolver } from './routing/user-resolver.service';
import { ProfileResolverService } from './routing/profile-resolver.service';
import { PayoutComponent } from './pages/finance/payout/payout.component';
import { PayoutListComponent } from './pages/finance/payout-list/payout-list.component';
import { LanguageSelectorComponent } from './controls/language-selector/language-selector.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { ApiModule } from './api/api.module';
import { DictionaryModule } from './api/dictionary.module';
import { StatisticsModule } from './api/statistics.module';
import { UserModule } from './api/user.module';
import { OfferModule } from './api/offer.module';
import { StreamModule } from './api/stream.module';
import { LandingPageModule } from './api/landingPage.module';

import { UserLinksModule } from './api/user-links.module';
import { FinanceModule } from './api/finance.module';

import { MatNativeDateModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerComponent } from './controls/date-picker/date-picker.component';

import { MultiSelectComponent } from './controls/multi-select/multi-select.component';
import { WrapModelArrayPipe, WrapModelPipe } from './models/pipes/wrapModel.pipe';
import { EnumToArrayPipe } from './models/pipes/enumToArray.pipe';
import { ImageIdToLinkPipe } from './models/pipes/imageIdToLink.pipe';
import { CustomNumberPipe } from './models/pipes/custom-number.pipe';

import { StringToColorPipe } from './models/pipes/stringToColor.pipe';
import { HasRoleDirective } from './directives/has-role.directive';
import { BackButtonDirective } from './directives/back-button.directive';
import { HasNotRoleDirective } from './directives/has-not-role.directive';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { UserListResolverService } from './routing/user-list-resolver.service';
import { OfferListResolverService } from './routing/offer-list-resolver.service';
import { MyOfferListResolverService } from './routing/my-offer-list-resolver.service';
import { PrivateOfferListResolverService } from './routing/private-offer-list-resolver.service';
import { AllowedOfferListResolverService } from './routing/allowed-offer-list-resolver.service';
import { StreamListResolverService } from './routing/stream-list-resolver.service';
import { LandingPageComponent } from './pages/landing-pages/landing-page/landing-page.component';
import { SelectComponent } from './controls/select/select.component';
import { LinkBuilderModalComponent } from './controls/modal/link-builder-modal/link-builder-modal.component';
import { CustomPayoutComponent } from './pages/custom-payouts/custom-payout.component';
import { ByUserComponent } from './pages/custom-payouts/by-user/by-user.component';
import { ByOfferComponent } from './pages/custom-payouts/by-offer/by-offer.component';
import { RouterObserver } from './services/router-observer.service';
import { TicketFormComponent } from './controls/ticket-form/ticket-form.component';
import { RequestAccessModalComponent } from './controls/modal/request-access-modal/request-access-modal.component';
import { UserLinkListComponent } from './pages/user-link-list/list/user-link-list.component';
import { AddUserLinkComponent } from './pages/user-link-list/add-user-link/add-user-link.component';
import { AdminEditProfileResolverService } from './routing/admin-edit-profile-resolver.service';
import { AdminEditStreamResolverService } from './routing/admin-edit-stream-resolver.service';
import { StatisticsResolverService } from './routing/statistics-resolver.service';
import { AlertQueueComponent } from './controls/alerts/alert-queue/alert-queue.component';
import { AlertComponent } from './controls/alerts/alert/alert.component';
import { TrafficSourcesComponent } from './controls/traffic-sources/traffic-sources.component';
import { PaginatorComponent } from './controls/paginator/paginator.component';
import { TitleCasePipe } from './models/pipes/titleCase.pipe';
import { FinanceGuard } from './services/guards/finance-guard.service';
import { RequisitesResolverService } from './routing/requisites-resolver.service';
import { TransactionConfirmationModalComponent } from './controls/modal/transaction-confirmation-modal/transaction-confirmation-modal.component';
import { TabsComponent } from './controls/tabs/tabs.component';
import { GoodStatisticsModule } from './api/goodStatistics.module';
import { UnderscoreToSpacePipe } from './models/pipes/underscoreToSpace.pipe';
import { HeaderMobileComponent } from './controls/header-mobile/header-mobile.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { FaqComponent } from './pages/faq/faq.component';
import { FaqQuestionComponent } from './pages/faq/faq-question/faq-question.component';

@Injectable()
export class LocaleDateAdapter extends MomentDateAdapter {
  getFirstDayOfWeek() {
    return 1;
  }
}

export const DateFormats: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    AsidePanelComponent,
    PageContainerComponent,
    HeaderComponent,
    MainContentComponent,
    NavItemListComponent,
    StatsCPAComponent,
    HomeComponent,
    PageNotFoundComponent,
    StatisticsComponent,
    StreamsComponent,
    AddStreamComponent,
    OffersComponent,
    FinanceComponent,
    NewsComponent,
    RulesComponent,
    SupportComponent,
    LoginComponent,
    RegistrationComponent,
    UserConfirmationComponent,
    LandingPagesComponent,
    AddLandingPageComponent,
    AddOfferComponent,
    OfferComponent,
    LandSelectorModalComponent,

    LandingPageCardComponent,
    NavItemComponent,
    ProfileComponent,
    RequisitesComponent,
    FileUploadInputComponent,

    EnumToArrayPipe,
    ImageIdToLinkPipe,
    TitleCasePipe,
    UnderscoreToSpacePipe,
    StringToColorPipe,

    HasRoleDirective,
    HasNotRoleDirective,
    BackButtonDirective,
    ClickOutsideDirective,

    ProgressButtonComponent,
    TabsComponent,

    UserListComponent,

    PayoutComponent,
    PayoutListComponent,
    LanguageSelectorComponent,
    DatePickerComponent,
    MultiSelectComponent,
    WrapModelPipe,
    WrapModelArrayPipe,
    CustomNumberPipe,
    LandingPageComponent,
    SelectComponent,
    CustomPayoutComponent,
    ByUserComponent,
    ByOfferComponent,
    TicketFormComponent,

    LinkBuilderModalComponent,
    RequestAccessModalComponent,
    TransactionConfirmationModalComponent,
    UserLinkListComponent,
    AddUserLinkComponent,
    AlertQueueComponent,
    AlertComponent,
    TrafficSourcesComponent,
    PaginatorComponent,
    HeaderMobileComponent,
    FaqComponent,
    FaqQuestionComponent,
  ],
  imports: [
    ApiModule,
    OfferModule,
    UserModule,
    StatisticsModule,
    GoodStatisticsModule,
    DictionaryModule,
    StreamModule,
    LandingPageModule,
    FinanceModule,
    UserLinksModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  providers: [
    AuthGuard,
    UnauthGuard,
    AdminGuard,
    CreateOfferGuard,
    CreateStreamGuard,
    PaymentsGuard,
    FinanceGuard,

    CurrentUserResolver,
    UserResolver,
    UserListResolverService,
    OfferListResolverService,
    MyOfferListResolverService,
    PrivateOfferListResolverService,
    AllowedOfferListResolverService,
    StreamListResolverService,
    ProfileResolverService,
    StatisticsResolverService,
    RequisitesResolverService,

    AdminEditProfileResolverService,
    AdminEditStreamResolverService,

    RouterObserver,
    {provide: DateAdapter, useClass: MomentDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: DateFormats},
    {provide: MAT_DATE_LOCALE, useValue: 'en_US'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    LandSelectorModalComponent,
    LinkBuilderModalComponent,
    RequestAccessModalComponent,
    TransactionConfirmationModalComponent
  ]
})
export class AppModule {
}
