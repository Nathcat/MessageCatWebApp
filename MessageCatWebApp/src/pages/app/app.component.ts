import { Component } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LoginModule } from '../Login/Login.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "MessageCat";
  Json = JSON;
  pfp_req_url = "http://192.168.1.26:8080/api/pfps/";

  username = "";
  password = "";
  pfp_path = "";
  friends: string[] = [];
  contactBoxRippleColour: string = "";
  selectedFriendString: string = "";
  message: string = "";
  messages: string[] = [];

  constructor() {
    if (window.sessionStorage.getItem("username") === null || window.sessionStorage.getItem("password") === null) {
      platformBrowserDynamic().bootstrapModule(LoginModule)
        .catch(err => console.error(err));
    }
    else {
      this.username = this.GetSessionValueNullSafe("username");
      this.password = this.GetSessionValueNullSafe("password");
      this.pfp_path = this.pfp_req_url + this.GetSessionValueNullSafe("pfp_path");
      this.GetFriends();
      this.GetMessagesAsync();
    }
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

  Logout() {
    window.sessionStorage.clear();
    platformBrowserDynamic().bootstrapModule(LoginModule)
      .catch(err => console.error(err));
  }

  OpenUserSettings() {
    alert("This feature is not yet implemented!");
  }

  async GetFriends() {
    const response = await fetch("http://192.168.1.26:8080/api/getfriends", {
      method: "POST",
      body: JSON.stringify({
        "ID": this.GetSessionValueNullSafe("ID")
      })
    }).then((response) => {
      return response.text();
    });

    let stringFriends = response.split("<[SePaRaToR]>");
    this.friends = stringFriends.map((item) => {
      return item;
    });
  }

  async SendMessage() {
    if (this.selectedFriendString == "") {
      alert("No conversation has been selected!");
      return;
    }

    let messageJson = JSON.stringify({
      "senderID": this.GetSessionValueNullSafe("ID"),
      "recipientID": JSON.parse(this.selectedFriendString).ID,
      "content": this.message
    });

    const response = await fetch("http://192.168.1.26:8080/api/sendmessage", {
      method: "POST",
      body: messageJson
    }).then((response) => {
      if (response.ok) {
        this.message = "";
      }
      else {
        alert("Something went wrong!");
      }
    });
  }

  async GetMessagesAsync() {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (this.selectedFriendString == '') {
        continue;
      }

      const response = await fetch("http://192.168.1.26:8080/api/getmessages", {
        method: "POST",
        body: JSON.stringify({
          "userID": this.GetSessionValueNullSafe("ID"),
          "friendID": JSON.parse(this.selectedFriendString).ID
        })
      }).then((response) => {
        if (response.ok) {
          return response.text();
        }
        else {
          alert("Something went wrong when trying to get messages!");
          return "";
        }
      });

      this.messages = response.split("<[SePaRaToR]>");
    }
  }

  GetMessageClassName(senderID: string) {
    if (senderID == this.GetSessionValueNullSafe("ID")) {
      return "user-messages";
    }
    else {
      return "friend-messages";
    }
  }
}
