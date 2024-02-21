@UseGuards(WsGuard)
@WebSocketGateway(3006, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  protected logger: Logger = new Logger('MessageGateway');

  constructor(
    protected readonly jwtService: JwtService,
    protected readonly userService: UserService,
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    readonly sessions: IGatewaySessionManager,
    @Inject(Services.GROUPS)
    private readonly groupsService: IGroupService,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationsService,
  ) {}

  afterInit(server: Server): void {
    this.logger.log('Socket initialization');
    console.log('server:', server);
  }

  //function get user from token
  async getDataUserFromToken(socket: AuthenticatedSocket): Promise<string> {
    const accessToken: any = socket.handshake.auth.access_token;
    try {
      const decoded = this.jwtService.verify(accessToken, {
        secret: jwtConstants.accessTokenSecret,
      });
      return decoded;
    } catch (ex) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async handleConnection(
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): Promise<void> {
    this.logger.log(`${socket.id} connect`);
    try {
      const token: any = await this.getDataUserFromToken(socket);
      this.sessions.setUserSocket(token.id, socket);
      socket.emit(SocketEnum.CONNECT_SUCCESS, 'Connect success');
    } catch (error) {
      return error.message;
    }
  }

  async handleDisconnect(socket: AuthenticatedSocket): Promise<void> {
    this.logger.log(`${socket.id} disconnect`);
    try {
      const token: any = await this.getDataUserFromToken(socket);
      this.sessions.removeUserSocket(token.id);
    } catch (error) {
      return error.message;
    }
  }

  @SubscribeMessage('closeConnect')
  async handleDisconnectClose(socket: AuthenticatedSocket): Promise<void> {
    this.logger.log(`${socket.id} disconnect`);
    try {
      const token: any = await this.getDataUserFromToken(socket);
      this.sessions.removeUserSocket(token.id);
    } catch (error) {
      return error.message;
    }
  }

  @SubscribeMessage('getOnlineGroupUsers')
  async handleGetOnlineGroupUsers(
    @ConnectedSocket() socket: AuthenticatedSocket,
  ): Promise<void> {
    const listUser: any = await this.userService.getAllUser();
    if (!listUser) return;
    const onlineUsers = [];
    const offlineUsers = [];
    listUser.forEach((user) => {
      const socket = this.sessions.getUserSocket(user.id);
      socket ? onlineUsers.push(user) : offlineUsers.push(user);
    });
    socket.emit('onlineGroupUsersReceived', { onlineUsers, offlineUsers });
  }

  @SubscribeMessage('onConversationJoin')
  onConversationJoin(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    console.log(
      `${client.user?.id} joined a Conversation of ID: ${data.conversationId}`,
    );
    client.join(`conversation-${data.conversationId}`);
    console.log(client.rooms);
    client.to(`conversation-${data.conversationId}`).emit('userJoin');
    return;
  }

  @SubscribeMessage('onConversationLeave')
  onConversationLeave(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    console.log('onConversationLeave');
    client.leave(`conversation-${data.conversationId}`);
    console.log(client.rooms);
    client.to(`conversation-${data.conversationId}`).emit('userLeave');
    return;
  }

  @SubscribeMessage('onTypingStart')
  onTypingStart(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    console.log('onTypingStart');
    console.log(data.conversationId);
    console.log(client.rooms);
    client.to(`conversation-${data.conversationId}`).emit('onTypingStart');
    return;
  }

  @SubscribeMessage('onTypingStop')
  onTypingStop(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    console.log('onTypingStop');
    console.log(data.conversationId);
    console.log(client.rooms);
    client.to(`conversation-${data.conversationId}`).emit('onTypingStop');
    return;
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: CreateMessageResponse): Promise<void> {
    const {
      message: { author },
      conversation: { creator, recipient },
    } = payload;

    const authorSocket = this.sessions.getUserSocket(author.id);
    const recipientSocket =
      author?.id === creator?.id
        ? this.sessions.getUserSocket(recipient?.id)
        : this.sessions.getUserSocket(creator?.id);
    if (authorSocket) authorSocket.emit('onMessage', payload.message);
    if (recipientSocket) recipientSocket.emit('onMessage', payload.message);
    return;
  }

  @OnEvent('conversation.create')
  handleConversationCreateEvent(payload: ConversationsEntity): Promise<void> {
    console.log('Inside conversation.create');
    const recipientSocket = this.sessions.getUserSocket(payload.recipient.id);
    if (recipientSocket) recipientSocket.emit('onConversation', payload);
    return;
  }

  @SubscribeMessage('onConversationUpdate')
  async handleConversationUpdate(@MessageBody() userId: string): Promise<void> {
    console.log('onConversationUpdate');
    const paging: ConservationsPagination = {
      sizePage: 10,
      currentPage: 1,
    };
    const listConservations = await this.conversationService.getConversations(
      userId,
      paging,
    );
    const userSocket = this.sessions.getUserSocket(userId);
    if (userSocket) userSocket.emit('onConversationUpdate', listConservations);
    return;
  }

  @OnEvent('message.delete')
  async handleMessageDelete(payload): Promise<void> {
    console.log('Inside message.delete');
    console.log(payload);
    const conversation = await this.conversationService.findById(
      payload.conversationId,
    );
    if (!conversation) return;
    const { creator, recipient } = conversation;
    const recipientSocket =
      creator.id === payload.userId
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);
    if (recipientSocket) recipientSocket.emit('onMessageDelete', payload);
  }

  @OnEvent('message.update')
  async handleMessageUpdate(message: MessageEntity): Promise<void> {
    const {
      author,
      conversation: { creator, recipient },
    } = message;
    console.log(message);
    const recipientSocket =
      author.id === creator.id
        ? this.sessions.getUserSocket(recipient.id)
        : this.sessions.getUserSocket(creator.id);
    if (recipientSocket) recipientSocket.emit('onMessageUpdate', message);
  }
}