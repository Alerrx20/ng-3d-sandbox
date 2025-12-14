import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  isMenuOpen: WritableSignal<boolean> = signal(false);

  navItems = [
    { title: 'Anime Scene', route: '/anime' },
    { title: 'Rubik Game', route: '/rubik' },
    { title: 'Scroll Trigger', route: '/scrolltrigger' },
    { title: 'Cube 3D', route: '/cube' }
  ];

  toggleMenu() {
    this.isMenuOpen.update((currentValue) => !currentValue);
    const isOpen = this.isMenuOpen();
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }
}
