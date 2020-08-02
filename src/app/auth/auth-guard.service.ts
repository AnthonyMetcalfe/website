// src/app/auth/auth-guard.service.ts
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CanActivate, Router } from "@angular/router";

import { LoginComponent } from "../login/login.component";

import { AuthService } from "./auth.service";
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    private dialog: MatDialog,
    public router: Router
  ) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.dialog.open(LoginComponent, { data: null, width: "350px" });
      return false;
    }
    return true;
  }
}
