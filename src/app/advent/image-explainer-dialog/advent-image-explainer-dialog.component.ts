import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-advent-image-explainer-dialog",
  templateUrl: "./advent-image-explainer-dialog.component.html"
})
export class AdventImageExplainerDialogComponent {
  imageData: { title: string; imageText: string };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { title: string; imageText: string }
  ) {
    this.imageData = data;
  }
}
