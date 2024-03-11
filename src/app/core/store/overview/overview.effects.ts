import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as OverviewActions from './overview.actions';
import { OverviewService } from '../../services/overview.service';

@Injectable()
export class OverviewEffects {
  constructor(
    private actions$: Actions,
    private overviewService: OverviewService
  ) {}
  getMediaCount = createEffect(() =>
    this.actions$.pipe(
      ofType(OverviewActions.getMediaCount),
      switchMap(({filter}) => {
        return this.overviewService.getMediaCount(filter).pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return OverviewActions.getMediaCountSuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(OverviewActions.getMediaCountError({ error: error.message }))
          )
        );
      })
    )
  );

  getAllCount = createEffect(() =>
    this.actions$.pipe(
      ofType(OverviewActions.getAllCount),
      switchMap(() => {
        return this.overviewService.getAllCount().pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return OverviewActions.getAllCountSuccess({ data: response });
          }),
          catchError((error) =>
            of(OverviewActions.getAllCountError({ error: error.message }))
          )
        );
      })
    )
  );

  getWordCloud = createEffect(() =>
    this.actions$.pipe(
      ofType(OverviewActions.getWordCloud),
      switchMap(() => {
        return this.overviewService.getWordCloud().pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return OverviewActions.getWordCloudSuccess({ data: response.data });
          }),
          catchError((error) =>
            of(OverviewActions.getWordCloudError({ error: error.message }))
          )
        );
      })
    )
  );

  getToneByMedia = createEffect(() =>
    this.actions$.pipe(
      ofType(OverviewActions.getToneByMedia),
      switchMap(() => {
        return this.overviewService.getToneByMedia().pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return OverviewActions.getToneByMediaSuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(OverviewActions.getToneByMediaError({ error: error.message }))
          )
        );
      })
    )
  );

  getHighlights = createEffect(() =>
    this.actions$.pipe(
      ofType(OverviewActions.getHighlights),
      switchMap(() => {
        return this.overviewService.getHighlights().pipe(
          map((response) => {
            if ((response as any).code === 401)
              throw new Error((response as any).message);
            return OverviewActions.getHighlightsSuccess({
              data: response.data,
            });
          }),
          catchError((error) =>
            of(OverviewActions.getHighlightsError({ error: error.message }))
          )
        );
      })
    )
  );
}
