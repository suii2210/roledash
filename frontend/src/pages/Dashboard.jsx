import { useEffect, useMemo, useState } from 'react';
import { Github, Linkedin, Globe, Mail, StickyNote, Trash2, Pencil, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { taskApi, noteApi } from '../services/api';
import FormField from '../components/FormField';

const statusOptions = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 hover:-translate-y-1 transition shadow-card">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-white font-semibold">{task.title}</p>
        <p className="text-white/70 text-sm">{task.description || 'No description'}</p>
      </div>
      <div className="flex gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, { status: e.target.value })}
          className="bg-night border border-white/10 text-white text-xs rounded-full px-2 py-1"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={task.priority}
          onChange={(e) => onStatusChange(task._id, { priority: e.target.value })}
          className="bg-night border border-white/10 text-white text-xs rounded-full px-2 py-1"
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="flex items-center gap-3 text-xs text-white/60">
      {task.dueDate ? (
        <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
          Due {new Date(task.dueDate).toLocaleDateString()}
        </span>
      ) : null}
      <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
        Updated {new Date(task.updatedAt).toLocaleDateString()}
      </span>
    </div>
    <div className="flex gap-3">
      <button
        onClick={() => onEdit(task)}
        className="text-xs text-mint border border-mint/40 px-3 py-1 rounded-full hover:bg-mint/10"
      >
        Quick edit
      </button>
      <button
        onClick={() => onDelete(task._id)}
        className="text-xs text-coral border border-coral/30 px-3 py-1 rounded-full hover:bg-coral/10"
      >
        Delete
      </button>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const profile = {
    name: user?.name || 'Shruti Singh',
    role: 'Full-stack Web Developer',
    avatar: 'https://i.pravatar.cc/300?img=12',
    github: user?.github || 'https://github.com/suii2210',
    linkedin: user?.linkedin || 'https://linkedin.com/in/shruti2210',
    portfolio: user?.portfolio || 'https://suii.dev',
    email: user?.contactEmail || user?.email || 'work8758@gmail.com'
  };
  const skills = ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'Docker'];
  const projects = [
    { title: 'Recruitment CRM', link: `${profile.github}/recruitment-crm` },
    { title: 'Event Management System', link: `${profile.github}/event-management` },
    { title: 'Personal Portfolio', link: profile.portfolio }
  ];
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' });
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: ''
  });
  const [notes, setNotes] = useState([]);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const summary = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    return { total, done, inProgress };
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskApi.list({
        search: filters.search || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined
      });
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (createForm.title.length < 2) {
      setError('Task title must be at least 2 characters');
      return;
    }
    try {
      await taskApi.create({
        ...createForm,
        dueDate: createForm.dueDate || undefined
      });
      setCreateForm({ ...createForm, title: '', description: '', dueDate: '' });
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, payload) => {
    try {
      await taskApi.update(id, payload);
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, ...payload } : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskApi.remove(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleEditSave = async () => {
    if (!editing) return;
    const payload = {
      title: editing.title,
      description: editing.description,
      dueDate: editing.dueDate || undefined
    };
    try {
      await taskApi.update(editing._id, payload);
      setEditing(null);
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!filters.search) return tasks;
    return tasks.filter((t) =>
      `${t.title} ${t.description}`.toLowerCase().includes(filters.search.toLowerCase())
    );
  }, [tasks, filters.search]);

  const fetchNotes = async () => {
    try {
      const res = await noteApi.list();
      setNotes(res.data.notes);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (noteForm.title.trim().length < 2) {
      setError('Note title must be at least 2 characters');
      return;
    }
    try {
      await noteApi.create(noteForm);
      setNoteForm({ title: '', content: '' });
      fetchNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;
    try {
      await noteApi.update(editingNote._id, {
        title: editingNote.title,
        content: editingNote.content
      });
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await noteApi.remove(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="hidden md:flex flex-col gap-3 fixed right-6 top-1/2 -translate-y-1/2 z-20 items-center">
       
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-white shadow-card"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-white shadow-card"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href={profile.portfolio}
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-white shadow-card"
        >
          <Globe className="w-5 h-5" />
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="p-3 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-white shadow-card"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-white/70 text-sm">Welcome, {user?.name}</p>
        <div className="flex flex-wrap gap-4">
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-xs text-white/60">Total tasks</p>
            <p className="text-2xl font-bold text-white">{summary.total}</p>
          </div>
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-xs text-white/60">In progress</p>
            <p className="text-2xl font-bold text-sky">{summary.inProgress}</p>
          </div>
          <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-xs text-white/60">Done</p>
            <p className="text-2xl font-bold text-mint">{summary.done}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-card">
          <h3 className="text-white font-semibold mb-3">Create a task</h3>
          <form className="space-y-3" onSubmit={handleCreate}>
            <FormField label="Title">
              <input
                value={createForm.title}
                onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
                required
              />
            </FormField>
            <FormField label="Description">
              <textarea
                rows="3"
                value={createForm.description}
                onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Status">
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-night border border-white/10 text-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Priority">
                <select
                  value={createForm.priority}
                  onChange={(e) => setCreateForm((p) => ({ ...p, priority: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-night border border-white/10 text-white"
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField label="Due date">
              <input
                type="date"
                value={createForm.dueDate}
                onChange={(e) => setCreateForm((p) => ({ ...p, dueDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-night border border-white/10 text-white"
              />
            </FormField>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-gradient-to-r from-mint to-sky text-night font-semibold hover:opacity-90 transition"
            >
              Save task
            </button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearch}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
              className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              <option value="">All statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={filters.priority}
              onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value }))}
              className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
            >
              <option value="">All priorities</option>
              {priorityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="p-3 rounded-xl bg-coral/20 text-coral border border-coral/30">{error}</div>
          ) : null}
          {loading ? <p className="text-white/70">Loading tasks...</p> : null}

          <div className="grid sm:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={(t) =>
                  setEditing({
                    ...t,
                    dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : ''
                  })
                }
              />
            ))}
            {!filteredTasks.length && !loading ? (
              <p className="text-white/60">No tasks yet. Create one to get started.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <StickyNote className="w-5 h-5 text-mint" />
            <h3 className="text-white font-semibold">Notes</h3>
          </div>
          <form className="space-y-3" onSubmit={handleCreateNote}>
            <FormField label="Title">
              <input
                value={noteForm.title}
                onChange={(e) => setNoteForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
                required
              />
            </FormField>
            <FormField label="Content">
              <textarea
                rows="4"
                value={noteForm.content}
                onChange={(e) => setNoteForm((p) => ({ ...p, content: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-night border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-mint"
              />
            </FormField>
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-gradient-to-r from-mint to-sky text-night font-semibold hover:opacity-90 transition"
            >
              Add note
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="w-5 h-5 text-mint" />
            <h3 className="text-white font-semibold">Your notes</h3>
            <span className="text-xs text-white/60">({notes.length})</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="relative group rounded-xl border border-white/10 bg-white/5 p-4 text-white/80"
              >
                <p className="text-white font-semibold mb-2">{note.title}</p>
                <p className="text-sm text-white/70 whitespace-pre-wrap min-h-[60px]">
                  {note.content || 'No content'}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() =>
                      setEditingNote({
                        ...note,
                        title: note.title,
                        content: note.content
                      })
                    }
                    className="flex items-center gap-1 text-xs text-mint border border-mint/30 px-3 py-1 rounded-full hover:bg-mint/10"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="flex items-center gap-1 text-xs text-coral border border-coral/30 px-3 py-1 rounded-full hover:bg-coral/10"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
                <p className="text-[10px] text-white/50 mt-2">
                  Updated {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {!notes.length ? (
              <p className="text-white/60 text-sm">No notes yet. Add one to get started.</p>
            ) : null}
          </div>
        </div>
      </div>

      {editingNote ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-night border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Edit note</h3>
              <button
                onClick={() => setEditingNote(null)}
                className="text-white/60 hover:text-white px-3 py-1 rounded-full border border-white/10"
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              <FormField label="Title">
                <input
                  value={editingNote.title}
                  onChange={(e) => setEditingNote((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </FormField>
              <FormField label="Content">
                <textarea
                  rows="4"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote((p) => ({ ...p, content: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </FormField>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditingNote(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-white/80 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNote}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-mint to-sky text-night font-semibold hover:opacity-90"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editing ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-night border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Edit task</h3>
              <button
                onClick={() => setEditing(null)}
                className="text-white/60 hover:text-white px-3 py-1 rounded-full border border-white/10"
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              <FormField label="Title">
                <input
                  value={editing.title}
                  onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  rows="3"
                  value={editing.description}
                  onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </FormField>
              <FormField label="Due date">
                <input
                  type="date"
                  value={editing.dueDate}
                  onChange={(e) => setEditing((p) => ({ ...p, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </FormField>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-white/80 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-mint to-sky text-night font-semibold hover:opacity-90"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
