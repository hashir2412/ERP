import {  Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng-lts';
import {  Subject } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() messages$: Subject<Message> = new Subject<Message>();
  msgs: Message[] = [{ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' }];
  constructor() { }

  ngOnInit(): void {
    this.messages$.subscribe(res => this.msgs = [res]);
  }

}
