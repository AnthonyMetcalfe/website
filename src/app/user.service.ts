import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { UserLoginForm } from "./models/user-login-form";
import { User } from "./models/user.model";

@Injectable({
  providedIn: "root"
})
export class UserService {
  // private user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  constructor(private apiService: ApiService) {}

  emailMyself(): Observable<boolean> {
    return this.apiService.post<string, boolean>("users/emailMyself", "hello!");
  }

  getMe(): Observable<User> {
    return this.apiService.get<User>("users/me");
  }

  getUsernames(): Observable<string[]> {
    return this.apiService.get<string[]>("users/usernames");
  }

  login(form: UserLoginForm): Observable<any> {
    return this.apiService.postToExternal<UserLoginForm, any>(
      "api-token-auth/",
      form
    );
  }

  register(registrationObj: any): Observable<any> {
    return this.apiService.post<any, any>("users/register", registrationObj);
  }
}
