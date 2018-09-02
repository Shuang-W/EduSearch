import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService, User } from '../core/auth.service';
import { RestApiService } from '../core/rest-api.service';
import { Chart } from 'chart.js';
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, AfterViewInit {

  chart = [];
  files = [];

  constructor(public auth: AuthService, public restapi: RestApiService, private router: Router) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.auth.user.subscribe(user => {
      this.createChart(user);
      this.showFiles(user);
    });
  }

  /*
  * Send user data to be updated. User data is received as an array and then parsed
  */
  updateUserInfo(userData) {
    const checkedBox = userData[2];
    let userType: string;

    if (checkedBox[0] === true) {
      userType = 'professor';
    } else if (checkedBox[1] === true) {
      userType = 'student';
    }

    const userObservable = this.auth.user.subscribe(user => {
      const userUpdated: User = {
        uid: user.uid,
        displayName: userData[0],
        email: userData[1],
        photoURL: user.photoURL,
        userType: userType
      };

      this.auth.addAndChangeUserData(user, userUpdated);
      userObservable.unsubscribe();
    });
  }

  createChart(user) {
    this.restapi.chartData(user['uid']).subscribe(data => {
      const file_types: Array<string> = [];
      const number_file_types: Array<number> = [];

      for (let file in data['file']) {
        file_types.push(file);
        number_file_types.push(data['file'][file]);
      }

      this.chart = new Chart('canvas', {
        type: 'pie',
        data: {
          labels: file_types,
          datasets: [
            {
              label: 'Types of Files',
              backgroundColor: ['#3cb44b', '#ffe119', '#0082c8', '#f58231', '#911eb4'],
              borderColor: '#8ECDC9',
              borderWidth: 1,
              data: number_file_types,
              fill: false
            },
          ]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'No. of different types of files uploaded'
          },
        }
      });
    });
  }

  showFiles(user){
    this.restapi.getUserFilenames(user['uid']).subscribe(data => {
      this.files = data['files'];
    });
  }

  deleteFile(fileName) {
    this.auth.user.subscribe(user => {
      this.restapi.deleteUserFilename(user['uid'], fileName).subscribe(
        (response) => {},
        (error) => {
          this.restapi.getUserFilenames(user['uid']).subscribe(data => {
            this.files = data['files'];
          });
        }
      );
    });
  }

  viewFile(fileName) {
    this.auth.user.subscribe(user => {
      this.restapi.getFile(user['uid'], fileName);
    });
  }

}
