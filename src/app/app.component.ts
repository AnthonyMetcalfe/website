import { Component, OnInit } from "@angular/core";
import { MediaObserver } from "@angular/flex-layout";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  isOliviaChristmasPage = false;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.navigationListener();
  }

  private navigationListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (
          !this.isOliviaChristmasPage &&
          event.url.startsWith("/merry-christmas-olivia")
        ) {
          this.isOliviaChristmasPage = true;
        } else if (this.isOliviaChristmasPage) {
          this.isOliviaChristmasPage = false;
        }
      });
  }
}
