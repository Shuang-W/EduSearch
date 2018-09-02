import { ChangeDetectorRef, NgModule, Component, OnInit } from '@angular/core';
import { AuthService, User } from '../core/auth.service';
import { RestApiService } from 'src/app/core/rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpeechRecognizerService } from '../core/services/speech-recognizer.service';

import { SpeechNotification } from '../core/model/speech-notification';
import { SpeechError } from '../core/model/speech-error';
import { ActionContext } from '../core/model/strategy/action-context';

@Component({
  selector: 'app-searchResult-page',
  templateUrl: './searchResult-page.component.html',
  styleUrls: ['./searchResult-page.component.css']
})
export class SearchResultPageComponent implements OnInit {

  searchKey: string = '';
  searchRange: string;
  searchResult = [];

  finalTranscript: string = '';
  recognizing: boolean = false;
  notification: string;
  languages: string[] =  ['en-US', 'es-ES'];
  currentLanguage: string;
  actionContext: ActionContext = new ActionContext();
  audio = new Audio();

  constructor(public auth: AuthService, 
    public restapi: RestApiService,
    private route: ActivatedRoute, 
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService) {
    this.route.queryParams.subscribe(params => {
      this.searchKey = params['key'];
      this.searchRange = params['filter'];
    });
  }

  ngOnInit() {
    this.search(this.searchKey, this.searchRange);
    this.currentLanguage = this.languages[0];
    this.speechRecognizer.initialize(this.currentLanguage);
    this.initRecognition();
    this.notification = null;
  }

  viewFile(user, fileName) {
    this.restapi.getFile(user, fileName);
  }

  searchButtonClick(searchData) {
    const checkedBox = searchData[1];
    let value = searchData[0];
    if (value === '') {
      alert('please enter some value before searching.');
    } else {
      // redirect page
      while (value.includes(' ')) {
        value = value.replace(' ', '+');
      }

      if (checkedBox[0] === true) {
        this.searchRange = 'all'
      } else if (checkedBox[1] === true) {
        this.searchRange = 'professor';
      } else if (checkedBox[2] === true) {
        this.searchRange = 'student';
      }
      this.router.navigateByUrl('/searchresult?key=' + value + '&filter=' + this.searchRange);

      
    }
  }

  search(searchKey, searchRange) {
    (<HTMLInputElement>document.getElementById('searchBar')).defaultValue = searchKey;
    this.restapi.searchRequest(searchKey, searchRange).subscribe(
      data => {
        this.searchResult = [];
        for (let result of data['results']) {
          this.searchResult.push({ "filename": result['file'].split('/')[1], "id": result['file'].split('/')[0], "user": result['user'], "date": result['date'] });
        }
      }
    );
  }
  private initRecognition() {
    this.speechRecognizer.onStart()
      .subscribe(data => {
        this.recognizing = true;
        this.notification = 'I\'m listening...';
        this.detectChanges();
      });

    this.speechRecognizer.onEnd()
      .subscribe(data => {
        this.recognizing = false;
        this.notification = null;
        this.detectChanges();
      });

    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
        const message = data.content.trim();
        if (data.info === 'final_transcript' && message.length > 0) {
          this.searchKey = `${this.searchKey}\n${message}`;
          this.actionContext.processMessage(message, this.currentLanguage);
          this.detectChanges();
          this.actionContext.runAction(message, this.currentLanguage);
        }
      });

    this.speechRecognizer.onError()
      .subscribe(data => {
        switch (data.error) {
          case SpeechError.BLOCKED:
          case SpeechError.NOT_ALLOWED:
            this.notification = `Cannot run the demo.
            Your browser is not authorized to access your microphone. Verify that your browser has access to your microphone and try again.
            `
            break;
          case SpeechError.NO_SPEECH:
            this.notification = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.NO_MICROPHONE:
            this.notification = `Microphone is not available. Plese verify the connection of your microphone and try again.`
            break;
          default:
            this.notification = null;
            break;
        }
        this.recognizing = false;
        this.detectChanges();
      });
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }

  startButton(event) {
    if (this.recognizing) {
      this.audio.src = "../../assets/sound/voice_deactivated.mp3"
      this.audio.play();
      this.speechRecognizer.stop();
      return;
    }
    this.audio.src = "../../assets/sound/voice_activated.mp3"
    this.audio.play();
    const inpObj = document.getElementById('searchBar');
    let value = (<HTMLInputElement>inpObj).value;
    this.searchKey = value;
    this.speechRecognizer.start(event.timeStamp);
  }
}
