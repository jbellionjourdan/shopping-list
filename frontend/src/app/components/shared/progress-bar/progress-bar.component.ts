import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ProgressBarModule} from "primeng/progressbar";

@Component({
    selector: 'spl-progress-bar',
    imports: [
        ProgressBarModule
    ],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {

  @Input({transform: booleanAttribute}) shown = false;
}
