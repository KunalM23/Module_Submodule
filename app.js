const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware =======>
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Data array =======>
let moduleData = [
  { id: 1, moduleName: "computer science", status: 1 },
  { id: 2, moduleName: "information technology", status: 1 },
  { id: 3, moduleName: "civil engineering", status: 1 },
  { id: 4, moduleName: "electrical engineering", status: 0 },
];
let submoduleData = [
  { id: 1, moduleId: 1, subModuleName: "Database Management", status: 1 },
  { id: 2, moduleId: 2, subModuleName: "Automata Theory", status: 1 },
];  

// Routes =======>

// 1. Listing
app.get('/', (req, res) => {
  try {
    const combinedData = moduleData.map((mod) => {
      const submodules = submoduleData.filter((sub) => sub.moduleId === mod.id);
      return {
        ...mod,
        submodules,
        submoduleCount: submodules.length, 
      };
    });
    res.status(200).json({
      success: true,
      data: combinedData,
      moduleCount: moduleData.length,
    });
  }
  catch (error) {
    console.log('Error fetching data', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching module data in dropdown'
    });
  }
});   

// 2. Signup 
app.post('/api/signup', (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    if(!email || !password || !confirmPassword) {
      res.status(404).json({
        success: false,
        message: "All fields are required"
      });
    }
    if(password !== confirmPassword) {
      res.status(404).json({
        success: false,
        message: "Password and confirm password should match"
      });
    }
    res.status(200).json({
      success: true,
      message: "Signup successfull"
    });
  }
  catch (error) {
    console.log('Signup error', error);
    res.status(500).json({
      success: false,
      message: 'Error in signup'
    });
  }
});  

// 3. Module dropdown filter
app.get('/api/moduledropdown', (req, res) => {
  try {
    const status = parseInt(req.query.status);
    if(status === -1) {
      res.status(402).json({
        success: false,
        message: "Invalid status"
      });
    }
    const filteredModule = moduleData.filter((module) => module.status === status);
    res.status(200).json({
      success: true,
      data: filteredModule
    });
  }
  catch (error) {
    console.log('Error fetching data', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching module data in dropdown'
    });
  }
});

// 4. Create Module
app.post('/api/createmodule', (req, res) => {
  try {
    let { moduleName } = req.body;
    const isExisting = moduleData.find((module) => module.moduleName.toLowerCase() === moduleName.toLowerCase());
    moduleName = moduleName.toLowerCase();
    if(isExisting) {
      res.status(404).json({
        success: false,
        message: "Module name already exists"
      });
    }
    const newModule = {
      id: moduleData.length + 1 > 0 ? moduleData.length + 1 : 1,
      moduleName,
      status: 1
    };
    moduleData.push(newModule);
    res.status(200).json({
      success: true,
      message: "Module created successfully",
      data: newModule
    });
  }
  catch (error) {
    console.log('Module creation error', error);
    res.status(500).json({
      success: false,
      message: 'Error in module creation'
    });
  }
});

// 5. Edit Module
app.put('/api/editmodule/:id', (req, res) => {
  try {
    const moduleId = parseInt(req.params.id);
    const moduleIndex = moduleData.findIndex((module) => module.id === moduleId);
    if(moduleIndex === -1) {
      res.status(403).json({
        success: false,
        message: "Module not found"
      });
    }
    let { moduleName, status } = req.body;
    moduleName = moduleName.toLowerCase();
        
    if(moduleName) moduleData[moduleIndex].moduleName = moduleName;
    if(status) moduleData[moduleIndex].status = status;
    
    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: moduleData[moduleIndex]
    });
  }
  catch (error) {
    console.log('Module edit error', error);
    res.status(500).json({
      success: false,
      message: 'Error in module edition'
    });
  }
});

// 6. Create Sub-module
app.post('/api/createsubmodule', (req, res) => {
  try {
    let { moduleId, subModuleName, status } = req.body;
    const isExisting = submoduleData.find((submodule) => submodule.subModuleName.toLowerCase() === subModuleName.toLowerCase());
    if(isExisting) {
      res.status(404).json({
        success: false,
        message: "Submodule name already exists"
      });
    }
    subModuleName = subModuleName.toLowerCase();
    const newSubModule = {
      id: submoduleData.length + 1 > 0 ? submoduleData.length + 1 : 1,
      moduleId,
      subModuleName,
      status: status
    };
    submoduleData.push(newSubModule);
    res.status(200).json({
      success: true,
      message: "Submodule created successfully",
      data: newSubModule
    });
  }
  catch (error) {
    console.log('Submodule creation error', error);
    res.status(500).json({
      success: false,
      message: 'Error in submodule creation'
    });
  }
});

// 7. Edit Sub-module 
app.put('/api/editsubmodule/:id', (req, res) => {
  try {
    const submoduleId = parseInt(req.params.id);
    const subModuleIndex =  submoduleData.findIndex((submodule) => submodule.id === submoduleId);
    if(subModuleIndex === -1){
      res.status(403).json({
        success: false,
        message: "Sub module not found"
      });
    }
    let { moduleId, subModuleName, status } = req.body;
    subModuleName = subModuleName.toLowerCase();

    if(moduleId) submoduleData[subModuleIndex].moduleId = moduleId;
    if(subModuleName) submoduleData[subModuleIndex].subModuleName = subModuleName;
    if(status) submoduleData[subModuleIndex].status = status;
    res.status(200).json({
      success: true,
      message: "Sub module updated successfully",
      data: submoduleData[subModuleIndex]
    });
  }
  catch (error) {
    console.log('Submodule edit error', error);
    res.status(500).json({
      success: false,
      message: 'Error in submodule edition'
    });
  }
});

// Server =======>
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port no - ${PORT}`);
});