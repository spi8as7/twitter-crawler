import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AppService } from './app.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Listener } from 'selenium-webdriver';

@Component({
  selector: 'app-display-board',
  templateUrl: './display-board.component.html',
  styleUrls: ['./display-board.component.css']
})

export class DisplayBoardComponent implements OnInit {

  selectedItem : any;

  constructor(private appService: AppService) { }

  @Input() searches: any[];
  @Output() selectedSearchEvent = new EventEmitter<string>();

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.appService.getSearches().pipe(takeUntil(this.destroy$)).subscribe((searches: any[]) => {
      this.searches = searches;
    });
  }

  selectedSearch(value: string) {
    let keywords = document.getElementById("keywords").getElementsByTagName("li");
    for (let i = 0; i < keywords.length ; i++ ) {
      keywords[i].style.backgroundColor = "white";
      if (keywords[i].id.toString() == value) {
        keywords[i].style.backgroundColor = "#b7d7e8";
      }
    }
    this.selectedSearchEvent.emit(value);
  }

}
