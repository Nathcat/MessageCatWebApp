import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '../app/app.module';
import { LoginModule } from '../Login/Login.module'
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './CreateNewUser.component.html',
  styleUrls: ['./CreateNewUser.component.css']
})
export class CreateNewUserComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  title = 'MessageCat';

  email = "";
  username = "";
  password = "";

  async CreateNewUser() {
    if (this.emailFormControl.hasError("required") || this.emailFormControl.hasError("email") || this.usernameFormControl.hasError("required") || this.passwordFormControl.hasError("required")) {
      alert("One or more required fields are empty or invalid!");
      return;
    }
    
    const response = await fetch("http://192.168.1.26:8080/api/createuser", {
      method: "POST",
      headers: {
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "username": this.username,
        "password": this.password,
        "email": this.email
      })
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      else {
        return response.ok;
      }
    });

    window.sessionStorage.setItem("username", response.username);
    window.sessionStorage.setItem("password", this.password);
    window.sessionStorage.setItem("email", this.email);
    window.sessionStorage.setItem("ID", response.ID);
    window.sessionStorage.setItem("pfp_path", response.pfp_path);
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  }

  GoToLogin() {
    platformBrowserDynamic().bootstrapModule(LoginModule)
        .catch(err => console.error(err));
  }
}
