import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Roster } from '../models/roster.model';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  rosters: Observable<Roster[]>;
  rostersUrl = 'https://api.sleeper.app/v1/league/468987145315414016/rosters';
  usersUrl = 'https://api.sleeper.app/v1/league/468987145315414016/users';
  users: Observable<User[]>;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.users = this.http.get(this.usersUrl).pipe(
      take(1),
      tap(x => console.log(x)),
      map((data: string) => JSON.parse(JSON.stringify(data)) as User[])
    );

    this.rosters = this.http.get(this.rostersUrl).pipe(
      take(1),
      tap(x => console.log(x)),
      map((data: string) => JSON.parse(JSON.stringify(data)) as Roster[])
    );

    // combineLatest([this.users, this.rosters]).pipe(
    //   switchMap(([users, rosters]) => console.log(users, rosters))
    // );
  }
}
