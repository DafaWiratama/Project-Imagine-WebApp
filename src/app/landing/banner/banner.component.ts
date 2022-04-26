import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  scrollTo(className: string):void {
    // const elementList = document.querySelectorAll('.' + className);
    // const element = elementList[0] as HTMLElement;
    window.scrollTo(0,document.body.scrollHeight);
  }
}
