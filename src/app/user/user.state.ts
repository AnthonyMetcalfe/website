import { Action, State, StateContext } from "@ngxs/store";
import produce from "immer";
import { tap } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { User } from "../models/user.model";
import { UserService } from "../user.service";

import { ClearUser, LoadUser, LoadUsernames } from "./user.action";
import { UserStateModel } from "./user.model";

@State<UserStateModel>({
  name: "user",
  defaults: {
    user: null,
    usernames: null
  }
})
export class UserState {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Action(LoadUser)
  loadUser(ctx: StateContext<UserStateModel>, action: LoadUser) {
    if (this.authService.isAuthenticated()) {
      return this.userService.getMe().pipe(
        tap((user: User) => {
          ctx.setState(
            produce(store => {
              store.user = user;
            })
          );
        })
      );
    }
  }

  @Action(LoadUsernames)
  loadUsernames(ctx: StateContext<UserStateModel>, action: LoadUsernames) {
    return this.userService.getUsernames().pipe(
      tap((usernames: string[]) => {
        ctx.setState(
          produce(store => {
            store.usernames = usernames;
          })
        );
      })
    );
  }

  @Action(ClearUser)
  clearUser(ctx: StateContext<UserStateModel>, action: ClearUser) {
    ctx.setState(
      produce(store => {
        store.user = null;
      })
    );
  }
}
