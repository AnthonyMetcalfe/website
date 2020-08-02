import { Component, OnInit } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { User } from "src/app/models/user.model";

@Component({
  selector: "am-mastermind-navbar",
  templateUrl: "./mastermind.component.html",
  styleUrls: ["./mastermind.component.scss"]
})
export class MastermindNavBarComponent implements OnInit {
  @Select(state => state.user.user) user: Observable<User>;
  constructor() {}

  ngOnInit() {}
}
