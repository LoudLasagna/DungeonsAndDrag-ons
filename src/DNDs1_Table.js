/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import { useSelector, connect } from 'react-redux';
import DNDs1 from './DNDs1';

const data = [
  { name: 'qwerty', value: '12345', department: 'qwerty' },
  { name: 'yuiop', value: '67890', department: 'qwerty' },
  { name: 'yuiqweqwop' },
  {}
];

function DNDs1_Table() {
  const selectedColumns = useSelector((state) => state.mainReducer.selected)
  console.log(selectedColumns);
  const getSelectedData = () => {
    const tsc = selectedColumns.map((elem) => elem.alias);
    const temp = []
    for (let i = 0; i < data.length; i += 1) {
      const tempObj = {};
      for (const j in data[i]) {
        if (tsc.includes(String(j))) tempObj[j] = data[i][j]
      }
      if (Object.keys(tempObj).length > 0) temp.push(tempObj)
    }
    return temp
  }

  return (
    <>
      <ButtonGroup style={{ width: '100%' }} className="links">
        <Button variant="btn btn-primary" disabled>Задание 1</Button>
        <Link to="/2" as="Button" className="btn btn-secondary">
          Задание 2
        </Link>
        <Link to="/2l" as="Button" className="btn btn-secondary">
          Задание 2 с beatiful dnd
        </Link>
      </ButtonGroup>
      <div className="main-wrapper">
        <DNDs1 columns={[]} />
        {
        selectedColumns.length === 0
          ? <h3>Не выбраны отображаемые поля, настройте таблицу</h3>
          : (
            <Table striped bordered>
              <thead>
                <tr>
                  <th>#</th>
                  {
                    selectedColumns.map((elem) => (
                      <td key={elem.id}>
                        {elem.title}
                      </td>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                getSelectedData().map((element, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    {
                      selectedColumns.map((cElement) => (
                        <td key={cElement.id}>
                          {element[cElement.alias]}
                        </td>
                      ))
                    }
                  </tr>
                ))
                }
              </tbody>
            </Table>
          )
        }
      </div>
    </>
  );
}

export default connect()(DNDs1_Table);
