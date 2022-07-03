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
