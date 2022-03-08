import { Component, ViewChild , AfterViewInit, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { SignaturePad } from 'ngx-signaturepad/signature-pad';

@Component({
  selector: 'app-pad-signature',
  templateUrl: './pad-signature.component.html',
  styleUrls: ['./pad-signature.component.scss'],
})
export class PadSignatureComponent implements AfterViewInit {

  @ViewChild('SignaturePad',{ static: true }) signaturePad: SignaturePad;


  @Output('') dataUrlSign   = new EventEmitter();

  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': window.innerWidth-70,
    'canvasHeight': 150,

  };

  constructor() {
    // no-op
  }
 

  ngAfterViewInit() {
    // this.signaturePad is now available
      this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
      this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  clearSign(){
    this.signaturePad.clear();
  }

  drawComplete() {
    // => Mando DataUrl Al Parent

    return this.dataUrlSign.emit(this.signaturePad.toDataURL());
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
    
  }
}
