const defaultState = {
  columns: [],
  selected: [
    { id: '0', alias: 'name', title: 'наименование' },
    { id: '1', alias: 'value', title: 'Значение' },
    { id: '2', alias: 'department', title: 'отдел' }
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
