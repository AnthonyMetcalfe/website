import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Select, Store } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { UserService } from "../user.service";
import { LoadUser } from "../user/user.action";

@Component({
  selector: "am-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  form: FormGroup;
  isRegistering = false;
  duplicateUsername = false;
  nonExistantUsername = false;

  @Select(state => state.user.usernames) usernames: Observable<string[]>;

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder,
    private store: Store,
    private userService: UserService
  ) {
    this.form = formBuilder.group({
      firstName: [null, Validators.maxLength(50)],
      lastName: [null],
      email: [null, Validators.required],
      username: [null, Validators.required]
    });
  }

  login(existingUsernames: string[]): void {
    const control = this.form.get("username");

    if (control == null || !control.valid || !control.dirty) {
      return;
    }

    if (!existingUsernames.includes(control.value)) {
      this.form.get("username").setErrors({ Invalid: true });
      this.nonExistantUsername = true;
      return;
    } else {
      this.nonExistantUsername = false;
    }

    this.userService
      .login({
        username: control.value,
        password: "*"
      })
      .subscribe(token => {
        if (token) {
          this.authService.storeAuthToken(token.token);
          this.store.dispatch(new LoadUser());
          this.dialogRef.close();
        }
      });
  }

  register(existingUsernames: string[]): void {
    if (this.form.enabled && this.form.valid) {
      if (existingUsernames.includes(this.form.get("username").value)) {
        this.form.get("username").setErrors({ Invalid: true });
        this.duplicateUsername = true;
        return;
      } else {
        this.duplicateUsername = false;
      }

      this.userService
        .register({
          firstName: this.form.get("firstName").value,
          lastName: this.form.get("lastName").value,
          email: this.form.get("email").value,
          username: this.form.get("username").value,
          password: "*"
        })
        .pipe(take(1))
        .subscribe(token => {
          if (token) {
            this.authService.storeAuthToken(token.token);
            this.store.dispatch(new LoadUser());
            this.dialogRef.close();
          }
        });
    }
  }

  switchToRegistering(): void {
    this.form.markAsUntouched();
    this.nonExistantUsername = false;
    this.isRegistering = true;
  }

  switchToLogin(): void {
    this.form.markAsUntouched();
    this.duplicateUsername = false;
    this.isRegistering = false;
  }
}
