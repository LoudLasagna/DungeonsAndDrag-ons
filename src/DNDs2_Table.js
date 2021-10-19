/* eslint-disable no-shadow */
/* eslint-disable prefer-template */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, {
  useEffect,
  useRef,
  View,
  PanResponder,
  Animated,
  useState
} from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import { connect, useSelector, useDipatch } from 'react-redux';
import { element } from 'prop-types';

const events = [
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
  },
  {
    id: 3,
    name: 'test3',
    start: '16:00',
    end: '18:00',
    duration: 4
  },
  {
    id: 4,
    name: 'test4',
    start: '9:00',
    end: '12:00',
    duration: 7
  }
]

let rooms = [
  {
    id: 0,
    number: '101',
    events: [
      events[0],
      events[2]
    ],
    top: 0
  },
  {
    id: 1,
    number: '102',
    events: [
      events[3]
    ],
    top: 0
  },
  {
    id: 2,
    number: '103-b',
    events: [
      events[1]
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

let times = []

for (let i = 8; i <= 18; i += 1) {
  times.push({
    str: i + ':00'
  })
  if (i !== 18) {
    times.push({
      str: i + ':30'
    })
  }
}
let draggedElement = {};


function Event(props) {
  const {
    id,
    start,
    name,
    duration
  } = props.obj

  const [isFree, setFree] = useState(props.free);

  let [style, setStyle] = useState({
    width: 55 * duration,
    left: 0,
    top: 0,
    backgroundColor: isFree ? 'yellow' : 'rgb(70, 167, 70)'
  })

  const onDragStart = (event) => {
    draggedElement = props.obj;
  }

  const onDragEnd = (event) => {
    if (draggedElement.newCoordinates) {
      setStyle({
        ...style,
        left: draggedElement.newCoordinates[0] + 'px',
        top: draggedElement.newCoordinates[1] + 'px'
      });
    }
    draggedElement = {};
  }


  function setCoordinates() {
    let x = times.filter((element) => element.str === start)[0].left;
    let y = rooms.filter(
      (element) => element.events.filter(
        (elem) => elem.id === id
      ).length > 0
    )[0].top;

    setStyle({
      ...style,
      left: x + 'px',
      top: y + 'px'
    })
  }

  useEffect(() => { setCoordinates() }, events, times)

  return (
    isFree
      ? (
        <div
          draggable
          style={style}
          onDragStart={(event) => onDragStart(event)}
          onDragEnd={(event) => onDragEnd(event)}
          className="event"
        >
          {name}
          <Button onClick={() => { setFree(false); setStyle({ ...style, backgroundColor: 'rgb(70, 167, 70)' }) }} />
        </div>
      )
      : (
        <div
          style={style}
          className="event"
        >
          {name}
        </div>
      )
  );
}


function TableCell(props) {
  const ref = useRef();

  const str = props.time.str;

  function setTimeCoordinates() {
    if (props.header) {
      const rect = ref.current.getBoundingClientRect();
      times = times.map((element) => {
        if (element.str === str) return { str: element.str, left: rect.x }
        return element;
      })
    }
  }

  const onDrop = (event) => {
    event.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    if (checkDroppability()) {
      let trooms = rooms.slice();
      draggedElement.start = str;
      let timeIndex = times.findIndex((element) => element.str === str);
      draggedElement.end = times[timeIndex + draggedElement.duration - 1].str;

      let newRoomEvents = props.room.events.filter((elem) => elem.id !== draggedElement.id);
      newRoomEvents.push(draggedElement);

      for (let i = 0; i < trooms.length; i += 1) {
        for (let j = 0; j < trooms[i].events.length; j += 1) {
          if (trooms[i].events[j].id === draggedElement.id) {
            trooms[i].events.splice(j, 1);
          }
        }
        if (trooms[i].id === props.room.id) {
          trooms[i].events.push(draggedElement);
        }
      }

      rooms = trooms;
      draggedElement.newCoordinates = [rect.x, rect.y];
    }
  }

  const checkDroppability = () => {
    let freeSpace = true;

    let newTime = [];
    let occupiedRoomTime = [];
    let roomEvents = props.room.events.filter((elem) => elem.id !== draggedElement.id);

    let nti = times.findIndex((element) => element.str === str);
    for (let j = nti; j < nti + draggedElement.duration; j += 1) {
      newTime.push(times[j].str)
    }

    for (let i = 0; i < roomEvents.length; i += 1) {
      let oti = times.findIndex((element) => element.str === roomEvents[i].start);
      for (let j = oti; j < oti + roomEvents[i].duration; j += 1) {
        occupiedRoomTime.push(times[j].str)
      }
    }

    occupiedRoomTime.forEach((ort) => {
      newTime.forEach((nt) => {
        if (ort === nt) {
          freeSpace = false;
        }
      })
    });

    return freeSpace
  }

  useEffect(() => {
    setTimeCoordinates()
  }, times)

  return (
    props.header
      ? (
        <td ref={ref}>
          { str }
        </td>
      ) : (
        <td
          ref={ref}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => onDrop(event)}
        />
      )
  )
}

function TableRow(props) {
  const ref = useRef();

  function setRoomsCoordinates() {
    const rect = ref.current.getBoundingClientRect();
    rooms = rooms.map((element) => {
      if (element.id === props.room.id) return { ...element, top: rect.y };
      return element;
    })
  }

  useEffect(() => {
    setRoomsCoordinates();
  }, rooms)

  return (
    <tr ref={ref}>
      <td>
        { props.room.number }
      </td>
      {times.map((time, index) => (
        <TableCell room={props.room} time={time} key={index} />
      ))}
    </tr>
  )
}

function EventsCreator() {
  const [start, setStart] = useState('8:00');
  const [end, setEnd] = useState('8:30');
  const [endTimes, setEndTimes] = useState(times.slice().splice(1, 21));
  const [localEvents, setLocalEvents] = useState([]);

  const handleStartChange = (event) => {
    setStart(event.target.value);
    let ti = 0;
    for (let i = 0; i < times.length; i += 1) {
      if (times[i].str === event.target.value) {
        ti = i;
        break;
      }
    }
    setEndTimes(times.slice().splice(ti + 1, times.length - ti));
  }

  const handleEndChange = (event) => {
    setEnd(event.target.value);
  }

  const createEvent = () => {
    let id = events.length + 1;
    let duration = 0;

    let counting = false;
    for (let i = 0; i < times.length; i += 1) {
      if (times[i].str === start) counting = true;
      if (times[i].str === end) {
        counting = false;
        break;
      }
      if (counting) duration += 1;
    }


    let roomIndex = -1;
    for (let i = 0; i < rooms.length; i += 1) {
      let freeTime = times.slice();
      let timeIndex = -1;
      for (let j = 0; j < rooms[i].events.length; j += 1) {
        for (let k = 0; k < freeTime.length; k += 1) {
          if (freeTime[k].str === start) timeIndex = k;
          if (freeTime[k].str === rooms[i].events[j].start) {
            freeTime.splice(k, rooms[i].events[j].duration);
          }
        }
      }
      let timeCheck = times.slice().splice(timeIndex, duration);
      if (contains(freeTime, timeCheck)) {
        roomIndex = i;
        break;
      }
    }

    function contains(where, what) {
      for (let i = 0; i < what.length; i += 1) {
        if (where.indexOf(what[i]) === -1) return false;
      }
      return true;
    }

    let obj = {
      id,
      name: 'test' + id,
      start,
      end,
      duration
    }
    if (roomIndex !== -1) {
      rooms[roomIndex].events.push(obj);
      events.push(obj);
      let t = localEvents.slice();
      t.push(obj);
      setLocalEvents(t);
    }
  }

  return (
    <>
      <ButtonGroup>
        <select
          onChange={handleStartChange}
          value={start}
        >
          {times.map(
            (element, index) => (
              <option key={index} value={element.str}>
                {element.str}
              </option>
            )
          )}
        </select>
        <select
          onChange={handleEndChange}
          value={end}
        >
          {endTimes.map(
            (element, index) => (
              <option key={index} value={element.str}>
                {element.str}
              </option>
            )
          )}
        </select>
        <Button variant="primary" onClick={createEvent}>
          Подобрать аудиторию
        </Button>
      </ButtonGroup>
      <div>
        {
          localEvents.map(
            (elem) => <Event key={elem.id} obj={elem} free />
          )
        }
      </div>
    </>
  )
}

function DNDs2_Table() {
  return (
    <>
      <ButtonGroup style={{ width: '100%' }}>
        <Link to="/" as="Button" className="btn btn-secondary">
          Задание 1
        </Link>
        <Button variant="btn btn-primary" disabled>Задание 2</Button>
      </ButtonGroup>
      <br />
      <EventsCreator />
      <div className="main-wrapper">
        <Table striped bordered style={{ width: 1260 }}>
          <thead>
            <tr>
              <td> Аудитория </td>
              { times.map((element, index) => (<TableCell key={index} time={element} header />)) }
            </tr>
          </thead>
          <tbody>
            {
              rooms.map((element) => (
                <TableRow room={element} key={element.id} />
              ))
            }
          </tbody>
        </Table>
        {
          events.map((element) => <Event key={element.id} obj={element} />)
        }
      </div>
    </>
  );
}

export default connect()(DNDs2_Table);
