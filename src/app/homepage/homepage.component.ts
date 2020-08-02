import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";

import { User } from "../models/user.model";

@Component({
  selector: "am-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  @Select(state => state.user.user) user: Observable<User>;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToStandings(): void {
    this.router.navigate(["fantasy/standings"]);
  }

  goToAdvent(): void {
    this.router.navigate(["advent"]);
  }
}
