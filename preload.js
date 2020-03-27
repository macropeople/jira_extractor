// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// let axios = require('axios').default;

let jiraTableData = [];

window.addEventListener('DOMContentLoaded', () => {
  getJiras();
})


async function makeRequest(jiraUrl) {
  return new Promise((resolve, reject) => {
    axios.get(jiraUrl, {
      headers: {
        "Authorization": "Basic bWloYWpsby5tZWRqZWRvdmljQG91dGxvb2suY29tOlg4ZUZjTml5RnhicnNqTzJZMVVGMjc3RQ=="
      }
    }).then(res => {
      resolve(res.data);
    }, err => {
      console.log(err);
      reject(err);
    })
  });
}

async function getJiras() {
  let currentIndex = 0;
  let jiras = [];

  while (true) {
      const jiraUrl = `https://macropeople.atlassian.net/rest/api/2/search?projet=MC&maxResults=100&startAt=${currentIndex}`;

      let res = await makeRequest(jiraUrl);

      try {
          if (res.issues.length > 0) {
              jiras.push(...res.issues);

              document.getElementById('issuesFetched').innerText = jiras.length.toString() + " issues...";

              currentIndex += 100;
          } else {
              break;
          }
      } catch(es) {
          break;
      }
  }
  
  createJiraTable(jiras);
}

function createJiraTable(jiras) {
  let existingTable = document.querySelector("#jira-container");
  let divRow = document.createElement("div");
  divRow.className = "row no-gutters";
  existingTable.appendChild(divRow);
  let divCol = document.createElement("div");
  divCol.className = "col-12";
  divRow.appendChild(divCol);
  let table = document.createElement("table");
  table.id = "jira-table";
  table.className = "table table-fixed";
  let tableHeader = createJiraTableHeader();
  table.appendChild(tableHeader);

  let tableRows = createJiraRows(jiras);
  let tableBody = document.createElement("tbody");
  table.appendChild(tableBody);
  tableRows.forEach(row => tableBody.appendChild(row));
  divCol.appendChild(table);
}

function createJiraTableHeader() {
  const headerRow = document.createElement("thead");
  const row = document.createElement("tr");
  headerRow.appendChild(row);
  const columnNames = [
      { text: "Project", size: 1, class: "text-center align-center custom-th" }, //for the edit button
      { text: "ID", size: 1, class: "text-center align-center custom-th" },
      { text: "Type", size: 1, class: "align-center custom-th" },
      { text: "Fix Version", size: 1, class: "align-center custom-th" },
      { text: "Created DT.", size: 2, class: "align-center custom-th" },
      { text: "Priority", size: 2, class: "align-center custom-th" },
      { text: "Labels", size: 1, class: "align-center custom-th" },
      { text: "Status", size: 1, class: "align-center custom-th" },
      { text: "Summary", size: 1, class: "align-center custom-th" },
      { text: "Creator", size: 1, class: "align-center custom-th" },
      { text: "Reporter", size: 1, class: "align-center custom-th" }
  ];
  columnNames.forEach(columnName => {
      const header = document.createElement("th");
      header.className = columnName.class;
      header.innerText = columnName.text;
      row.appendChild(header);
  });

  return headerRow;
}

function createJiraRows(jiras) {
  let jiraRows = [];
  console.log(jiras);
  jiras.forEach(jira => {
      let jiraTableRow = {};
      // for (jira in jiras) {
      let row = document.createElement("tr");
      // console.log(jira.fields)
      let projectCell = document.createElement("td");
      // projectCell.className = "col-1";
      jiraTableRow['JIRA_PROJECT'] = jira.fields.project.key;
      projectCell.innerText = jira.fields.project.key;
      row.appendChild(projectCell);

      let idCell = document.createElement("td");
      // idCell.className = "col-1";
      jiraTableRow['SYSTEM_ID'] = jira.id ? parseInt(jira.id) : 0;
      jiraTableRow['JIRA_ID'] = jira.key;
      idCell.innerText = jira.key;
      row.appendChild(idCell);

      let typeCell = document.createElement("td");
      // typeCell.className = "col-1";
      jiraTableRow['JIRA_TYPE'] = jira.fields.issuetype.name;
      typeCell.innerText = jira.fields.issuetype.name;
      row.appendChild(typeCell);

      let fixCell = document.createElement("td");
      // fixCell.className = "col-1";
      jiraTableRow['JIRA_FIXVERSION'] = jira.fields.fixVersions[0] ? jira.fields.fixVersions[0].name : undefined;
      fixCell.innerText = jira.fields.fixVersions.name;
      row.appendChild(fixCell);

      let creationCell = document.createElement("td");
      // creationCell.className = "col-1";
      jiraTableRow['JIRA_CREATED_DTM'] = jira.fields.created;
      creationCell.innerText = jira.fields.created;
      row.appendChild(creationCell);

      let priorityCell = document.createElement("td");
      // priorityCell.className = "col-1";
      jiraTableRow['JIRA_PRIORITY'] = jira.fields.priority.name;
      priorityCell.innerText = jira.fields.priority.name;
      row.appendChild(priorityCell);

      jiraTableRow['JIRA_LABELS'] = "|none|";
      let labelsCell = document.createElement("td");
      // labelsCell.className = "col-1";
      // for (status in jira.fields.status) {
      //     let badge = document.createElement("span");
      //     badge.className = "badge badge-primary";
      //     badge.innerText = status;
      //     labelsCell.appendChild(badge);
          

      //     jiraTableRow['JIRA_LABELS'] += status + "|";
      // }
      // row.appendChild(labelsCell);
      if (jira.fields.labels.length > 0) jiraTableRow['JIRA_LABELS'] = "|";
      for (let label of jira.fields.labels) {
          let badge = document.createElement("span");
          badge.className = "badge badge-primary";
          badge.innerText = label;
          labelsCell.appendChild(badge);
          

          jiraTableRow['JIRA_LABELS'] += label + "|";
      }
      row.appendChild(labelsCell);

      let statusCell = document.createElement("td");
      // statusCell.className = "col-1";
      jiraTableRow['JIRA_STATUS'] = jira.fields.status.name;
      statusCell.innerText = jira.fields.status.name;
      row.appendChild(statusCell);

      let summaryCell = document.createElement("td");
      // summaryCell.className = "col-1";
      jiraTableRow['JIRA_SUMMARY'] = jira.fields.summary;
      summaryCell.innerText = jira.fields.summary;
      row.appendChild(summaryCell);

      let creatorCell = document.createElement("td");
      // creatorCell.className = "col-1";
      jiraTableRow['JIRA_CREATED_BY'] = jira.fields.creator.displayName;
      creatorCell.innerText = jira.fields.creator.displayName;
      row.appendChild(creatorCell);

      let reporterCell = document.createElement("td");
      // reporterCell.className = "col-1";
      jiraTableRow['JIRA_REPORTED_BY'] = jira.fields.reporter.displayName;
      reporterCell.innerText = jira.fields.reporter.displayName;
      row.appendChild(reporterCell);

      jiraRows.push(row);
      jiraTableData.push(jiraTableRow);

  });
  
  jiraTableData.map((row) => {
      Object.keys(row).map(key => {
          if (row[key] === undefined) {
              row[key] = "none";
          }
      });
  });

  // document.getElementById('sendJiraTickets').style.display = "";
  document.querySelector("#jiraLoaded").style = "";
  let loadingJiraEl = document.querySelector('#loadingJira');
  loadingJiraEl.style.display = "none";
  loadingJiraEl.classList.remove('d-inline-flex');

  console.log(jiraTableData);

  return jiraRows;

}