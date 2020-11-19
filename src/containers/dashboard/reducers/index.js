import Actions from '../actions';

/* eslint-disable no-redeclare, no-shadow */
export default (state = {}, action) => {

    let views;

    switch (action.type) {

        case Actions.LOAD_VIEWS :

            state = {
                ...state,
                isLoading: true
            };
            break;

        case Actions.LOAD_VIEWS_SUCCESS :
            views = action.payload;

            state = {
                ...state,
                views: views,
                isLoading: false
            };
            break;

        default :
            break;
    }

    return state;
};

