import { Component, OnInit } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { User } from "src/app/models/user.model";

@Component({
  selector: "am-nfl-draft-navbar",
  templateUrl: "./nfl-draft.component.html",
  styleUrls: ["./nfl-draft.component.scss"]
})
export class NFLDraftNavBarComponent implements OnInit {
  @Select(state => state.user.user) user: Observable<User>;
  constructor() {}

  ngOnInit() {}
}
