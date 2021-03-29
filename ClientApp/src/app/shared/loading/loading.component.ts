import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent implements OnInit {

  @Input() show$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  ngOnInit(): void {
  }

}
