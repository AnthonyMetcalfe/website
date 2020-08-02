import { Action, State, StateContext } from "@ngxs/store";

import produce from "immer";

import { FantasyStateModel } from "./fantasy.model";
import { FantasyService } from "../fantasy.service";
import { LoadFantasyInformation } from "./fantasy.action";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import moment from "moment";
import { OldUser } from "../models/old-user.model";

@State<FantasyStateModel>({
  name: "fantasy",
  defaults: {
    rosters: null,
    users: null,
    league: null,
    players: null,
    week: null,
    isMidWeek: false,
    userDict: null
  }
})
export class FantasyState {
  constructor(private fantasyService: FantasyService) {}

  @Action(LoadFantasyInformation)
  loadFantasyInformation(
    ctx: StateContext<FantasyStateModel>,
    action: LoadFantasyInformation
  ) {
    return combineLatest([
      this.fantasyService.getPlayers(),
      this.fantasyService.getRosters(),
      this.fantasyService.getUsers(),
      this.fantasyService.getLeague()
    ]).pipe(
      map(([players, rosters, users, league]) => {
        const userDict: Map<number, OldUser> = new Map<number, OldUser>();
        // It's Thursday-Monday.
        const midWeekFlag = moment().day() >= 4 || moment().day() <= 1;
        const weekNumber =
          rosters != null && rosters.length > 0 && rosters[0].settings
            ? rosters[0].settings.wins +
              rosters[0].settings.losses +
              rosters[0].settings.ties +
              1
            : 0;

        rosters.forEach(
          roster =>
            (userDict[roster.roster_id] = users.find(
              user => user.user_id === roster.owner_id
            ))
        );
        ctx.setState(
          produce(store => {
            store.players = players;
            store.users = users;
            store.league = league;
            store.rosters = rosters;
            store.week = weekNumber;
            store.isMidWeek = midWeekFlag;
            store.userDict = userDict;
          })
        );
      })
    );
  }
}
