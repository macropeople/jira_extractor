// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// window.addEventListener('DOMContentLoaded', () => {
//     getJiras();
// });

// function getJiras() {
//     const jiraUrl = "https://macropeople.atlassian.net/rest/api/2/search?projet=MC&maxResults=10&startAt=0";
//     axios.get(jiraUrl, {
//       headers: {
//         "Authorization": "Basic bWloYWpsby5tZWRqZWRvdmljQG91dGxvb2suY29tOlg4ZUZjTml5RnhicnNqTzJZMVVGMjc3RQ=="
//       }
//     }).then(res => {
//       console.log(res);
//     })
// }