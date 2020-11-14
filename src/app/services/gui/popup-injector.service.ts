import {Component, ComponentFactoryResolver, ComponentRef, Inject, Injectable, NgModuleRef, Type} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupInjectorService {

  private rootViewContainer;

  constructor(@Inject(ComponentFactoryResolver) private factoryResolver) {
  }

  public setViewVontainer(viewContainerRef): void {
    this.rootViewContainer = viewContainerRef;
  }

  public addComponent(componentType: Type<any>): ComponentRef<any> {
    const factory = this.factoryResolver.resolveComponentFactory(componentType);

    let component: ComponentRef<any> = factory
      .create(this.rootViewContainer.injector);

    this.rootViewContainer.insert(component.hostView);

    return component;
  }
}
