import React, { useEffect, useState } from 'react';
import { Card, Tabs, List, Button, Modal, Input, Space, message, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { getDatabase, ref, set, onValue, push, remove, update } from "firebase/database";

const { TabPane } = Tabs;
const { Title } = Typography;

const itemTypes = [
  { key: 'Transporter', label: 'Transporter' },
  { key: 'locations', label: 'Locations' },
  { key: 'pumps', label: 'Pump Names' },
  { key: 'bankData', label: 'Bank Names' },
  { key: 'Vehicles', label: 'Vehicle Numbers' },
  { key: 'maal', label: 'Maals' }
];


const ManageItems = () => {
  const [activeTab, setActiveTab] = useState('locations');
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, type: '', item: null });
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // Fetch all lists from Firebase Realtime Database
  const fetchItems = async () => {
    setLoading(true);
    const db = getDatabase();
    const newItems = {};

    await new Promise(resolve => {
      onValue(ref(db, 'transporters/'), (snapshot) => {
        const data = snapshot.val();
        let arr = [];
        if (data) {
          Object.entries(data).forEach(([id, item]) => {
            arr.push({ id, ...item });
          });
        }
        newItems['Transporter'] = arr;
        resolve();
      }, { onlyOnce: true });
    })
    // Locations
    await new Promise(resolve => {
      onValue(ref(db, 'locations/'), (snapshot) => {
        const data = snapshot.val();
        let arr = [];
        if (data) {
          Object.entries(data).forEach(([id, item]) => {
            arr.push({ id, ...item });
          });
        }
        newItems['locations'] = arr;
        resolve();
      }, { onlyOnce: true });
    });

    // Pumps
    await new Promise(resolve => {
      onValue(ref(db, 'pumps/'), (snapshot) => {
        const data = snapshot.val();
        let arr = [];
        if (Array.isArray(data)) {
          arr = data.map((item, idx) => item ? { ...item, id: idx } : null).filter(Boolean);
        } else if (data) {
          // fallback for object structure
          Object.entries(data).forEach(([id, item]) => {
            arr.push({ id: Number(id), ...item });
          });
        }
        newItems['pumps'] = arr;
        resolve();
      }, { onlyOnce: true });
    });

    // Bank Names
    await new Promise(resolve => {
      onValue(ref(db, 'bankData/data/'), (snapshot) => {
        const data = snapshot.val();
        let arr = [];
        if (Array.isArray(data)) {
          arr = data.map((item, idx) => item ? { ...item, id: idx } : null).filter(Boolean);
        } else if (data) {
          Object.entries(data).forEach(([id, item]) => {
            arr.push({ id: Number(id), ...item });
          });
        }
        newItems['bankData'] = arr;
        resolve();
      }, { onlyOnce: true });
    });

    // Vehicle Numbers
    await new Promise(resolve => {
      onValue(ref(db, 'Vehicles/'), (snapshot) => {
        const data = snapshot.val();
        let arr = [];
        if (Array.isArray(data)) {
          arr = data.map((item, idx) => item ? { ...item, id: idx } : null).filter(Boolean);
        } else if (data) {
          Object.entries(data).forEach(([id, item]) => {
            arr.push({ id: Number(id), ...item });
          });
        }
        newItems['Vehicles'] = arr;
        resolve();
      }, { onlyOnce: true });
    });

    // Maal
    await new Promise(resolve => {
      onValue(ref(db, 'maal/'), (snapshot) => {
        const data = snapshot.val();
        let arr = [];
        if (data) {
          Object.entries(data).forEach(([id, item]) => {
            arr.push({ id, ...item });
          });
        }
        newItems['maal'] = arr;
        resolve();
      }, { onlyOnce: true });
    });

    setItems(newItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  // Add new item
  const handleAdd = async () => {
    if (!inputValue.trim()) {
      message.warning('Please enter a value');
      return;
    }
    setLoading(true);
    const db = getDatabase();
    let refPath = '';
    let newItem = {};
    let arr = [];
    switch (modal.type) {
      case 'Transporter':
        refPath = 'transporters';
        newItem = { label: inputValue, value: inputValue };
        await set(ref(db, `${refPath}/${Date.now().toString()}`), newItem);
        break;
      case 'locations':
        refPath = 'locations';
        newItem = { value: inputValue, label: inputValue };
        // Add as object with unique id
        const newId = Date.now().toString();
        await set(ref(db, `${refPath}/${newId}`), newItem);
        break;
      case 'pumps':
        refPath = 'pumps';
        newItem = { pumpName: inputValue, value: inputValue, label: inputValue };
        arr = items['pumps'] ? [...items['pumps']] : [];
        arr.push(newItem);
        await set(ref(db, refPath), arr);
        break;
      case 'bankData':
        refPath = 'bankData/data';
        newItem = { bankName: inputValue, value: inputValue, label: inputValue };
        arr = items['bankData'] ? [...items['bankData']] : [];
        arr.push(newItem);
        await set(ref(db, refPath), arr);
        break;
      case 'Vehicles':
        refPath = 'Vehicles';
        newItem = { vehicleNo: inputValue, value: inputValue, label: inputValue };
        arr = items['Vehicles'] ? [...items['Vehicles']] : [];
        arr.push(newItem);
        await set(ref(db, refPath), arr);
        break;
      case 'maal':
        refPath = 'maal';
        newItem = { value: inputValue, label: inputValue };
        const maalId = Date.now().toString();
        await set(ref(db, `${refPath}/${maalId}`), newItem);
        break;
      default:
        setLoading(false);
        return;
    }
    message.success('Item added');
    setModal({ visible: false, type: '', item: null });
    setInputValue('');
    fetchItems();
    setLoading(false);
  };

  // Edit item
  const handleEdit = async () => {
    if (!inputValue.trim()) {
      message.warning('Please enter a value');
      return;
    }
    setLoading(true);
    const db = getDatabase();
    let refPath = '';
    let updateObj = {};
    let arr = [];
    switch (modal.type) {
      case 'Transporter':
        refPath = `transporters/${modal.item.id}`;
        updateObj = { label: inputValue, value: inputValue };
        await update(ref(db, refPath), updateObj);
        break;
      case 'locations':
        refPath = `locations/${modal.item.id}`;
        updateObj = { value: inputValue, label: inputValue };
        await update(ref(db, refPath), updateObj);
        break;
      case 'pumps':
        refPath = 'pumps';
        arr = items['pumps'] ? [...items['pumps']] : [];
        arr[modal.item.id] = { pumpName: inputValue, value: inputValue, label: inputValue };
        await set(ref(db, refPath), arr);
        break;
      case 'bankData':
        refPath = 'bankData/data';
        arr = items['bankData'] ? [...items['bankData']] : [];
        arr[modal.item.id] = { bankName: inputValue, value: inputValue, label: inputValue };
        await set(ref(db, refPath), arr);
        break;
      case 'Vehicles':
        refPath = 'Vehicles';
        arr = items['Vehicles'] ? [...items['Vehicles']] : [];
        arr[modal.item.id] = { vehicleNo: inputValue, value: inputValue, label: inputValue };
        await set(ref(db, refPath), arr);
        break;
      case 'maal':
        refPath = `maal/${modal.item.id}`;
        updateObj = { value: inputValue, label: inputValue };
        await update(ref(db, refPath), updateObj);
        break;
      default:
        setLoading(false);
        return;
    }
    message.success('Item updated');
    setModal({ visible: false, type: '', item: null });
    setInputValue('');
    fetchItems();
    setLoading(false);
  };

  // Delete item
  const handleDelete = async (type, id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      onOk: async () => {
        setLoading(true);
        const db = getDatabase();
        let refPath = '';
        let arr = [];
        switch (type) {
          case 'Transporter':
            refPath = `transporters/${id}`;
            await set(ref(db, refPath), null);
            break;
          case 'locations':
            refPath = `locations/${id}`;
            await set(ref(db, refPath), null);
            break;
          case 'pumps':
            refPath = 'pumps';
            arr = items['pumps'] ? [...items['pumps']] : [];
            arr.splice(id, 1);
            await set(ref(db, refPath), arr);
            break;
          case 'bankData':
            refPath = 'bankData/data';
            arr = items['bankData'] ? [...items['bankData']] : [];
            arr.splice(id, 1);
            await set(ref(db, refPath), arr);
            break;
          case 'Vehicles':
            refPath = 'Vehicles';
            arr = items['Vehicles'] ? [...items['Vehicles']] : [];
            arr.splice(id, 1);
            await set(ref(db, refPath), arr);
            break;
          case 'maal':
            refPath = `maal/${id}`;
            await set(ref(db, refPath), null);
            break;
          default:
            setLoading(false);
            return;
        }
        message.success('Item deleted');
        fetchItems();
        setLoading(false);
      }
    });
  };

  // Open modal for add/edit
  const openModal = (type, item = null) => {
    setModal({ visible: true, type, item });
    setInputValue(item ? (item.value || item.label || item.bankName || item.pumpName || item.vehicleNo) : '');
  };

  // Filtered items for current tab
  const getFilteredItems = (type) => {
    const list = items[type] || [];
    if (!searchValue.trim()) return list;
    return list.filter(item =>
      (item.value || item.label || item.bankName || item.pumpName || item.vehicleNo || '')
        .toLowerCase()
        .includes(searchValue.trim().toLowerCase())
    );
  };

  // Prepare tab items for Ant Design Tabs
  const tabItems = itemTypes.map(type => ({
    key: type.key,
    label: type.label,
    children: (
      <>

        <Space style={{ width: '100%', justifyContent: 'center' }}>
          <Input
            placeholder={`Search ${type.label}`}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            allowClear
            style={{ marginBottom: 16 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal(type.key)}
            style={{ marginBottom: 16 }}
          >
            Add New {type.label.slice(0, -1)}
          </Button>
        </Space>
        <List
          loading={loading}
          dataSource={getFilteredItems(type.key)}
          renderItem={(item, index) => (
            <List.Item
              key={index}
              actions={[
                <Button
                  key={`edit-${index}`}
                  icon={<EditOutlined />}
                  onClick={() => openModal(type.key, item)}
                  type="link"
                />,
                <Button
                  key={`delete-${index}`}
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(type.key, item.id)}
                  type="link"
                />
              ]}
            >
              {item.value || item.label || item.bankName || item.pumpName || item.vehicleNo}
            </List.Item>
          )}
          bordered
          style={{ marginBottom: 16 }}
        />

      </>
    )
  }));

  return (
    <Card style={{ maxWidth: 700, margin: '40px auto', boxShadow: '0 2px 8px #f0f1f2' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 20 }}>Manage List Items</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={tabItems}
      />
      <Modal
        open={modal.visible}
        title={modal.item ? `Edit ${itemTypes.find(t => t.key === modal.type)?.label?.slice(0, -1)}` : `Add New ${itemTypes.find(t => t.key === modal.type)?.label?.slice(0, -1)}`}
        onCancel={() => setModal({ visible: false, type: '', item: null })}
        onOk={modal.item ? handleEdit : handleAdd}
        okText={modal.item ? <><SaveOutlined /> Save</> : <><PlusOutlined /> Add</>}
      >
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder={`Enter ${itemTypes.find(t => t.key === modal.type)?.label?.slice(0, -1)}`}
          autoFocus
        />
      </Modal>
    </Card>
  );
};

export default ManageItems;