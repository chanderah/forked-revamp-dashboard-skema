import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AnalyzeActions from './analyze.actions';
import { ArticleService } from '../../services/article.service';
import { ToneService } from '../../services/tone.service';
import { AnalyzeService } from '../../services/analyze.service';

@Injectable()
export class AnalyzeEffects {
  constructor(
    private actions$: Actions,
    private articleService: ArticleService,
    private toneService: ToneService,
    private analyzeService: AnalyzeService
  ) {}
  getHighlights = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyzeActions.getHighlights),
      switchMap(({ filter }) => {
        return this.articleService.getHighlights(filter).pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return AnalyzeActions.getHighlightsSuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(AnalyzeActions.getHighlightsError({ error: error.message }))
          )
        );
      })
    )
  );

  getTones = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyzeActions.getTones),
      switchMap(({ filter }) => {
        return this.toneService.getTones(filter).pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return AnalyzeActions.getTonesSuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(AnalyzeActions.getTonesError({ error: error.message }))
          )
        );
      })
    )
  );

  getMediaVisibility = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyzeActions.getMediaVisibility),
      switchMap(({ filter }) => {
        return this.analyzeService.getMediaVisibility(filter).pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return AnalyzeActions.getMediaVisibilitySuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(AnalyzeActions.getMediaVisibilityError({ error: error.message }))
          )
        );
      })
    )
  );

  getToneByCategory = createEffect(() =>
    this.actions$.pipe(
      ofType(AnalyzeActions.getToneByCategory),
      switchMap(({ filter }) => {
        return this.toneService.getToneByCategory(filter).pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return AnalyzeActions.getToneByCategorySuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(AnalyzeActions.getToneByCategoryError({ error: error.message }))
          )
        );
      })
    )
  );

  getToneByMedia = createEffect(() =>
  this.actions$.pipe(
    ofType(AnalyzeActions.getToneByMedia),
    switchMap(({ filter }) => {
      return this.toneService.getToneByMedia(filter).pipe(
        map((response) => {
          if ((response as any).code === 401)
            throw new Error((response as any).message);
          return AnalyzeActions.getToneByMediaSuccess({
            data: response.data,
          });
        }),
        catchError((error) =>
          of(AnalyzeActions.getToneByMediaError({ error: error.message }))
        )
      );
    })
  )
);
}
