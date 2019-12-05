import { Component, OnInit } from "@angular/core";
import _ from "lodash";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { MediaObserver } from "@angular/flex-layout";
import { filter, map } from "rxjs/operators";
import { Router } from "@angular/router";

@Component({
  selector: "app-advent",
  templateUrl: "./advent.component.html",
  styleUrls: ["./advent.component.scss"]
})
export class AdventComponent implements OnInit {
  days: number[];
  date: number;
  isMobile = false;

  constructor(
    private dialog: MatDialog,
    private mediaObserver: MediaObserver,
    private router: Router
  ) {}

  openImage(day: number) {
    if (this.date >= day) {
      this.router.navigate(["advent/", day]);
    }
  }

  ngOnInit() {
    this.days = [];
    this.date = moment().month() === 11 ? moment().date() : 0;

    for (let i = 1; i < 25; i++) {
      this.days.push(i);
    }
  }
}
