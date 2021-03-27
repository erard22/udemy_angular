import {Component} from "@angular/core";

@Component({
  selector: "app-servers",
  templateUrl: "./servers.component.html"
})
export class ServersComponent {

    allowNewServer = false;
    serverCreationStatus = "No server was created so far."
    serverName = "ServerName"
    serverCreated: boolean;
    servers = ['Testserver', 'Testserver 2']

    constructor() {
      setTimeout(() => {this.allowNewServer = true}, 2000)
      this.serverCreated = false;
    }

    onCreateServer() {
      this.serverCreationStatus = "Server created! Name is " + this.serverName;
      this.serverCreated = true;
      this.servers.push(this.serverName);
    }

  onUpdateServerName(event: any) {
    console.log(event.target.value);
    this.serverName = event.target.value;
  }
}
