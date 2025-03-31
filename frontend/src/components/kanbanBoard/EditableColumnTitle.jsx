import React, { useEffect, useRef } from 'react';
import './EditableColumnTitle.css';

const EditableColumnTitle = ({ 
  title, 
  isEditing, 
  onColumnNameChange, 
  onColumnNameKeyDown, 
  onColumnNameBlur,
  newColumnName
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="column-title-container">
        <input
          ref={inputRef}
          type="text"
          className="column-title-input"
          value={newColumnName}
          onChange={onColumnNameChange}
          onKeyDown={(e) => onColumnNameKeyDown(e)}
          onBlur={() => onColumnNameBlur()}
        />
      </div>
    );
  }

  return (
    <div className="column-title-container">
      <h3 className="column-title">{title}</h3>
    </div>
  );
};

export default EditableColumnTitle;
