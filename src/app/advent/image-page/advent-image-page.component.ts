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
        "Much like Olivia is going to drop that bomb on Mario-me, I'm dropping the premise that each day will correlate to the number of the day. Instead, I'll have poorly photoshoped pictures of me for each day."
    },
    6: {
      title: "Meow",
      imageText: "This one is pretty bad."
    },
    7: {
      title: "Winter is Coming (after naptime).",
      imageText:
        "It's kind of hard to tell, but if you look very closely you will see that one of these horseriders doesn't belong."
    },
    8: {
      title: "I'm sorry",
      imageText:
        "The best part about looking like that as a child is being able to poorly photoshop it onto Justin Bieber's body."
    },
    9: {
      title: "Rockstar Olivia",
      imageText:
        "After winning 2005's American Idol, Olivia was able to perform on stage next to Katy Perry. She performed a stunning rendition of Hotel California, Wonderwall, and Twinkle Twinkle Little Star"
    },
    10: {
      title: "This picture is worth ~$2.3 million",
      imageText:
        "It's a little known fact that Billy the Kid was an avid croquet player (this is a real photo, one of two confirmed Billy the kid photos in existence). Even less known were two of the members of his posse, Anthony the child and Olivia the youngster. Anthony and Olivia were killed by Billy shortly after this image was taken due to a thorough croquet shellacking."
    },
    11: {
      title: "Jesus and his 13 disciples.",
      imageText:
        'The unidentified man (right, seen eating corn) was kicked out shortly after for asking whether Jesus\'s body was "gluten free", or at least made with italian flour.'
    },
    12: {
      title: "A shy conehead",
      imageText:
        "If gemoetry class taught me anything, it's that Olivia's head has a volume of 1/3 * pi * r^2 * h. Just kidding, I had to google that. Some argue that it's actually a normal head just with a bun of hair doing a great job of acting, but I'm not a conspiracy theorist."
    },
    13: {
      title: "Eye Spy",
      imageText:
        "One of these roller derby competitors does not belong. Can you spot him?"
    },
    14: {
      title: "Pi-irate",
      imageText:
        "What do you get when you try and calculate the circumference of a circle and get really angry with the constant you use to do so? See above for the answer."
    },
    15: {
      title: "Four Weddings and an Umbrella",
      imageText:
        "Sometimes, all you need to find true love is 3 weddings, a funeral, your own failed wedding, and a guy decked out in an Eagan High School tennis uniform holding an umbrella. My apologies to anyone who just got the plot to the 1994 movie Four Weddings and a Funeral ruined for them."
    },
    16: {
      title: "Ray Bans: BOGO",
      imageText:
        "This has to be the lowest-effort one yet. We're only 8 days to go. Almost at the finish line!"
    },
    17: {
      title: "Mount Everest Segway Tours: $50",
      imageText:
        "Some people choose to struggle their way up the mountain for a sense of accomplishment. Others take the more touristy route and rent a segway. Shown attire not recommended. Don't try this at home (mostly because if you did, you'd be nowhere near Mount Everest, and frankly you'd look a bit embarrassing.)"
    },
    18: {
      title: "Where's the Bunny?",
      imageText: "That's a really bad \"Bugs Bunny\" joke. You're welcome."
    },
    19: {
      title: "Blue Steel",
      imageText:
        "I'm pretty sure there's a lot more to life than being really, really, ridiculously good looking. And I plan on finding out what that is."
    },
    20: {
      title: "Happy Star Wars Day!",
      imageText: "This one was a bit FORCEd, am I right? Funny, I am."
    },
    21: {
      title: "Where's My Car?",
      imageText: "I knew I should have pinned my parking spot in Google Maps."
    },
    22: {
      title: "Rata-twenty-two-uille",
      imageText:
        "Alfredo Linguini's neck is WAY too small to make any photoshop look realistic. Also, if you have a problem with that pun, please email me at howDareYou@anthonymetcalfe.com."
    },
    23: {
      title: "Happy Hannukah!",
      imageText:
        "That doesn't relate to the image, but I have to respect all (one) of my Jewish viewers. Alternative title: Something about Olivia looking peach and Nixon being impeached, etc., etc. Don't judge me, I'm on break."
    },
    24: {
      title: "Merry Christmas Eve!",
      imageText:
        "My original idea for today was to really spend time on making the image and have my faces seemlessly blend in to the Mount Rushmore. But then I realized that would take a lot of work and so here we are."
    }
  };

  private onDestroy = new Subject();

  constructor(private dialog: MatDialog, private route: ActivatedRoute) {}

  openExplanation() {
    // const date = moment().month() === 11 ? moment().date() : 0;
    // if (date >= this.day) {
    this.dialog.open(AdventImageExplainerDialogComponent, {
      data: this.imageDatas[this.day]
    });
    // }
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
        // const date = moment().month() === 11 ? moment().date() : 0;
        // if (date >= adventDay) {
        this.day = adventDay;
        this.url = "assets/advent_img/advent_" + adventDay + ".jpg";
        // } else {
        //   this.day = 1000;
        //   this.url = "assets/advent_img/too_early.jpg";
        // }
      });
  }
}
