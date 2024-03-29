import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITrack } from '../layered-map-widget.model';

@Component({
  selector: 'track-list',
  templateUrl: './track-list.component.html',
})
export class TrackListComponent {
  @Input() title: string;
  @Input() tracks: ITrack[] = [];
  @Input() selectedTrackName = '';
  @Input() selectable = false;

  @Output() deleteTrack = new EventEmitter<ITrack>();
  @Output() userChangedSelection = new EventEmitter<{
    checked: boolean;
    track: ITrack;
  }>();

  onUserChangedSelection(event: Event, track: ITrack): void {
    const checked = (<HTMLInputElement>event.currentTarget).checked;

    this.userChangedSelection.emit({
      checked,
      track: track,
    });
  }

  onDeleteTrack(track: ITrack): void {
    this.deleteTrack.emit(track);
  }
}
