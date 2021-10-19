/* eslint-disable no-unused-vars */
import { combineReducers } from 'redux'

const defaultState = {
  columns: [],
  selected: [
    { id: '0', alias: 'name', title: 'наименование' },
    { id: '1', alias: 'value', title: 'Значение' },
    { id: '2', alias: 'department', title: 'отдел' }
  ]
}

const secondaryState = {
  rooms: [
    {
      id: 0,
      number: '101',
      events: [
      ],
      top: 0
    },
    {
      id: 1,
      number: '102',
      events: [],
      top: 0
    },
    {
      id: 2,
      number: '103-b',
      events: [
      ],
      top: 0
    },
    {
      id: 3,
      number: '114',
      events: [],
      top: 0
    }
  ]
}

export default function mainReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_SELECTED':
      return {
        ...state,
        selected: action.payload
      }
    default:
      return state
  }
}

function secondaryReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_SELECTED':
      return {
        ...state,
        selected: action.payload
      }
    default:
      return state
  }
}
