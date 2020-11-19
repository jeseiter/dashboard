/**
 * Copyright (c) 2019 Home Box Office, Inc. as an unpublished
 * work. Neither this material nor any portion hereof may be copied or
 * distributed without the express written consent of Home Box Office, Inc.
 *
 * This material also contains proprietary and confidential information
 * of Home Box Office, Inc. and its suppliers, and may not be used by or
 * disclosed to any person, in whole or in part, without the prior written
 * consent of Home Box Office, Inc.
 */

import QueryBuilderReducer from './index';
import Actions from '../actions';
import {describe, it} from 'mocha';
import {expect} from 'chai';

const customQuery = {
    json: [
        {
            id: 'primary-group',
            combinator: 'and',
            not: false,
            rules: [
                {
                    id: 'primary-group-rule-0',
                    index: 0,
                    field: 'genre',
                    value: 'action',
                    operator: '=',
                    incomplete: false,
                    groupId: 'primary-group',
                },
                {
                    id: 'primary-group-rule-1',
                    index: 1,
                    field: 'tag',
                    value: 'in-franchise',
                    operator: '!=',
                    incomplete: false,
                    groupId: 'primary-group',
                },
                {
                    id: 'secondary-group',
                    index: 2,
                    combinator: 'or',
                    not: false,
                    deletable: true,
                    incomplete: false,
                    rules: [
                        {
                            id: 'secondary-group-rule-0',
                            index: 0,
                            field: 'tag',
                            value: 'feature',
                            operator: '=',
                            incomplete: false,
                            groupId: 'secondary-group'
                        },
                        {
                            id: 'secondary-group-rule-1',
                            index: 1,
                            field: 'tag',
                            value: 'franchise',
                            operator: '=',
                            incomplete: false,
                            groupId: 'secondary-group'
                        },
                        {
                            id: 'secondary-group-rule-2',
                            index: 2,
                            field: 'tag',
                            value: 'series',
                            operator: '=',
                            incomplete: false,
                            groupId: 'secondary-group'
                        }
                    ]
                }
            ],
            deletable: false,
            incomplete: false
        }
    ],
    tags: 'urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
};

/* eslint-disable no-unused-expressions, max-statements, max-nested-callbacks, max-len */
describe('Query Builder Menu Reducer', () => {

    describe('Initial State', () => {

        it('Should handle initial null state', () => {

            let newState = QueryBuilderReducer(undefined, {});
            expect(newState).to.be.a('object');
        });

    });

    describe('LOAD_QUERY_NAME', () => {

        it('Should set query name', () => {

            let action = {
                type: Actions.SET_QUERY_NAME,
                payload: 'all-action'

            };

            let state = {
                queryName: '',
                queries: [
                    {
                        globalId: 'urn:hbo:query:all-action',
                        queryName: 'all-action',
                        title: 'A-Z Action',
                        tags: 'urn:hbo:genre:action',
                        json: undefined,
                        incomplete: false
                    }
                ],
                currentQuery: {
                    incomplete: true
                },
                offerings: [{}, {}, {}]
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.queryName).to.equal('all-action');
            expect(newState.currentQuery.globalId).to.equal('urn:hbo:query:all-action');
        });

        it('Should handle if no queries', () => {

            let action = {
                type: Actions.SET_QUERY_NAME,
                payload: 'all-action'

            };

            let state = {
                queryName: '',
                queries: [],
                currentQuery: {
                    incomplete: true
                }
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.queryName).to.equal('all-action');
            expect(newState.queries).has.lengthOf(0);
            expect(newState.currentQuery.incomplete).to.be.true;
        });

    });

    describe('LOAD_QUERIES_SUCCESS', () => {

        it('Should load tagged queries', () => {

            let action = {
                type: Actions.LOAD_QUERIES_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {
                                globalId: 'urn:hbo:query:action-movies',
                                queryName: 'action-movies',
                                title: 'Action Movies',
                                tags: 'urn:hbo:genre:action&urn:hbo:content-category:movie&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                            },
                            {
                                globalId: 'urn:hbo:query:action-series',
                                queryName: 'action-series',
                                title: 'Action Series',
                                tags: 'urn:hbo:genre:action&(urn:hbo:content-category:series|urn:tag:franchise)&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                            },
                            {
                                globalId: 'urn:hbo:query:custom-query',
                                queryName: 'custom-query',
                                title: 'Custom Query',
                                tags: 'urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                            }
                        ]
                    }
                }
            };

            let state = {
                queryName: 'action-movies',
                queries: [],
                filteredQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.globalId).to.equal('urn:hbo:query:action-movies');
            expect(newState.queries).has.lengthOf(3);
            expect(newState.filteredQueries).has.lengthOf(3);
        });

        it('Should load tagged queries', () => {

            let action = {
                type: Actions.LOAD_QUERIES_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {
                                globalId: 'urn:hbo:query:all-action',
                                queryName: 'A-Z action',
                                title: 'Custom Query',
                                tags: 'urn:hbo:genre:action SORTBY=airDate DESC'
                            }
                        ]
                    }
                }
            };

            let state = {
                queryName: 'all-action',
                queries: [],
                filteredQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.globalId).to.equal('urn:hbo:query:all-action');
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action');
            expect(newState.currentQuery.sort.name).to.equal('airDate');
            expect(newState.currentQuery.sort.value).to.equal('DESC');
            expect(newState.queries).has.lengthOf(1);
            expect(newState.filteredQueries).has.lengthOf(1);
        });

        it('Should load queries', () => {

            let action = {
                type: Actions.LOAD_QUERIES_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {
                                globalId: 'urn:hbo:query:action-movies',
                                queryName: 'action-movies',
                                title: 'Action Movies',
                                tags: 'urn:hbo:genre:action&urn:hbo:content-category:movie&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                            },
                            {
                                globalId: 'urn:hbo:query:action-series',
                                queryName: 'action-series',
                                title: 'Action Series',
                                tags: 'urn:hbo:genre:action&(urn:hbo:content-category:series|urn:tag:franchise)&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                            },
                            {
                                globalId: 'urn:hbo:query:custom-query',
                                queryName: 'custom-query',
                                title: 'Custom Query',
                                tags: 'urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                            }
                        ]
                    }
                }
            };

            let state = {
                queryName: '',
                currentQuery: {
                    incomplete: true
                },
                queries: [],
                filteredQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.globalId).to.be.undefined;
            expect(newState.queries).has.lengthOf(3);
            expect(newState.filteredQueries).has.lengthOf(3);
        });

        it('Should handle A-Z HBO Max Originals query', () => {

            let action = {
                type: Actions.LOAD_QUERIES_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {
                                globalId: 'urn:hbo:query:action-movies',
                                queryName: 'action-movies',
                                title: 'Action Movies',
                                tags: 'urn:hbo:genre:action&urn:hbo:content-category:movie&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                            },
                            {
                                globalId: 'urn:hbo:query:action-series',
                                queryName: 'action-series',
                                title: 'Action Series',
                                tags: 'urn:hbo:genre:action&(urn:hbo:content-category:series|urn:tag:franchise)&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                            },
                            {
                                globalId: 'urn:hbo:query:all-hbo-max-originals',
                                queryName: 'all-hbo-max-originals',
                                title: 'A-Z HBO Max Originals',
                                tags: '(urn:warnermedia:brand:hbo&urn:hbo:genre:original|urn:warnermedia:brand:max-originals)'
                            }
                        ]
                    }
                }
            };

            let state = {
                queryName: 'action-movies',
                queries: [],
                filteredQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.globalId).to.equal('urn:hbo:query:action-movies');
            expect(newState.queries).has.lengthOf(3);
            expect(newState.filteredQueries).has.lengthOf(3);
        });

    });

    describe('FILTER_QUERIES_SUCCESS', () => {

        it('Should filter tagged queries', () => {

            let action = {
                type: Actions.FILTER_QUERIES,
                payload: 'Action'
            };

            let state = {
                queries: [
                    {
                        type: 'tagged-query',
                        globalId: 'urn:hbo:query:action-movies',
                        title: 'Action Movies',
                        tags: 'urn:hbo:genre:action&urn:hbo:content-category:movie&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                    },
                    {
                        type: 'tagged-query',
                        globalId: 'urn:hbo:query:action-series',
                        title: 'Action Series',
                        tags: 'urn:hbo:genre:action&(urn:hbo:content-category:series|urn:tag:franchise)&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                    },
                    {
                        type: 'tagged-query',
                        globalId: 'urn:hbo:query:custom-query',
                        title: 'Custom Query',
                        tags: 'urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                    },
                ]
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.filteredQueries).has.lengthOf(2);
            expect(newState.queriesFilter).to.equal('action');
        });

    });

    describe('LOAD_QUERY_SUCCESS', () => {

        it('Should load query', () => {

            let action = {
                type: Actions.LOAD_QUERY_SUCCESS,
                payload: {
                    type: 'tagged-query',
                    globalId: 'urn:hbo:query:custom-query',
                    checksum: 123456789,
                    title: 'Custom Query',
                    tags: 'urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                }
            };

            let state = {
                queries: [
                    {
                        type: 'tagged-query',
                        globalId: 'urn:hbo:query:action-movies',
                        title: 'Action Movies',
                        tags: 'urn:hbo:genre:action&urn:hbo:content-category:movie&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                    },
                    {
                        type: 'tagged-query',
                        globalId: 'urn:hbo:query:action-series',
                        title: 'Action Series',
                        tags: 'urn:hbo:genre:action&(urn:hbo:content-category:series|urn:tag:franchise)&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                    },
                    {
                        type: 'tagged-query',
                        globalId: 'urn:hbo:query:custom-query',
                        title: 'Custom Query',
                        tags: 'urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                    }
                ],
                currentQuery: {
                    type: 'tagged-query',
                    id: 'urn:hbo:query:custom-query',
                    title: 'Custom Query',
                    tags: 'urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)'
                }
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.checksum).to.equal(123456789);
        });

    });

    describe('UNDO_CURRENT_QUERY_UPDATE', () => {

        it('Should undo current query update', () => {

            let action = {
                type: Actions.UNDO_CURRENT_QUERY_UPDATE
            };

            let state = {
                currentQuery: {
                    status: 'approved',
                    json: [{}]
                },
                pastQueries: [
                    {
                        status: 'saved',
                        json: [{}]
                    },
                    {
                        status: 'pending',
                        json: [{}]
                    }
                ],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.status).to.equal('pending');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(1);
        });

    });

    describe('REDO_CURRENT_QUERY_UPDATE', () => {

        it('Should redo current query update', () => {

            let action = {
                type: Actions.REDO_CURRENT_QUERY_UPDATE
            };

            let state = {
                currentQuery: {
                    status: 'pending',
                    json: [{}]
                },
                pastQueries: [
                    {
                        status: 'saved',
                        json: [{}]
                    }
                ],
                futureQueries: [{
                    status: 'approved',
                    json: [{}]
                }]
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.status).to.equal('approved');
            expect(newState.pastQueries).has.lengthOf(2);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('UPDATE_STATUS', () => {

        it('Should update status', () => {

            let action = {
                type: Actions.UPDATE_STATUS,
                payload: 'approved'
            };

            let state = {
                currentQuery: {
                    status: 'pending'
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.status).to.equal('approved');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('SET_COMBINATOR', () => {

        it('Should set combinator', () => {

            let action = {
                type: Actions.SET_COMBINATOR,
                payload: {
                    id: 'primary-group',
                    combinator: 'or'
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.json[0].combinator).to.equal('or');
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action|!urn:tag:in-franchise|(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should handle incomplete rule', () => {

            let action = {
                type: Actions.SET_COMBINATOR,
                payload: {
                    id: 'primary-group',
                    combinator: 'or'
                }
            };

            let state = {
                currentQuery: {
                    json: [
                        {
                            id: 'primary-group',
                            combinator: 'and',
                            not: false,
                            rules: [
                                {
                                    id: 'primary-group-rule-0',
                                    index: 0,
                                    field: 'genre',
                                    value: 'action',
                                    operator: '=',
                                    incomplete: false,
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'primary-group-rule-1',
                                    index: 1,
                                    field: 'brand',
                                    operator: '=',
                                    value: '',
                                    incomplete: true,
                                    groupId: 'primary-group',
                                }
                            ],
                            deletable: false,
                            incomplete: true
                        }
                    ],
                    tags: 'urn:hbo:genre:action<span style="color: #FF5353">&urn:tag:</span>'
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.json[0].combinator).to.equal('or');
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action<span style="color: #FF5353">|urn:warnermedia:brand:</span>');
            expect(newState.currentQuery.incomplete).to.be.true;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('ADD_RULE', () => {

        it('Should add rule', () => {

            let action = {
                type: Actions.ADD_RULE,
                payload: {
                    group: {
                        id: 'secondary-group'
                    }
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action&!urn:tag:in-franchise<span style="color: #FF5353">&(urn:tag:feature|urn:tag:franchise|urn:tag:series<span style="color: #FF5353">|</span>)</span>');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should add rule before an existing group', () => {

            let action = {
                type: Actions.ADD_RULE,
                payload: {
                    group: {
                        id: 'primary-group'
                    }
                }
            };

            let state = {
                currentQuery: {
                    json: [
                        {
                            id: 'primary-group',
                            combinator: 'and',
                            not: false,
                            rules: [
                                {
                                    id: 'primary-group-rule-0',
                                    index: 0,
                                    field: 'genre',
                                    operator: '',
                                    value: '',
                                    incomplete: true,
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'secondary-group',
                                    index: 1,
                                    combinator: 'or',
                                    not: false,
                                    deletable: true,
                                    incomplete: false,
                                    rules: [
                                        {
                                            id: 'secondary-group-rule-0',
                                            index: 0,
                                            field: 'tag',
                                            value: 'feature',
                                            operator: '=',
                                            incomplete: false,
                                            groupId: 'secondary-group'
                                        },
                                        {
                                            id: 'secondary-group-rule-1',
                                            index: 1,
                                            field: 'tag',
                                            value: 'franchise',
                                            operator: '=',
                                            incomplete: false,
                                            groupId: 'secondary-group'
                                        }
                                    ],
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'primary-group-rule-2',
                                    index: 2,
                                    field: 'tag',
                                    value: 'in-franchise',
                                    operator: '!=',
                                    incomplete: false,
                                    groupId: 'primary-group',
                                }
                            ],
                            deletable: false,
                            incomplete: true
                        }
                    ]
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('<span style="color: #FF5353">urn:hbo:genre:</span><span style="color: #FF5353">&</span>&(urn:tag:feature|urn:tag:franchise)&!urn:tag:in-franchise');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('SET_RULE_FIELD', () => {

        it('Should set rule field', () => {

            let action = {
                type: Actions.SET_RULE_FIELD,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0',
                    field: 'brand'
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('<span style="color: #FF5353">urn:warnermedia:brand:</span>&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('SET_RULE_OPERATOR', () => {

        it('Should set rule operator', () => {

            let action = {
                type: Actions.SET_RULE_OPERATOR,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0',
                    operator: '!='
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('!urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should set rule operator and flip incomplete if now complete', () => {

            let action = {
                type: Actions.SET_RULE_OPERATOR,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0',
                    operator: '='
                }
            };

            let state = {
                currentQuery: {
                    json: [
                        {
                            id: 'primary-group',
                            combinator: 'and',
                            not: false,
                            rules: [
                                {
                                    id: 'primary-group-rule-0',
                                    index: 0,
                                    field: 'genre',
                                    value: 'action',
                                    operator: '',
                                    incomplete: true,
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'primary-group-rule-1',
                                    index: 1,
                                    field: 'brand',
                                    operator: '=',
                                    value: 'cnn',
                                    incomplete: false,
                                    groupId: 'primary-group',
                                }
                            ],
                            deletable: false,
                            incomplete: true
                        }
                    ],
                    tags: '<span style="color: #FF5353">urn:hbo:genre:action</span>&urn:warnermedia:brand:cnn'
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action&urn:warnermedia:brand:cnn');
            expect(newState.currentQuery.incomplete).to.be.false;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should set rule operator', () => {

            let action = {
                type: Actions.SET_RULE_OPERATOR,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0',
                    operator: '='
                }
            };

            let state = {
                currentQuery: {
                    json: [
                        {
                            id: 'primary-group',
                            combinator: 'and',
                            not: false,
                            rules: [
                                {
                                    id: 'primary-group-rule-0',
                                    index: 0,
                                    field: 'genre',
                                    value: '',
                                    operator: '',
                                    incomplete: true,
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'primary-group-rule-1',
                                    index: 1,
                                    field: 'brand',
                                    operator: '=',
                                    value: 'cnn',
                                    incomplete: false,
                                    groupId: 'primary-group',
                                }
                            ],
                            deletable: false,
                            incomplete: true
                        }
                    ],
                    tags: '<span style="color: #FF5353">urn:hbo:genre:</span>&urn:warnermedia:brand:cnn'
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('<span style="color: #FF5353">urn:hbo:genre:</span>&urn:warnermedia:brand:cnn');
            expect(newState.currentQuery.incomplete).to.be.true;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('SET_RULE_VALUE', () => {

        it('Should set rule value', () => {

            let action = {
                type: Actions.SET_RULE_VALUE,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0',
                    value: 'comedy'
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:comedy&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should set rule value and flip incomplete if now complete', () => {

            let action = {
                type: Actions.SET_RULE_VALUE,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0',
                    value: 'action'
                }
            };

            let state = {
                currentQuery: {
                    json: [
                        {
                            id: 'primary-group',
                            combinator: 'and',
                            not: false,
                            rules: [
                                {
                                    id: 'primary-group-rule-0',
                                    index: 0,
                                    field: 'genre',
                                    value: '',
                                    operator: '=',
                                    incomplete: true,
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'primary-group-rule-1',
                                    index: 1,
                                    field: 'brand',
                                    operator: '=',
                                    value: 'cnn',
                                    incomplete: false,
                                    groupId: 'primary-group',
                                }
                            ],
                            deletable: false,
                            incomplete: true
                        }
                    ],
                    tags: '<span style="color: #FF5353">urn:hbo:genre:action</span>&urn:warnermedia:brand:cnn'
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action&urn:warnermedia:brand:cnn');
            expect(newState.currentQuery.incomplete).to.be.false;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should set rule value', () => {

            let action = {
                type: Actions.SET_RULE_VALUE,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0',
                    value: 'action'
                }
            };

            let state = {
                currentQuery: {
                    json: [
                        {
                            id: 'primary-group',
                            combinator: 'and',
                            not: false,
                            rules: [
                                {
                                    id: 'primary-group-rule-0',
                                    index: 0,
                                    field: 'genre',
                                    operator: '',
                                    value: '',
                                    incomplete: true,
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'primary-group-rule-1',
                                    index: 1,
                                    field: 'brand',
                                    operator: '=',
                                    value: 'cnn',
                                    incomplete: false,
                                    groupId: 'primary-group',
                                }
                            ],
                            deletable: false,
                            incomplete: true
                        }
                    ],
                    tags: '<span style="color: #FF5353">urn:hbo:genre:action</span>&urn:warnermedia:brand:cnn'
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('<span style="color: #FF5353">urn:hbo:genre:action</span>&urn:warnermedia:brand:cnn');
            expect(newState.currentQuery.incomplete).to.be.true;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('DELETE_RULE', () => {

        it('Should delete rule', () => {

            let action = {
                type: Actions.DELETE_RULE,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0'
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should delete rule', () => {

            let action = {
                type: Actions.DELETE_RULE,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0'
                }
            };

            let state = {
                currentQuery: {
                    json: [{
                        id: 'primary-group',
                        combinator: 'and',
                        not: false,
                        rules: [
                            {
                                id: 'primary-group-rule-0',
                                index: 0,
                                field: 'genre',
                                value: 'action',
                                operator: '=',
                                incomplete: false,
                                groupId: 'primary-group',
                            },
                            {
                                id: 'primary-group-rule-1',
                                index: 1,
                                field: 'tag',
                                value: '',
                                operator: '!=',
                                incomplete: true,
                                groupId: 'primary-group',
                            }
                        ],
                        deletable: false,
                        incomplete: true
                    }],
                    tags: 'urn:hbo:genre:action<span style="color: #FF5353">&urn:tag:</span>',
                    incomplete: true
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('<span style="color: #FF5353">!urn:tag:</span>');
            expect(newState.currentQuery.incomplete).to.be.true;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should handle delete of only rule', () => {

            let action = {
                type: Actions.DELETE_RULE,
                payload: {
                    groupId: 'primary-group',
                    ruleId: 'primary-group-rule-0'
                }
            };

            let state = {
                currentQuery: {
                    json: [{
                        id: 'primary-group',
                        combinator: 'and',
                        not: false,
                        rules: [
                            {
                                id: 'primary-group-rule-0',
                                index: 0,
                                field: 'genre',
                                value: 'action',
                                operator: '=',
                                incomplete: false,
                                groupId: 'primary-group',
                            }
                        ],
                        deletable: false,
                        incomplete: false
                    }],
                    tags: 'urn:hbo:genre:action'
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('');
            expect(newState.currentQuery.incomplete).to.be.true;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('ADD_GROUP', () => {

        it('Should add group', () => {

            let action = {
                type: Actions.ADD_GROUP,
                payload: {
                    group: {
                        id: 'primary-group'
                    }
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action&!urn:tag:in-franchise<span style="color: #FF5353">&()</span>&(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should add group before an existing group', () => {

            let action = {
                type: Actions.ADD_GROUP,
                payload: {
                    group: {
                        id: 'primary-group'
                    }
                }
            };

            let state = {
                currentQuery: {
                    json: [
                        {
                            id: 'primary-group',
                            combinator: 'and',
                            not: false,
                            rules: [
                                {
                                    id: 'primary-group-rule-0',
                                    index: 0,
                                    field: 'genre',
                                    operator: '',
                                    value: '',
                                    incomplete: true,
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'secondary-group',
                                    index: 1,
                                    combinator: 'or',
                                    not: false,
                                    deletable: true,
                                    incomplete: false,
                                    rules: [
                                        {
                                            id: 'secondary-group-rule-0',
                                            index: 0,
                                            field: 'tag',
                                            value: 'feature',
                                            operator: '=',
                                            incomplete: false,
                                            groupId: 'secondary-group'
                                        },
                                        {
                                            id: 'secondary-group-rule-1',
                                            index: 1,
                                            field: 'tag',
                                            value: 'franchise',
                                            operator: '=',
                                            incomplete: false,
                                            groupId: 'secondary-group'
                                        }
                                    ],
                                    groupId: 'primary-group',
                                },
                                {
                                    id: 'primary-group-rule-2',
                                    index: 2,
                                    field: 'tag',
                                    value: 'in-franchise',
                                    operator: '!=',
                                    incomplete: false,
                                    groupId: 'primary-group',
                                }
                            ],
                            deletable: false,
                            incomplete: true
                        }
                    ]
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('<span style="color: #FF5353">urn:hbo:genre:</span><span style="color: #FF5353">&()</span>&(urn:tag:feature|urn:tag:franchise)&!urn:tag:in-franchise');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('DELETE_GROUP', () => {

        it('Should delete group', () => {

            let action = {
                type: Actions.DELETE_GROUP,
                payload: {
                    parentGroupId: 'primary-group',
                    groupId: 'secondary-group'
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action&!urn:tag:in-franchise');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('TOGGLE_NOT', () => {

        it('Should toggle NOT', () => {

            let action = {
                type: Actions.TOGGLE_NOT,
                payload: 'primary-group'
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('!(urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series))');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should toggle NOT', () => {

            let action = {
                type: Actions.TOGGLE_NOT,
                payload: 'secondary-group'
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action&!urn:tag:in-franchise&!(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should toggle NOT', () => {

            let action = {
                type: Actions.TOGGLE_NOT,
                payload: 'dd57e080-e6be-11ea-b664-69badf84cdb4'
            };

            let state = {
                currentQuery: {
                    tags: 'urn:hbo:genre:action',
                    json: [
                        {
                            combinator: '',
                            deletable: false,
                            id: 'dd57e080-e6be-11ea-b664-69badf84cdb4',
                            rules: [{
                                field: 'genre',
                                groupId: 'dd57e080-e6be-11ea-b664-69badf84cdb4',
                                id: 'dd57e081-e6be-11ea-b664-69badf84cdb4',
                                incomplete: false,
                                index: 0,
                                operator: '=',
                                tag: 'urn:hbo:genre:',
                                value: 'action'
                            }]
                        }
                    ],
                    incomplete: false
                },
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('!(urn:hbo:genre:action)');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('SET_SORT_NAME', () => {

        it('Should set sort name', () => {

            let action = {
                type: Actions.SET_SORT_NAME,
                payload: 'title'
            };

            const query = {
                sort: {
                    name: 'airDate',
                    value: 'DESC'
                },
                tags: 'urn:hbo:genre:action'
            };

            let state = {
                currentQuery: query,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.sort.name).to.equal('title');
            expect(newState.currentQuery.incomplete).to.be.false;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should set sort name', () => {

            let action = {
                type: Actions.SET_SORT_NAME,
                payload: 'title'
            };

            const query = {
                sort: {
                    name: 'airDate',
                    value: 'DESC'
                },
                tags: 'urn:hbo:genre:action<span style="color: #FF5353">&urn:tag:</span>'
            };

            let state = {
                currentQuery: query,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.sort.name).to.equal('title');
            expect(newState.currentQuery.incomplete).to.be.true;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('SET_SORT_VALUE', () => {

        it('Should set sort value', () => {

            let action = {
                type: Actions.SET_SORT_VALUE,
                payload: 'ASC'
            };

            const query = {
                sort: {
                    name: 'airDate',
                    value: 'DESC'
                },
                tags: 'urn:hbo:genre:action'
            };

            let state = {
                currentQuery: query,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.sort.value).to.equal('ASC');
            expect(newState.currentQuery.incomplete).to.be.false;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should set sort value', () => {

            let action = {
                type: Actions.SET_SORT_VALUE,
                payload: 'ASC'
            };

            const query = {
                sort: {
                    name: 'airDate',
                    value: 'DESC'
                },
                tags: 'urn:hbo:genre:action<span style="color: #FF5353">&urn:tag:</span>'
            };

            let state = {
                currentQuery: query,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.sort.value).to.equal('ASC');
            expect(newState.currentQuery.incomplete).to.be.true;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('ADD_SORT', () => {

        it('Should add sort', () => {

            let action = {
                type: Actions.ADD_SORT
            };

            const query = {
                tags: 'urn:hbo:genre:action'
            };

            let state = {
                currentQuery: query,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.sort.name).to.equal('');
            expect(newState.currentQuery.sort.value).to.equal('DESC');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('DELETE_SORT', () => {

        it('Should delete sort', () => {

            let action = {
                type: Actions.DELETE_SORT
            };

            const query = {
                tags: 'urn:hbo:genre:action',
                sort: {
                    name: 'airDate',
                    value: 'DESC'
                },
                sortString: 'SORTBY=airDate DESC'
            };

            let state = {
                currentQuery: query,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.sort).to.be.undefined;
            expect(newState.currentQuery.sortString).to.equal('');
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should delete sort', () => {

            let action = {
                type: Actions.DELETE_SORT
            };

            const query = {
                tags: 'urn:hbo:genre:action<span style="color: #FF5353">&urn:tag:</span>',
                sort: {
                    name: 'airDate',
                    value: 'DESC'
                },
                sortString: 'SORTBY=airDate DESC'
            };

            let state = {
                currentQuery: query,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.sort).to.be.undefined;
            expect(newState.currentQuery.sortString).to.equal('');
            expect(newState.currentQuery.incomplete).to.be.true;
            expect(newState.pastQueries).has.lengthOf(1);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('ADD_QUERY', () => {

        it('Should copy query', () => {

            let action = {
                type: Actions.ADD_QUERY,
                payload: {
                    title: 'New Query',
                    copyQuery: true
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.title).to.equal('New Query');
            expect(newState.currentQuery.queryName).to.equal('New Query');
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
            expect(newState.pastQueries).has.lengthOf(0);
            expect(newState.futureQueries).has.lengthOf(0);
        });

        it('Should add empty query if copyQuery false', () => {

            let action = {
                type: Actions.ADD_QUERY,
                payload: {
                    title: 'New Query',
                    copyQuery: false
                }
            };

            let state = {
                currentQuery: customQuery,
                pastQueries: [],
                futureQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.title).to.equal('New Query');
            expect(newState.currentQuery.queryName).to.equal('New Query');
            expect(newState.currentQuery.tags).to.equal('');
            expect(newState.pastQueries).has.lengthOf(0);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('GET QUERY LOCK', () => {

        it('Should set is loading query lock', () => {

            let action = {
                type: Actions.GET_QUERY_LOCK
            };

            let state = {
                isLoadingQueryLock: false
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.isLoadingQueryLock).to.be.true;
        });

    });

    describe('GET_QUERY_LOCK_SUCCESS', () => {

        it('Should handle if NO current query', () => {

            let action = {
                type: Actions.GET_QUERY_LOCK_SUCCESS,
                payload: {
                    data: {
                        locked: true,
                        createdBy: 'jeseiter',
                        created: '2018-09-01T16:00:00.000Z'

                    },
                    user: {
                        displayName: 'jeseiter'
                    }
                }
            };

            let state = {
                queries: [{index: 0}, {index: 1}, {index: 2}],
                currentQuery: null,
                isLoadingQueryLock: true
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.isLoadingQueryLock).to.be.false;
        });

        it('Should set current query lock', () => {

            let action = {
                type: Actions.GET_QUERY_LOCK_SUCCESS,
                payload: {
                    data: {
                        locked: true,
                        createdBy: 'jeseiter',
                        created: '2018-09-01T16:00:00.000Z'

                    },
                    user: {
                        displayName: 'jeseiter'
                    }
                }
            };

            let state = {
                queries: [{index: 0}, {index: 1}, {index: 2}],
                currentQuery: {index: 1},
                isLoadingQueryLock: true
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.lock.locked).to.be.true;
            expect(newState.currentQuery.lock.lockedByUser).to.be.true;
            expect(newState.currentQuery.lock.lockedByOther).to.be.false;
            expect(newState.isLoadingQueryLock).to.be.false;
        });

        it('Should set current query lock', () => {

            let action = {
                type: Actions.GET_QUERY_LOCK_SUCCESS,
                payload: {
                    data: {
                        locked: true,
                        createdBy: '',

                    },
                    user: {
                        displayName: 'jeseiter'
                    }
                }
            };

            let state = {
                queries: [{index: 0}, {index: 1}, {index: 2}],
                currentQuery: {index: 1},
                currentQueryIndex: 1,
                isLoadingQueryLock: true
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.lock.locked).to.be.true;
            expect(newState.currentQuery.lock.lockedByUser).to.be.false;
            expect(newState.currentQuery.lock.lockedByOther).to.be.true;
            expect(newState.isLoadingQueryLock).to.be.false;
        });

        it('Should set current query lock', () => {

            let action = {
                type: Actions.GET_QUERY_LOCK_SUCCESS,
                payload: {
                    data: {
                        locked: true,
                        createdBy: 'bmeehan',

                    },
                    user: {
                        displayName: 'jeseiter'
                    }
                }
            };

            let state = {
                queries: [{index: 0}, {index: 1}, {index: 2}],
                currentQuery: {index: 1},
                currentQueryIndex: 1,
                isLoadingQueryLock: true
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.lock.locked).to.be.true;
            expect(newState.currentQuery.lock.lockedByUser).to.be.false;
            expect(newState.currentQuery.lock.lockedByOther).to.be.true;
            expect(newState.isLoadingQueryLock).to.be.false;
        });

    });

    describe('LOCK_QUERY', () => {

        it('Should save pending action', () => {

            let action = {
                type: Actions.LOCK_QUERY
            };

            let state = {
                pendingAction: null
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.pendingAction).to.be.null;
        });

        it('Should save pending action', () => {

            let payload = {
                id: 'primary-group',
                combinator: 'or'
            };

            let action = {
                type: Actions.LOCK_QUERY,
                payload: {
                    type: Actions.SET_COMBINATOR,
                    payload: payload
                }
            };

            let state = {
                pendingAction: null
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.pendingAction.type).to.equal(Actions.SET_COMBINATOR);
            expect(newState.pendingAction.payload).to.equal(payload);
        });

    });

    describe('LOCK_QUERY_SUCCESS', () => {

        it('Should set current query lock', () => {

            let action = {
                type: Actions.LOCK_QUERY_SUCCESS,
                payload: {
                    displayName: 'jeseiter'
                }
            };

            let state = {
                currentQuery: {}
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.lock.locked).to.be.true;
            expect(newState.currentQuery.lock.lockedBy).to.equal('jeseiter');
            expect(newState.currentQuery.lock.lockedByUser).to.be.true;
            expect(newState.currentQuery.lock.lockedByOther).to.be.false;
        });

    });

    describe('UNLOCK_QUERY_SUCCESS', () => {

        it('Should unlock current query', () => {

            let action = {
                type: Actions.UNLOCK_QUERY_SUCCESS
            };

            let state = {
                currentQuery: {
                    lock: {
                        locked: true,
                        lockedBy: 'jeseiter',
                        lockedByUser: true,
                        lockedByOther: false
                    }
                },
                pastQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.lock).to.be.undefined;
        });

        it('Should unlock current query', () => {

            let action = {
                type: Actions.UNLOCK_QUERY_SUCCESS
            };

            let state = {
                currentQuery: {
                    lock: {
                        locked: true,
                        lockedBy: 'jeseiter',
                        lockedByUser: true,
                        lockedByOther: false
                    }
                },
                pastQueries: [{status: 'saved'}, {status: 'pending'}, {status: 'approved'}]
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.lock).to.be.undefined;
            expect(newState.pastQueries).has.lengthOf(0);
            expect(newState.currentQuery.status).to.equal('saved');
        });

        it('Should handle case where current query is null', () => {

            let action = {
                type: Actions.UNLOCK_QUERY_SUCCESS
            };

            let state = {
                currentQuery: null,
                pastQueries: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery).to.be.null;
        });

    });

    describe('CREATE_QUERY_SUCCESS', () => {

        it('Should reset past and future queries', () => {

            let action = {
                type: Actions.CREATE_QUERY_SUCCESS,
                payload: {}
            };

            let state = {
                currentQuery: {
                    lock: {
                        locked: true,
                        lockedBy: 'jeseiter',
                        lockedByUser: true,
                        lockedByOther: false
                    }
                },
                pastQueries: [{}],
                futureQueries: [{}]
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.pastQueries).has.lengthOf(0);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('UPDATE_QUERY_SUCCESS', () => {

        it('Should reset past and future queries', () => {

            let action = {
                type: Actions.UPDATE_QUERY_SUCCESS,
                payload: {}
            };

            let state = {
                currentQuery: {
                    lock: {
                        locked: true,
                        lockedBy: 'jeseiter',
                        lockedByUser: true,
                        lockedByOther: false
                    }
                },
                pastQueries: [{}],
                futureQueries: [{}]
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.pastQueries).has.lengthOf(0);
            expect(newState.futureQueries).has.lengthOf(0);
        });

    });

    describe('LOAD_QUERY_OFFERINGS', () => {

        it('Should set isLoading', () => {

            let action = {
                type: Actions.LOAD_QUERY_OFFERINGS
            };

            let state = {
                isLoading: false
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.isLoading).to.be.true;
        });

    });

    describe('LOAD_QUERY_OFFERINGS_SUCCESS', () => {

        it('Should set offerings', () => {

            let action = {
                type: Actions.LOAD_QUERY_OFFERINGS_SUCCESS,
                payload: {
                    request: {
                        body: JSON.stringify({
                            offset: 0
                        })
                    },
                    response: {
                        data: {
                            offerings: [{}, {}, {}],
                            totalFound: 3,
                            lastUpdatedDate: '2017-10-05T18:50:00.000Z'
                        }
                    }
                }
            };

            let state = {
                isLoading: true,
                offset: 0,
                lastUpdatedDate: '',
                offerings: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.isLoading).to.be.false;
            expect(newState.offset).to.equal(0);
            expect(newState.offerings.length).to.equal(3);
        });

        it('Should set offerings', () => {

            let state = {
                isLoading: true,
                offset: 0,
                lastUpdatedDate: '',
                offerings: [{}, {}, {}]
            };

            let action = {
                type: Actions.LOAD_QUERY_OFFERINGS_SUCCESS,
                payload: {
                    request: {
                        body: JSON.stringify({
                            offset: 50
                        })
                    },
                    response: {
                        data: {
                            offerings: [{}, {}, {}],
                            totalFound: 3,
                            lastUpdatedDate: '2017-10-05T18:50:00.000Z'
                        }
                    }
                }
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.isLoading).to.be.false;
            expect(newState.offset).to.equal(50);
            expect(newState.offerings.length).to.equal(6);
        });

    });

    describe('LOAD_QUERY_OFFERINGS_ERROR', () => {

        it('Should reset isLoading', () => {

            let action = {
                type: Actions.LOAD_QUERY_OFFERINGS_ERROR
            };

            let state = {
                isLoading: true,
                offset: 0,
                lastUpdatedDate: '',
                offerings: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.isLoading).to.be.false;
        });

    });

    describe('LOAD_AGES_SUCCESS', () => {

        it('Should load ages', () => {

            let action = {
                type: Actions.LOAD_AGES_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {label: 'Little Kids', tag: 'urn:warnermedia:age:little-kid', value: 'little-kid'},
                            {label: 'Big Kids', tag: 'urn:warnermedia:age:big-kid', value: 'big-kid'},
                            {label: 'Tween', tag: 'urn:warnermedia:age:tween', value: 'tween'},
                            {label: 'Teen', tag: 'urn:warnermedia:age:teen', value: 'teen'}
                        ]
                    }
                }
            };

            let state = {
                ages: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.ages).has.lengthOf(4);
        });

    });

    describe('LOAD_TAGS_SUCCESS', () => {

        it('Should load tags', () => {

            let action = {
                type: Actions.LOAD_TAGS_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {label: 'Feature', tag: 'urn:tag:feature', value: 'feature'},
                            {label: 'Franchise', tag: 'urn:tag:franchise', value: 'franchise'},
                            {label: 'In Franchise', tag: 'urn:tag:in-franchise', value: 'in-franchise'},
                            {label: 'Series', tag: 'urn:tag:series', value: 'series'}
                        ]
                    }
                }
            };

            let state = {
                tags: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.tags).has.lengthOf(4);
        });

    });

    describe('LOAD_GENRES_SUCCESS', () => {

        it('Should load genres', () => {

            let action = {
                type: Actions.LOAD_GENRES_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {label: 'Action', genre: 'urn:hbo:genre:action', value: 'action'},
                            {label: 'Comedy', genre: 'urn:hbo:genre:comedy', value: 'comedy'},
                            {label: 'Crime', genre: 'urn:hbo:genre:crime', value: 'crime'},
                            {label: 'Documentaries', genre: 'urn:hbo:genre:documentary', value: 'documentary'},
                            {label: 'Drama', genre: 'urn:hbo:genre:drama', value: 'drama'},
                            {label: 'Fantasy & Sci-Fi', genre: 'urn:hbo:genre:fantasy-sci-fi', value: 'fantasy-sci-fi'},
                            {label: 'Horror', genre: 'urn:hbo:genre:horror', value: 'horror'},
                            {label: 'International', genre: 'urn:hbo:genre:international', value: 'international'},
                            {label: 'Kid', genre: 'urn:hbo:genre:kid', value: 'kid'},
                            {label: 'Latino', genre: 'urn:hbo:genre:latino', value: 'latino'},
                            {label: 'Music', genre: 'urn:hbo:genre:music', value: 'music'},
                            {label: 'News/Talk', genre: 'urn:hbo:genre:news-talk', value: 'news-talk'},
                            {label: 'Originals', genre: 'urn:hbo:genre:original', value: 'original'},
                            {label: 'Reality', genre: 'urn:hbo:genre:reality', value: 'reality'},
                            {label: 'Romance', genre: 'urn:hbo:genre:romance', value: 'romance'},
                            {label: 'Short', genre: 'urn:hbo:genre:short', value: 'short'},
                            {label: 'Sports', genre: 'urn:hbo:genre:sport', value: 'sport'},
                            {label: 'Suspense', genre: 'urn:hbo:genre:suspense', value: 'suspense'}
                        ]
                    }
                }
            };

            let state = {
                tags: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.genres).has.lengthOf(18);
        });

    });

    describe('LOAD_CATEGORIES_SUCCESS', () => {

        it('Should load categories', () => {

            let action = {
                type: Actions.LOAD_CATEGORIES_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {label: 'Movie', tag: 'urn:hbo:content-category:movie', value: 'movie'},
                            {label: 'Series', tag: 'urn:hbo:content-category:series', value: 'series'},
                            {label: 'Specials', tag: 'urn:hbo:content-category:special', value: 'special'}
                        ]
                    }
                }
            };

            let state = {
                tags: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.categories).has.lengthOf(3);
        });

    });

    describe('LOAD_BRANDS_SUCCESS', () => {

        it('Should load brands', () => {

            let action = {
                type: Actions.LOAD_BRANDS_SUCCESS,
                payload: {
                    response: {
                        data: [
                            {label: 'CNN', tag: 'urn:warnermedia:brand:cnn', value: 'cnn'},
                            {label: 'CNN Films', tag: 'urn:warnermedia:brand:cnn-films', value: 'cnn-films'},
                            {label: 'DC Comics', tag: 'urn:warnermedia:brand:dc-comics', value: 'dc-comics'},
                            {label: 'HBO', tag: 'urn:warnermedia:brand:hbo', value: 'hbo'},
                            {label: 'truTV', tag: 'urn:warnermedia:brand:trutv', value: 'trutv'}
                        ]
                    }
                }
            };

            let state = {
                tags: []
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.brands).has.lengthOf(5);
        });

    });

    describe('LOAD_TOGGLE_FULL_QUERY', () => {

        it('Should toggle full query', () => {

            let action = {
                type: Actions.TOGGLE_FULL_QUERY
            };

            let state = {
                currentQuery: {
                    tags: 'urn:hbo:genre:action'
                }
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)');
        });

        it('Should toggle full query', () => {

            let action = {
                type: Actions.TOGGLE_FULL_QUERY
            };

            let state = {
                currentQuery: {
                    tags: 'urn:hbo:genre:action&!urn:tag:in-franchise&(urn:tag:feature|urn:tag:franchise|urn:tag:series)',
                    hasSuffix: true
                }
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.currentQuery.tags).to.equal('urn:hbo:genre:action');
        });

    });

    describe('CLEAR_QUERIES', () => {

        it('Should clearQueries', () => {

            let action = {
                type: Actions.CLEAR_QUERIES
            };

            let state = {
                pastQueries: [{}, {}],
                currentQuery: {
                    tags: 'urn:hbo:genre:action'
                }
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState.pastQueries).has.lengthOf(0);
        });

    });

    describe('UNDEFINED ACTION', () => {

        it('Should handle undefined action', () => {

            let state = {};

            let action = {
                type: 'UNDEFINED ACTION'
            };

            let newState = QueryBuilderReducer(state, action);
            expect(newState).to.equal(state);
        });

    });

});
