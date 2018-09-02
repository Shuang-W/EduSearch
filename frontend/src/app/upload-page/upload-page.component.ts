import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../core/auth.service';
import { RestApiService } from '../core/rest-api.service';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css']
})
export class UploadPageComponent implements OnInit {

  message1: string;
  message2: string;
  hint = 'Choose Your Files...';
  files_onReady = [];
  files_names = [];

  constructor(public auth: AuthService, public restapi: RestApiService) { }

  ngOnInit() {}

  onSubmit(form) {
    if (form.value.length <= 5) {
      this.message2 = 'Invalid link';
      form.value = '';
      return null;
    }

    this.auth.user.subscribe(user => {
      this.restapi.postCrawler(user['uid'], form.value).subscribe(
        (response) => (this.message2 = 'Link successfully added'),
        (error) => {
          if (error['status'] === 200) {
            this.message2 = 'Link successfully added';
          } else {
            this.message2 = 'There was an issue adding link';
          }
        }
      );

      form.value = '';
    });

  }

  startUpload() {
    if (this.files_onReady.length === 0) {
      this.message1 = 'Please choose your files.';
    } else {
      this.message1 = '';
    }
    this.auth.user.subscribe(user => {
      this.files_onReady.forEach((item, index) => {
        this.restapi.uploadFile(user['uid'], this.files_names[index], item).subscribe(res => {
          console.log(res);
        },
        (error) => {
            if (error['status'] === 200) {
              this.message1 = 'File successfully uploaded';
            } else {
              this.message1 = 'There was an issue uploading file';
            }
          }
        );
      });
    });
  }

  onFilesAdded(event) {
    this.files_onReady = [];
    this.files_names = [];
    this.hint = '';
    let i = 0;
    while (event.target.files[i] != null) {
      let selectedFile = <File>event.target.files[i];
      const fd = new FormData();
      fd.append('file', selectedFile, selectedFile.name);
      this.files_onReady.push(fd);
      this.files_names.push(selectedFile.name);
      this.hint += selectedFile.name + ', ';
      i++;
    }
    this.hint += '...';
  }
}
