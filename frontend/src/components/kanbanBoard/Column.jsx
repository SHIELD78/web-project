import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import './Column.css';
import EditableColumnTitle from './EditableColumnTitle';

const Column = ({ 
  column, 
  tasks, 
  index, 
  addTask, 
  deleteColumn, 
  onTaskClick,
  isEditing,
  onColumnNameChange,
  onColumnNameKeyDown,
  onColumnNameBlur,
  newColumnName
}) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="column"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="column-header" {...provided.dragHandleProps}>
            <div className="column-title-container">
              <div className="task-count">{tasks.length}</div>
              <EditableColumnTitle
                title={column.title}
                isEditing={isEditing}
                onColumnNameChange={onColumnNameChange}
                onColumnNameKeyDown={(e) => onColumnNameKeyDown(e, column.id)}
                onColumnNameBlur={() => onColumnNameBlur(column.id)}
                newColumnName={newColumnName}
              />
            </div>
            <button className="delete-column-button" onClick={() => deleteColumn(column.id)}>
              ×
            </button>
          </div>
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {tasks.map((task, index) => (
                  <Task 
                    key={task.id} 
                    task={task} 
                    index={index} 
                    onClick={() => onTaskClick(task)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <button className="add-task-button" onClick={() => addTask(column.id)}>
            <span className="plus-icon">+</span> Add task
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
