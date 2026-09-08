const ZKLib = require('node-zklib');
const axios = require('axios');

// ==========================================
// EASYGYM BIOMETRIC SYNC AGENT CONFIGURATION
// ==========================================

// 1. Gym ki Biometric Machine ka IP address (LAN)
const MACHINE_IP = '192.168.1.102'; 
const MACHINE_PORT = 4370; // Default ZKTeco port

// 2. Aapke EasyGym Cloud Server ka API URL (Jahan data bhejna hai)
const EASYGYM_API_URL = 'http://localhost:5000/api/biometric/sync'; 

// 3. Gym ka Secret Key (Taki server ko pata chale kis gym ka data hai)
const GYM_SECRET_KEY = 'EZG-77489230'; 

// ==========================================

async function startSync() {
    console.log(`\n[EasyGym] ⏳ Connecting to Biometric Machine at ${MACHINE_IP}:${MACHINE_PORT}...`);
    
    // ZKTeco machine se connect karne ke liye ZKLib ka use
    const zkInstance = new ZKLib(MACHINE_IP, MACHINE_PORT, 10000, 4000);
    
    try {
        await zkInstance.createSocket();
        console.log('[EasyGym] ✅ Connected successfully to Biometric Machine!');
        
        // Har 5 seconds me machine se check karenge ki kisi ne punch kiya ya nahi
        setInterval(async () => {
            try {
                // Machine se attendance logs get karna
                const logs = await zkInstance.getAttendances();
                
                if (logs && logs.data && logs.data.length > 0) {
                    console.log(`[EasyGym] 🟢 Found ${logs.data.length} new punch logs. Syncing with cloud server...`);
                    
                    // EasyGym backend API par data bhejna (POST request)
                    await axios.post(EASYGYM_API_URL, {
                        gymKey: GYM_SECRET_KEY,
                        logs: logs.data // Data me member ki ID, date, time hoga
                    });
                    
                    console.log('[EasyGym] 🚀 Data Sync Successful!');
                    
                    // Note: Real production me yahan se logs clear kiye jate hain taki dubara sync na ho
                    // await zkInstance.clearAttendanceLog();
                }
            } catch (err) {
                console.error('[EasyGym] ❌ Error syncing logs:', err.message);
            }
        }, 5000); // 5000 ms = 5 seconds

    } catch (e) {
        console.error('[EasyGym] ❌ Failed to connect to biometric machine.', e.message);
        console.log('[EasyGym] 🔄 Retrying in 10 seconds...');
        setTimeout(startSync, 10000);
    }
}

// Agent Start karna
startSync();
