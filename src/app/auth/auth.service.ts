// src/app/auth/auth.service.ts
import { Injectable } from "@angular/core";
import { LocalStorageService } from "ngx-webstorage";
@Injectable()
export class AuthService {
  constructor(private localStorageService: LocalStorageService) {}
  // ...
  public isAuthenticated(): boolean {
    return this.localStorageService.retrieve("token") != null;
  }

  public getAuthToken(): string {
    return this.localStorageService.retrieve("token");
  }

  public storeAuthToken(token: string): void {
    this.localStorageService.store("token", token);
  }

  public clearAuthToken(): void {
    this.localStorageService.clear("token");
  }
}
