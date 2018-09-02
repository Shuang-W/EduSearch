import { Router} from '@angular/router';
import { Location} from '@angular/common';

import { AuthService } from '../core/auth.service';
import { RestApiService } from '../core/rest-api.service';

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpeechRecognizerService } from '../core/services/speech-recognizer.service';

import { SpeechNotification } from '../core/model/speech-notification';
import { SpeechError } from '../core/model/speech-error';
import { ActionContext } from '../core/model/strategy/action-context';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  
  finalTranscript: string = '';
  recognizing: boolean = false;
  notification: string;
  languages: string[] =  ['en-US', 'es-ES'];
  currentLanguage: string;
  actionContext: ActionContext = new ActionContext();
  audio = new Audio();

  constructor(public auth: AuthService, 
    public restapi: RestApiService, 
    private router: Router, 
    private location: Location,
    private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService) { }

  search() {
    const inpObj = document.getElementById('searchBar');
    let value = (<HTMLInputElement>inpObj).value;
    if (value === '') {
      alert('please enter some value before searching.');
    } else {
      // redirect page
      while (value.includes(' ')) {
        value = value.replace(' ', '+');
      }
      this.router.navigateByUrl('/searchresult?key=' + value + '&filter=all');
    }
  }

  ngOnInit() {
    this.currentLanguage = this.languages[0];
    this.speechRecognizer.initialize(this.currentLanguage);
    this.initRecognition();
    this.notification = null;
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
    this.finalTranscript = value;
    this.speechRecognizer.start(event.timeStamp);
  }

  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
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
          this.finalTranscript = `${this.finalTranscript}\n${message}`;
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

}
