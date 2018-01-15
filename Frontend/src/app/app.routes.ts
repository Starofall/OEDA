import {Routes} from '@angular/router';
import {UserRouteGuard} from "./shared/modules/auth/user-routeguard.service";
// import {ArtistRouteGuard} from "./shared/modules/auth/artist-routeguard.service";

export const routes: Routes = [
  {
    path: 'control',
    canActivate: [UserRouteGuard],
    loadChildren: 'app/+control/control.module#ControlModule'
  },
  // {path: 'artist', canActivate: [ArtistRouteGuard], loadChildren: 'app/+artist/artist.module#ArtistModule'},
  // {path: 'releases', loadChildren: 'app/+releases/releases.module#ReleasesModule'},
  // {path: 'scout', loadChildren: 'app/+scout/scout.module#ScoutModule'},
  // {path: 'auth', loadChildren: 'app/+auth/auth.module#AuthModule'},
  {path: '', loadChildren: 'app/+landingpage/landingpage.module#LandingPageModule'},
  {path: '**', pathMatch: 'full', redirectTo: '/'}
];
