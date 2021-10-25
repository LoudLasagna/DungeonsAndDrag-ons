import React, {
  useState
} from 'react';
import {
  Button,
  Alert,
  Form
} from 'react-bootstrap';
import { connect, useSelector, useDispatch } from 'react-redux';

const times = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

function EventsCreator() {
  const [start, setStart] = useState('8:00');
  const [end, setEnd] = useState('8:30');
  const startTimes = times.slice().splice(0, 20);
  const [endTimes, setEndTimes] = useState(times.slice().splice(1, 21));
  const [showAlert, setShowAlert] = useState(false);

  const [name, setName] = useState('');

  const rooms = useSelector((state) => state.secondaryReducer.rooms);
  const dispatch = useDispatch();

  const handleStartChange = (event) => {
    setStart(event.target.value);
    let ti = 0;
    ti = times.findIndex((elem) => elem === event.target.value)
    setEndTimes(times.slice().splice(ti + 1, times.length - ti));
  }

  const handleEndChange = (event) => {
    setEnd(event.target.value);
  }

  const createEvent = () => {
    const id = rooms.map((room) => room.events.length)
      .reduce((accumulator, currentValue) => accumulator + currentValue) + 1;
    let duration = 0;
    let counting = false;
    for (let i = 0; i < times.length; i += 1) {
      if (times[i] === start) counting = true;
      if (times[i] === end) {
        counting = false;
        break;
      }
      if (counting) duration += 1;
    }
    duration = duration === 0 ? 1 : duration;

    let roomIndex = -1;
    for (let i = 0; i < rooms.length; i += 1) {
      const freeTime = times.slice();
      const timeIndex = times.findIndex((element) => element === start);
      for (let j = 0; j < rooms[i].events.length; j += 1) {
        for (let k = 0; k < freeTime.length; k += 1) {
          if (freeTime[k] === rooms[i].events[j].start) {
            freeTime.splice(k, rooms[i].events[j].duration);
          }
        }
      }

      let timeCheck = times.slice();
      timeCheck = timeCheck.splice(timeIndex, duration);
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

    const obj = {
      id,
      name: name.length > 0 ? name : '',
      start,
      end,
      duration,
      free: true,
      roomIndex
    }

    if (roomIndex !== -1) {
      setShowAlert(false);
      dispatch({
        type: 'CHANGE_ROOM',
        to: roomIndex,
        object: obj
      })
    } else setShowAlert(true);
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  return (
    <Form d-flex="flex-row-nowrap">
      <Form.Group>
        <Form.Label>Начало</Form.Label>
        <Form.Select
          type="select"
          onChange={handleStartChange}
          value={start}
        >
          {startTimes.map(
            (element) => (
              <option value={element}>
                {element}
              </option>
            )
          )}
        </Form.Select>
        <Form.Label>Конец</Form.Label>
        <Form.Select
          onChange={handleEndChange}
          value={end}
        >
          {endTimes.map(
            (element) => (
              <option value={element}>
                {element}
              </option>
            )
          )}
        </Form.Select>
        <Form.Label>
          Название мероприятия
        </Form.Label>
        <Form.Control type="input" value={name} placeholder="Введите название мероприятия" onChange={handleNameChange} />
        <Button variant="primary" onClick={createEvent} className="mt-3 mb-3">
          Подобрать аудиторию
        </Button>
      </Form.Group>
      <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
        <Alert.Heading>Нет подходящих аудиторий, попробуйте изменить время</Alert.Heading>
      </Alert>
    </Form>
  )
}

export default connect()(EventsCreator);
