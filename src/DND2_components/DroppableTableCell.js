/* eslint-disable react/jsx-filename-extension */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, {
  useState
} from 'react';
import {
  Button
} from 'react-bootstrap';
import { connect, useSelector, useDispatch } from 'react-redux';

const times = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

let draggedElement = {};

function Event(props) {
  const {
    id,
    duration,
    free,
    start,
    end
  } = props.obj;
  const dispatch = useDispatch();
  const [name, setName] = useState(props.obj.name);

  const [roomIndex, setRoomIndex] = useState(props.obj.roomIndex)
  const [style, setStyle] = useState({
    width: 80 * duration,
    backgroundColor: free ? 'yellow' : 'rgb(70, 167, 70)',
    borderColor: free ? 'rgb(160, 160, 9)' : 'green',
    cursor: free ? 'grab' : 'default',
    padding: '0 7px',
    textAlign: 'center',
    wordWrap: 'break-word'
  })
  const inputStyle = {
    width: '100%',
    backgroundColor: 'rgb(236, 236, 207)',
    border: '1px solid rgb(160, 160, 9)',
    borderRadius: 5
  }
  const buttonStyle = {
    width: 20,
    height: 20,
    fontSize: '.6em',
    textAlign: 'center',
    padding: 0,
    marginRight: 2,
    marginLeft: 2
  }

  const onDragStart = () => {
    draggedElement = { ...props.obj };
  }

  const onDragEnd = () => {
    if (draggedElement.newRoomIndex >= 0) {
      setRoomIndex(draggedElement.newRoomIndex);
      dispatch({
        type: 'CHANGE_ROOM',
        from: draggedElement.roomIndex,
        to: draggedElement.newRoomIndex,
        object: {
          id,
          name,
          start: draggedElement.start,
          end: draggedElement.end,
          duration,
          free,
          roomIndex: draggedElement.newRoomIndex
        }
      })
      draggedElement = {};
    }
  }

  const confirmEvent = () => {
    setStyle({
      ...style,
      backgroundColor: 'rgb(70, 167, 70)',
      borderColor: 'green',
      cursor: 'default'
    });
    dispatch({ type: 'CONFIRM_EVENT', roomIndex, eventId: id })
  }
  const denyEvent = () => {
    dispatch({ type: 'DENY_EVENT', roomIndex, eventId: id })
  }

  const changeName = (event) => {
    setName(event.target.value);
    dispatch({
      type: 'CHANGE_EVENT_NAME',
      roomIndex,
      eventId: id,
      name: event.target.value
    })
  }

  return (
    free
      ? (
        <div
          draggable
          style={style}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className="event"
        >
          <input value={name} style={inputStyle} title="Введите название мероприятия" placeholder="Введите название мероприятия" onChange={changeName} />
          <b style={{ fontSize: '.6em' }}>{`${start}-${end}`}</b>
          <div className="d-flex flex-row-nowrap">
            <Button
              onClick={confirmEvent}
              style={buttonStyle}
            >
              &#10003;
            </Button>
            <Button
              onClick={denyEvent}
              style={buttonStyle}
              variant="danger"
            >
              &#10006;
            </Button>
          </div>
        </div>
      )
      : (
        <div
          style={style}
          className="event"
        >
          {name.length > 0 ? <b>{name}</b> : <br />}
          <b style={{ fontSize: '.6em' }}>{`${start}-${end}`}</b>
        </div>
      )
  );
}

function DroppableTableCell(props) {
  const time = props.time;
  const rooms = useSelector((state) => state.secondaryReducer.rooms);
  const room = rooms.find((sRoom) => sRoom.id === props.room.id);
  const temp = room.events.find((elem) => elem.start === time);
  const contents = temp === undefined ? [] : [temp];
  const [isDraggingOver, setDragState] = useState(false);

  const onDrop = () => {
    setDragState(false);
    if (checkDroppability()) {
      draggedElement.start = time;
      const timeIndex = times.findIndex((element) => element === time);
      draggedElement.end = times[timeIndex + draggedElement.duration];
      draggedElement.newRoomIndex = room.id;
      contents[0] = draggedElement
    }
  }

  const checkDroppability = () => {
    let freeSpace = true;

    let newTime = [];
    const occupiedRoomTime = [];
    const roomEvents = room.events.filter((elem) => elem.id !== draggedElement.id);
    const nti = times.findIndex((element) => element === time);

    if (nti + draggedElement.duration > times.length - 1) freeSpace = false;

    newTime = times.slice().splice(nti, draggedElement.duration);
    for (let i = 0; i < roomEvents.length; i += 1) {
      const oti = times.findIndex((element) => element === roomEvents[i].start);
      for (let j = oti; j < oti + roomEvents[i].duration; j += 1) {
        occupiedRoomTime.push(times[j]);
      }
    }

    occupiedRoomTime.some((ort) => newTime.some((nt) => {
      if (ort === nt) {
        freeSpace = false;
        return true
      }
      return false
    }));

    return freeSpace
  }

  const onDragOver = (event) => {
    event.preventDefault()
    if (draggedElement.id) {
      setDragState(true);
    }
  }
  const onDragLeave = () => {
    if (draggedElement.id) {
      setDragState(false);
    }
  }

  const getCellStyle = (ido) => ({
    backgroundColor: ido ? 'lightgrey' : '',
    padding: 0,
    maxHeight: 80
  })

  return (
    <td
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
      style={getCellStyle(isDraggingOver)}
    >
      {
      contents.length > 0
        ? <Event obj={contents[0]} />
        : ''
      }
    </td>
  )
}

export default connect()(DroppableTableCell)
