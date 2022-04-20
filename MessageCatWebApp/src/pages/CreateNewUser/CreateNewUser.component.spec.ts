import { TestBed } from '@angular/core/testing';
import { CreateNewUserComponent } from './CreateNewUser.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CreateNewUserComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CreateNewUserComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'MessageCat'`, () => {
    const fixture = TestBed.createComponent(CreateNewUserComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('MessageCat');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CreateNewUserComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('MessageCat app is running!');
  });
});
