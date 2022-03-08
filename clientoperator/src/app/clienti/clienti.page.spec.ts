import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientiPage } from './clienti.page';

describe('ClientiPage', () => {
  let component: ClientiPage;
  let fixture: ComponentFixture<ClientiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientiPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
