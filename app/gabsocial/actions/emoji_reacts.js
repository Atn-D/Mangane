import api from '../api';
import { importFetchedAccounts, importFetchedStatus } from './importer';

export const EMOJI_REACT_REQUEST = 'EMOJI_REACT_REQUEST';
export const EMOJI_REACT_SUCCESS = 'EMOJI_REACT_SUCCESS';
export const EMOJI_REACT_FAIL    = 'EMOJI_REACT_FAIL';

export const UNEMOJI_REACT_REQUEST = 'UNEMOJI_REACT_REQUEST';
export const UNEMOJI_REACT_SUCCESS = 'UNEMOJI_REACT_SUCCESS';
export const UNEMOJI_REACT_FAIL    = 'UNEMOJI_REACT_FAIL';

export const EMOJI_REACTS_FETCH_REQUEST = 'EMOJI_REACTS_FETCH_REQUEST';
export const EMOJI_REACTS_FETCH_SUCCESS = 'EMOJI_REACTS_FETCH_SUCCESS';
export const EMOJI_REACTS_FETCH_FAIL    = 'EMOJI_REACTS_FETCH_FAIL';

const noOp = () => () => new Promise(f => f());

export function fetchEmojiReacts(id, emoji) {
  return (dispatch, getState) => {
    if (!getState().get('me')) return dispatch(noOp());

    dispatch(fetchEmojiReactsRequest(id, emoji));

    const url = emoji
      ? `/api/v1/pleroma/statuses/${id}/reactions/${emoji}`
      : `/api/v1/pleroma/statuses/${id}/reactions`;

    return api(getState).get(url).then(response => {
      response.data.forEach(emojiReact => {
        dispatch(importFetchedAccounts(emojiReact.accounts));
      });
      dispatch(fetchEmojiReactsSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchEmojiReactsFail(id, error));
    });
  };
};

export function emojiReact(status, emoji) {
  return function(dispatch, getState) {
    if (!getState().get('me')) return dispatch(noOp());

    dispatch(emojiReactRequest(status, emoji));

    return api(getState)
      .put(`/api/v1/pleroma/statuses/${status.get('id')}/reactions/${emoji}`)
      .then(function(response) {
        dispatch(importFetchedStatus(response.data));
        dispatch(emojiReactSuccess(status, emoji));
      }).catch(function(error) {
        dispatch(emojiReactFail(status, emoji, error));
      });
  };
};

export function unEmojiReact(status, emoji) {
  return (dispatch, getState) => {
    if (!getState().get('me')) return dispatch(noOp());

    dispatch(unEmojiReactRequest(status, emoji));

    return api(getState)
      .delete(`/api/v1/pleroma/statuses/${status.get('id')}/reactions/${emoji}`)
      .then(response => {
        dispatch(importFetchedStatus(response.data));
        dispatch(unEmojiReactSuccess(status, emoji));
      }).catch(error => {
        dispatch(unEmojiReactFail(status, emoji, error));
      });
  };
};

export function fetchEmojiReactsRequest(id, emoji) {
  return {
    type: EMOJI_REACTS_FETCH_REQUEST,
    id,
    emoji,
  };
};

export function fetchEmojiReactsSuccess(id, emojiReacts) {
  return {
    type: EMOJI_REACTS_FETCH_SUCCESS,
    id,
    emojiReacts,
  };
};

export function fetchEmojiReactsFail(id, error) {
  return {
    type: EMOJI_REACTS_FETCH_FAIL,
    error,
  };
};

export function emojiReactRequest(status, emoji) {
  return {
    type: EMOJI_REACT_REQUEST,
    status,
    emoji,
    skipLoading: true,
  };
};

export function emojiReactSuccess(status, emoji) {
  return {
    type: EMOJI_REACT_SUCCESS,
    status,
    emoji,
    skipLoading: true,
  };
};

export function emojiReactFail(status, emoji, error) {
  return {
    type: EMOJI_REACT_FAIL,
    status,
    emoji,
    error,
    skipLoading: true,
  };
};

export function unEmojiReactRequest(status, emoji) {
  return {
    type: UNEMOJI_REACT_REQUEST,
    status,
    emoji,
    skipLoading: true,
  };
};

export function unEmojiReactSuccess(status, emoji) {
  return {
    type: UNEMOJI_REACT_SUCCESS,
    status,
    emoji,
    skipLoading: true,
  };
};

export function unEmojiReactFail(status, emoji, error) {
  return {
    type: UNEMOJI_REACT_FAIL,
    status,
    emoji,
    error,
    skipLoading: true,
  };
};
