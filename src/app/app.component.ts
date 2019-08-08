import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { tap, takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    shadowleft: any = '-69px';
    shadowtop: any = '-68px';
    message = 'angular-speech-recognition sahdkjashjdkashkj ahskd askhajkshdk asdaskaskaskjskhakshkasjh kjashkjaskhaskjdakjhkd';
    borderheight = 0;
    listening = true;

    ngOnInit(): void {
        timer(0, 400)
            .pipe(takeWhile(() => this.listening === true))
            .subscribe(() => this.borderheight = this.randomize(0.6, 1));
    }

    randomize(min, max) {
        let x;
        x = (Math.random() * (max - min) + min);
        return x;
    }
}
