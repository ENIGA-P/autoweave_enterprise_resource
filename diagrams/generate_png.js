const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Create a simple SVG version of the use case diagram
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #333; }
      .subtitle { font-family: Arial, sans-serif; font-size: 14px; fill: #666; }
      .module-title { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #6a1b9a; }
      .usecase { font-family: Arial, sans-serif; font-size: 10px; fill: #2e7d32; }
      .actor { font-family: Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #01579b; }
      .external { font-family: Arial, sans-serif; font-size: 11px; fill: #e65100; }
      .module-box { fill: #f3e5f5; stroke: #6a1b9a; stroke-width: 1; }
      .usecase-box { fill: #e8f5e8; stroke: #2e7d32; stroke-width: 1; }
      .actor-box { fill: #e1f5fe; stroke: #01579b; stroke-width: 2; }
      .external-box { fill: #fff3e0; stroke: #e65100; stroke-width: 2; }
      .connection { stroke: #333; stroke-width: 1; fill: none; }
      .dashed { stroke-dasharray: 5,5; }
    </style>
  </defs>
  
  <!-- Title -->
  <text x="800" y="30" class="title" text-anchor="middle">AutoWeave ERP - Use Case Diagram</text>
  <text x="800" y="50" class="subtitle" text-anchor="middle">Comprehensive Textile Manufacturing Management System</text>
  
  <!-- Actors (Left Side) -->
  <rect x="20" y="100" width="120" height="30" class="actor-box" rx="5"/>
  <text x="80" y="120" class="actor" text-anchor="middle">👨‍💼 Admin</text>
  
  <rect x="20" y="150" width="120" height="30" class="actor-box" rx="5"/>
  <text x="80" y="170" class="actor" text-anchor="middle">👔 Manager</text>
  
  <rect x="20" y="200" width="120" height="30" class="actor-box" rx="5"/>
  <text x="80" y="220" class="actor" text-anchor="middle">👷‍♂️ Supervisor</text>
  
  <rect x="20" y="250" width="120" height="30" class="actor-box" rx="5"/>
  <text x="80" y="270" class="actor" text-anchor="middle">👷 Worker</text>
  
  <rect x="20" y="300" width="120" height="30" class="actor-box" rx="5"/>
  <text x="80" y="320" class="actor" text-anchor="middle">🧑‍💼 Customer</text>
  
  <!-- System Boundary -->
  <rect x="180" y="80" width="1200" height="1000" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="10,5"/>
  <text x="780" y="100" class="title" text-anchor="middle" font-size="18">AutoWeave ERP System</text>
  
  <!-- Authentication Module -->
  <rect x="200" y="120" width="280" height="120" class="module-box" rx="5"/>
  <text x="340" y="140" class="module-title" text-anchor="middle">Authentication Module</text>
  <rect x="210" y="150" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="270" y="167" class="usecase" text-anchor="middle">UC-01: Login</text>
  <rect x="340" y="150" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="400" y="167" class="usecase" text-anchor="middle">UC-02: Logout</text>
  <rect x="210" y="185" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="270" y="202" class="usecase" text-anchor="middle">UC-03: Reset Password</text>
  
  <!-- Dashboard Module -->
  <rect x="500" y="120" width="280" height="120" class="module-box" rx="5"/>
  <text x="640" y="140" class="module-title" text-anchor="middle">Dashboard Module</text>
  <rect x="510" y="150" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="570" y="167" class="usecase" text-anchor="middle">UC-04: View Dashboard</text>
  <rect x="640" y="150" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="700" y="167" class="usecase" text-anchor="middle">UC-05: View Analytics</text>
  <rect x="510" y="185" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="570" y="202" class="usecase" text-anchor="middle">UC-06: Reports Summary</text>
  
  <!-- Machine Management -->
  <rect x="800" y="120" width="280" height="150" class="module-box" rx="5"/>
  <text x="940" y="140" class="module-title" text-anchor="middle">Machine Management</text>
  <rect x="810" y="150" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="870" y="167" class="usecase" text-anchor="middle">UC-07: Register Machine</text>
  <rect x="940" y="150" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="1000" y="167" class="usecase" text-anchor="middle">UC-08: Update Status</text>
  <rect x="810" y="185" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="870" y="202" class="usecase" text-anchor="middle">UC-09: Monitor Performance</text>
  <rect x="940" y="185" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="1000" y="202" class="usecase" text-anchor="middle">UC-10: Schedule Maintenance</text>
  <rect x="810" y="220" width="120" height="25" class="usecase-box" rx="3"/>
  <text x="870" y="237" class="usecase" text-anchor="middle">UC-11: View History</text>
  
  <!-- Order Management -->
  <rect x="1100" y="120" width="260" height="150" class="module-box" rx="5"/>
  <text x="1230" y="140" class="module-title" text-anchor="middle">Order Management</text>
  <rect x="1110" y="150" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1165" y="167" class="usecase" text-anchor="middle">UC-12: Create Order</text>
  <rect x="1230" y="150" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1285" y="167" class="usecase" text-anchor="middle">UC-13: Update Status</text>
  <rect x="1110" y="185" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1165" y="202" class="usecase" text-anchor="middle">UC-14: View Order List</text>
  <rect x="1230" y="185" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1285" y="202" class="usecase" text-anchor="middle">UC-15: Assign to Production</text>
  <rect x="1110" y="220" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1165" y="237" class="usecase" text-anchor="middle">UC-16: Track Fulfillment</text>
  
  <!-- Production Management -->
  <rect x="200" y="290" width="380" height="150" class="module-box" rx="5"/>
  <text x="390" y="310" class="module-title" text-anchor="middle">Production Management</text>
  <rect x="210" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="265" y="337" class="usecase" text-anchor="middle">UC-17: Record Production</text>
  <rect x="330" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="385" y="337" class="usecase" text-anchor="middle">UC-18: Monitor Targets</text>
  <rect x="450" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="505" y="337" class="usecase" text-anchor="middle">UC-19: Manage Shifts</text>
  <rect x="210" y="355" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="265" y="372" class="usecase" text-anchor="middle">UC-20: Track Quality</text>
  <rect x="330" y="355" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="385" y="372" class="usecase" text-anchor="middle">UC-21: Production Reports</text>
  
  <!-- Worker Management -->
  <rect x="600" y="290" width="380" height="150" class="module-box" rx="5"/>
  <text x="790" y="310" class="module-title" text-anchor="middle">Worker Management</text>
  <rect x="610" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="665" y="337" class="usecase" text-anchor="middle">UC-22: Register Worker</text>
  <rect x="730" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="785" y="337" class="usecase" text-anchor="middle">UC-23: Manage Attendance</text>
  <rect x="850" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="905" y="337" class="usecase" text-anchor="middle">UC-24: Assign Shifts</text>
  <rect x="610" y="355" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="665" y="372" class="usecase" text-anchor="middle">UC-25: Track Performance</text>
  <rect x="730" y="355" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="785" y="372" class="usecase" text-anchor="middle">UC-26: Update Profile</text>
  
  <!-- Payroll Module -->
  <rect x="1000" y="290" width="360" height="150" class="module-box" rx="5"/>
  <text x="1180" y="310" class="module-title" text-anchor="middle">Payroll Module</text>
  <rect x="1010" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1065" y="337" class="usecase" text-anchor="middle">UC-27: Calculate Salary</text>
  <rect x="1130" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1185" y="337" class="usecase" text-anchor="middle">UC-28: Generate Payslips</text>
  <rect x="1240" y="320" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1295" y="337" class="usecase" text-anchor="middle">UC-29: Process Payments</text>
  <rect x="1010" y="355" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1065" y="372" class="usecase" text-anchor="middle">UC-30: Payment History</text>
  
  <!-- Reports Module -->
  <rect x="300" y="460" width="480" height="150" class="module-box" rx="5"/>
  <text x="540" y="480" class="module-title" text-anchor="middle">Reports Module</text>
  <rect x="310" y="490" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="365" y="507" class="usecase" text-anchor="middle">UC-31: Production Reports</text>
  <rect x="430" y="490" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="485" y="507" class="usecase" text-anchor="middle">UC-32: Financial Reports</text>
  <rect x="550" y="490" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="605" y="507" class="usecase" text-anchor="middle">UC-33: Worker Reports</text>
  <rect x="670" y="490" width="100" height="25" class="usecase-box" rx="3"/>
  <text x="720" y="507" class="usecase" text-anchor="middle">UC-34: Machine Reports</text>
  <rect x="310" y="525" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="365" y="542" class="usecase" text-anchor="middle">UC-35: Schedule Reports</text>
  
  <!-- Settings Module -->
  <rect x="800" y="460" width="360" height="150" class="module-box" rx="5"/>
  <text x="980" y="480" class="module-title" text-anchor="middle">Settings Module</text>
  <rect x="810" y="490" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="865" y="507" class="usecase" text-anchor="middle">UC-36: Manage Users</text>
  <rect x="930" y="490" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="985" y="507" class="usecase" text-anchor="middle">UC-37: System Settings</text>
  <rect x="1040" y="490" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="1095" y="507" class="usecase" text-anchor="middle">UC-38: Manage Permissions</text>
  <rect x="810" y="525" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="865" y="542" class="usecase" text-anchor="middle">UC-39: Backup Data</text>
  <rect x="930" y="525" width="110" height="25" class="usecase-box" rx="3"/>
  <text x="985" y="542" class="usecase" text-anchor="middle">UC-40: Configure Notifications</text>
  
  <!-- External Systems -->
  <rect x="200" y="650" width="200" height="60" class="external-box" rx="5"/>
  <text x="300" y="685" class="external" text-anchor="middle">💳 Razorpay Payment Gateway</text>
  
  <rect x="450" y="650" width="180" height="60" class="external-box" rx="5"/>
  <text x="540" y="685" class="external" text-anchor="middle">📧 Email Service</text>
  
  <!-- Connections (Sample - showing main connections) -->
  <!-- Admin connections -->
  <line x1="140" y1="115" x2="210" y2="162" class="connection"/>
  <line x1="140" y1="115" x2="810" y2="162" class="connection"/>
  <line x1="140" y1="115" x2="610" y2="332" class="connection"/>
  <line x1="140" y1="115" x2="1010" y2="332" class="connection"/>
  <line x1="140" y1="115" x2="310" y2="502" class="connection"/>
  <line x1="140" y1="115" x2="810" y2="502" class="connection"/>
  
  <!-- Manager connections -->
  <line x1="140" y1="165" x2="210" y2="162" class="connection"/>
  <line x1="140" y1="165" x2="510" y2="162" class="connection"/>
  <line x1="140" y1="165" x2="810" y2="162" class="connection"/>
  <line x1="140" y1="165" x2="1110" y2="162" class="connection"/>
  <line x1="140" y1="165" x2="210" y2="332" class="connection"/>
  
  <!-- Supervisor connections -->
  <line x1="140" y1="215" x2="210" y2="162" class="connection"/>
  <line x1="140" y1="215" x2="510" y2="162" class="connection"/>
  <line x1="140" y1="215" x2="940" y2="197" class="connection"/>
  <line x1="140" y1="215" x2="810" y2="197" class="connection"/>
  <line x1="140" y1="215" x2="210" y2="332" class="connection"/>
  
  <!-- Worker connections -->
  <line x1="140" y1="265" x2="210" y2="162" class="connection"/>
  <line x1="140" y1="265" x2="510" y2="162" class="connection"/>
  <line x1="140" y1="265" x2="730" y2="367" class="connection"/>
  
  <!-- Customer connections -->
  <line x1="140" y1="315" x2="1110" y2="162" class="connection"/>
  <line x1="140" y1="315" x2="1110" y2="232" class="connection"/>
  
  <!-- External system connections -->
  <line x1="1065" y1="332" x2="300" y2="650" class="connection dashed"/>
  <line x1="985" y1="537" x2="540" y2="650" class="connection dashed"/>
  
  <!-- Legend -->
  <rect x="200" y="750" width="1000" height="200" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1" rx="5"/>
  <text x="700" y="780" class="module-title" text-anchor="middle" font-size="16">Legend</text>
  
  <rect x="220" y="800" width="80" height="25" class="actor-box" rx="3"/>
  <text x="260" y="817" class="actor" text-anchor="middle">Actors</text>
  
  <rect x="320" y="800" width="80" height="25" class="usecase-box" rx="3"/>
  <text x="360" y="817" class="usecase" text-anchor="middle">Use Cases</text>
  
  <rect x="420" y="800" width="80" height="25" class="external-box" rx="3"/>
  <text x="460" y="817" class="external" text-anchor="middle">External</text>
  
  <text x="220" y="850" class="subtitle">Total Use Cases: 40 across 8 modules</text>
  <text x="220" y="870" class="subtitle">Primary Actors: 5 (Admin, Manager, Supervisor, Worker, Customer)</text>
  <text x="220" y="890" class="subtitle">External Systems: Razorpay Payment Gateway, Email Service</text>
  <text x="220" y="910" class="subtitle">Relationships: → Direct association, -.-> External/Extend relationship</text>
</svg>`;

// Write SVG to file
fs.writeFileSync('use_case_diagram.svg', svgContent);

console.log('SVG file created: use_case_diagram.svg');

// Convert SVG to PNG using Node.js (if you have sharp installed)
try {
  const sharp = require('sharp');
  
  sharp(Buffer.from(svgContent))
    .png()
    .toFile('use_case_diagram.png')
    .then(() => {
      console.log('PNG file created: use_case_diagram.png');
    })
    .catch(err => {
      console.log('Sharp not available, SVG created instead');
      console.log('You can convert SVG to PNG using:');
      console.log('1. Online converters like https://convertio.co/svg-png/');
      console.log('2. Command line: npm install sharp -g && node convert_svg_to_png.js');
    });
} catch (err) {
  console.log('SVG file created successfully!');
  console.log('To convert to PNG, you can:');
  console.log('1. Open the SVG file in a browser and save as PNG');
  console.log('2. Use online converters like https://convertio.co/svg-png/');
  console.log('3. Install sharp: npm install sharp and run the conversion');
}
