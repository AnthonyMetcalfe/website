import { Component, OnInit, Inject } from "@angular/core";
import _ from "lodash";
import { ActivatedRoute } from "@angular/router";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-olivia",
  templateUrl: "./olivia.component.html",
  styleUrls: ["./olivia.component.scss"]
})
export class OliviaComponent implements OnInit {
  private onDestroy = new Subject();

  constructor(private dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit() {}
}
