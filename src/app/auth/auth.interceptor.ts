import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LocalStorageService } from "ngx-webstorage";
import { from, Observable, of } from "rxjs";
import { concatMap } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.toLowerCase().endsWith("api-token-auth/")) {
      // TODO FIX THIS GARBAGE
      return of(this.authService.getAuthToken()).pipe(
        concatMap(accessToken => {
          if (accessToken) {
            let headers = req.headers.set(
              "Authorization",
              "Token " + accessToken
            );

            return next.handle(req.clone({ headers, responseType: "text" }));
          } else {
            return next.handle(req.clone({ responseType: "text" }));
          }
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
