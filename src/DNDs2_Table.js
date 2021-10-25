/* eslint-disable camelcase */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  Button,
  ButtonGroup
} from 'react-bootstrap';
import { connect, useSelector } from 'react-redux';
import EventsCreator from './DND2_components/EventsCreator';
import DroppableTableCell from './DND2_components/DroppableTableCell';

const times = ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

function DNDs2_Table() {
  const lRooms = useSelector((state) => state.secondaryReducer.rooms);
  const lTimes = times.slice().splice(0, 21);
  return (
    <>
      <ButtonGroup style={{ width: '100%' }} className="links">
        <Link to="/" as="Button" className="btn btn-secondary">
          Задание 1
        </Link>
        <Button variant="btn btn-primary" disabled>Задание 2</Button>
      </ButtonGroup>
      <br />
      <div className="main-wrapper">
        <EventsCreator />
        <div style={{ overflowX: 'scroll', border: '1px solid lightgrey' }}>
          <Table striped bordered style={{ marginBottom: 0 }}>
            <thead>
              <tr>
                <td style={{ minWidth: 105 }}> Аудитория </td>
                {
                lTimes.map((element) => (
                  <td>
                    { element }
                  </td>
                ))
                }
              </tr>
            </thead>
            <tbody>
              {
                lRooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      { room.number }
                    </td>
                    {lTimes.map((time) => (
                      <DroppableTableCell room={room} time={time} />
                    ))}
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export default connect()(DNDs2_Table);
