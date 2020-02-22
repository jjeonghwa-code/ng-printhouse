import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import {AuthorizationService} from '../../services/authorization.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = createEffect(() => this.actions$.pipe(
    ofType( AuthActions.login ),
    mergeMap((payload) => this.authorizationService.login(payload.name, payload.password)
      .pipe(
        map(login => {
          localStorage.setItem('token', login.token);
          localStorage.setItem('login_date', (new Date()).toUTCString() );
          this.router.navigateByUrl('/dashboard');
          return { type: '[Auth] Login Success', token: login.token };
        }),
        catchError((err) => {
          console.log('err', err);
          return of({ type: '[Auth] Login Error', errorMessage: 'Не правильный логин или пароль.' });
        })
      )
    )
  ));

  register$ = createEffect(() => this.actions$.pipe(
    ofType( AuthActions.register ),
    mergeMap((payload) => this.authorizationService.register(payload.user)
      .pipe(
        map(user => {
          this.router.navigateByUrl('/auth');
          return { type: '[Auth] Register Success', successMessage: 'Новый пользователь создан.' };
        }),
        catchError((err) => {
          console.log('err', err);
          return of({ type: '[Auth] Register Error',
                      errorMessage: 'Произошла ошибка при регистрации. Проверьте поля.',
                      errors: err.error.errors });
        })
      )
    )
  ));

  constructor(private actions$: Actions,
              private authorizationService: AuthorizationService,
              private router: Router
  ) {}
}