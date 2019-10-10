import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Roster } from '../models/roster.model';
import { TeamMatchup } from '../models/team-matchup';
import { Owner } from '../models/owner.model';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  rosters: Observable<Roster[]>;
  rostersUrl = 'https://api.sleeper.app/v1/league/468987145315414016/rosters';
  usersUrl = 'https://api.sleeper.app/v1/league/468987145315414016/users';
  matchupsUrl =
    'https://api.sleeper.app/v1/league/468987145315414016/matchups/';
  users: Observable<User[]>;
  weekOneMatchups: Observable<any>;
  userDict: Map<number, User> = new Map<number, User>();

  owners: Owner[] = [];

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

    combineLatest([this.users, this.rosters]).subscribe(([users, rosters]) => {
      rosters.forEach(
        roster =>
          (this.userDict[roster.roster_id] = users.find(
            user => user.user_id === roster.owner_id
          ))
      );
    });

    this.weekOneMatchups = this.http.get(this.matchupsUrl + 1).pipe(
      take(1),
      map((data: string) => JSON.parse(JSON.stringify(data)) as TeamMatchup[]),
      map(teams => teams.sort((a, b) => b.points - a.points)),
      tap(teams => {
        console.log(teams);
        let i = 0;
        teams.forEach((team: TeamMatchup) => {
          this.owners.push({
            user: this.userDict[team.roster_id].display_name,
            wins: 9 - i,
            losses: i,
            ties: 0,
            name: this.userDict[team.roster_id].metadata.team_name
          });
          i += 1;
        });
      }),
      tap(x => console.log(this.owners))
    );
  }
}
