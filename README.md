# 📋 Todo App

A modern, feature-rich todo application built with vanilla HTML, CSS, and JavaScript. Manage your tasks efficiently with a sleek interface, persistent storage, and powerful task management features.

## ✨ Features

### Core Functionality
- ✅ **Create Tasks** - Add new tasks with descriptions via a modal form
- ✏️ **Edit Tasks** - Modify task name, description, and status anytime
- 🗑️ **Delete Tasks** - Remove tasks with a confirmation dialog
- ✔️ **Complete Tasks** - Mark tasks as done with a checkbox
- 📝 **Task Descriptions** - Add detailed descriptions to each task and view them in a modal
- 🏷️ **Status Tracking** - Categorize tasks into 6 status types:
  - `new` - Newly created tasks
  - `todo` - Tasks to be done
  - `analiz` - Tasks under analysis
  - `in dev` - Tasks in development
  - `test` - Tasks in testing phase
  - `done` - Completed tasks

### Advanced Features
- 🔄 **Drag & Drop** - Reorder tasks by dragging the handle (≡) to set priorities
- 🎯 **Filtering** - Filter tasks by completion status:
  - All tasks
  - Active tasks (not completed)
  - Completed tasks
- 📊 **Status Tabs** - Quick filter by task status with dedicated tabs
- 💾 **localStorage** - Automatic data persistence - your tasks are saved and restored on page reload
- 🎨 **Beautiful UI** - Modern gradient background, smooth animations, and responsive design
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **One-Click Menu** - Three-dot (⋮) kebab menu for all task actions (view, edit, delete, status change)

## 🚀 Getting Started

### Installation
1. Clone this repository or download the files
2. No dependencies required - pure vanilla JavaScript!

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

### Running the App
1. Open `index.html` in your web browser
2. Start adding and managing your tasks!

**Or** use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js with http-server
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## 📖 Usage

### Adding a Task
1. Click the **"+ New Task"** button in the top-right
2. Enter the task name
3. (Optional) Add a detailed description
4. (Optional) Select a status from the dropdown (default: "new")
5. Click **"Add"** to save

### Editing a Task
1. Click the **⋮** (three-dot menu) on any task
2. Select **"Edit task"**
3. Modify the task name, description, or status
4. Click **"Save"** to update

### Viewing Task Descriptions
1. Click the **⋮** (three-dot menu) on a task with a description
2. Select **"View description"** to see the full text in a modal

### Changing Task Status
1. Click the **⋮** (three-dot menu) on any task
2. Select **"Change status ▾"** to expand status options
3. Choose a new status:
   - `new` - For newly created tasks
   - `todo` - For tasks ready to start
   - `analiz` - For tasks under review
   - `in dev` - For tasks being worked on
   - `test` - For tasks in QA phase
   - `done` - For completed tasks
4. Status updates instantly with color-coded badge

### Reordering Tasks (Priority)
1. Hover over a task to see the drag handle (≡) on the left
2. Click and drag the handle to move the task up or down
3. Drop the task in its new position
4. Order is automatically saved

### Filtering Tasks
- **By Completion**: Use the filter buttons (All, Active, Completed)
- **By Status**: Click any status tab (All, new, todo, analiz, in dev, test, done)
- **Combined Filtering**: Filters work together - e.g., show "Active + todo" status tasks

### Completing Tasks
1. Click the checkbox ☑️ next to any task to mark it as complete
2. Completed tasks are struck through and can be filtered
3. Click **"Clear Completed"** to delete all completed tasks at once

### Deleting Tasks
1. Click the **⋮** (three-dot menu) on a task
2. Select **"Delete"**
3. Confirm the deletion in the popup dialog

## 🎨 Design Highlights

- **Color-Coded Statuses**: Each status has a unique color for quick visual identification
  - `new` - Gray
  - `todo` - Blue
  - `analiz` - Purple
  - `in dev` - Cyan
  - `test` - Yellow
  - `done` - Green
- **Gradient Background**: Purple-to-violet gradient for a modern aesthetic
- **Smooth Animations**: Fade-in modals, slide transitions, and hover effects
- **Accessible UI**: Clear labels, semantic HTML, and keyboard support (Enter to submit forms)

## 💾 Data Storage

All tasks are automatically saved to your browser's **localStorage** under the key `todos`. This means:
- Your tasks persist even after closing the browser
- No server or backend required
- Data is stored locally on your device

To clear all data, open your browser's Developer Tools:
1. Right-click → Inspect (or F12)
2. Go to Application → Storage → Local Storage
3. Find and delete the `todos` entry

## 🔧 Technical Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure and form elements |
| **CSS3** | Styling, gradients, animations, flexbox layout |
| **JavaScript (ES6+)** | Class-based OOP, event handling, localStorage API |
| **Drag & Drop API** | Native HTML5 drag-and-drop for task reordering |

### Project Structure
```
todo-app/
├── index.html      # Main HTML structure and modals
├── style.css       # Complete styling and animations
├── script.js       # TodoApp class with all functionality
└── README.md       # This file
```

## 🎯 Key Methods (TodoApp Class)

| Method | Purpose |
|---|---|
| `addTodoFromModal()` | Create a new task from modal form |
| `editTodo()` / `saveEdit()` | Modify task details |
| `deleteTodo(id)` | Remove a task |
| `toggleTodo(id)` | Mark task as complete/incomplete |
| `changeStatus(id, status)` | Update task status |
| `reorder(draggedId, targetId)` | Reorder tasks via drag-and-drop |
| `getFilteredTodos()` | Apply active and status filters |
| `render()` | Dynamically generate the task list UI |

## 🌟 Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Requirements**: Modern browser with support for:
- localStorage API
- CSS Flexbox
- ES6 JavaScript
- HTML5 Drag & Drop API

## 📝 Code Quality

- **No External Dependencies**: Pure vanilla JavaScript
- **XSS Protection**: HTML entities escaped to prevent script injection
- **Event Delegation**: Efficient event handling for dynamically created elements
- **OOP Pattern**: Class-based architecture for maintainability
- **Responsive Design**: Mobile-first approach with media queries

## 🚀 Future Enhancements

Potential features for future versions:
- 📅 Due dates and reminders
- 🔍 Search/filter by task text
- ⌨️ Keyboard shortcuts (e.g., Cmd+K to open add modal)
- 🏷️ Task tags and categories
- 🎨 Custom color themes
- 📊 Statistics dashboard (completed/total ratio, etc.)
- 🔄 Undo/Redo functionality
- 🌙 Dark mode
- 📤 Export tasks to JSON/CSV
- 🔗 Share tasks via URL

## 📄 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute as needed.

## 👨‍💻 Contributing

Contributions are welcome! If you have suggestions for improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💬 Support

If you encounter any issues or have questions:
- Check this README for usage instructions
- Review the code comments in `script.js`, `index.html`, and `style.css`
- Open an issue on GitHub with details about the problem

---

**Made with ❤️ - Enjoy organizing your tasks!**
