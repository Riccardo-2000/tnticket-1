import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hero-card',
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.scss']
})
export class HeroCardComponent implements OnInit {

  @Input() data : any;
  @Input() titleCard : string;
  @Input() max : Number;

  constructor() { }

  ngOnInit(): void {
  }

}
