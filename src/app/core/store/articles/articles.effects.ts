import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ArticlesActions from './articles.actions';
import { OverviewService } from '../../services/overview.service';
import { ArticleService } from '../../services/article.service';
import { ToneService } from '../../services/tone.service';

@Injectable()
export class ArticlesEffects {
  constructor(
    private actions$: Actions,
    private articleService: ArticleService
  ) {}
  getMediaCountArticles = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.getMediaCountArticles),
      switchMap(({ filter }) => {
        return this.articleService.getMediaCountArticles(filter).pipe(
          map((response) => {
            if ((response as any).code === 401) throw new Error((response as any).message);
            return ArticlesActions.getMediaCountArticlesSuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(
              ArticlesActions.getMediaCountArticlesError({
                error: error.message,
              })
            )
          )
        );
      })
    )
  );
}
