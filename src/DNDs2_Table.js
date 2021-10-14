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
import { connect } from 'react-redux';

let rooms = [
  {
    id: 0,
    number: '101',
    events: [
      1,
      3
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
      2
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

const events = [
  {
    id: 1,
    name: 'test1',
    start: '8:30',
    end: '10:00'
  },
  {
    id: 2,
    name: 'test2',
    start: '13:30',
    end: '14:00'
  },
  {
    id: 3,
    name: 'test3',
    start: '16:00',
    end: '18:00'
  }
]

let times = []

for (let i = 8; i <= 18; i += 1) {
  times.push({
    str: i + ':00'
  })
  times.push({
    str: i + ':30'
  })
}

let draggedElement = {};


function Event(props) {
  const { id, start, name } = props.obj

  let [style, setStyle] = useState({
    position: 'absolute',
    height: '44px',
    width: '55px',
    backgroundColor: 'green',
    left: 0,
    top: 0
  })

  const onDragStart = (event) => {
    draggedElement.id = id;
  }

  const onDragEnd = (event) => {
    if (draggedElement.newCoordinates) {
      setStyle({
        ...style,
        left: draggedElement.newCoordinates[0] + 'px',
        top: draggedElement.newCoordinates[1] + 'px'
      })
      console.log(style)
    }
    draggedElement = {};
  }


  function setCoordinates() {
    let x = times.filter((element) => element.str === start)[0].left;
    let y = rooms.filter(
      (element) => element.events.filter(
        (elem) => elem === id
      ).length > 0
    )[0].top;

    setStyle({
      ...style,
      left: x + 'px',
      top: y + 'px'
    })
  }

  useEffect(() => { setCoordinates() }, rooms, events, times)

  return (
    <div
      draggable
      style={style}
      onDragStart={(event) => onDragStart(event)}
      onDragEnd={(event) => onDragEnd(event)}
    >
      {name}
    </div>
  );
}




function TableCell(props) {
  const ref = useRef();

  function setTimeCoordinates() {
    const rect = ref.current.getBoundingClientRect();
    times = times.map((element) => {
      if (element.str === props.time.str) return { str: element.str, left: rect.x }
      return element;
    })
  }

  const onDrop = (event) => {
    event.preventDefault();
    const rect = ref.current.getBoundingClientRect();
    draggedElement.newCoordinates = [rect.x, rect.y];
  }

  const onClick = () => {
    const rect = ref.current.getBoundingClientRect();
    console.log(props.room.number, '-', props.time.str, '; x:', rect.x, ' y:', rect.y)
  }

  if (props.header) {
    useEffect(() => {
      setTimeCoordinates()
    })
  }

  return (
    props.header
      ? (
        <td ref={ref}>
          { props.time.str }
        </td>
      ) : (
        <td
          ref={ref}
          className="DnDDroppable"
          onClick={onClick}
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
    console.log(rooms);
  }

  useEffect(() => {
    setRoomsCoordinates();
  })

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

function DNDs2_Table() {
  return (
    <>
      <ButtonGroup style={{ width: '100%' }}>
        <Link to="/" as="Button" className="btn btn-secondary">
          Задание 1
        </Link>
        <Button variant="btn btn-primary" disabled>Задание 2</Button>
      </ButtonGroup>
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
