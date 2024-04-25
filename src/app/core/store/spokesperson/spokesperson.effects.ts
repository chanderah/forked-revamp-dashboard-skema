import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as SpokespersonActions from './spokesperson.actions';
import { ArticleService } from '../../services/article.service';
import { InfluencerService } from '../../services/influencer.service';

@Injectable()
export class SpokespersonEffects {
  constructor(
    private actions$: Actions,
    private articleService: ArticleService,
  ) {}
  getLatestNews = createEffect(() =>
    this.actions$.pipe(
      ofType(SpokespersonActions.getLatestNews),
      switchMap(({ filter }) => {
        return this.articleService.getHighlights(filter).pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return SpokespersonActions.getLatestNewsSuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(
              SpokespersonActions.getLatestNewsError({
                error: error.message,
              })
            )
          )
        );
      })
    )
  );
}
