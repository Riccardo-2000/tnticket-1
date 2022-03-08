import { Component, OnInit, Input } from '@angular/core';
import { Ticket } from './../../interfaces/ticket';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-ticket-slider',
    templateUrl: './ticket-slider.component.html',
    styleUrls: ['./ticket-slider.component.scss'],
})
export class TicketSliderComponent implements OnInit {
    @Input('') tickets$:Observable<Ticket[]>;
    existedTicket:Boolean = true;

    slideOpts = {
        initialSlide: 0,
        speed: 400,
        slidesPerView:1.3
    };
    constructor() { }

    ngOnInit() {
    }

}
