/* eslint-disable react/prop-types */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  borderRadius: '.3rem',
  background: isDragging ? 'lightgreen' : 'grey',

  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
  borderRadius: '.3rem',
  marginRight: '.5em',
  marginLeft: '.5em'
});



class DNDs1 extends Component {
    id2List = {
      droppable: 'items',
      droppable2: 'selected'
    };

    constructor(props) {
      super(props);
      this.state = {
        savedSelected: props.selected,
        savedItems: props.columns,

        selected: props.selected,
        items: props.columns,
        showSettings: false
      };
    }

    getList = (id) => this.state[this.id2List[id]];

    onDragEnd = (result) => {
      const { source, destination } = result;
      if (!destination) {
        return;
      }
      if (source.droppableId === destination.droppableId) {
        const items = reorder(
          this.getList(source.droppableId),
          source.index,
          destination.index
        );

        let state = { };

        if (source.droppableId === 'droppable2') {
          state = { selected: items };
        } else {
          state = { items };
        }

        this.setState(state);
      } else {
        const resultT = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        );

        this.setState({
          items: resultT.droppable,
          selected: resultT.droppable2
        });
      }
    };

    changeShow = () => this.setState((prev) => ({
      ...prev,
      selected: prev.savedSelected,
      items: prev.savedItems,
      showSettings: !prev.showSettings
    }));

    saveChanges = () => {
      this.props.dispatch({ type: 'SET_SELECTED', payload: new Array(...this.state.selected) });
      this.setState((prev) => ({
        ...prev,
        savedSelected: prev.selected,
        savedItems: prev.items,
        showSettings: !prev.showSettings
      }));
    }

    render() {
      return (
        <>
          <Button
            variant="primary"
            onClick={this.changeShow}
            style={{
              marginBottom: '1em'
            }}
          >
            Настройка отображаемых полей
          </Button>
          <Modal show={this.state.showSettings} onHide={this.changeShow}>
            <Modal.Header closeButton>
              <Modal.Title>Настройка таблицы</Modal.Title>
            </Modal.Header>

            <Modal.Body
              className="d-flex flex-column"
            >
              <DragDropContext onDragEnd={this.onDragEnd}>
                <div className="d-flex flex-row-nowrap" style={{ width: '100%' }}>
                  <p style={{ width: '50%', margin: '.5em' }}>Доступные поля</p>
                  <p style={{ width: '50%', margin: '.5em' }}>Выбранные поля</p>
                </div>

                <div className="d-flex flex-row-nowrap" style={{ width: '100%', minHeight: '300px' }}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {this.state.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {item.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {this.state.selected.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                {item.title}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.changeShow}>
                Закрыть
              </Button>
              <Button variant="primary" onClick={this.saveChanges}>
                Применить
              </Button>
            </Modal.Footer>
          </Modal>
        </>

      );
    }
}

function mapStateToProps(state) {
  const { selected, columns } = state
  return { selected, columns }
}

export default connect(mapStateToProps)(DNDs1);
