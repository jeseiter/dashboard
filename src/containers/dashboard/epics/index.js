import 'rxjs';
import {of} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {combineEpics, ofType} from 'redux-observable';
import {catchError, mergeMap, switchMap} from 'rxjs/operators';
import Actions from '../actions';

/* Actions always run through reducers before Epics even receive them. */

// const LOCAL = true;

// const getLoadViewsUrl = () => {
//     return LOCAL ? 'http://localhost:3000/pods' : '/api/pods';
// };

const loadViewsEpic = ((action$) => action$.pipe(
    ofType(Actions.LOAD_VIEWS),
    mergeMap(() =>
        ajax.get('http://localhost:3000/pods').pipe(
            switchMap((e) => of({type: Actions.LOAD_VIEWS_SUCCESS, payload: e})),
            catchError(() => of({type: Actions.LOAD_VIEWS_ERROR}))
        ))
    )
);

export default combineEpics(
    loadViewsEpic
);
