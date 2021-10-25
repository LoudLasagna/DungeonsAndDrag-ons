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
        {
          id: 1,
          name: 'test1',
          start: '8:30',
          end: '10:00',
          duration: 3
        },
        {
          id: 2,
          name: 'test2',
          start: '13:30',
          end: '14:00',
          duration: 1
        }
      ],
      top: 0
    },
    {
      id: 1,
      number: '102',
      events: [
        {
          id: 3,
          name: 'test3',
          start: '16:00',
          end: '18:00',
          duration: 4
        }
      ],
      top: 0
    },
    {
      id: 2,
      number: '103-b',
      events: [
        {
          id: 4,
          name: 'test4',
          start: '9:00',
          end: '12:00',
          duration: 7
        }
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

function mainReducer(state = defaultState, action) {
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

function secondaryReducer(state = secondaryState, action) {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state,
        rooms: action.rooms
      }
    case 'CHANGE_ROOM': {
      const tRooms = state.rooms.slice();
      console.log(action);
      for (let i = 0; i < tRooms.length; i += 1) {
        if (tRooms[i].id === action.from) {
          tRooms[i].events.splice(
            tRooms[i].events.findIndex((elem) => elem.id === action.object.id), 1
          );
          break;
        }
      }
      for (let i = 0; i < tRooms.length; i += 1) {
        if (tRooms[i].id === action.to) {
          tRooms[i].events.push(action.object);
          break;
        }
      }
      return {
        ...state,
        rooms: tRooms
      }
    }
    case 'CONFIRM_EVENT': {
      const tRooms = state.rooms.slice();
      tRooms[action.roomIndex].events = tRooms[action.roomIndex].events.map(
        (elem) => (elem.id === action.eventId
          ? {
            id: elem.id,
            name: elem.name,
            start: elem.start,
            end: elem.end,
            duration: elem.duration
          } : elem)
      );
      console.log(tRooms);
      return {
        ...state,
        rooms: tRooms
      }
    }
    case 'DENY_EVENT': {
      const tRooms = state.rooms.slice();
      const eventIndex = tRooms[action.roomIndex].events.findIndex(
        (elem) => elem.id === action.eventId
      )
      tRooms[action.roomIndex].events.splice(eventIndex, 1);
      console.log(tRooms);
      return {
        ...state,
        rooms: tRooms
      }
    }
    case 'CHANGE_EVENT_NAME': {
      const tRooms = state.rooms.slice();
      tRooms[action.roomIndex].events = tRooms[action.roomIndex].events.map(
        (elem) => (elem.id === action.eventId
          ? {
            ...elem,
            name: action.name
          } : elem)
      );
      console.log(tRooms);
      return {
        ...state,
        rooms: tRooms
      }
    }
    default:
      return state
  }
}

const myApp = combineReducers({
  mainReducer,
  secondaryReducer
})

export default myApp
