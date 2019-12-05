import { Component, OnInit, Inject } from "@angular/core";
import _ from "lodash";
import { ActivatedRoute } from "@angular/router";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { AdventImageExplainerDialogComponent } from "../image-explainer-dialog/advent-image-explainer-dialog.component";

@Component({
  selector: "app-advent-image-page",
  templateUrl: "./advent-image-page.component.html",
  styleUrls: ["./advent-image-page.component.scss"]
})
export class AdventImagePageComponent implements OnInit {
  url: string;
  day: number;
  imageDatas = {
    1: {
      title: "Lil' $1 Anthony",
      imageText:
        "Please note: this is not legal tender. Don't print it off and use it at the farmer's market while trying to buy a basket of cherry tomatoes for $3.50. It won't work, and quite frankly you'll get some weird looks doing so."
    },
    2: {
      title: "2% Milk, 98% Anthony",
      imageText: "Straight from my utters to your screen. Drink responsibly."
    },
    3: {
      title: "The Christmas Three",
      imageText:
        "It's a story as old as time: you come up with a decent pun for the 3rd day of your advent calendar and then you spend way too much time filling in the tree with tiny 3's because you're too stubborn to go back and increase their size."
    },
    4: {
      title: "Avoid the Santa Trap",
      imageText:
        'You may be asking yourself "Is that Santa and a reindeer at top golf?" or "It\'s only day 4, is that really the best he came up with?"...The answer to both of those questions is "Yes."'
    },
    5: {
      title: "It's a me, Mario!",
      imageText:
        "Much like Olivia is going to drop that bomb on Mario-me, I'm dropping the premise that each day will correlate to the number in favor of poorly photoshoped pictures of me."
    }
  };

  private onDestroy = new Subject();

  constructor(private dialog: MatDialog, private route: ActivatedRoute) {}

  openExplanation() {
    const date = moment().month() === 11 ? moment().date() : 0;
    if (date >= this.day) {
      this.dialog.open(AdventImageExplainerDialogComponent, {
        data: this.imageDatas[this.day]
      });
    }
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        distinctUntilChanged(),
        map(params =>
          params.get("adventDay") == null ? null : +params.get("adventDay")
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe(adventDay => {
        const date = moment().month() === 11 ? moment().date() : 0;
        if (date >= adventDay) {
          this.day = adventDay;
          this.url = "assets/advent_img/advent_" + adventDay + ".jpg";
        } else {
          this.day = 1000;
          this.url = "assets/advent_img/too_early.jpg";
        }
      });
  }
}
