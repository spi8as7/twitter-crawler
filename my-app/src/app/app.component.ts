import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  display = false;
  constructor(private appService: AppService) {}

  title = 'my-app';

  userForm = new FormGroup({
    keyword: new FormControl('', Validators.nullValidator && Validators.required),
    start_time: new FormControl('', Validators.nullValidator && Validators.required),
    end_time: new FormControl('', Validators.nullValidator && Validators.required)
  });

  users: any[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();

  onSubmit() {
    const current_time = new Date();
    let time_limit = new Date();
    time_limit.setDate(current_time.getDate() - 7);
    let start_time = this.userForm.value.start_time;
    start_time.setHours(current_time.getHours());
    start_time.setMinutes(current_time.getMinutes());
    start_time.setSeconds(current_time.getSeconds());
    start_time.setMilliseconds(current_time.getMilliseconds());
    let end_time = this.userForm.value.end_time;
    end_time.setHours(current_time.getHours());
    end_time.setMinutes(current_time.getMinutes());
    end_time.setSeconds(current_time.getSeconds());
    end_time.setMilliseconds(current_time.getMilliseconds());

    if ((start_time > current_time) || (end_time > current_time)) {
      alert("Can't provide data for future date");
      this.userForm.reset();
      return; 
    }

    if (start_time > end_time) {
      alert("Starting time should be greater than the ending time");
      this.userForm.reset();
      return;
    }

    if((start_time < time_limit) || (end_time < time_limit)) {
      alert("Twitter API can provide data only for the last 7 days");
      this.userForm.reset();
      return;
    }
    
    this.userForm.patchValue(
      { start_time:this.userForm.value.start_time.toISOString(),
        end_time:this.userForm.value.end_time.toISOString() 
      });

    this.appService.addUser(this.userForm.value).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.userForm.reset();
      this.getAllUsers();
    });
  }

  getAllUsers() {
    this.appService.getUsers().pipe(takeUntil(this.destroy$)).subscribe((users: any[]) => {
        this.users = users;
    });
  }

  onPress() {
    this.display = !this.display;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
