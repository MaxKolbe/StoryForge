import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../events.js';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthEventsListener {
  @OnEvent('auth.user-registered')
  handleUserRegisteredEvent(event: UserRegisteredEvent) {
    Logger.log(event.payload.email, 'USER REGISTERED EVENT RECEIVED');

    // Do whatever needs to happen here
  }
}
