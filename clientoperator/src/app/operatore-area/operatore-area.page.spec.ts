import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OperatoreAreaPage } from './operatore-area.page';

describe('OperatoreAreaPage', () => {
  let component: OperatoreAreaPage;
  let fixture: ComponentFixture<OperatoreAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatoreAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OperatoreAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
