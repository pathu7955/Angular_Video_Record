import { Component, ViewChild, ElementRef } from '@angular/core';

declare var MediaRecorder: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('recordedVideo') recordVideoElementRef: ElementRef | any;
  @ViewChild('video') videoElementRef: ElementRef | any;

  htmlVideoElement: HTMLVideoElement | any;
  recordVideoElement: HTMLVideoElement | any;
  mediaRecorder: any;
  recordedBlobs: Blob[] | any;
  isRecording: boolean = false;
  downloadUrl: string | any;
  stream: MediaStream | any;

  constructor() { }

  ngOnInit() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 360
        }
      })
      .then(stream => {
        this.htmlVideoElement = this.videoElementRef.nativeElement;
        this.recordVideoElement = this.recordVideoElementRef.nativeElement;

        this.stream = stream;
        this.htmlVideoElement.srcObject = this.stream;
      });
  }

  startRecording() {
    this.recordedBlobs = [];
    let options: any = { mimeType: 'video/webm' };

    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.start();
    this.isRecording = !this.isRecording;
    this.onDataAvailableEvent();
    this.onStopRecordingEvent();
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = !this.isRecording;
  }

  playRecording() {
    if (!this.recordedBlobs || !this.recordedBlobs.length) {
      return;
    }
    this.recordVideoElement.play();
  }

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  onStopRecordingEvent() {
    this.mediaRecorder.onstop = (event: Event) => {
      const videoBuffer = new Blob(this.recordedBlobs, {
        type: 'video/webm'
      });
      this.downloadUrl = window.URL.createObjectURL(videoBuffer); // you can download with <a> tag
      this.recordVideoElement.src = this.downloadUrl;
    };
  }
}