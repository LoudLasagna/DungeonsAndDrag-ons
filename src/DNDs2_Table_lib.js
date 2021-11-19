/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-undef */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { connect, useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EventsCreator from './DND2_components/EventsCreator';

const times = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

function checkDroppability(obj, roomEvents, cellTime) {
  let freeSpace = true;

  let newTime = [];
  let tt = [];
  const occupiedRoomTime = [];

  let filteredRoomEvents = roomEvents.filter((elem) => elem.id !== obj.id);
  if (obj.id === -1) filteredRoomEvents = filteredRoomEvents.filter((elem) => elem.free !== true)

  const nti = times.findIndex((element) => element === cellTime);

  if (nti + obj.duration > times.length - 1) freeSpace = false;

  tt = times.slice().splice(nti, obj.duration + 1)
  newTime = tt.slice(0, tt.length - 1)

  for (let i = 0; i < filteredRoomEvents.length; i += 1) {
    const oti = times.findIndex((element) => element === filteredRoomEvents[i].start);
    for (let j = oti; j < oti + filteredRoomEvents[i].duration; j += 1) {
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

  return { freeSpace, newStart: tt[0], newEnd: tt[tt.length - 1] }
}

function DNDs2_Table_lib() {
  const lRooms = useSelector((state) => state.secondaryReducer.rooms);
  const lTimes = times.slice().splice(0, 21);

  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    if (!result.destination) return

    const desId = Number(result.destination.droppableId.split('-')[0])
    const desStart = result.destination.droppableId.split('-')[1]
    const dragId = Number(result.draggableId.split('-')[0])
    const dragDuration = Number(result.draggableId.split('-')[2])
    const resRoom = lRooms.find((elem) => elem.id === desId);

    const checkResult = checkDroppability(
      { id: dragId, duration: dragDuration },
      resRoom.events,
      desStart
    )

    const sourceId = Number(result.source.droppableId.split('-')[0])
    const sourceRoom = lRooms.find((elem) => elem.id === sourceId)
    const dragObj = sourceRoom.events.find((elem) => elem.id === dragId)
    if (checkResult.freeSpace) {
      dispatch({
        type: 'CHANGE_ROOM',
        from: sourceId,
        to: desId,
        object: {
          id: dragId,
          name: dragObj.name,
          start: checkResult.newStart,
          end: checkResult.newEnd,
          duration: dragObj.duration,
          free: true,
          roomIndex: desId
        }
      })
    }
  }

  return (
    <>
      <ButtonGroup style={{ width: '100%' }} className="links">
        <Link to="/" as="Button" className="btn btn-secondary">
          Задание 1
        </Link>
        <Link to="/2" as="Button" className="btn btn-secondary">
          Задание 2
        </Link>
        <Button variant="btn btn-primary" disabled>Задание 2 с beatiful dnd</Button>
      </ButtonGroup>
      <br />
      <div className="main-wrapper">
        <EventsCreator />
        <div style={{ overflowX: 'auto', border: '1px solid lightgrey' }}>
          <Table striped bordered style={{ marginBottom: 0, maxWidth: 1 }}>
            <thead>
              <tr>
                <td style={{ minWidth: 105 }}> Аудитория </td>
                {
                lTimes.map((element) => (
                  <td key={element}>
                    { element }
                  </td>
                ))
                }
              </tr>
            </thead>
            <DragDropContext onDragEnd={onDragEnd}>
              <tbody>
                {
                    lRooms.map((room) => (
                      <tr key={room.id}>
                        <td>
                          { room.number }
                        </td>
                        {lTimes.map((time) => (
                          <DroppableTableCell room={room} time={time} key={time} />
                        ))}
                      </tr>
                    ))
                }
              </tbody>
            </DragDropContext>
          </Table>
        </div>
      </div>
    </>
  );
}

function DroppableTableCell(props) {
  const { time, room } = props;

  const temp = room.events.find((elem) => elem.start === time);
  const contents = temp === undefined ? [] : [temp];

  const getCellStyle = (isDraggingOver) => ({
    backgroundColor: isDraggingOver ? 'lightgrey' : '',
    padding: 0,
    maxHeight: 80
  })

  return (
    <Droppable
      key={`${room.id}-${time}`}
      droppableId={`${room.id}-${time}`}
      isDropDisabled={!checkDroppability({ id: -1, duration: 1 }, room.events, time).freeSpace}
    >
      {(provided, snapshot) => (
        <td ref={provided.innerRef} style={getCellStyle(snapshot.isDraggingOver)}>
          {
            contents.length > 0
              ? <Event obj={contents[0]} />
              : ''
          }
          {provided.placeholder}
        </td>
      )}
    </Droppable>
  )
}

function Event(props) {
  const {
    id,
    duration,
    free,
    start,
    end,
    roomIndex
  } = props.obj;
  const dispatch = useDispatch()
  const [name, setName] = useState(props.obj.name)

  let style = {
    width: 80 * duration,
    backgroundColor: free ? 'yellow' : 'rgb(70, 167, 70)',
    borderColor: free ? 'rgb(160, 160, 9)' : 'green',
    cursor: free ? 'grab' : 'default',
    padding: '0 7px',
    textAlign: 'center',
    wordWrap: 'break-word'
  }

  const confirmEvent = () => {
    style = {
      ...style,
      backgroundColor: 'rgb(70, 167, 70)',
      borderColor: 'green',
      cursor: 'default'
    };
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

  const getEventStyle = (draggableStyle) => ({
    ...style,
    width: 80 * duration,
    ...draggableStyle
  })

  return (
    free
      ? (
        <Draggable
          index={id}
          draggableId={`${id}-${start}-${duration}`}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div
                style={{ ...getEventStyle(provided.draggableStyle) }}
                className="event"
              >
                <input value={name} className="event-input" title="Введите название мероприятия" placeholder="Введите название мероприятия" onChange={changeName} />
                <b style={{ fontSize: '.6em' }}>{`${start}-${end}`}</b>
                <div className="d-flex flex-row-nowrap">
                  <Button
                    onClick={confirmEvent}
                    className="event-button"
                  >
                    &#10003;
                  </Button>
                  <Button
                    onClick={denyEvent}
                    className="event-button"
                    variant="danger"
                  >
                    &#10006;
                  </Button>
                </div>
              </div>
              {provided.placeholder}
            </div>
          )}
        </Draggable>
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

export default connect()(DNDs2_Table_lib);
