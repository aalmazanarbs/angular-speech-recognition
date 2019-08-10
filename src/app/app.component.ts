import { Component, OnInit, NgZone } from '@angular/core';
import { timer, BehaviorSubject, NEVER } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    public message: string;
    public micIcon: string;
    public borderheight: number;

    public readonly $listening: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private speechRecognition: SpeechRecognition;

    constructor(private readonly zone: NgZone) {}

    public ngOnInit(): void {
        try {
            this.speechRecognition = this.getSpeechRecognition();
            this.speechRecognition.onstart = (_) => this.zone.run(() => this.micListening());
            this.speechRecognition.onerror = (error: SpeechRecognitionError) => this.zone.run(() => this.speechRecognitionError(error));
            this.speechRecognition.onresult = (event: SpeechRecognitionEvent) => this.zone.run(() => this.speechRecognitionResult(event));
            this.micStop();

            this.$listening
                .pipe(switchMap((listening: boolean) => listening ? timer(0, 400) : NEVER))
                .subscribe(() => this.randomizeMicButtonBorderheight(0.6, 1));
        } catch (error) {
            this.micNotAvailable(error.message);
        }
    }

    public startSpeechRecognition(): void {
        if (!this.$listening.getValue()) {
            this.speechRecognition.start();
        }
    }

    private getSpeechRecognition(): SpeechRecognition {
        // tslint:disable-next-line:max-line-length no-string-literal
        const SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition'] || window['mozSpeechRecognition'] || window['msSpeechRecognition'] || window['oSpeechRecognition'];
        if (SpeechRecognition !== undefined) {
            return new SpeechRecognition();
        }

        throw new Error('Your browser does not support speech recognition');
    }

    private randomizeMicButtonBorderheight(min: number, max: number): void {
        this.borderheight = Math.random() * (max - min) + min;
    }

    private speechRecognitionError(error: SpeechRecognitionError): void {
        if (error.error === 'no-speech') {
            this.micStop();
        } else {
            this.micNotAvailable('You don\'t have microphone or don\'t have granted permission');
        }
    }

    private speechRecognitionResult(event: SpeechRecognitionEvent): void {
        this.micStop();
        this.message = event.results[event.resultIndex][0].transcript;
    }

    private micListening(): void {
        this.message = 'Listening...';
        this.micIcon = 'mic';
        this.$listening.next(true);
    }

    private micStop(): void {
        this.message = 'Click microphone button and talk';
        this.micIcon = 'mic_none';
        this.borderheight = 0;
        this.$listening.next(false);
    }

    private micNotAvailable(message: string): void {
        this.message = message;
        this.micIcon = 'mic_off';
        this.borderheight = 0;
        this.$listening.next(false);
    }
}
