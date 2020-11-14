import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationMenuService {
  get navbarElements() {
    return [
      {
        name: 'statistics',
        icon: 'fas fa-chart-pie',
        text: 'Statistics',
        linkOption: {exact: false},
        routerLink: '/dashboard/statistics',
        expanded: true,
      },
      {
        name: 'instruments',
        icon: 'fas fa-tools',
        text: 'Instruments',
        linkOption: {exact: false},
        expanded: false,
        subItems: [
          {
            name: 'streams',
            text: 'Streams',
            routerLink: '/dashboard/streams',
            linkOption: {exact: true}
          },
          {
            name: 'traffback-list',
            text: 'Traffic back links',
            routerLink: '/dashboard/traffback/list',
            linkOption: {exact: true},
          },
          {
            name: 'postback-list',
            text: 'Postback links',
            routerLink: '/dashboard/postback/list',
            linkOption: {exact: true}
          },
        ]
      },
      {
        name: 'offers',
        icon: 'fas fa-tag',
        text: 'Offers',
        linkOption: {exact: false},
        expanded: false,
        subItems: [
          {
            name: 'all-offers',
            text: 'All offers',
            routerLink: '/dashboard/offers/all',
            linkOption: {exact: true}
          },
          {
            name: 'my-offers',
            text: 'My offers',
            routerLink: '/dashboard/offers/my',
            linkOption: {exact: true}
          },
          {
            name: 'private-offers',
            text: 'Private offers',
            routerLink: '/dashboard/offers/private',
            linkOption: {exact: true}
          }
        ]
      },

      {
        name: 'landing-pages',
        icon: 'fas fa-link',
        text: 'Landing pages',
        routerLink: '/dashboard/landing-pages',
        linkOption: {},
        roles: ['CreateOffer', 'Superuser'],
        expanded: false,
      },
      {
        name: 'support',
        icon: 'fas fa-question',
        text: 'Support',
        routerLink: '/dashboard/support',
        linkOption: {},
        expanded: false,
      },
      {
        name: 'faq',
        icon: 'fas fa-question-circle',
        text: 'FAQ',
        routerLink: '/dashboard/faq',
        linkOption: {exact: true},
        expanded: false
      },
      {
        name: 'admin',
        icon: 'fas fa-crown',
        text: 'admin',
        linkOption: {},
        roles: ['Superuser'],
        expanded: false,
        subItems: [
          {
            name: 'users',
            text: 'users',
            routerLink: '/admin/users',
            linkOption: {exact: true},
          },
          {
            name: 'streams',
            text: 'streams',
            routerLink: '/admin/streams',
            linkOption: {exact: true},
          },
          {
            name: 'statistics',
            text: 'statistics',
            routerLink: '/admin/statistics',
            linkOption: {exact: true},
          },
          {
            name: 'traffback-list',
            text: 'Traffic back list',
            routerLink: '/admin//traffback/list',
            linkOption: {exact: true},
          },
          {
            name: 'postback-list',
            text: 'Postback list',
            routerLink: '/admin/postback/list',
            linkOption: {exact: true}
          },

          {
            name: 'finance',
            text: 'finance',
            routerLink: '/admin/finance',
            linkOption: {exact: true},
          }
        ]
      }
    ];
  }
}
