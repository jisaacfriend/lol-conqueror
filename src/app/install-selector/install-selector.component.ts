import { Component } from '@angular/core';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-install-selector',
  templateUrl: './install-selector.component.html',
  styleUrls: ['./install-selector.component.scss'],
})
export class InstallSelectorComponent {
  faFolderOpen = faFolderOpen;

};
