import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TecnicoAreaPage } from './tecnico-area.page';

describe('TecnicoAreaPage', () => {
  let component: TecnicoAreaPage;
  let fixture: ComponentFixture<TecnicoAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TecnicoAreaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TecnicoAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
