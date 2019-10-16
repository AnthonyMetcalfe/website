import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of, from } from 'rxjs';
import {
  map,
  tap,
  take,
  switchMap,
  concatMap,
  shareReplay
} from 'rxjs/operators';
import { User } from '../models/user.model';
import { Roster } from '../models/roster.model';
import { TeamMatchup } from '../models/team-matchup';
import { Owner } from '../models/owner.model';
import _ from 'lodash';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  completedWeeks: number[];
  rosters: Observable<Roster[]>;
  rostersUrl = 'https://api.sleeper.app/v1/league/468987145315414016/rosters';
  usersUrl = 'https://api.sleeper.app/v1/league/468987145315414016/users';
  matchupsUrl =
    'https://api.sleeper.app/v1/league/468987145315414016/matchups/';
  users: Observable<User[]>;
  userDict: Map<number, User> = new Map<number, User>();
  loading = true;

  weeklyStandings: Owner[][] = [];

  owners: Observable<Owner[]>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.users = this.http.get(this.usersUrl).pipe(
      take(1),
      map((data: string) => JSON.parse(JSON.stringify(data)) as User[])
    );

    this.rosters = this.http.get(this.rostersUrl).pipe(
      take(1),
      map((data: string) => JSON.parse(JSON.stringify(data)) as Roster[])
    );

    this.owners = combineLatest([this.users, this.rosters]).pipe(
      tap(([users, rosters]) => {
        rosters.forEach(
          roster =>
            (this.userDict[roster.roster_id] = users.find(
              user => user.user_id === roster.owner_id
            ))
        );

        this.completedWeeks = _.range(
          1,
          rosters[0].settings.wins +
            rosters[0].settings.losses +
            rosters[0].settings.ties +
            1
        );
      }),
      switchMap(() => {
        const standings: Owner[] = [];

        let loadingCounter = 0;

        this.loading = true;

        return from(this.completedWeeks).pipe(
          concatMap(weekNumber => this.http.get(this.matchupsUrl + weekNumber)),
          map(
            (data: string) => JSON.parse(JSON.stringify(data)) as TeamMatchup[]
          ),
          map(teams => teams.sort((a, b) => b.points - a.points)),
          map((teams: TeamMatchup[]) => {
            let j = 0;
            teams.forEach((team: TeamMatchup) => {
              const userName = this.userDict[team.roster_id].display_name;
              if (standings.find(owner => owner.user === userName) != null) {
                standings.find(owner => owner.user === userName).wins += 9 - j;
                standings.find(owner => owner.user === userName).losses += j;
                standings.find(owner => owner.user === userName).ties += 0;
                standings.find(
                  owner => owner.user === userName
                ).name = this.userDict[team.roster_id].metadata.team_name;
              } else {
                standings.push({
                  user: this.userDict[team.roster_id].display_name,
                  wins: 9 - j,
                  losses: j,
                  ties: 0,
                  name: this.userDict[team.roster_id].metadata.team_name
                });
              }
              j += 1;
            });

            const previousWeek = this.weeklyStandings[
              this.weeklyStandings.length - 1
            ];

            const sortedStandings = [
              ...standings
                .sort((a, b) =>
                  a.wins > b.wins ? -1 : a.wins < b.wins ? 1 : 0
                )
                .map((owner, index) => {
                  return {
                    ...owner,
                    weeklyChange:
                      previousWeek != null
                        ? previousWeek.findIndex(o => o.user === owner.user) -
                            index !==
                          0
                          ? previousWeek.findIndex(o => o.user === owner.user) -
                            index
                          : null
                        : null
                  };
                })
            ];

            this.weeklyStandings.push(
              JSON.parse(JSON.stringify(sortedStandings))
            );
            console.log(sortedStandings);

            if (loadingCounter >= this.completedWeeks.length - 1) {
              this.loading = false;
            }

            loadingCounter += 1;

            return sortedStandings;
          })
        );
      })
    );
  }
}
