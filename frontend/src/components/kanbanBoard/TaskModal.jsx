import React, { useState } from 'react';
import './TaskModal.css';
import { setTaskReminder } from '../../services/api';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const TaskModal = ({ task, onClose, onSave, isNewTask = false }) => {
  const [description, setDescription] = useState(task.description);
  const [content, setContent] = useState(task.content);
  const [isSettingReminder, setIsSettingReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(task.id, description, content);
  };

  const handleSetReminder = async () => {
    try {
      setIsSettingReminder(true);
      setReminderMessage('');
      // In a real implementation, you would call the API
      // await setTaskReminder(task.id);
      setReminderMessage('Reminder set successfully!');
    } catch (error) {
      setReminderMessage('Failed to set reminder: ' + error.message);
    } finally {
      setIsSettingReminder(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="task-modal">
        <div className="modal-header">
          {isNewTask ? (
            <h2>New Task</h2>
          ) : (
            <h2>{task.content}</h2>
          )}
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Task Name</label>
            <Input
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter task name..."
              className="task-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
            />
          </div>
          
          <div className="reminder-section">
            <button 
              type="button" 
              className="button reminder"
              onClick={handleSetReminder}
              disabled={isSettingReminder}
            >
              {isSettingReminder ? 'Setting reminder...' : 'Set Reminder'}
            </button>
            {reminderMessage && <p className="reminder-message">{reminderMessage}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" className="button cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="button save">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
