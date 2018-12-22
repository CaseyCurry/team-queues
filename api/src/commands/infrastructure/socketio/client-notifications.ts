export class ClientNotifications {
  constructor(private io: SocketIO.Server) {}

  public send(channel: string, message: object) {
    this.io.emit(channel, message);
    console.debug(`notification emitted on channel ${channel}`);
  }
}
