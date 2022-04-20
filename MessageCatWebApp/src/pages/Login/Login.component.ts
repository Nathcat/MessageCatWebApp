import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '../app/app.module';
import { CreateNewUserModule } from '../CreateNewUser/CreateNewUser.module'
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { Md5 } from 'ts-md5';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.css']
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  title = 'MessageCat';
  email = "";
  password = "";

  async Login() {
    if (this.emailFormControl.hasError("required") || this.emailFormControl.hasError("email") || this.passwordFormControl.hasError("required")) {
      alert("One or more required fields are empty or invalid!");
      return;
    }

    var password = Md5.hashStr(this.password);

    const response = await fetch("http://192.168.1.26:8080/api/getuser", {
      method: "POST",
      headers: {
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "email": this.email,
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

    if (this.email === response.email && password === response.password) {
      window.sessionStorage.setItem("username", response.username);
      window.sessionStorage.setItem("password", password);
      window.sessionStorage.setItem("email", this.email);
      window.sessionStorage.setItem("ID", response.ID);
      window.sessionStorage.setItem("pfp_path", response.pfp_path);
      platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err));
    }
    else {
      alert("Invalid credentials.");
    }
  }

  GoToCreateNewUser() {
    platformBrowserDynamic().bootstrapModule(CreateNewUserModule)
        .catch(err => console.error(err));
  }
}
