import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialGymData } from '../data/gymData';
import { dbService } from '../services/dbService';
import { apiService } from '../services/api';

const GymContext = createContext();

export const GymProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('easygym_pro_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialGymData,
          ...parsed,
          members: parsed.members || [],
          posProducts: parsed.posProducts || [],
          biometricLogs: parsed.biometricLogs || [],
          invoices: parsed.invoices || [],
          ptAssignments: parsed.ptAssignments || [],
          plans: parsed.plans || initialGymData.plans,
          trainers: parsed.trainers || initialGymData.trainers
        };
      } catch (e) {
        return initialGymData;
      }
    }
    return initialGymData;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('easygym_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('overview'); // Admin tabs
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'admin' | 'login'
  const [toast, setToast] = useState(null);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // For Edit Member Modal

  // Sync Live Data from Express MongoDB Atlas Backend for specific logged-in Gym Owner
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const ownerEmail = user?.email;
        if (!ownerEmail) return;

        const membersRes = await apiService.getMembers(ownerEmail);
        const productsRes = await apiService.getProducts(ownerEmail);
        const plansRes = await apiService.getPlans(ownerEmail);
        const trainersRes = await apiService.getTrainers(ownerEmail);
        const gymRes = await apiService.getGymInfo(ownerEmail);

        if (gymRes && gymRes.success && gymRes.data) {
          setData(prev => ({
            ...prev,
            gymInfo: {
              ...prev.gymInfo,
              ...gymRes.data
            }
          }));
        }

        if (membersRes && membersRes.success && Array.isArray(membersRes.data)) {
          setData(prev => {
            const newState = {
              ...prev,
              members: membersRes.data
            };
            if (user) {
              localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
            }
            return newState;
          });
        }

        if (productsRes && productsRes.success && Array.isArray(productsRes.data)) {
          setData(prev => ({
            ...prev,
            posProducts: productsRes.data
          }));
        }

        if (plansRes && plansRes.success && Array.isArray(plansRes.data)) {
          setData(prev => ({
            ...prev,
            plans: plansRes.data
          }));
        }

        if (trainersRes && trainersRes.success && Array.isArray(trainersRes.data)) {
          setData(prev => ({
            ...prev,
            trainers: trainersRes.data
          }));
        }
      } catch (err) {
        console.log("Using cached/local database fallback:", err.message);
      }
    };

    fetchBackendData();
    dbService.initDB();
  }, [user?.email]);

  // Save current gym state into local storage per user session
  useEffect(() => {
    if (user) {
      localStorage.setItem('easygym_pro_data', JSON.stringify({
        gymInfo: data.gymInfo,
        members: data.members,
        posProducts: data.posProducts,
        biometricLogs: data.biometricLogs,
        invoices: data.invoices,
        ptAssignments: data.ptAssignments,
        plans: data.plans,
        trainers: data.trainers
      }));
    }
  }, [data, user]);

  // Keep gymInfo synced with current logged in user
  useEffect(() => {
    if (user && (user.gymName || user.branch)) {
      setData(prev => ({
        ...prev,
        gymInfo: {
          ...prev.gymInfo,
          name: user.gymName || prev.gymInfo?.name || 'EasyGym Fitness Hub',
          branch: user.branch || prev.gymInfo?.branch || 'Central Branch',
          address: user.address || prev.gymInfo?.address || 'Main Road',
          city: user.city || prev.gymInfo?.city || '',
          phone: user.phone || prev.gymInfo?.phone || '+91 98765 43210',
          email: user.email || prev.gymInfo?.email || '',
          capacity: user.gymCapacity || prev.gymInfo?.capacity || 300
        }
      }));
    }
  }, [user]);

  const updateGymInfo = async (newGymInfo) => {
    setData(prev => {
      const newState = {
        ...prev,
        gymInfo: {
          ...prev.gymInfo,
          ...newGymInfo
        }
      };
      if (user) {
        localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      }
      return newState;
    });

    if (user) {
      const updatedUser = {
        ...user,
        gymName: newGymInfo.name,
        branch: newGymInfo.branch,
        phone: newGymInfo.phone,
        address: newGymInfo.address,
        city: newGymInfo.city
      };
      setUser(updatedUser);
      localStorage.setItem('easygym_user', JSON.stringify(updatedUser));
    }

    if (user && user.id) {
      try {
        await apiService.updateUser(user.id, {
          gymName: newGymInfo.name,
          branch: newGymInfo.branch,
          phone: newGymInfo.phone,
          address: newGymInfo.address,
          city: newGymInfo.city,
          logo: newGymInfo.logo
        });
      } catch (err) {
        console.error("Failed to sync gym info to backend", err);
      }
    }

    if (user && user.email) {
      try {
        await apiService.updateGymInfo({
          ownerEmail: user.email,
          gymName: newGymInfo.name,
          branch: newGymInfo.branch,
          phone: newGymInfo.phone,
          address: newGymInfo.address,
          city: newGymInfo.city,
          logo: newGymInfo.logo,
          gstNo: newGymInfo.gstNo
        });
      } catch (err) {
        console.error("Failed to sync gym to dedicated gyms table", err);
      }
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth Actions
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('easygym_user', JSON.stringify(userData));

    setData(prev => ({
      ...prev,
      members: [],
      posProducts: [],
      biometricLogs: [],
      invoices: [],
      ptAssignments: [],
      plans: [],
      trainers: [],
      gymInfo: {
        ...prev.gymInfo,
        name: userData.gymName || 'EasyGym Fitness Hub',
        branch: userData.branch || 'Central Branch',
        address: userData.address || 'Main Road',
        city: userData.city || '',
        phone: userData.phone || '+91 98765 43210',
        email: userData.email || '',
        capacity: userData.gymCapacity || 300
      }
    }));

    setViewMode('admin');
    showToast(`Welcome ${userData.name}! (${userData.gymName || 'Gym'} Owner Dashboard Ready)`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('easygym_user');
    localStorage.removeItem('easygym_pro_data');
    setData({
      ...initialGymData,
      members: [],
      posProducts: [],
      biometricLogs: [],
      invoices: [],
      ptAssignments: [],
      plans: [],
      trainers: []
    });
    setViewMode('login');
    showToast('Logged out successfully', 'info');
  };

  // Database Backup Export
  const exportDatabaseBackup = () => {
    dbService.exportDatabaseToJson(data);
    showToast('Database exported as JSON backup file!', 'success');
  };

  // Member Actions
  const addMember = async (newMember) => {
    const id = `MEM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const ownerEmail = (user?.email || 'owner@gym.com').trim().toLowerCase();
    const memberWithId = {
      ...newMember,
      id,
      ownerEmail,
      attendanceToday: false,
      lastCheckIn: "Never",
      biometricStatus: "Registered (Facial + Fingerprint)"
    };

    // Update state AND localStorage immediately
    setData(prev => {
      const updatedMembers = [memberWithId, ...(prev.members || [])];
      const newState = { ...prev, members: updatedMembers };
      if (user) {
        localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      }
      return newState;
    });

    try {
      const res = await apiService.createMember(memberWithId);
      if (res && res.success) {
        showToast(`Member ${newMember.name} registered & saved live to MongoDB Atlas!`, 'success');
      } else {
        showToast(`Member ${newMember.name} saved locally`, 'info');
      }
    } catch (e) {
      showToast(`Member ${newMember.name} saved locally`, 'info');
    }

    // Automated Welcome WhatsApp Message
    setTimeout(() => {
      sendWhatsAppMessage(newMember.name, newMember.phone, `Welcome to ${user?.gymName || 'EasyGym Fitness Hub'}, ${newMember.name}! Your ${newMember.plan} membership is now active.`);
    }, 1500);

    // Automated Welcome Email
    if (newMember.email) {
      setTimeout(async () => {
        const gymName = user?.gymName || 'EasyGym Fitness Hub';
        const ownerEmail = user?.email || 'support@easygym.com';
        const res = await apiService.sendEmail({
          to: newMember.email,
          fromName: gymName,
          replyTo: ownerEmail,
          subject: `Welcome to ${gymName} - Membership Confirmed!`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #10b981;">Welcome to ${gymName}! 🏋️‍♂️</h2>
              <p>Hi <strong>${newMember.name}</strong>,</p>
              <p>We are thrilled to have you join our fitness community. Your registration was successful.</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Membership ID:</strong> ${id}</p>
                <p><strong>Selected Plan:</strong> ${newMember.plan}</p>
                <p><strong>Join Date:</strong> ${newMember.joinDate}</p>
                <p><strong>Expiry Date:</strong> ${newMember.expiryDate}</p>
              </div>
              <p>Please clear any pending dues (₹${newMember.dueAmount || 0}) at the front desk if you haven't already.</p>
              <p>Get ready to achieve your fitness goals!</p>
              <br/>
              <p>Warm Regards,<br/><strong>The ${gymName} Team</strong></p>
            </div>
          `
        });
        
        if (res && res.success) {
          showToast(`📧 Welcome email sent to ${newMember.email}!`, 'success');
        } else {
          console.warn("Email send failed:", res?.message);
          showToast(`⚠️ Could not send email. Check backend terminal for errors.`, 'warning');
        }
      }, 2500);
    }
  };

  const updateMemberFull = async (memberId, updatedFields) => {
    const updatedMember = { ...updatedFields, id: memberId };
    setData(prev => {
      const updatedMembers = (prev.members || []).map(m => (m.id === memberId || m._id === memberId) ? { ...m, ...updatedFields } : m);
      const newState = { ...prev, members: updatedMembers };
      if (user) {
        localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      }
      return newState;
    });

    try {
      await apiService.updateMember(memberId, updatedMember);
      showToast(`Member "${updatedFields.name || memberId}" details updated in database!`, 'success');
    } catch (e) {
      showToast(`Member updated locally`, 'info');
    }
  };

  const deleteMember = async (memberId) => {
    const targetMember = (data.members || []).find(m => m.id === memberId || m._id === memberId);
    const idToDelete = targetMember?.id || targetMember?._id || memberId;

    // Filter out from local state & localStorage immediately
    setData(prev => {
      const updatedMembers = (prev.members || []).filter(m => m.id !== memberId && m._id !== memberId && m.id !== idToDelete && m._id !== idToDelete);
      if (user) {
        localStorage.setItem('easygym_pro_data', JSON.stringify({
          ...prev,
          members: updatedMembers
        }));
      }
      return {
        ...prev,
        members: updatedMembers
      };
    });

    try {
      const res = await apiService.deleteMember(idToDelete);
      if (res && res.success) {
        showToast(`Member deleted from MongoDB database permanently!`, 'success');
      } else {
        showToast(`Member removed from roster`, 'info');
      }
    } catch (e) {
      showToast(`Member removed locally`, 'info');
    }
  };

  const updateMemberStatus = (memberId, newStatus) => {
    const member = data.members.find(m => m.id === memberId);
    if (member) {
      updateMemberFull(memberId, { ...member, status: newStatus });
    }
  };

  // POS Store Product Actions (Gym Owner Product Inventory)
  const addProduct = async (productData) => {
    const id = `PROD-${Math.floor(1000 + Math.random() * 9000)}`;
    const ownerEmail = user?.email || 'owner@gym.com';
    const newProd = {
      id,
      ownerEmail,
      ...productData,
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0
    };

    setData(prev => {
      const updatedProducts = [newProd, ...(prev.posProducts || [])];
      const newState = { ...prev, posProducts: updatedProducts };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.createProduct(newProd);
      showToast(`Store item "${newProd.name}" added to MongoDB Database!`, 'success');
    } catch (e) {
      showToast(`Item "${newProd.name}" saved locally`, 'info');
    }
  };

  const updateProduct = async (productId, updatedFields) => {
    const payload = { 
      ...updatedFields, 
      price: Number(updatedFields.price) || 0,
      costPrice: Number(updatedFields.costPrice) || 0,
      stock: Number(updatedFields.stock) || 0,
      id: productId 
    };
    setData(prev => {
      const updatedProducts = (prev.posProducts || []).map(p => p.id === productId ? { ...p, ...payload } : p);
      const newState = { ...prev, posProducts: updatedProducts };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.updateProduct(productId, payload);
      showToast(`Product updated in Database!`, 'success');
    } catch (e) {
      showToast(`Product updated locally`, 'info');
    }
  };

  const deleteProduct = async (productId) => {
    setData(prev => {
      const updatedProducts = (prev.posProducts || []).filter(p => p.id !== productId);
      const newState = { ...prev, posProducts: updatedProducts };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.deleteProduct(productId);
      showToast(`Item removed from database permanently!`, 'success');
    } catch (e) {
      showToast(`Item removed locally`, 'info');
    }
  };

  // Biometric Check-in Simulation
  const processBiometricPunch = (memberId, method = 'Fingerprint') => {
    const member = data.members.find(m => m.id === memberId || m.name.toLowerCase().includes(memberId.toLowerCase()));
    if (!member) {
      showToast(`Biometric Scan Failed: Member ID "${memberId}" not found in your gym roster`, 'danger');
      return false;
    }

    if (member.status === 'Expired') {
      showToast(`❌ ACCESS DENIED: ${member.name}'s plan is Expired!`, 'danger');
      const newLog = {
        id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
        memberId: member.id,
        memberName: member.name,
        time: new Date().toLocaleTimeString(),
        date: "Today",
        device: "Biometric Gate #1",
        method,
        status: "Access Denied (Expired)",
        accessCode: "DENIED"
      };
      setData(prev => ({ ...prev, biometricLogs: [newLog, ...prev.biometricLogs] }));
      return false;
    }

    if (member.dueAmount > 0) {
      showToast(`❌ ACCESS DENIED: ${member.name} has pending dues of ₹${member.dueAmount}!`, 'danger');
      const newLog = {
        id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
        memberId: member.id,
        memberName: member.name,
        time: new Date().toLocaleTimeString(),
        date: "Today",
        device: method.includes('Mobile') ? "EasyGym Member App" : "Biometric Gate #1",
        method,
        status: `Denied (₹${member.dueAmount} Due)`,
        accessCode: "DENIED"
      };
      setData(prev => ({ ...prev, biometricLogs: [newLog, ...(prev.biometricLogs || [])] }));
      return false;
    }

    const newLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      memberId: member.id,
      memberName: member.name,
      time: new Date().toLocaleTimeString(),
      date: "Today",
      device: method.includes('Mobile') ? "EasyGym Member App" : "Biometric Gate #1",
      method,
      status: "Access Granted",
      accessCode: "OK"
    };

    setData(prev => ({
      ...prev,
      members: (prev.members || []).map(m => m.id === member.id ? { ...m, attendanceToday: true, lastCheckIn: `${new Date().toLocaleTimeString()} Today` } : m),
      biometricLogs: [newLog, ...(prev.biometricLogs || [])]
    }));

    showToast(`✅ ACCESS GRANTED: Welcome ${member.name}! Turnstile Gate Unlocked.`, 'success');
    return true;
  };

  const deleteBiometricLog = (logId) => {
    setData(prev => {
      const updatedLogs = (prev.biometricLogs || []).filter(log => log.id !== logId);
      const newState = { ...prev, biometricLogs: updatedLogs };
      if (user) {
        localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      }
      return newState;
    });
    showToast('Biometric log entry removed successfully', 'info');
  };

  // POS & Billing Actions
  const createInvoice = (invoiceData) => {
    const id = `INV-${Math.floor(8000 + Math.random() * 1000)}`;
    const newInvoice = {
      id,
      ...invoiceData,
      date: new Date().toISOString().split('T')[0],
      status: "Paid"
    };

    setData(prev => ({
      ...prev,
      invoices: [newInvoice, ...(prev.invoices || [])]
    }));

    showToast(`Invoice #${id} generated & printed successfully!`, 'success');
  };

  const deleteInvoice = (invoiceId) => {
    setData(prev => ({
      ...prev,
      invoices: (prev.invoices || []).filter(inv => inv.id !== invoiceId)
    }));
    showToast(`Invoice #${invoiceId} deleted successfully`, 'info');
  };

  // WhatsApp Campaign Trigger
  const sendWhatsAppMessage = (nameOrTarget, phoneOrMessage, messageStr) => {
    if (messageStr) {
      showToast(`🚀 WhatsApp message sent to ${nameOrTarget} (${phoneOrMessage})!`, 'success');
    } else {
      showToast(`🚀 Automated WhatsApp campaign sent to ${nameOrTarget}!`, 'success');
    }
  };

  // Plan Management
  const addPlan = async (newPlanData) => {
    const id = `PLAN-${Date.now()}`;
    const ownerEmail = user?.email || 'owner@gym.com';
    const newPlan = { id, ownerEmail, ...newPlanData };

    setData(prev => {
      const updatedPlans = [...(prev.plans || []), newPlan];
      const newState = { ...prev, plans: updatedPlans };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.createPlan(newPlan);
      showToast(`Plan "${newPlan.name}" saved live to MongoDB Database!`, 'success');
    } catch (e) {
      showToast(`Plan "${newPlan.name}" added successfully!`, 'success');
    }
  };

  const updatePlan = async (planId, updatedFields) => {
    const ownerEmail = user?.email || 'owner@gym.com';
    const payload = { ownerEmail, ...updatedFields };

    setData(prev => {
      const updatedPlans = (prev.plans || []).map(p => (p.id === planId || p._id === planId) ? { ...p, ...payload } : p);
      const newState = { ...prev, plans: updatedPlans };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.updatePlan(planId, payload);
      showToast(`Plan updated in MongoDB Database!`, 'success');
    } catch (e) {
      showToast(`Plan updated locally`, 'info');
    }
  };

  const deletePlan = async (planId) => {
    setData(prev => {
      const updatedPlans = (prev.plans || []).filter(p => p.id !== planId && p._id !== planId);
      const newState = { ...prev, plans: updatedPlans };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.deletePlan(planId);
      showToast('Plan removed from Database', 'success');
    } catch (e) {
      showToast('Plan removed locally', 'info');
    }
  };

  const addTrainer = async (newTrainer) => {
    const id = `TR-${Date.now()}`;
    const ownerEmail = user?.email || 'owner@gym.com';
    const trainerWithId = {
      id,
      ownerEmail,
      experience: '1 Year',
      activeClients: 0,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150&q=80',
      ...newTrainer
    };

    setData(prev => {
      const updatedTrainers = [...(prev.trainers || []), trainerWithId];
      const newState = { ...prev, trainers: updatedTrainers };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.createTrainer(trainerWithId);
      showToast(`Trainer ${newTrainer.name} saved live to MongoDB Database!`, 'success');
    } catch (e) {
      showToast(`Trainer ${newTrainer.name} added successfully!`, 'success');
    }
  };

  const updateTrainer = async (trainerId, updatedFields) => {
    const ownerEmail = user?.email || 'owner@gym.com';
    const payload = { ownerEmail, ...updatedFields };

    setData(prev => {
      const updatedTrainers = (prev.trainers || []).map(t => (t.id === trainerId || t._id === trainerId) ? { ...t, ...payload } : t);
      const newState = { ...prev, trainers: updatedTrainers };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.updateTrainer(trainerId, payload);
      showToast(`Trainer details updated in MongoDB Database!`, 'success');
    } catch (e) {
      showToast(`Trainer updated locally`, 'info');
    }
  };

  const deleteTrainer = async (id) => {
    setData(prev => {
      const updatedTrainers = (prev.trainers || []).filter(t => t.id !== id && t._id !== id);
      const newState = { ...prev, trainers: updatedTrainers };
      if (user) localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
      return newState;
    });

    try {
      await apiService.deleteTrainer(id);
      showToast('Trainer removed from database', 'info');
    } catch (e) {
      showToast('Trainer removed locally', 'info');
    }
  };

  const assignPT = (assignmentDetails) => {
    const id = `PT-${Date.now()}`;
    setData(prev => ({
      ...prev,
      ptAssignments: [{ ...assignmentDetails, id, createdAt: new Date().toISOString() }, ...(prev.ptAssignments || [])]
    }));
    showToast('Trainer assigned successfully to Member! Records updated.', 'success');
  };

  const removePTAssignment = (id) => {
    setData(prev => ({
      ...prev,
      ptAssignments: (prev.ptAssignments || []).filter(pt => pt.id !== id)
    }));
    showToast('PT Assignment removed', 'info');
  };

  const resetData = () => {
    setData(initialGymData);
    localStorage.removeItem('easygym_pro_data');
    showToast("Database reset to default", "info");
  };

  // Automated Expiry Check
  useEffect(() => {
    if (!data.members || data.members.length === 0) return;
    
    const today = new Date().toISOString().split('T')[0];
    let needsUpdate = false;
    
    const updatedMembers = data.members.map(m => {
      if (m.expiryDate && m.expiryDate < today && m.status !== 'Expired') {
        needsUpdate = true;
        setTimeout(() => {
          sendWhatsAppMessage(m.name, m.phone, `Hi ${m.name}, your ${m.plan || 'membership'} expired on ${m.expiryDate}. Please renew to continue your fitness journey!`);
        }, 2500);
        return { ...m, status: 'Expired' };
      }
      return m;
    });

    if (needsUpdate) {
      setData(prev => {
        const newState = { ...prev, members: updatedMembers };
        if (user) {
          localStorage.setItem('easygym_pro_data', JSON.stringify(newState));
        }
        return newState;
      });
    }
  }, [data.members]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GymContext.Provider value={{
      data,
      user,
      login,
      logout,
      exportDatabaseBackup,
      activeTab,
      setActiveTab,
      viewMode,
      setViewMode,
      toast,
      showToast,
      showBiometricModal,
      setShowBiometricModal,
      showAddMemberModal,
      setShowAddMemberModal,
      editingMember,
      setEditingMember,
      addMember,
      updateMemberFull,
      deleteMember,
      updateMemberStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      processBiometricPunch,
      deleteBiometricLog,
      createInvoice,
      deleteInvoice,
      sendWhatsAppMessage,
      addPlan,
      updatePlan,
      deletePlan,
      addTrainer,
      updateTrainer,
      deleteTrainer,
      assignPT,
      removePTAssignment,
      resetData,
      updateGymInfo
    }}>
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => useContext(GymContext);
