Meteor.methods({
  // Implement latency compensated update using Meteor methods and localUpdate
  insertFileParent: function (parent) {
    // Always check method params!
    check(parent, String);
    // You'll probably want to do some kind of ownership check here...

    // Generate a new id of type object
    const mongoId = new Mongo.ObjectID;
    // Extract the id String from the object to use as the Meteor id in TreeView
    const meteorId = mongoId._str;
    const newName = 'New node';
    // Add the new node to the myFiles file collection
    myFiles.insert({
      _id: mongoId,
      filename: newName,
      contentType: '',
      metadata: { owner: Meteor.userId(), parent: parent },
      aliases: [ ]
    },
    function (err, _id) {  // Callback to .insert
      if (err) { return console.error("File myFiles creation failed!", err); }
      // Once the file exists on the server, start uploading
      //myFiles.upload();
    });

    // Add the new node to the TreeData collection
    TreeData.insert({
      _id: meteorId,
      name: newName,
      parent: parent
    },
    function (err, _id) {  // Callback to .insert
      if (err) { return console.error("File TreeData creation failed!", err); }
    });
      // Optional options here
      // Optional callback here
    return meteorId;
  },

  updateFileParent: function (fileId, parent) {
    // Always check method params!
    console.log('update parent: ' + parent)
    check(fileId, String);
    check(parent, String);

    // convert Meteor String id to Mongo ObjectID
    const fcId = new Mongo.ObjectID(fileId);

    // Check whether dragging node to the root
    if (parent === '#') {
      parent = null;
    }

    // You'll probably want to do some kind of ownership check here...

    // retrieve owner to use in the metadata update function
    const owner = myFiles.findOne({ _id: fcId }).metadata.owner;

    // Update the node in the myFiles file collection
    myFiles.update({ _id: fcId }, {
        $set: { metadata: { owner: owner, parent: parent } }
      },
      function (err, _id) {  // Callback to .update
        if (err) { return console.error("File myFiles update failed!", err); }
      }
      // Optional options here
      // Optional callback here
    );

    // Update the node in the TreeData collection
    TreeData.update({ _id: fileId }, {
        $set: { parent: parent }
      },
      function (err, _id) {  // Callback to .update
        if (err) { return console.error("File TreeData update failed!", err); }
      }
      // Optional options here
      // Optional callback here
    );

  },

  renameFile: function (fileId, filename) {
    // Always check method params!
    check(fileId, String);
    check(filename, String);

    // convert Meteor String id to Mongo ObjectID
    const fcId = new Mongo.ObjectID(fileId);

    // You'll probably want to do some kind of ownership check here...

    // Use whichever function the environment dictates
    myFiles.update({ _id: fcId }, {
        $set: { filename: filename }
      },
      function (err, _id) {  // Callback to .update
        if (err) { return console.error("File myFiles rename failed!", err); }
      }
      // Optional options here
      // Optional callback here
    );

    TreeData.update({ _id: fileId }, {
        $set: { name: filename }
      },
      function (err, _id) {  // Callback to .update
        if (err) { return console.error("File TreeData rename failed!", err); }
      }
      // Optional options here
      // Optional callback here
    );
    return fileId;
  },

  copyNode: function (fileId, parent) {
    console.log('recursiveCopy typeof fileId: ' + typeof fileId);
    console.log('recursiveCopy fileId: ' +  fileId);
    console.log('recursiveCopy typeof parent: ' + typeof parent);
    console.log('recursiveCopy parent: ' +  parent);
    check(fileId, String);  // 24 character hexadecimal string id
    check(parent, String);

    // Check whether copying node to the root
    if (parent === '#') {
      parent = null;
    }

    recursiveCopy(fileId, parent);
  },

  deleteNode: function (fileId) {
    check(fileId, String);

    recursiveDelete(fileId);
  },

  resetData() {
    let testData = {
      "QMS Category": {
        "Policy": {
          "Health and Safety Ground Rules": null,
          "Health and Safety Policy Statement": null,
          "HSMS Objectives (2018)": null,
          "QMS Objectives (2017)": null,
          "Quality Policy": null
        },
        "Manual": {
          "Health and Safety Manual": null,
          "Quality Manual": null
        },
        "Roles and Responsibilities": {
          "Actionee": null,
          "Approver": null,
          "Assigned Engineer(s)": null,
          "Auditee(s)": null,
          "Board Member": null,
          "CAD Designer": null,
          "Checker": null,
          "Commercial Manager": null,
          "Construction Engineer": null,
          "Design Checker": null,
          "Document Controller": null,
          "Estimator": null,
          "Finance Director": null,
          "HR Advisor": null,
          "HSQ Manager": null,
          "Lead Auditor": null,
          "Management Review Participants": null,
          "Managing Director": null,
          "Office Administrator": null,
          "Originator": null,
          "Project Controller": null,
          "Project Manager-Study Leader": null,
          "Project Sponsor-Study sponsor": null,
          "Proposal Manager": null,
          "Proposer": null,
          "Risk Consultant": null,
          "Second Auditor": null
        },
        "Procedures": {
          "Health and Safety": {
            "0001-OPT-SA-PROC-001 Hazard Identification and Risk Assessment": null,
            "0001-OPT-SA-PROC-002 Control of Health and Safety Requirements": null,
            "0001-OPT-SA-PROC-003 Fire Procedure": null,
            "0001-OPT-SA-PROC-004 Health and Safety in the Office": null,
            "0001-OPT-SA-PROC-005 HSMS Performance and Monitoring": null,
            "0001-OPT-SA-PROC-006 Incident Investigation": null,
            "0001-OPT-SA-PROC-007 Health and Safety Interface Management Procedure": null,
            "0001-OPT-SA-PROC-008 Emergency Preparedness and Response Arrangements": null,
            "0001-OPT-SA-PROC-009 Maintenance Contractor Management": null
          },
          "Quality": {
            "0001-OPT-QA-PROC-001 Preparation and Issue of Proposals": null,
            "0001-OPT-QA-PROC-002 New Contract Review": null,
            "0001-OPT-QA-PROC-003 Project-Study Start-Up": null,
            "0001-OPT-QA-PROC-004 Project-Study Cost Control": null,
            "0001-OPT-QA-PROC-005 Project Execution - Technical Change Management": null,
            "0001-OPT-QA-PROC-006 Project-Study Document Development": null,
            "0001-OPT-QA-PROC-007 Client Document Control": null,
            "0001-OPT-QA-PROC-010 Project Procurement": null,
            "0001-OPT-QA-PROC-011 Project-Study Close-Out": null,
            "0001-OPT-QA-PROC-012 Doc Development and Control": null,
            "0001-OPT-QA-PROC-013 Internal Audit": null,
            "0001-OPT-QA-PROC-014 Corrective and Preventive Action": null,
            "0001-OPT-QA-PROC-015 Management Review": null,
            "0001-OPT-QA-PROC-016 Project Execution": null,
            "0001-OPT-QA-PROC-017 PED Compliance": null,
            "0001-OPT-QA-PROC-018 Study Development": null,
            "0001-OPT-QA-PROC-019 Workpack Progress": null,
            "0001-OPT-QA-PROC-020 Project-Study Variation-Change Control": null,
            "0001-OPT-QA-PROC-021 Estimate Development": null,
            "0001-OPT-QA-PROC-022 Manpower Management": null,
            "0001-OPT-QA-PROC-023 Supplier Document Control": null,
            "0001-OPT-QA-PROC-024 Project Risk Management": null
          },
        },
        "Guidance": {
          "Health and Safety": null,
          "Quality": {
            "0001-OPT-QA-GND-001 Proposal Requirements": null,
            "0001-OPT-QA-GND-002 Delegation of Authority Limits": null,
            "0001-OPT-QA-GND-003 Checking and Approving Matrix": null,
            "0001-OPT-QA-GND-005 Project Scope Review and Kick-Off": null,
            "0001-OPT-QA-GND-006 Corporate Numbering System and Document Control": null,
            "0001-OPT-QA-GND-007 PED Compliance Guidance Notes": null,
            "0001-OPT-QA-GND-008 Preliminary Information Issue": null,
            "0001-OPT-QA-GND-009 Undertaking Audits": null,
            "0001-OPT-QA-GND-010 Project and Study Definitions": null,
            "0001-OPT-QA-GND-011 Timesheet Completion Guidance": null,
            "0001-OPT-QA-GND-012 Instruction to Suppliers": null,
            "0001-OPT-QA-GND-013 Regulatory Compliance within Project Execution": null,
            "0001-OPT-QA-GND-014 Risk Management Guidance": null
          },
        },
        "Records": {
          "Health and Safety": {
            "Documents": {
              "0001-OPT-SA-MSC-003 Health and Safety Legislation Register for Office and Co-located Premises": null,
              "0001-OPT-SA-MSC-004 Emergency Response Plan": null,
              "0001-OPT-SA-MSC-005 Health and Safety on Fabricator Site Visits Inspections": null,
              "0001-OPT-SA-MSC-006 HSMS Competencies": null,
              "0001-OPT-SA-MSC-007 HSMS Documentation Records Management - Responsibilities Matrix": null
            },
            "Risk Assessments": {
              "0001-OPT-SA-MSC-001 Fire Risk Assessment": null,
              "0001-OPT-SA-MSC-002 Office Risk Assessment": null
            },
          },
          "Internal Instructions": {
            "2016_5 Offshore Trips - Lone Working": null,
            "2017_1 Revision of Optimus QMS Documentation": null,
            "2017_3 Revision of Optimus QMS Documentation": null,
            "2017_4 Revision of Optimus HSMS Documentation": null,
            "2017_5 Revision of Optimus HSMS Documentation": null,
            "2017_7 Revision of Risk Management Process": null
          },
          "Other": null,
          "Piping": {
            "Documents": {
              "0001-OPT-PI-WPE-006 Rev C1": null,
              "0001-OPT-PI-WPE-007 Rev C1": null
            },
            "Specifications": null
          },
          "Process": {
            "Documents": null,
            "Calculations": {
              "Control Valve Calculation Spreadsheet Rev Z1": null,
              "Incompressible Line Sizing": null,
              "PSV Sizing - API 2 Phase Relief": null,
              "PSV Sizing - API Gas-Vapour Relief": null,
              "PSV Sizing - API Liquid Relief": null,
              "Restriction Orifice Sizing Rev Z1": null
            },
            "Working Practices": {
              "0001-OPT-PR-GND-001 Incompressible Line Sizing Calculation Guide": null,
              "0001-OPT-PR-GND-002 Compressible Line Sizing Calculation Guide": null,
              "0001-OPT-PR-GND-003 2-Phase Line Sizing Calculation Guide": null,
              "0001-OPT-PR-GND-007 PSV Sizing - API Gas-Vapour Relief Guide": null,
              "0001-OPT-PR-GND-008 PSV Sizing - API Liquid Relief Guide": null,
              "0001-OPT-PR-GND-009 PSV Sizing - API 2 Phase Relief Guide": null,
              "0001-OPT-PR-WPE-001 Process Engineering Document Development and Checklists": null,
              "0001-OPT-PR-WPE-005 PID Check List": null,
              "0001-OPT-PR-WPE-006 Rev Z1 - PFD and P&ID Drafting Guidelines": null,
              "0001-OPT-PR-WPE-006 Rev Z1 PFD and PID Drafting Guidelines": null,
              "0001-OPT-PR-WPE-007 Calculation Checklist": null
            },
          },
          "Working Practices": {
            "Documents": {
              "0001-OPT-SA-WPE-001 Optimus SIL Procedure Rev Z2": null,
              "0001-OPT-SA-WPE-002 HAZOP Procedure Rev Z1": null
            },
          },
        },
        "Templates": {
          "Health and Safety": {
            "Incident Investigation": null,
            "Management Review Programme": null,
            "Risk Assessment - Office and Work Place": null,
            "Risk Assessment - Offshore Visits, Survey Working": null,
            "Risk Assessment - Onshore Vists, Survey Working": null,
            "Risk Assessment - Overseas Travel": null
          },
          "Office": {
            "10 Part Address Labels": null,
            "CD Label": null,
            "Compliments": null,
            "Continuing Professional Development Plan": null,
            "Document Transmittal": null,
            "Expense Form - Contractor": null,
            "Expense Form - Staff": null,
            "Fax Front Sheet": null,
            "File Front Cover - A3": null,
            "File Front Cover - A4": null,
            "Induction Checklist - New Start CONT": null,
            "Induction Checklist - New Start EMP": null,
            "Letter - Optimus Aberdeen": null,
            "Lever Arch File Label": null,
            "Purchase Order Request Form (Project)": null,
            "Purchase Order Request Form - Non-Project": null,
            "Sickness Absence Form": null,
            "Training Booking Form": null
          },
          "Project": {
            "A0 Piping Border": null,
            "A1 Piping Border": null,
            "A3 Isometric Border": null,
            "Asset": null,
            "Bid Tab Template": null,
            "Blank Report Page A3 Opt2": null,
            "Calculation Sheet (continuous calc pages)": null,
            "Calculation Sheet": null,
            "Client Feedback Form": null,
            "Comments Sheet": null,
            "Completion Certificate Checklist": null,
            "Completion Certificate": null,
            "Consent to Introduce Hydrocarbons Certificate": null,
            "Criticality Assessment": null,
            "Datasheet - Process": null,
            "Design Change Notice": null,
            "Design Change Request": null,
            "Discipline Approval Sheet": null,
            "Distribution Matrix": null,
            "HAZOP Report (Series HAZOP)": null,
            "HAZOP Report (Single HAZOP)": null,
            "Inspection Release Certificate": null,
            "Jobcard": null,
            "Kick-Off Meeting Agenda": null,
            "Meeting Notes": null,
            "Optimus A1 Border - E and I": null,
            "Optimus A3 Border - E and I": null,
            "Optimus Bill of Materials - E and I": null,
            "Optimus Cable Schedule - E and I": null,
            "Optimus Document Number Request Form": null,
            "Optimus Junction Box Data Sheet - E and I": null,
            "Optimus Label Schedule - E and I": null,
            "Optimus Shipping Authorisation Template Copy": null,
            "Optimus Supplier Document Front Sheet": null,
            "PID Border A1": null,
            "PED PER Assessment": null,
            "Preliminary Information Issue": null,
            "Presentation with footer fields": null,
            "Procurement Status Report (PSR)": null,
            "Progress Report": null,
            "Project Execution Plan": null,
            "Project File Structure (Multidisciplinary)": null,
            "Project File Structure (Single Discipline)": null,
            "Project Procurement Plan": null,
            "Project Quality Plan": null,
            "Proposal": null,
            "Prospective Single Source Justification": null,
            "Punchlist": null,
            "Report Template - with fields and no appendices": null,
            "Report Template - with fields": null,
            "Report Template - with no fields": null,
            "Requisition": null,
            "Risk Register": null,
            "Safety Action Record Sheet": null,
            "Schedule": null,
            "SDRL": null,
            "Single Page A3 - Presentation Style": null,
            "Single Page A3 - Report Style": null,
            "Single Page A4 - Presentation Style": null,
            "Single Page A4 - Report Style": null,
            "Site Query": null,
            "Standard Document Register": null,
            "STRUCTURAL DRAWING BORDER": null,
            "System Acceptance Certificate": null,
            "System Mechanical Completion Certificate": null,
            "Technical Note - with fields": null,
            "Transmittal_001 - Template": null,
            "Variation Order": null,
            "Weight Report": null,
            "Workpack Multidisciplinary Check Sheet": null,
            "WorkPack Template": null
          },
          "Quality": {
            "Action Plan": null,
            "Attendance List": null,
            "Audit Plan": null,
            "Audit Programme": null,
            "Audit Report - Actions Effectiveness Review": null,
            "Audit Report": null,
            "Checklist": null,
            "Feedback Form": null,
            "Finding Record": null,
            "Guidance": null,
            "Improvement Plan": null,
            "Internal Instruction": null,
            "Management Review Programme": null,
            "Management Review Report": null,
            "Objectives": null,
            "Procedure": null,
            "R&R": null,
            "Self Assessment Questionnaire ": null,
            "Supplier Questionnaire": null
          },
        },
        "Standards": {
          "API": null,
          "ASME": null,
          "BS": null,
          "Directives": null,
          "IEC": null,
          "Other": null
        },
        "Info": {
          "OPT documents": {
            "1. The Help Icon": null,
            "2. Creating Projects": null,
            "2.1 Project Set Up": null,
            "2.2 Procurement": null,
            "2.3 Expenses": null,
            "2.4 Schedules": null,
            "3. Making a Project Live (2)": null,
            "4. Dashboard": null,
            "5. Cost to Complete and Forecasting": null,
            "6. Hour Burned Remaining": null,
            "7. Reports": null,
            "8. Email App User Guide": null
          },
          "General documents": {
            "Certificate of Approval ISO 9001.2008": null,
            "Certificate of Approval OHSAS 18001": null,
            "Documentation Amendment List 06.2017": null,
            "Documentation Amendment List 08.2017": null,
            "Environmental Policy Statement": null,
            "HSMS Audit Programme 2017": null,
            "Optimus QMS": null,
            "Poster HSMS - Key Requirements": null,
            "QMS and HSMS Documentation Amendment List 11.2016": null,
            "QMS Audit Programme 2017": null,
            "QMS Poster Landscape": null
          },
        },
        "Quality Processes": {
          "Core Processes": {
            "Win Work": {
              "Preparation and Issue of Proposals": null,
              "Contract Review": null
            },
            "Project Execution": {
              "Start-Up": null,
              "Project Execution": {
                "Control": {
                  "Cost Control": null,
                  "Technical Change Management": null,
                  "Project Risk Management": null,
                  "Variation Change Control": null,
                  "PED Compliance": null,
                  "Project-Study Document Development": null,
                  "Client Document Control": null,
                  "Supplier Document Control": null
                },
                "Deliverables": {
                  "Study Development": null,
                  "Workpack Process": null
                },
                "Procurement": null
              },
              "Close-Out": null
            },
          },
          "Project Support": {
            "Project Estimating": null,
            "Manpower Management": null
          },
          "Improvement of QMS": {
            "Document Development and Control": null,
            "Internal Audit": null,
            "Corrective and Preventive Action": null,
            "Management Review": null
          },
        },
      }
    };

    function insertTestData(parent, data) {
      for (let name in data) {
        let id = TreeData.insert({name, parent});
        if (typeof data[name] === 'object') insertTestData(id, data[name]);
      }
    }

    TreeData.remove({});
    insertTestData(null, testData);
  },
  addUser(email, password, forename, surname,jobTitle, company) {
    var existing = Meteor.users.findOne({'emails.0.address': email});
    if (!existing) {
      Accounts.createUser({
        email: email,
        password: password,
        profile: {
          forename,
          surname,
          jobTitle,
          company,
        }
/*      }, (error) => {
        if (error) {
          if (error.reason === 'Email already exists.') {
            validator.showErrors({
              email: 'That email address is already registered.'
            });
            const userEmail = $('[name=email]').val();
//              logActivity(
//                '',
//                'Users',
//                userEmail,
//                'Attempt to register account using existing email address.'
//              );
            console.log("User account already exists");
          }
          console.log("Error: " + error);
        } else {
          const currentUser = Meteor.userId();
          if (currentUser) {
//              const activity = 'Account created for user ' + getUserName() + '.';
//              logActivity(
//                currentUser,
//                'Users',
//                currentUser,
//                activity,
//              );
//              sendEmailToAdmin(
//                Meteor.user().emails[0].address,
//                'Registration notification',
//                getUserName() + ' requests roles to be set up.'
//              );
//              insertUserActionsTable(Meteor.userId());
//              insertUserContactsTable(Meteor.userId());
//              insertUserContactsParams(Meteor.userId());
            console.log("User account created");
          } else {
            const userEmail = $('[name=email]').val();
//              logActivity(
//                '',
//                'Users',
//                userEmail,
//                'Attempted account registration failed.',
//              );
            console.log("User account creation failed");
          }
          Router.go('home');
        }
*/
      });
    }
/*
    Meteor.users.remove({});
    Meteor.users.insert({
      email: "rhamlet@hdcl.co.uk",
      password: "cloudqms"
    });
    */
  },
});

function recursiveCopy(fileId, parent) {
  // Generate a hexadecimal object id
  // This is to be used as the id in the new myFiles and TreeData nodes
  // as we don't want Mongo to generate a different id in each collection
  const fcNewId = new Mongo.ObjectID();
//  console.log('recursiveCopy typeof fcNewId: ' + typeof fcNewId);
//  console.log('recursiveCopy fcNewId: ' +  fcNewId);
  const newId = fcNewId._str;
//  console.log('recursiveCopy typeof newId: ' + typeof newId);
  console.log('recursiveCopy newId: ' +  newId);
  // first iteration copies the selected node
  // subsequent iterations copy across child getNodes
  // keep myFiles file-collection and TreeData collection in sync
  // retrieve the document which is to be copied
  let item = TreeData.findOne({ _id: fileId });
  // replace original id with new hexadecimal id
  item._id = newId;
//  console.log('recursiveCopy typeof item._id: ' + typeof item._id);
  console.log('recursiveCopy item._id: ' +  item._id);
  // reset the parent value to the parent of the node where the copy is to be pasted
  item.parent = parent;
  // inserting the item will automatically regenerate a new id
  TreeData.insert(item);  // 17 character non-hexadecimal id

  // convert node to copy Meteor String id to Mongo ObjectID
  const fcId = new Mongo.ObjectID(fileId);
//  console.log('recursiveCopy typeof fcId: ' + typeof fcId);
  console.log('recursiveCopy fcId: ' +  fcId);

  // retrieve the document which is to be copied
  item = myFiles.findOne({ _id: fcId });
  // replace original id new id synced across TreeData and myFiles
  item._id._str = newId;
//  console.log('recursiveCopy typeof item._id._str: ' + typeof item._id._str);
  console.log('recursiveCopy item._id._str: ' +  item._id._str);
  console.log('recursiveCopy item.md5: ' +  item.md5);
  item.metadata.parent = parent;
  myFiles.insert(item);

  // this routine copies the selected node and all its child nodes
  // retrieve children of the copied node and copy to new node
  // on each iteration of the recursive copy, copy the childrens' children
  TreeData.find({ parent: fileId }).forEach(function (item) {
    console.log('recursiveCopy typeof item._id: ' + typeof item._id);
    console.log('recursiveCopy item._id: ' +  item._id);
    console.log('recursiveCopy typeof fcNewId._str: ' + typeof fcNewId._str);
    console.log('recursiveCopy fcNewId._str: ' +  fcNewId._str);
    recursiveCopy(item._id, newId);
  });
}

function recursiveDelete(fileId) {
  check(fileId, String);

  // first iteration deletes the selected node
  // subsequent iterations delete child nodes
  // keep myFiles file-collection and TreeData collection in sync
  // retrieve the document which is to be deleted
  TreeData.remove({ _id: fileId });

  // convert Meteor String id to Mongo ObjectID
  const fcId = new Mongo.ObjectID(fileId);
  fcId._str = fileId;

  myFiles.remove({ _id: fcId });

  TreeData.find({ parent: fileId }).forEach(function (item) {
    recursiveDelete(item._id);
  });
}
