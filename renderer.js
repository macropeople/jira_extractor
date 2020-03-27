// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

function refreshJira() {
    let slicedJiras = jiraTableData.slice(0, 50);
  
    // let data = {JIRA_TICKETS: slicedJiras};
    let data = {JIRA_TICKETS: jiraTableData};
    console.log(data
        );
    sasJs.request("edit/refreshjira", data).then(res => {
        console.log(res);
  
        alert("Jira Tickets Added");
    }, err => {
        console.log(err);
  
        alert("SAS Error:\n" + JSON.stringify(err));
    });
  }