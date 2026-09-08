// Clean Initial Dataset Schema for EasyGym Management Software (Zero Hardcoded Dummy Data)
export const initialGymData = {
  gymInfo: {
    name: "My EasyGym Hub",
    branch: "Main Branch",
    phone: "+91 98765 43210",
    email: "",
    address: "Main Road",
    gstNo: "07AAAAA0000A1Z5",
    currency: "₹"
  },

  smtpConfig: {
    provider: "Google Gmail SMTP",
    host: "smtp.gmail.com",
    port: "587",
    security: "TLS / STARTTLS",
    user: "",
    pass: "",
    senderName: "EasyGym Verified Mailer",
    status: "Ready",
    lastVerified: "Today"
  },

  members: [],
  biometricLogs: [],
  posProducts: [],
  invoices: [],
  ptAssignments: [],

  plans: [
    { id: "PLAN-1", name: "Silver 3-Month", price: 6499, duration: "3 Months", access: "Gym + Steam", popular: false, features: ["Full Gym Access", "Free Locker", "Fitness Assessment", "1 PT Trial Session"] },
    { id: "PLAN-2", name: "Gold 6-Month", price: 11999, duration: "6 Months", access: "Gym + Sauna + Cardio Zone", popular: true, features: ["All Silver Features", "Group Classes Included", "Diet Chart Consultation", "2 Guest Passes"] },
    { id: "PLAN-3", name: "Platinum 12-Month", price: 18999, duration: "12 Months", access: "All-Access 24/7", popular: false, features: ["Unlimited Access", "Personalized Workout App", "Free Supplement Shaker", "Monthly Body Composition Scan"] },
    { id: "PLAN-4", name: "VIP PT 3-Month", price: 25000, duration: "3 Months", access: "Dedicated Trainer", popular: false, features: ["Dedicated Certified Trainer", "Custom Meal Plans", "1-on-1 Daily Tracking", "Priority Biometric Gate"] }
  ],

  trainers: [
    { id: "TR-1", name: "Head Fitness Trainer", specialization: "Bodybuilding & Strength", experience: "5 Years", activeClients: 0, rating: 5.0 }
  ],

  classes: [
    { id: "CLS-1", title: "Morning High-Intensity HIIT", trainer: "Head Fitness Trainer", time: "07:00 AM - 08:00 AM", days: "Mon, Wed, Fri", capacity: 20, enrolled: 0, room: "Studio A" }
  ],

  whatsappCampaigns: [
    { id: "WA-101", title: "Membership Renewal Alert", targetGroup: "Expiring in 7 Days", status: "Active Automated", sentCount: 0, template: "Hi {{name}}, your {{plan}} membership expires on {{expiryDate}}. Renew today!" },
    { id: "WA-102", title: "Happy Birthday Wishes & Gift", targetGroup: "Daily Birthday Members", status: "Active Automated", sentCount: 0, template: "Happy Birthday {{name}}! 🎂 Celebrate with a FREE Personal Training session today!" },
    { id: "WA-103", title: "Dues & Payment Reminder", targetGroup: "Members with Pending Dues", status: "Active Automated", sentCount: 0, template: "Hello {{name}}, you have a pending balance of {{dueAmount}}. Please clear it at the front desk." }
  ],

  financialStats: {
    monthlyRevenue: "₹0",
    activeMembers: 0,
    monthlyCheckins: 0,
    renewalRate: "100%",
    pendingDuesTotal: "₹0",
    revenueGrowth: "0% growth"
  }
};
