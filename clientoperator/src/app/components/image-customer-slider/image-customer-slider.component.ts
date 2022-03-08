import { Component, OnInit,Input,Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
    selector: 'app-image-customer-slider',
    templateUrl: './image-customer-slider.component.html',
    styleUrls: ['./image-customer-slider.component.scss'],
})
export class ImageCustomerSliderComponent implements OnInit {
    @Input() images;
    @Input() id;
    slideOpts = {
        initialSlide: 0,
        speed: 400
    };
    constructor(private modalController : ModalController) { }

    ngOnInit() {
    }
    dismissModal(){
        this.modalController.dismiss();
    }
    emitDeleteImageEvent(index){
        this.modalController.dismiss({
            dismiss:true,
            imageIndex : index,
            id:this.id
        });
    }
}
