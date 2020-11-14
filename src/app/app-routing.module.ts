import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { HomeComponent } from './pages/home/home.component';
import { StatsCPAComponent } from './pages/statistics/stats-cpa/stats-cpa.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
// import { StatisticsComponent } from './pages/statistics/statistics.component';
import { StreamsComponent } from './pages/streams/list/streams.component';
import { AddStreamComponent } from './pages/streams/add-stream/add-stream.component';
import { OffersComponent } from './pages/offers/list/offers.component';
import { FinanceComponent } from './pages/finance/finance.component';
import { NewsComponent } from './pages/news/news.component';
import { RulesComponent } from './pages/rules/rules.component';
import { SupportComponent } from './pages/support/support.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { PageContainerComponent } from './pages/page-container/page-container.component';
import { AuthGuard } from './services/guards/auth-guard.service';

import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { UserConfirmationComponent } from './pages/auth/user-confirmation/user-confirmation.component';
import { AddLandingPageComponent } from './pages/landing-pages/add-landing-page/add-landing-page.component';
import { LandingPagesComponent } from './pages/landing-pages/list/landing-pages.component';
import { AddOfferComponent } from './pages/offers/add-offer/add-offer.component';
import { OfferComponent } from './pages/offers/offer/offer.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RequisitesComponent } from './pages/requisites/requisites.component';
import { UserListComponent } from './pages/admin/user-list/user-list.component';
import { CurrentUserResolver } from './routing/current-user-resolver.service';
import { OfferResolverService } from './routing/offer-resolver.service';
import { MyOfferListResolverService } from './routing/my-offer-list-resolver.service';
import { AllowedOfferListResolverService } from './routing/allowed-offer-list-resolver.service';
import { OfferListResolverService } from './routing/offer-list-resolver.service';
import { UserListResolverService } from './routing/user-list-resolver.service';
import { StreamListResolverService } from './routing/stream-list-resolver.service';
import { LandingPageResolverService } from './routing/landing-page-resolver.service';
import { LandingPageComponent } from './pages/landing-pages/landing-page/landing-page.component';
import { CustomPayoutComponent } from './pages/custom-payouts/custom-payout.component';
import { CustomPayoutResolverService } from './routing/custom-payout-resolver.service';
import { ProfileResolverService } from './routing/profile-resolver.service';
import { AdminGuard } from './services/guards/admin-guard.service';
import { CreateOfferGuard } from './services/guards/create-offer-guard.service';
import { CreateStreamGuard } from './services/guards/create-stream-guard.service';
import { StreamResolverService } from './routing/stream-resolver.service';
import { UserLinkListComponent } from './pages/user-link-list/list/user-link-list.component';
import { TrafficBackListResolverService } from './routing/traffic-back-list-resolver.service';
import { PostbackListResolverService } from './routing/postback-list-resolver.service';
import { AddUserLinkComponent } from './pages/user-link-list/add-user-link/add-user-link.component';
import { TrafficBackResolverService } from './routing/traffic-back-resolver.service';
import { PostbackResolverService } from './routing/postback-resolver.service';
import { AdminEditStreamResolverService } from './routing/admin-edit-stream-resolver.service';
import { AdminEditProfileResolverService } from './routing/admin-edit-profile-resolver.service';
import { StatisticsResolverService } from './routing/statistics-resolver.service';
import { UnauthGuard } from './services/guards/unauth-guard.service';
import { OfferListTypeEnum } from './models/enums/offerListType.enum';
import { SubcategoriesWithCategoryNamesResolverService } from './routing/subcategories-with-category-names-resolver.service';
import { SubcategoriesResolverService } from './routing/subcategories-resolver.service';
import { RequisitesResolverService } from './routing/requisites-resolver.service';
import { FinanceGuard } from './services/guards/finance-guard.service';
import { UserLinkTypeEnum } from './models/enums/UserLinkType.enum';
import { FaqComponent } from './pages/faq/faq.component';

const titles = {
  statistics: 'Statistics - C2M',
  streamList: 'Streams - C2M',
  streamAdd: 'Add stream - C2M',
  streamEdit: 'Edit stream - C2M',
  offerListAll: 'All offers - C2M',
  offerListMy: 'My offers - C2M',
  offerListPrivate: 'Private offers - C2M',
  offerAdd: 'Add offer - C2M',
  offerEdit: 'Edit offer - C2M',
  landingList: 'Landing pages - C2M',
  landingAdd: 'Add landing page - C2M',
  landingEdit: 'Edit landing page - C2M',
  userList: 'Users - C2M',
  statisticsAdmin: 'Admin statistics - C2M',
  profile: 'Profile - C2M',
  requisites: 'Requisites - C2M',
  finance: 'Finance - C2M',
  news: 'News - C2M',
  rules: 'Rules - C2M',
  support: 'Support - C2M',
  signIn: 'Sign in - C2M',
  signUp: 'Sign up - C2M',
  confirm: 'Confirm account - C2M',
  postbackList: 'Postback list - C2M',
  traffbackList: 'Traffic back list - C2M',
  addLink: 'Add link - C2M',
  editLink: 'Edit link - C2M',
  notFound: '404 - C2M',
  faq: 'FAQ - C2M'
};

const appRoutes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'dashboard/statistics'},
  {
    path: '',
    resolve: {userReady: CurrentUserResolver},
    children: [
      {
        path: 'dashboard',
        component: PageContainerComponent,
        canActivate: [AuthGuard],
        children: [
          {path: '', pathMatch: 'full', redirectTo: 'statistics'},
          {
            path: 'faq',
            component: FaqComponent,
            canActivate: [AuthGuard],
            data: {title: titles.faq}
          },
          {
            path: 'statistics',
            component: StatsCPAComponent,
            resolve: {
              offers: MyOfferListResolverService,
              streams: StreamListResolverService,
              stats: StatisticsResolverService
            },
            data: {title: titles.statistics}
          },
          {
            path: 'streams',
            component: StreamsComponent,
            resolve: {offerList: MyOfferListResolverService},
            canActivate: [CreateStreamGuard],
            data: {title: titles.streamList}
          },
          {
            path: 'streams/:streamId/edit',
            component: AddStreamComponent,
            resolve: {
              offers: AllowedOfferListResolverService,
              selectedStream: StreamResolverService,
              traffbackList: TrafficBackListResolverService,
              postbackList: PostbackListResolverService,
              subcategoryList: SubcategoriesResolverService
            },
            canActivate: [CreateStreamGuard],
            data: {edit: true, title: titles.streamEdit}
          },
          {
            path: 'add-stream',
            component: AddStreamComponent,
            resolve: {
              offers: AllowedOfferListResolverService,
              selectedOffer: OfferResolverService,
              traffbackList: TrafficBackListResolverService,
              postbackList: PostbackListResolverService,
              subcategoryList: SubcategoriesResolverService
            },
            data: {title: titles.streamAdd}
          },
          {
            path: 'add-offer',
            component: AddOfferComponent,
            canActivate: [CreateOfferGuard],
            data: {title: titles.offerAdd},
            resolve: {offerList: OfferListResolverService, subcategoryList: SubcategoriesWithCategoryNamesResolverService}
          },
          {
            path: 'offers',
            children: [
              {
                path: 'all',
                component: OffersComponent,
                data: {type: OfferListTypeEnum.All, title: titles.offerListAll},
                resolve: {subcategoryList: SubcategoriesResolverService}
              },
              {
                path: 'my',
                component: OffersComponent,
                data: {type: OfferListTypeEnum.My, title: titles.offerListMy},
                resolve: {subcategoryList: SubcategoriesResolverService}
              },
              {
                path: 'private',
                component: OffersComponent,
                data: {type: OfferListTypeEnum.Private, title: titles.offerListPrivate},
                resolve: {subcategoryList: SubcategoriesResolverService}
              },
            ]
          },
          {
            path: 'offers/:offerId/edit',
            component: AddOfferComponent,
            resolve: {
              offer: OfferResolverService,
              offerList: OfferListResolverService,
              subcategoryList: SubcategoriesWithCategoryNamesResolverService
            },
            canActivate: [CreateOfferGuard],
            data: {edit: true, title: titles.offerEdit}
          },
          {
            path: 'offers/:offerId',
            component: OfferComponent,
            resolve: {offer: OfferResolverService}
          },
          {
            path: 'landing-pages/:id',
            component: LandingPageComponent,
            canActivate: [CreateOfferGuard],
            resolve: {landingPage: LandingPageResolverService}
          },
          {
            path: 'landing-pages/:id/edit',
            component: AddLandingPageComponent,
            resolve: {landingPage: LandingPageResolverService},
            canActivate: [CreateOfferGuard],
            data: {edit: true, title: titles.landingEdit}
          },
          {
            path: 'finance',
            component: FinanceComponent,
            data: {title: titles.finance},
            resolve: {requisites: RequisitesResolverService}
          },
          {
            path: 'news',
            component: NewsComponent,
            data: {title: titles.news}
          },
          {
            path: 'rules',
            component: RulesComponent,
            data: {title: titles.rules}
          },
          {
            path: 'support',
            component: SupportComponent,
            data: {title: titles.support}
          },
          {
            path: 'add-landing-page',
            component: AddLandingPageComponent,
            canActivate: [CreateOfferGuard],
            data: {title: titles.landingAdd}
          },
          {
            path: 'landing-pages',
            component: LandingPagesComponent,
            canActivate: [CreateOfferGuard],
            data: {title: titles.landingList}
          },
          {
            path: 'profile',
            component: ProfileComponent,
            data: {self: true, title: titles.profile},
            resolve: {postbackList: PostbackListResolverService}
          },
          {
            path: 'requisites',
            component: RequisitesComponent,
            data: {title: titles.requisites}
          },
          {
            path: 'postback/list',
            component: UserLinkListComponent,
            data: {title: titles.postbackList, userLinkType: UserLinkTypeEnum.UserPostback}
          },
          {
            path: 'traffback/list',
            component: UserLinkListComponent,
            data: {title: titles.traffbackList, userLinkType: UserLinkTypeEnum.UserTraffback}
          },
          {
            path: 'add-link/:linkType',
            component: AddUserLinkComponent,
            data: {title: titles.addLink}
          },
          {
            path: 'edit-link/:linkType/:linkId/edit',
            resolve: {traffBackLink: TrafficBackResolverService, postbackLink: PostbackResolverService},
            component: AddUserLinkComponent,
            data: {title: titles.editLink, edit: true}
          },
          {
            path: '404',
            component: PageNotFoundComponent,
            canActivate: [AuthGuard],
            data: {mode: 'user', title: titles.notFound}
          },
          {
            path: '**',
            canActivate: [AuthGuard],
            redirectTo: '404'
          }
        ]
      },
      {
        path: 'admin', component: PageContainerComponent, canActivate: [AuthGuard, AdminGuard], data: {mode: 'admin'},
        children: [
          {
            path: 'users',
            component: UserListComponent,
            data: {mode: 'admin', title: titles.userList}
          },
          {
            path: 'users/:mail',
            component: ProfileComponent,
            resolve: {adminProfileEditObj: AdminEditProfileResolverService},
            data: {mode: 'admin'}
          },
          {
            path: 'statistics',
            component: StatsCPAComponent,
            resolve: {
              offers: OfferListResolverService,
              streams: StreamListResolverService,
              users: UserListResolverService,
              stats: StatisticsResolverService
            },
            data: {adminMode: true, title: titles.statisticsAdmin}
          },
          {
            path: 'custom-payout/by-offer/:offerId',
            component: CustomPayoutComponent,
            resolve: {users: CustomPayoutResolverService, userList: UserListResolverService, offer: OfferResolverService},
            data: {subComponent: 'by-offer'}
          },
          {
            path: 'custom-payout/by-user/:userId',
            component: CustomPayoutComponent,
            resolve: {offers: CustomPayoutResolverService, offerList: OfferListResolverService, profile: ProfileResolverService},
            data: {subComponent: 'by-user'}
          },
          {
            path: 'streams',
            component: StreamsComponent,
            resolve: {offerList: OfferListResolverService, userList: UserListResolverService},
            canActivate: [CreateStreamGuard, AdminGuard],
            data: {title: titles.streamList, adminMode: true}
          },
          {
            path: 'streams/:streamId/edit',
            component: AddStreamComponent,
            resolve: {offers: AllowedOfferListResolverService, adminStreamEditObj: AdminEditStreamResolverService},
            canActivate: [CreateStreamGuard, AdminGuard],
            data: {mode: 'admin', edit: true, title: titles.streamEdit}
          },
          {
            path: 'postback/list',
            component: UserLinkListComponent,
            canActivate: [AdminGuard],
            resolve: {userList: UserListResolverService},
            data: {title: titles.postbackList, userLinkType: UserLinkTypeEnum.AdminPostback, adminMode: true}
          },
          {
            path: 'traffback/list',
            component: UserLinkListComponent,
            canActivate: [AdminGuard],
            resolve: {userList: UserListResolverService},
            data: {title: titles.traffbackList, userLinkType: UserLinkTypeEnum.AdminTraffback, adminMode: true}
          },
          {
            path: 'finance',
            component: FinanceComponent,
            resolve: {users: UserListResolverService, requisites: RequisitesResolverService},
            canActivate: [FinanceGuard, AdminGuard],
            data: {admin: true}
          },
          {
            path: 'edit-link/:linkType/:linkId/edit',
            resolve: {traffBackLink: TrafficBackResolverService, postbackLink: PostbackResolverService},
            component: AddUserLinkComponent,
            data: {title: titles.editLink, edit: true, adminMode: true}
          },
        ]
      },
    ]
  },
  {
    path: 'sign-in',
    component: LoginComponent,
    canActivate: [UnauthGuard],
    data: {title: titles.signIn}
  },
  {
    path: 'sign-up',
    component: RegistrationComponent,
    canActivate: [UnauthGuard],
    data: {title: titles.signUp}
  },
  {
    path: 'confirm',
    component: UserConfirmationComponent,
    canActivate: [UnauthGuard],
    data: {title: titles.confirm}
  },
  {
    path: '404',
    component: PageNotFoundComponent,
    canActivate: [UnauthGuard],
    data: {mode: 'guest', title: titles.notFound}
  },
  {
    path: '**',
    canActivate: [UnauthGuard],
    redirectTo: '404'
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'top', onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
