import { useState } from 'react'
import './App.css'
import { DataTable } from './components/DataTable'
import myLogo from './assets/logo-react.png' 
import { getDaysDifference } from './utils/dateUtils';
import { DateTime } from 'luxon'
import { useEffect } from 'react'


interface User {
  id: number;
  name: string;
  role: string;
  date: string;
}

type AppStatus = 'loading' | 'success' | 'error';

function App() {
  const [users, setUsers] = useState<User[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const [newUserForm, setNewUserForm] = useState<Partial<User>>({ name: '', role: '' });

  const [daysOld, setDaysOld] = useState<number | null>(null);

  const [status, setStatus] = useState<AppStatus>('loading');
    useEffect(() => {
      const timer = setTimeout(() => {
        setStatus('success');
      }, 1500);
      return () => clearTimeout(timer);
    }, []);

  const handleStartEdit = (user: User) => {
    console.log("Date of expense:", user.date); 

    try {
      const daysAgo = getDaysDifference(user.date, DateTime.now());
      console.log("Calculated days:", daysAgo); 
      
      setDaysOld(daysAgo); 
    } catch (error) {
      console.error("Error in utility:", error);
      setDaysOld(0); 
    }

    setEditingUser(user);
    setEditForm(user); 
  };

  const handleFormChange = (key: keyof User, value: string) => {
    setEditForm({ ...editForm, [key]: value });
  };

  const handleSave = () => {
     if (editingUser && editForm.name?.trim()) {
      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...editForm } as User : u
      ));
      setEditingUser(null);
      setEditForm({});
    } else {
      alert("The name field cannot be empty");
    }
  };

  const handleDelete = (userToDelete: User) => {
    setUsers(users.filter(u => u.id !== userToDelete.id));
  };

  const handleAddUser = () => {
    if (newUserForm.name?.trim() && newUserForm.role?.trim()) {
      const nextId = users.length > 0 
        ? Math.max(...users.map(u => u.id)) + 1 
        : 1;
      const newUser: User = {
        id: nextId,
        name: newUserForm.name as string,
        role: newUserForm.role as string,
        date: DateTime.now().toFormat('dd/MM/yyyy'),
      };

      setUsers([...users, newUser]);
      setNewUserForm({ name: '', role: '' }); 
    } else {
      alert("Please fill in both Name and Role");
    }
  };

  const totalAmount = users.reduce((acc, curr) => acc + (Number(curr.role) || 0), 0);

    return (
    <>
      <section id="center">
        {status === 'loading' ? (
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Oink! Feeding the PiggyBank...</h2>
            <p>Loading your financial data...</p>
          </div>
        ) : (

        <div>
          <img src={myLogo} alt="App Logo" style={{ width: '100px', marginBottom: '10px' }}/>
          
          <h1>PiggyBank</h1>
          <p style={{ opacity: 0.8, marginTop: '-10px', marginBottom: '20px' }}>
            Smart Expense Tracking
          </p>

          <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', textAlign: 'left' }}>
            <h3>Add New Expense</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Expense (e.g. Pizza)" 
                value={newUserForm.name || ''} 
                onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Amount (e.g. 15.50)" 
                value={newUserForm.role || ''} 
                onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
              />
              <button onClick={handleAddUser} style={{ backgroundColor: '#d07804cd', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'}}>
                Add to PiggyBank
              </button>
            </div>
          </div>

          <div style={{ margin: '20px 0', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
            <DataTable 
              data={users.map(u => ({
                ...u,
                days_ago: getDaysDifference(u.date, DateTime.now())
              }))} 
              onDelete={handleDelete}
              columns={[
                { key: 'id', header: 'ID' },
                { key: 'name', header: 'Description' },
                { key: 'role', header: 'Amount' },
                { key: 'date', header: 'Date' },
                { key: 'days_ago' as any, header: 'Days Created' }
              ]} 
            />
           
            <div style={{ marginTop: '15px', textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold', color: '#d07804cd' }}>
              Total PiggyBank: {totalAmount.toFixed(2)} €
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'left' }}>
            <h2>Edit Section</h2>
            <div style={{ marginBottom: '15px' }}>
              {users.map(user => (
                <button key={user.id} onClick={() => handleStartEdit(user)} style={{ marginRight: '10px' }}>
                  Edit {user.name}
                </button>
              ))}
            </div>

            {editingUser && (
              <div style={{ border: '1px solid #646cff', padding: '15px', borderRadius: '8px', background: 'rgba(100, 108, 255, 0.1)' }}>
                <h3>Editing: {editingUser.name}</h3>

                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                  Registered <strong>{daysOld !== null ? daysOld : '--'}</strong> days ago
                </p>

                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <input 
                    type="text" 
                    placeholder="Update Name"
                    value={editForm.name || ''} 
                    onChange={(e) => handleFormChange('name', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Update Role"
                    value={editForm.role || ''} 
                    onChange={(e) => handleFormChange('role', e.target.value)}
                  />
                  <div style={{ marginTop: '15px' }}>
                    <button onClick={handleSave} style={{ marginRight: '10px', backgroundColor: '#1b5e20', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                      Save Changes
                    </button>
                    
                    <button onClick={() => setEditingUser(null)} style={{ backgroundColor: '#b71c1c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                      Cancel
                    </button>
                </div>
                </div>
              </div>
            )}
          </div>
        </div> 
        )}
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
