import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {ApiModule} from "../api/api.module";
import {RolesCollection} from "../models/role";

@Directive({
  selector: '[hasNotRole]'
})
export class HasNotRoleDirective implements OnInit {

  @Input() hasNotRole: string[];

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

    if (!this.hasNotRole) {
      this.show();
      return;
    }

    let checkResult: boolean = false;

    for (let i = 0, length = this.hasNotRole.length; i < length; i++) {
      if (roles.isInRole(this.hasNotRole[i]))
        checkResult = true;
    }

    if (checkResult) {
      this.hide();
    } else {
      this.show();
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
