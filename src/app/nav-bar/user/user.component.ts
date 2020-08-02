import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { LoginComponent } from "src/app/login/login.component";
import { User } from "src/app/models/user.model";
import { UserService } from "src/app/user.service";
import { ClearUser, LoadUser, LoadUsernames } from "src/app/user/user.action";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "am-user-navbar",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserNavBarComponent implements OnInit {
  loggedIn = false;
  @Select(state => state.user.user) user: Observable<User>;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store,
    private userService: UserService
  ) {}

  emailMyself() {
    this.userService
      .emailMyself()
      .pipe(take(1))
      .subscribe(success => {
        if (success) {
          this.snackBar.open("Email Sent!", "Close", { duration: 3000 });
        }
      });
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: null,
      width: "350px"
    });
  }

  logout() {
    this.authService.clearAuthToken();
    this.store.dispatch(new ClearUser());
    this.router.navigate([""]);
  }

  ngOnInit() {
    this.store.dispatch(new LoadUser());
    this.store.dispatch(new LoadUsernames());
  }
}
