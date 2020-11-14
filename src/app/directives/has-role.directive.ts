import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {ApiModule} from "../api/api.module";
import {RolesCollection} from "../models/role";

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {

  @Input() hasRole: string[];

  private _visible: boolean = false;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {
  }

  ngOnInit(): void {
    this._visible = false;
    let roles: RolesCollection = ApiModule.Roles;

    if (!roles) {
      this.hide();
      return;
    }

    if (!this.hasRole) {
      this.show();
      return;
    }

    let checkResult: boolean = false;

    for (let i = 0, length = this.hasRole.length; i < length; i++) {
      if (roles.isInRole(this.hasRole[i]))
        checkResult = true;
    }

    if (checkResult) {
      this.show();
    } else {
      this.hide();
    }
  }

  private show(): void {
    this._visible = true;
    this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  private hide(): void {
    this._visible = false;
    this.viewContainerRef.clear();
  }
}
