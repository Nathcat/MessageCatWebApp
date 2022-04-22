import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
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
  pfp_req_url = "http://localhost:8080/api/pfps/";

  username = "";
  password = "";
  pfp_path = "";
  friends: string[] = [];
  contactBoxRippleColour: string = "";
  selectedFriendString: string = "";
  message: string = "";
  messages: string[] = [];
  userSearchField: string = "";
  userSearchResults: string[] = [];
  friendRequests: string[] = [];

  constructor() {
    if (window.sessionStorage.getItem("username") === null || window.sessionStorage.getItem("password") === null) {
      platformBrowserDynamic().bootstrapModule(LoginModule)
        .catch(err => console.error(err));
    }
    else {
      this.username = this.GetSessionValueNullSafe("username");
      this.password = this.GetSessionValueNullSafe("password");
      this.pfp_path = this.pfp_req_url + this.GetSessionValueNullSafe("pfp_path");
      this.GetFriendsAsync();
      this.GetMessagesAsync();
      this.GetFriendRequestsAsync();
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

  async GetFriendsAsync() {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch("http://localhost:8080/api/getfriends", {
        method: "POST",
        body: JSON.stringify({
          "ID": this.GetSessionValueNullSafe("ID")
        })
      }).then((response) => {
        return response.text();
      });

      let stringFriends = response.split("<[SePaRaToR]>");
      if (stringFriends[0] == '') {
        continue;
      }

      this.friends = stringFriends.sort((a, b) => {
        if (parseInt(JSON.parse(a).ID) > parseInt(JSON.parse(b).ID)) {
          return 1;
        }
        else if (parseInt(JSON.parse(a).ID) < parseInt(JSON.parse(b).ID)) {
          return -1;
        }
        else {
          return 0;
        }
      });
    }
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

    const response = await fetch("http://localhost:8080/api/sendmessage", {
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

      const response = await fetch("http://localhost:8080/api/getmessages", {
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

  IsUserMessage(senderID: string) {
    return senderID == this.GetSessionValueNullSafe("ID");
  }

  async SearchForUser() {
    const response = await fetch("http://localhost:8080/api/searchforuser", {
      method: "POST",
      body: JSON.stringify({
        "username": this.userSearchField + "%"
      })
    }).then((response) => {
      return response.text();
    });

    this.userSearchResults = response.split("<[SePaRaToR]>");
    if (this.userSearchResults.length == 1 && this.userSearchResults[0] == '') {
      alert("No results!");
    }
  }

  async SendFriendRequest(user: string) {
    const response = await fetch("http://localhost:8080/api/sendfriendrequest", {
      method: "POST",
      body: JSON.stringify({
        "senderID": this.GetSessionValueNullSafe("ID"),
        "recipientID": JSON.parse(user).ID
      })
    }).then((response) => {
      return response.text();
    });

    if (response == "OK") {
      alert("Friend request sent");
    }
    else {
      alert("Something went wrong!");
    }
  }

  async GetFriendRequestsAsync() {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch("http://localhost:8080/api/getfriendrequests", {
        method: "POST",
        body: JSON.stringify({
          "ID": this.GetSessionValueNullSafe("ID")
        })
      }).then((response) => {
        return response.text();
      });

      if (response.split("<[SePaRaToR]>")[0] == '') {
        this.friendRequests = [];
        continue;
      }

      let requests = response.split("<[SePaRaToR]>").map((item) => { return JSON.parse(item); });
      let friend_requests = [];

      for (let i = 0; i < requests.length; i++) {
        const response = await fetch("http://localhost:8080/api/getuser/id", {
          method: "POST",
          body: JSON.stringify({
            "ID": requests[i].senderID
          })
        }).then((response) => {
          return response.json();
        });

        friend_requests.push(JSON.stringify(response));
      }

      friend_requests = friend_requests.sort((a, b) => {
        if (parseInt(JSON.parse(a).ID) > parseInt(JSON.parse(b).ID)) {
          return 1;
        }
        else if (parseInt(JSON.parse(a).ID) < parseInt(JSON.parse(b).ID)) {
          return -1;
        }
        else {
          return 0;
        }
      });
      this.friendRequests = friend_requests;
    }
  }

  async AcceptFriendRequest(senderData: string) {
    const response = await fetch("http://localhost:8080/api/acceptfriendrequest", {
      method: "POST",
      body: JSON.stringify({
        "senderID": JSON.parse(senderData).ID,
        "recipientID": this.GetSessionValueNullSafe("ID")
      })
    }).then((response) => {
      return response.text();
    });

    if (response == "OK") {
      alert("You are now friends with " + JSON.parse(senderData).username);
    }
    else {
      alert("Something went wrong!");
    }
  }

  async DeclineFriendRequest(senderData: string) {
    const response = await fetch("http://localhost:8080/api/declinefriendrequest", {
      method: "POST",
      body: JSON.stringify({
        "senderID": JSON.parse(senderData).ID,
        "recipientID": this.GetSessionValueNullSafe("ID")
      })
    }).then((response) => {
      return response.text();
    });

    if (response == "OK") {
      alert("Declined friend request");
    }
    else {
      alert("Something went wrong!");
    }
  }

  GetMessageRowName(message: string) {
    if (JSON.parse(message).senderID == this.GetSessionValueNullSafe("ID")) {
      return "user-message-row";
    }
    else {
      return "friend-message-row";
    }
  }
}
