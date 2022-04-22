import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '../app/app.module';

@Component({
  selector: 'app-root',
  templateUrl: './UserSettings.component.html',
  styleUrls: ['./UserSettings.component.css']
})
export class UserSettingsComponent {
  isLoadingSettings = true;
  sendEmailNotifications = true;

  constructor() {
    this.GetUserSettings();
  }

  GetSessionValueNullSafe(key: string) {
    var value = window.sessionStorage.getItem(key);
    if (value === null) {
      return "";
    }
    else {
      return value;
    }
  } 

  GoToAppPage() {
    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err));
  }

  async ApplySettings() {
    const response = await fetch("http://localhost:8080/api/applyusersettings", {
      method: "POST",
      body: JSON.stringify({
        "ID": this.GetSessionValueNullSafe("ID"),
        "send_email_notifications": this.sendEmailNotifications
      })
    }).then((response) => {
      return response.text();
    });

    if (response == "OK") {
      alert("Applied settings");
    }
    else {
      alert("Something went wrong!");
    }
  }

  async GetUserSettings() {
    this.isLoadingSettings = true;

    const response = await fetch("http://localhost:8080/api/getusersettings", {
      method: "POST",
      body: JSON.stringify({
        "ID": this.GetSessionValueNullSafe("ID")
      })
    }).then((response) => {
      return response.json();
    });

    this.sendEmailNotifications = response.send_email_notifications;

    this.isLoadingSettings = false;
  }
}
