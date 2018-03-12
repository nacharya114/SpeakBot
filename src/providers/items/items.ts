import { Injectable } from '@angular/core';

import { Message } from '../../models/message';
import { Api } from '../api/api';

@Injectable()
export class Messages {

  constructor(public api: Api) { }

  query(params?: any) {
    return this.api.get('/messages', params);
  }

  add(message: Message) {
  }

  delete(message: Message) {
  }

}
